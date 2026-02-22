import {
  Species,
  PetSex,
  AgeConfidence,
  SizeCategory,
  IntakeSource,
  AdoptionStatus,
  VaxStatus,
  SpayNeuterStatus,
  GroomingNeed,
  MobilityLimit,
  TrainingLevel,
  HousingFit,
  YardRequirement,
  TrainingFocusArea,
  TrainingUrgency,
  TrainingFormat,
  KnownTrigger,
  ManagementTool,
  PetStrength,
  PetChallenge,
  AssessorRole,
  AssessmentMethod,
} from '../types/shelter';

// ─── Step count ───
export const TOTAL_INTAKE_STEPS = 9;

export const INTAKE_STEP_NAMES = [
  'basic-profile',
  'health',
  'temperament-social',
  'temperament-behavior',
  'daily-needs',
  'environment',
  'training-plan',
  'observations',
  'media',
] as const;

// ─── Step 1: Basic Profile ───
export const SPECIES_OPTIONS: { label: string; value: Species }[] = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Rabbit', value: 'rabbit' },
  { label: 'Bird', value: 'bird' },
  { label: 'Reptile', value: 'reptile' },
  { label: 'Small Animal', value: 'small_animal' },
  { label: 'Other', value: 'other' },
];

export const SEX_OPTIONS: { label: string; value: PetSex }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unknown', value: 'unknown' },
];

export const AGE_CONFIDENCE_OPTIONS: { label: string; value: AgeConfidence }[] = [
  { label: 'Exact', value: 'exact' },
  { label: 'Estimated', value: 'estimated' },
  { label: 'Unknown', value: 'unknown' },
];

export const SIZE_CATEGORY_OPTIONS: { label: string; value: SizeCategory }[] = [
  { label: 'Tiny (< 5 lbs)', value: 'tiny' },
  { label: 'Small (5–25 lbs)', value: 'small' },
  { label: 'Medium (25–50 lbs)', value: 'medium' },
  { label: 'Large (50–100 lbs)', value: 'large' },
  { label: 'Extra Large (100+ lbs)', value: 'extra_large' },
];

export const INTAKE_SOURCE_OPTIONS: { label: string; value: IntakeSource }[] = [
  { label: 'Owner Surrender', value: 'owner_surrender' },
  { label: 'Stray', value: 'stray' },
  { label: 'Transfer', value: 'transfer' },
  { label: 'Confiscation', value: 'confiscation' },
  { label: 'Born in Shelter', value: 'born_in_shelter' },
  { label: 'Other', value: 'other' },
];

export const ADOPTION_STATUS_OPTIONS: { label: string; value: AdoptionStatus }[] = [
  { label: 'Available', value: 'available' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Pending', value: 'pending' },
  { label: 'Adopted', value: 'adopted' },
  { label: 'Not Available', value: 'not_available' },
];

// ─── Step 2: Health & Care ───
export const VAX_STATUS_OPTIONS: { label: string; value: VaxStatus }[] = [
  { label: 'Up to Date', value: 'up_to_date' },
  { label: 'Partial', value: 'partial' },
  { label: 'None', value: 'none' },
  { label: 'Unknown', value: 'unknown' },
];

export const SPAY_NEUTER_OPTIONS: { label: string; value: SpayNeuterStatus }[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Unknown', value: 'unknown' },
];

export const GROOMING_NEED_OPTIONS: { label: string; value: GroomingNeed }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
  { label: 'Professional Only', value: 'professional_only' },
];

export const MOBILITY_LIMIT_OPTIONS: { label: string; value: MobilityLimit }[] = [
  { label: 'None', value: 'none' },
  { label: 'Minor', value: 'minor' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Significant', value: 'significant' },
];

export const CONDITION_PICKLIST: string[] = [
  'Heartworm',
  'Flea/Tick infestation',
  'Dental disease',
  'Skin allergy',
  'Ear infection',
  'Eye condition',
  'Arthritis',
  'Hip dysplasia',
  'Diabetes',
  'Epilepsy',
  'Heart condition',
  'Respiratory issue',
  'Urinary issue',
  'GI issue',
  'Cancer',
  'Obesity',
  'FIV/FeLV (cats)',
  'Kennel cough',
  'Other',
];

// ─── Step 3 & 4: Temperament ───
export const TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS = ['Fearful', 'Wary', 'Neutral', 'Friendly', 'Loves all'];
export const TEMPERAMENT_SLIDER_LABELS_CONFIDENCE = ['Very shy', 'Shy', 'Moderate', 'Confident', 'Bold'];
export const TEMPERAMENT_SLIDER_LABELS_SENSITIVITY = ['Very sensitive', 'Sensitive', 'Moderate', 'Tolerant', 'Very tolerant'];
export const TEMPERAMENT_SLIDER_LABELS_RISK = ['Minimal', 'Low', 'Moderate', 'High', 'Severe'];
export const TEMPERAMENT_SLIDER_LABELS_LEVEL = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];

// ─── Step 5: Daily Needs ───
export const TRAINING_LEVEL_OPTIONS: { label: string; value: TrainingLevel }[] = [
  { label: 'None', value: 'none' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Reliable', value: 'reliable' },
];

// ─── Step 6: Environment Fit ───
export const HOUSING_FIT_OPTIONS: { label: string; value: HousingFit }[] = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Small House', value: 'house_small' },
  { label: 'Medium House', value: 'house_medium' },
  { label: 'Large House', value: 'house_large' },
  { label: 'Rural Property', value: 'rural_property' },
];

export const YARD_REQUIREMENT_OPTIONS: { label: string; value: YardRequirement }[] = [
  { label: 'None', value: 'none' },
  { label: 'Preferred', value: 'preferred' },
  { label: 'Required (Fenced)', value: 'required_fenced' },
  { label: 'Required (Large)', value: 'required_large' },
];

// ─── Step 7: Training Plan ───
export const TRAINING_FOCUS_OPTIONS: { label: string; value: TrainingFocusArea }[] = [
  { label: 'Basic Obedience', value: 'basic_obedience' },
  { label: 'Leash Manners', value: 'leash_manners' },
  { label: 'Socialization', value: 'socialization' },
  { label: 'Separation Anxiety', value: 'separation_anxiety' },
  { label: 'Resource Guarding', value: 'resource_guarding' },
  { label: 'Fear / Reactivity', value: 'fear_reactivity' },
  { label: 'Impulse Control', value: 'impulse_control' },
  { label: 'House Training', value: 'house_training' },
  { label: 'Crate Training', value: 'crate_training' },
  { label: 'Bite Inhibition', value: 'bite_inhibition' },
  { label: 'Noise Desensitization', value: 'noise_desensitization' },
  { label: 'Handling Tolerance', value: 'handling_tolerance' },
];

export const TRAINING_URGENCY_OPTIONS: { label: string; value: TrainingUrgency }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export const TRAINING_FORMAT_OPTIONS: { label: string; value: TrainingFormat }[] = [
  { label: 'Group Class', value: 'group' },
  { label: 'Private Sessions', value: 'private' },
  { label: 'Self-Guided', value: 'self_guided' },
  { label: 'Board & Train', value: 'board_and_train' },
];

export const KNOWN_TRIGGER_OPTIONS: { label: string; value: KnownTrigger }[] = [
  { label: 'Loud Noises', value: 'loud_noises' },
  { label: 'Strangers', value: 'strangers' },
  { label: 'Children', value: 'children' },
  { label: 'Other Dogs', value: 'other_dogs' },
  { label: 'Cats', value: 'cats' },
  { label: 'Bikes / Skateboards', value: 'bikes_skateboards' },
  { label: 'Cars', value: 'cars' },
  { label: 'Food Near Bowl', value: 'food_near_bowl' },
  { label: 'Handling Paws', value: 'handling_paws' },
  { label: 'Handling Ears', value: 'handling_ears' },
  { label: 'Vet Visits', value: 'vet_visits' },
  { label: 'Confinement', value: 'confinement' },
];

export const MANAGEMENT_TOOL_OPTIONS: { label: string; value: ManagementTool }[] = [
  { label: 'Crate', value: 'crate' },
  { label: 'Front-Clip Harness', value: 'front_clip_harness' },
  { label: 'Head Halter', value: 'head_halter' },
  { label: 'Muzzle', value: 'muzzle' },
  { label: 'Baby Gates', value: 'baby_gates' },
  { label: 'Exercise Pen', value: 'exercise_pen' },
  { label: 'Thundershirt', value: 'thundershirt' },
  { label: 'Puzzle Toys', value: 'puzzle_toys' },
  { label: 'Treat Pouch', value: 'treat_pouch' },
];

// ─── Step 8: Observations ───
export const STRENGTH_OPTIONS: { label: string; value: PetStrength }[] = [
  { label: 'House Trained', value: 'house_trained' },
  { label: 'Good with Kids', value: 'good_with_kids' },
  { label: 'Good with Dogs', value: 'good_with_dogs' },
  { label: 'Good with Cats', value: 'good_with_cats' },
  { label: 'Low Energy', value: 'low_energy' },
  { label: 'Highly Trainable', value: 'highly_trainable' },
  { label: 'Calm Temperament', value: 'calm_temperament' },
  { label: 'Affectionate', value: 'affectionate' },
  { label: 'Independent', value: 'independent' },
  { label: 'Good on Leash', value: 'good_on_leash' },
  { label: 'Crate Trained', value: 'crate_trained' },
  { label: 'Hypoallergenic', value: 'hypoallergenic' },
];

export const CHALLENGE_OPTIONS: { label: string; value: PetChallenge }[] = [
  { label: 'Separation Anxiety', value: 'separation_anxiety' },
  { label: 'Leash Reactive', value: 'leash_reactive' },
  { label: 'Resource Guards', value: 'resource_guards' },
  { label: 'Fearful', value: 'fearful' },
  { label: 'High Energy', value: 'high_energy' },
  { label: 'Needs Training', value: 'needs_training' },
  { label: 'Not House Trained', value: 'not_house_trained' },
  { label: 'Mouthy', value: 'mouthy' },
  { label: 'Escape Artist', value: 'escape_artist' },
  { label: 'Noise Sensitive', value: 'noise_sensitive' },
  { label: 'Special Diet', value: 'special_diet' },
  { label: 'Medical Needs', value: 'medical_needs' },
];

// ─── Step 9: Assessment Provenance ───
export const ASSESSOR_ROLE_OPTIONS: { label: string; value: AssessorRole }[] = [
  { label: 'Shelter Staff', value: 'shelter_staff' },
  { label: 'Foster Parent', value: 'foster_parent' },
  { label: 'Trainer', value: 'trainer' },
  { label: 'Veterinarian', value: 'veterinarian' },
  { label: 'Volunteer', value: 'volunteer' },
];

export const ASSESSMENT_METHOD_OPTIONS: { label: string; value: AssessmentMethod }[] = [
  { label: 'Observation', value: 'observation' },
  { label: 'Foster Report', value: 'foster_report' },
  { label: 'Trainer Evaluation', value: 'trainer_eval' },
  { label: 'Vet Exam', value: 'vet_exam' },
  { label: 'Combined', value: 'combined' },
];
