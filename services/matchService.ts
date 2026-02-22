import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockActiveMatch, mockPets, mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Match, MatchStatus, ActiveMatch, StabilitySummary } from '../types';
import { computeStability } from '../utils/stability';

export const matchService = {
  /**
   * Create a match. Enforces single-active-match rule:
   * if the adopter already has a confirmed/in_foster match, throw.
   */
  async createMatch(adopterId: string, petId: string): Promise<Match> {
    if (useAppStore.getState().mockMode) {
      const now = new Date();
      return {
        id: `match-${Date.now()}`,
        adopterId,
        petId,
        status: 'confirmed',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        stabilizationEndDate: new Date(
          now.getTime() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };
    }

    // Single-active-match guard
    const activeQ = query(
      collection(db, 'matches'),
      where('adopterId', '==', adopterId),
      where('status', 'in', ['confirmed', 'in_foster']),
    );
    const activeSnap = await getDocs(activeQ);
    if (!activeSnap.empty) {
      throw new Error('You already have an active match. Complete or end it before matching again.');
    }

    const now = new Date();
    const matchData = {
      adopterId,
      petId,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      stabilizationEndDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const ref = await addDoc(collection(db, 'matches'), matchData);
    return {
      id: ref.id,
      ...matchData,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    } as Match;
  },

  async getActiveMatch(adopterId: string): Promise<ActiveMatch | null> {
    if (useAppStore.getState().mockMode) {
      return null; // Return null by default; set mockActiveMatch to test foster flow
    }
    try {
      const q = query(
        collection(db, 'matches'),
        where('adopterId', '==', adopterId),
        where('status', 'in', ['confirmed', 'in_foster']),
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;

      const matchDoc = snap.docs[0];
      const matchData = matchDoc.data();
      const matchId = matchDoc.id;

      // Fetch pet
      const petRef = doc(db, 'shelterPets', matchData.petId);
      const petSnap = await getDoc(petRef);
      const petData = petSnap.exists() ? petSnap.data() : {};

      // Fetch adopter
      const adopterRef = doc(db, 'adopters', adopterId);
      const adopterSnap = await getDoc(adopterRef);
      const adopterData = adopterSnap.exists() ? adopterSnap.data() : {};

      // Calculate days in foster
      const createdDate = matchData.createdAt?.toDate?.() || new Date(matchData.createdAt);
      const daysInFoster = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

      // Get stability summary
      const stability = await this.getStabilitySummary(matchId);

      return {
        id: matchId,
        adopterId,
        petId: matchData.petId,
        status: matchData.status,
        createdAt: createdDate.toISOString(),
        updatedAt: matchData.updatedAt?.toDate?.()?.toISOString() || createdDate.toISOString(),
        stabilizationEndDate: matchData.stabilizationEndDate,
        pet: {
          id: matchData.petId,
          name: petData.name || 'Unknown',
          breed: petData.breed || 'Mixed',
          age: 'adult',
          size: 'medium',
          description: petData.oneLineBlurb || '',
          imageUrls: petData.photoUris || [],
          barkingLevel: petData.barkingLevel ?? 3,
          sheddingLevel: petData.sheddingLevel ?? 3,
          trainingLevel: 3,
          energyLevel: petData.energyLevel ?? 3,
          sociability: petData.friendlinessAdults ?? 3,
          spaceRequirement: 3,
          specialNeeds: false,
          behaviorTraits: [],
          createdAt: petData.createdAt || new Date().toISOString(),
          compatibilityScore: stability.stabilityScore,
          whyMatch: [],
          potentialChallenges: [],
          aiSummary: petData.idealAdopterNotes || '',
        },
        adopter: { id: adopterId, ...adopterData } as any,
        daysInFoster,
        stabilityScore: stability.stabilityScore,
        bondScore: stability.bondScore,
        incidentCount: stability.incidentCount,
        trainingAdherencePercent: stability.trainingAdherencePercent,
      };
    } catch {
      return null;
    }
  },

  async getStabilitySummary(matchId: string): Promise<StabilitySummary> {
    if (useAppStore.getState().mockMode) {
      return {
        stabilityScore: mockActiveMatch.stabilityScore,
        bondScore: mockActiveMatch.bondScore,
        incidentCount: mockActiveMatch.incidentCount,
        trainingAdherencePercent: mockActiveMatch.trainingAdherencePercent,
        trend: [45, 50, 55, 58, 62, 65, 68, 70, 72],
        daysRemaining: 76,
      };
    }

    // Fetch all checkins for this match
    const q = query(
      collection(db, 'checkins'),
      where('matchId', '==', matchId),
    );
    const snap = await getDocs(q);
    const checkins: any[] = [];
    snap.forEach((d) => checkins.push({ id: d.id, ...d.data() }));

    // Fetch match to get creation date
    const matchRef = doc(db, 'matches', matchId);
    const matchSnap = await getDoc(matchRef);
    const matchData = matchSnap.exists() ? matchSnap.data() : {};
    const createdDate = matchData?.createdAt?.toDate?.() || new Date();
    const endDate = matchData?.stabilizationEndDate ? new Date(matchData.stabilizationEndDate) : new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    return computeStability(70, checkins, daysRemaining);
  },

  /**
   * Cancel / end an active match by setting its status to 'failed'.
   */
  async cancelMatch(matchId: string): Promise<void> {
    if (useAppStore.getState().mockMode) return;

    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      status: 'failed',
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Transition a match to a new status (e.g. confirmed → in_foster).
   */
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
    if (useAppStore.getState().mockMode) return;

    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },
};
