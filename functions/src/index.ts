import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

initializeApp();
const db = getFirestore();

// Gemini API key stored as a Firebase secret
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * generateWhyYouMatch
 *
 * Callable Cloud Function that reads the adopter and pet profiles from
 * Firestore, sends them to Gemini, and returns a personalized "why you
 * match" narrative plus realistic challenges.
 */
export const generateWhyYouMatch = onCall(
  { secrets: [geminiApiKey], cors: true },
  async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const { adopterId, petId } = request.data as {
      adopterId?: string;
      petId?: string;
    };

    if (!adopterId || !petId) {
      throw new HttpsError(
        "invalid-argument",
        "adopterId and petId are required."
      );
    }

    // Read profiles from Firestore
    const [adopterSnap, petSnap] = await Promise.all([
      db.collection("adopters").doc(adopterId).get(),
      db.collection("shelterPets").doc(petId).get(),
    ]);

    if (!adopterSnap.exists) {
      throw new HttpsError("not-found", "Adopter profile not found.");
    }
    if (!petSnap.exists) {
      throw new HttpsError("not-found", "Pet profile not found.");
    }

    const adopter = adopterSnap.data()!;
    const pet = petSnap.data()!;

    // Build a concise summary of each profile for the prompt
    const adopterSummary = buildAdopterSummary(adopter);
    const petSummary = buildPetSummary(pet);

    const prompt = `You are a warm, knowledgeable pet adoption counselor for the app Pawnder.
Given the adopter and pet profiles below, produce a JSON object with exactly two keys:
- "whyMatch": an array of 3 short (1–2 sentence) reasons this is a good match, written in second person ("You…").
- "challenges": an array of 2 short (1–2 sentence) realistic challenges or adjustments the adopter should expect, written constructively.

Be specific — reference actual details from both profiles. Keep it conversational and encouraging.

### Adopter Profile
${adopterSummary}

### Pet Profile
${petSummary}

Respond ONLY with valid JSON. No markdown fences, no extra text.`;

    // Call Gemini
    const key = geminiApiKey.value();
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Parse the JSON response
      let parsed: { whyMatch: string[]; challenges: string[] };
      try {
        parsed = JSON.parse(text);
      } catch {
        // Gemini sometimes wraps in markdown fences — strip them
        const cleaned = text
          .replace(/^```json\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();
        parsed = JSON.parse(cleaned);
      }

      // Validate shape
      if (
        !Array.isArray(parsed.whyMatch) ||
        !Array.isArray(parsed.challenges)
      ) {
        throw new Error("Unexpected response shape");
      }

      return {
        whyMatch: parsed.whyMatch.slice(0, 3),
        challenges: parsed.challenges.slice(0, 2),
      };
    } catch (err: any) {
      console.error("Gemini call failed:", err);
      throw new HttpsError(
        "internal",
        "AI generation failed. Please try again."
      );
    }
  }
);

// ─── Helpers to build concise profile summaries ───

function buildAdopterSummary(a: Record<string, any>): string {
  const parts: string[] = [];
  if (a.name) parts.push(`Name: ${a.name}`);
  if (a.age) parts.push(`Age: ${a.age}`);
  if (a.housingType) parts.push(`Housing: ${a.housingType.replace(/_/g, " ")}`);
  if (a.environment) parts.push(`Environment: ${a.environment}`);
  if (a.householdSize) parts.push(`Household size: ${a.householdSize}`);
  if (a.kidsCount > 0) parts.push(`Kids: ${a.kidsCount} (ages: ${a.kidsAges || "unspecified"})`);
  if (a.activityHoursPerWeek != null) parts.push(`Active hours/week: ${a.activityHoursPerWeek}`);
  if (a.hoursAwayPerDay != null) parts.push(`Hours away from home/day: ${a.hoursAwayPerDay}`);
  if (a.experienceLevel) parts.push(`Pet experience: ${a.experienceLevel}`);
  if (a.petTypes?.length) parts.push(`Current pets: ${a.petTypes.join(", ")}`);
  if (a.sheddingTolerance) parts.push(`Shedding tolerance: ${a.sheddingTolerance}/5`);
  if (a.barkingTolerance) parts.push(`Noise tolerance: ${a.barkingTolerance}/5`);
  if (a.specialNeedsWilling) parts.push("Open to special-needs pets");
  if (a.trainingWillingness) parts.push(`Training willingness: ${a.trainingWillingness}`);
  if (a.allergies) parts.push(`Allergies: ${a.allergies}`);
  if (a.narrative) parts.push(`Personal note: "${a.narrative}"`);
  return parts.join("\n");
}

function buildPetSummary(p: Record<string, any>): string {
  const parts: string[] = [];
  if (p.name) parts.push(`Name: ${p.name}`);
  if (p.species) parts.push(`Species: ${p.species}`);
  if (p.breed) parts.push(`Breed: ${p.breed}`);
  if (p.sex) parts.push(`Sex: ${p.sex}`);
  if (p.ageYears != null) parts.push(`Age: ~${p.ageYears} years ${p.ageMonths ? `${p.ageMonths} months` : ""}`);
  if (p.sizeCategory) parts.push(`Size: ${p.sizeCategory}`);
  if (p.energyLevel) parts.push(`Energy level: ${p.energyLevel}/5`);
  if (p.friendlinessAdults) parts.push(`Friendliness to adults: ${p.friendlinessAdults}/5`);
  if (p.friendlinessKids) parts.push(`Friendliness to kids: ${p.friendlinessKids}/5`);
  if (p.friendlinessDogs) parts.push(`Friendliness to dogs: ${p.friendlinessDogs}/5`);
  if (p.friendlinessCats) parts.push(`Friendliness to cats: ${p.friendlinessCats}/5`);
  if (p.confidenceLevel) parts.push(`Confidence: ${p.confidenceLevel}/5`);
  if (p.separationAnxietyRisk) parts.push(`Separation anxiety risk: ${p.separationAnxietyRisk}/5`);
  if (p.barkingLevel) parts.push(`Barking level: ${p.barkingLevel}/5`);
  if (p.sheddingLevel) parts.push(`Shedding level: ${p.sheddingLevel}/5`);
  if (p.exerciseMinPerDay) parts.push(`Exercise needs: ${p.exerciseMinPerDay} min/day`);
  if (p.aloneTimeTolerance) parts.push(`Alone-time tolerance: ${p.aloneTimeTolerance} hrs`);
  if (p.topStrengths?.length) parts.push(`Strengths: ${p.topStrengths.join(", ")}`);
  if (p.topChallenges?.length) parts.push(`Challenges: ${p.topChallenges.join(", ")}`);
  if (p.needsExperiencedOwner) parts.push("Needs experienced owner");
  if (p.singlePetOnly) parts.push("Should be only pet");
  if (p.oneLineBlurb) parts.push(`Blurb: "${p.oneLineBlurb}"`);
  if (p.structuredNotes) parts.push(`Notes: "${p.structuredNotes}"`);
  if (p.idealAdopterNotes) parts.push(`Ideal adopter: "${p.idealAdopterNotes}"`);
  return parts.join("\n");
}
