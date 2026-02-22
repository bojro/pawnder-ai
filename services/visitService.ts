import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockVisitSlots } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { VisitSlot, Visit } from '../types';
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS } from '../utils/shelterConstants';

/**
 * Map day abbreviation to JS Date day-of-week number (0=Sun … 6=Sat).
 */
const DAY_TO_DOW: Record<string, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
};

/**
 * Given an availability grid from a shelter pet, generate concrete VisitSlot
 * objects for the upcoming 7 days from today.
 */
function slotsFromGrid(grid: Record<string, boolean>): VisitSlot[] {
  const slots: VisitSlot[] = [];
  const today = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dow = date.getDay(); // 0=Sun

    // Find matching day abbreviation
    const dayEntry = Object.entries(DAY_TO_DOW).find(([, v]) => v === dow);
    if (!dayEntry) continue; // skip Sat/Sun
    const dayKey = dayEntry[0]; // e.g. "mon"

    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    for (const hour of AVAILABILITY_HOURS) {
      const key = `${dayKey}-${hour}`;
      if (!grid[key]) continue;

      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');

      slots.push({
        id: `${dateStr}-${startHour}`,
        date: dateStr,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        available: true,
      });
    }
  }

  return slots;
}

/** A default mock availability grid for mock mode */
const MOCK_AVAILABILITY_GRID: Record<string, boolean> = {
  'mon-9': true, 'mon-10': true, 'mon-11': true,
  'mon-14': true, 'mon-15': true,
  'tue-10': true, 'tue-11': true, 'tue-13': true,
  'wed-9': true, 'wed-10': true, 'wed-14': true, 'wed-15': true, 'wed-16': true,
  'thu-10': true, 'thu-11': true, 'thu-13': true, 'thu-14': true,
  'fri-9': true, 'fri-14': true, 'fri-15': true, 'fri-16': true, 'fri-17': true,
};

export const visitService = {
  /**
   * Fetch the raw availability grid for a pet.
   * Returns a Record<string, boolean> keyed by "day-hour".
   */
  async getAvailabilityGrid(petId: string): Promise<Record<string, boolean>> {
    if (useAppStore.getState().mockMode) {
      return MOCK_AVAILABILITY_GRID;
    }

    try {
      const petDoc = await getDoc(doc(db, 'shelterPets', petId));
      if (petDoc.exists()) {
        const data = petDoc.data();
        const grid = data?.availabilityGrid as Record<string, boolean> | undefined;
        if (grid && Object.keys(grid).length > 0) {
          return grid;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch availability grid:', e);
    }

    return {};
  },

  async getAvailableSlots(petId: string): Promise<VisitSlot[]> {
    if (useAppStore.getState().mockMode) {
      return mockVisitSlots.filter((s) => s.available);
    }

    // 1) Try the visitSlots collection first
    const q = query(
      collection(db, 'visitSlots'),
      where('petId', '==', petId),
      where('available', '==', true),
    );
    const snap = await getDocs(q);
    const slots: VisitSlot[] = [];
    snap.forEach((d) => slots.push({ id: d.id, ...d.data() } as VisitSlot));

    if (slots.length > 0) return slots;

    // 2) Fallback: derive slots from the pet's availabilityGrid
    try {
      const petDoc = await getDoc(doc(db, 'shelterPets', petId));
      if (petDoc.exists()) {
        const data = petDoc.data();
        const grid = data?.availabilityGrid as Record<string, boolean> | undefined;
        if (grid && Object.keys(grid).length > 0) {
          return slotsFromGrid(grid);
        }
      }
    } catch (e) {
      console.warn('Failed to derive visit slots from availability grid:', e);
    }

    return [];
  },

  async scheduleVisit(matchId: string, slotId: string): Promise<Visit> {
    if (useAppStore.getState().mockMode) {
      const slot = mockVisitSlots.find((s) => s.id === slotId);
      return {
        id: `visit-${Date.now()}`,
        matchId,
        slotId,
        status: 'scheduled',
        scheduledDate: slot?.date || '2026-02-25',
        scheduledTime: slot?.startTime || '10:00',
        createdAt: new Date().toISOString(),
      };
    }

    // Look up the slot to get actual date/time
    let scheduledDate = new Date().toISOString().split('T')[0];
    let scheduledTime = '10:00';

    // Parse slotId format "YYYY-MM-DD-HH" from generated slots
    const parts = slotId.match(/^(\d{4}-\d{2}-\d{2})-(\d{2})$/);
    if (parts) {
      scheduledDate = parts[1];
      scheduledTime = `${parts[2]}:00`;
    }

    const ref = await addDoc(collection(db, 'visits'), {
      matchId,
      slotId,
      status: 'scheduled',
      scheduledDate,
      scheduledTime,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      matchId,
      slotId,
      status: 'scheduled',
      scheduledDate,
      scheduledTime,
      createdAt: new Date().toISOString(),
    };
  },
};
