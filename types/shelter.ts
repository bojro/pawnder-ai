// ─── Pet Status ───
export type PetStatus = 'draft' | 'ready' | 'published';

// ─── Basic Profile ───
export type Species = 'dog' | 'cat' | 'rabbit' | 'bird' | 'reptile' | 'small_animal' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';
export type AgeConfidence = 'exact' | 'estimated' | 'unknown';
export type SizeCategory = 'tiny' | 'small' | 'medium' | 'large' | 'extra_large';
export type IntakeSource = 'owner_surrender' | 'stray' | 'transfer' | 'confiscation' | 'born_in_shelter' | 'other';
export type AdoptionStatus = 'available' | 'on_hold' | 'pending' | 'adopted' | 'not_available';

// ─── Health ───
export type VaxStatus = 'up_to_date' | 'partial' | 'none' | 'unknown';
export type SpayNeuterStatus = 'yes' | 'no' | 'unknown';
export type ConditionSeverity = 'mild' | 'moderate' | 'severe';
export type GroomingNeed = 'low' | 'moderate' | 'high' | 'professional_only';
export type MobilityLimit = 'none' | 'minor' | 'moderate' | 'significant';

export interface KnownCondition {
  name: string;
  severity: ConditionSeverity;
}

// ─── Training Plan ───
export type TrainingFocusArea =
  | 'basic_obedience'
  | 'leash_manners'
  | 'socialization'
  | 'separation_anxiety'
  | 'resource_guarding'
  | 'fear_reactivity'
  | 'impulse_control'
  | 'house_training'
  | 'crate_training'
  | 'bite_inhibition'
  | 'noise_desensitization'
  | 'handling_tolerance';

export type TrainingUrgency = 'low' | 'moderate' | 'high' | 'critical';
export type TrainingFormat = 'group' | 'private' | 'self_guided' | 'board_and_train';

export type KnownTrigger =
  | 'loud_noises'
  | 'strangers'
  | 'children'
  | 'other_dogs'
  | 'cats'
  | 'bikes_skateboards'
  | 'cars'
  | 'food_near_bowl'
  | 'handling_paws'
  | 'handling_ears'
  | 'vet_visits'
  | 'confinement';

export type ManagementTool =
  | 'crate'
  | 'front_clip_harness'
  | 'head_halter'
  | 'muzzle'
  | 'baby_gates'
  | 'exercise_pen'
  | 'thundershirt'
  | 'puzzle_toys'
  | 'treat_pouch';

// ─── Environment Fit ───
export type HousingFit = 'apartment' | 'house_small' | 'house_medium' | 'house_large' | 'rural_property';
export type YardRequirement = 'none' | 'preferred' | 'required_fenced' | 'required_large';

// ─── Observations ───
export type PetStrength =
  | 'house_trained'
  | 'good_with_kids'
  | 'good_with_dogs'
  | 'good_with_cats'
  | 'low_energy'
  | 'highly_trainable'
  | 'calm_temperament'
  | 'affectionate'
  | 'independent'
  | 'good_on_leash'
  | 'crate_trained'
  | 'hypoallergenic';

export type PetChallenge =
  | 'separation_anxiety'
  | 'leash_reactive'
  | 'resource_guards'
  | 'fearful'
  | 'high_energy'
  | 'needs_training'
  | 'not_house_trained'
  | 'mouthy'
  | 'escape_artist'
  | 'noise_sensitive'
  | 'special_diet'
  | 'medical_needs';

// ─── Assessment Provenance ───
export type AssessorRole = 'shelter_staff' | 'foster_parent' | 'trainer' | 'veterinarian' | 'volunteer';
export type AssessmentMethod = 'observation' | 'foster_report' | 'trainer_eval' | 'vet_exam' | 'combined';

// ─── Training Level Sub-types ───
export type TrainingLevel = 'none' | 'in_progress' | 'reliable';

// ─── Shelter Pet (full record) ───
export interface ShelterPet {
  id: string;
  status: PetStatus;
  completionPercent: number;
  lastUpdated: string;
  createdAt: string;

  // Step 1 — Basic Profile
  name: string;
  species: Species | null;
  breed: string;
  sex: PetSex | null;
  ageYears: number;
  ageMonths: number;
  ageConfidence: AgeConfidence;
  weightLbs: number;
  sizeCategory: SizeCategory | null;
  intakeDate: string;
  intakeSource: IntakeSource | null;
  adoptionFee: number;
  adoptionStatus: AdoptionStatus;

  // Step 2 — Health & Care
  vaccineStatus: VaxStatus;
  microchipped: boolean;
  spayNeuterStatus: SpayNeuterStatus;
  medsNeeded: boolean;
  medsFrequency: string;
  specialDiet: boolean;
  specialDietType: string;
  knownConditions: KnownCondition[];
  groomingNeed: GroomingNeed;
  mobilityLimit: MobilityLimit;
  petAllergies: string;

  // Step 3 — Temperament (Social)
  friendlinessAdults: number;    // 1-5
  friendlinessKids: number;      // 1-5
  friendlinessDogs: number;      // 1-5
  friendlinessCats: number;      // 1-5
  confidenceLevel: number;       // 1-5 (shy → confident)
  touchSensitivity: number;      // 1-5 (very sensitive → very tolerant)

  // Step 4 — Temperament (Behavior)
  startleResponse: number;       // 1-5
  vocalizationLevel: number;     // 1-5
  preyDrive: number;             // 1-5
  resourceGuardingRisk: number;  // 1-5
  separationAnxietyRisk: number; // 1-5
  leashReactivity: number;       // 1-5

  // Step 5 — Daily Needs
  energyLevel: number;           // 1-5
  exerciseMinPerDay: number;
  enrichmentMinPerDay: number;
  pottyBreaksPerDay: number;
  aloneTimeTolerance: number;    // hours
  houseTraining: TrainingLevel;
  leashTraining: TrainingLevel;
  crateTraining: TrainingLevel;
  destructiveRisk: number;       // 1-5
  escapeRisk: number;            // 1-5
  sheddingLevel: number;         // 1-5
  barkingLevel: number;          // 1-5

  // Step 6 — Environment Fit
  bestHousingTypes: HousingFit[];
  yardRequirement: YardRequirement;
  stairsOk: boolean;
  noiseTolerance: number;        // 1-5
  singlePetOnly: boolean;
  compatibleWithDogs: boolean;
  compatibleWithCats: boolean;
  compatibleWithKids: boolean;
  minimumKidAge: number;         // 0 = no minimum
  needsExperiencedOwner: boolean;

  // Step 7 — Training Plan
  trainingFocusAreas: TrainingFocusArea[];
  trainingUrgency: TrainingUrgency;
  estTrainingHoursFirstMonth: number;
  estTrainingHoursOngoingWeekly: number;
  recommendedFormat: TrainingFormat[];
  knownTriggers: KnownTrigger[];
  managementTools: ManagementTool[];

  // Step 8 — Observations & Narrative
  topStrengths: PetStrength[];
  topChallenges: PetChallenge[];
  oneLineBlurb: string;          // <=120 chars
  structuredNotes: string;       // <=400 chars
  idealAdopterNotes: string;     // <=400 chars

  // Step 9 — Visit Availability
  availabilityGrid: Record<string, boolean>; // keyed "day-hour" e.g. "mon-9", "tue-14"

  // Step 10 — Media & Assessment
  photoUris: string[];
  coverPhotoIndex: number;
  assessorRole: AssessorRole | null;
  assessmentMethod: AssessmentMethod | null;
  observationHours: number;
  overallConfidence: number;     // 1-5
}

// ─── Pet Intake Draft (mirrors ShelterPet, used during wizard editing) ───
export type PetIntakeDraft = Omit<ShelterPet, 'id' | 'completionPercent' | 'lastUpdated' | 'createdAt'>;

export const DEFAULT_PET_INTAKE_DRAFT: PetIntakeDraft = {
  status: 'draft',

  // Step 1
  name: '',
  species: null,
  breed: '',
  sex: null,
  ageYears: 0,
  ageMonths: 0,
  ageConfidence: 'estimated',
  weightLbs: 0,
  sizeCategory: null,
  intakeDate: '',
  intakeSource: null,
  adoptionFee: 0,
  adoptionStatus: 'available',

  // Step 2
  vaccineStatus: 'unknown',
  microchipped: false,
  spayNeuterStatus: 'unknown',
  medsNeeded: false,
  medsFrequency: '',
  specialDiet: false,
  specialDietType: '',
  knownConditions: [],
  groomingNeed: 'low',
  mobilityLimit: 'none',
  petAllergies: '',

  // Step 3
  friendlinessAdults: 3,
  friendlinessKids: 3,
  friendlinessDogs: 3,
  friendlinessCats: 3,
  confidenceLevel: 3,
  touchSensitivity: 3,

  // Step 4
  startleResponse: 3,
  vocalizationLevel: 3,
  preyDrive: 3,
  resourceGuardingRisk: 3,
  separationAnxietyRisk: 3,
  leashReactivity: 3,

  // Step 5
  energyLevel: 3,
  exerciseMinPerDay: 30,
  enrichmentMinPerDay: 15,
  pottyBreaksPerDay: 4,
  aloneTimeTolerance: 4,
  houseTraining: 'none',
  leashTraining: 'none',
  crateTraining: 'none',
  destructiveRisk: 3,
  escapeRisk: 3,
  sheddingLevel: 3,
  barkingLevel: 3,

  // Step 6
  bestHousingTypes: [],
  yardRequirement: 'none',
  stairsOk: true,
  noiseTolerance: 3,
  singlePetOnly: false,
  compatibleWithDogs: true,
  compatibleWithCats: true,
  compatibleWithKids: true,
  minimumKidAge: 0,
  needsExperiencedOwner: false,

  // Step 7
  trainingFocusAreas: [],
  trainingUrgency: 'moderate',
  estTrainingHoursFirstMonth: 10,
  estTrainingHoursOngoingWeekly: 2,
  recommendedFormat: [],
  knownTriggers: [],
  managementTools: [],

  // Step 8
  topStrengths: [],
  topChallenges: [],
  oneLineBlurb: '',
  structuredNotes: '',
  idealAdopterNotes: '',

  // Step 9
  availabilityGrid: {},

  // Step 10
  photoUris: [],
  coverPhotoIndex: 0,
  assessorRole: null,
  assessmentMethod: null,
  observationHours: 0,
  overallConfidence: 3,
};
