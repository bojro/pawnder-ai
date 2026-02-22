import { ShelterPet } from '../types/shelter';

export const mockShelterPets: ShelterPet[] = [
  {
    id: 'shelter-pet-001',
    status: 'published',
    completionPercent: 95,
    lastUpdated: '2026-02-18T14:30:00Z',
    createdAt: '2026-02-10T09:00:00Z',

    // Step 1
    name: 'Luna',
    species: 'dog',
    breed: 'Golden Retriever',
    sex: 'female',
    ageYears: 2,
    ageMonths: 4,
    ageConfidence: 'estimated',
    weightLbs: 62,
    sizeCategory: 'large',
    intakeDate: '2026-01-15',
    intakeSource: 'owner_surrender',
    adoptionFee: 250,
    adoptionStatus: 'available',

    // Step 2
    vaccineStatus: 'up_to_date',
    microchipped: true,
    spayNeuterStatus: 'yes',
    medsNeeded: false,
    medsFrequency: '',
    specialDiet: false,
    specialDietType: '',
    knownConditions: [],
    groomingNeed: 'high',
    mobilityLimit: 'none',
    petAllergies: '',

    // Step 3
    friendlinessAdults: 5,
    friendlinessKids: 4,
    friendlinessDogs: 4,
    friendlinessCats: 3,
    confidenceLevel: 4,
    touchSensitivity: 5,

    // Step 4
    startleResponse: 2,
    vocalizationLevel: 2,
    preyDrive: 2,
    resourceGuardingRisk: 1,
    separationAnxietyRisk: 3,
    leashReactivity: 2,

    // Step 5
    energyLevel: 4,
    exerciseMinPerDay: 60,
    enrichmentMinPerDay: 20,
    pottyBreaksPerDay: 4,
    aloneTimeTolerance: 4,
    houseTraining: 'reliable',
    leashTraining: 'in_progress',
    crateTraining: 'reliable',
    destructiveRisk: 2,
    escapeRisk: 1,
    sheddingLevel: 4,
    barkingLevel: 2,

    // Step 6
    bestHousingTypes: ['house_medium', 'house_large', 'rural_property'],
    yardRequirement: 'preferred',
    stairsOk: true,
    noiseTolerance: 4,
    singlePetOnly: false,
    compatibleWithDogs: true,
    compatibleWithCats: true,
    compatibleWithKids: true,
    minimumKidAge: 5,
    needsExperiencedOwner: false,

    // Step 7
    trainingFocusAreas: ['leash_manners', 'impulse_control'],
    trainingUrgency: 'low',
    estTrainingHoursFirstMonth: 8,
    estTrainingHoursOngoingWeekly: 2,
    recommendedFormat: ['group'],
    knownTriggers: [],
    managementTools: ['front_clip_harness'],

    // Step 8
    topStrengths: ['affectionate', 'good_with_kids', 'house_trained'],
    topChallenges: [],
    oneLineBlurb: 'A joyful golden who greets everyone with a wagging tail',
    structuredNotes: 'Luna was surrendered due to owner relocation. She is well-socialized and knows basic commands. Needs leash work.',
    idealAdopterNotes: 'Active family with a yard. Tolerant of shedding. Willing to continue leash training.',

    // Step 9
    photoUris: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=600'],
    coverPhotoIndex: 0,
    assessorRole: 'shelter_staff',
    assessmentMethod: 'combined',
    observationHours: 12,
    overallConfidence: 4,
  },
  {
    id: 'shelter-pet-002',
    status: 'ready',
    completionPercent: 80,
    lastUpdated: '2026-02-19T10:15:00Z',
    createdAt: '2026-02-12T11:00:00Z',

    // Step 1
    name: 'Mochi',
    species: 'cat',
    breed: 'Domestic Shorthair',
    sex: 'male',
    ageYears: 1,
    ageMonths: 6,
    ageConfidence: 'estimated',
    weightLbs: 9,
    sizeCategory: 'small',
    intakeDate: '2026-02-01',
    intakeSource: 'stray',
    adoptionFee: 150,
    adoptionStatus: 'available',

    // Step 2
    vaccineStatus: 'up_to_date',
    microchipped: true,
    spayNeuterStatus: 'yes',
    medsNeeded: false,
    medsFrequency: '',
    specialDiet: false,
    specialDietType: '',
    knownConditions: [],
    groomingNeed: 'low',
    mobilityLimit: 'none',
    petAllergies: '',

    // Step 3
    friendlinessAdults: 4,
    friendlinessKids: 2,
    friendlinessDogs: 2,
    friendlinessCats: 4,
    confidenceLevel: 3,
    touchSensitivity: 3,

    // Step 4
    startleResponse: 4,
    vocalizationLevel: 3,
    preyDrive: 4,
    resourceGuardingRisk: 2,
    separationAnxietyRisk: 2,
    leashReactivity: 3,

    // Step 5
    energyLevel: 3,
    exerciseMinPerDay: 20,
    enrichmentMinPerDay: 30,
    pottyBreaksPerDay: 2,
    aloneTimeTolerance: 8,
    houseTraining: 'reliable',
    leashTraining: 'none',
    crateTraining: 'none',
    destructiveRisk: 2,
    escapeRisk: 3,
    sheddingLevel: 2,
    barkingLevel: 2,

    // Step 6
    bestHousingTypes: ['apartment', 'house_small', 'house_medium'],
    yardRequirement: 'none',
    stairsOk: true,
    noiseTolerance: 2,
    singlePetOnly: false,
    compatibleWithDogs: false,
    compatibleWithCats: true,
    compatibleWithKids: false,
    minimumKidAge: 12,
    needsExperiencedOwner: false,

    // Step 7
    trainingFocusAreas: ['socialization', 'handling_tolerance'],
    trainingUrgency: 'moderate',
    estTrainingHoursFirstMonth: 6,
    estTrainingHoursOngoingWeekly: 1,
    recommendedFormat: ['self_guided'],
    knownTriggers: ['loud_noises', 'strangers'],
    managementTools: ['puzzle_toys'],

    // Step 8
    topStrengths: ['independent', 'house_trained', 'low_energy'],
    topChallenges: ['fearful', 'noise_sensitive'],
    oneLineBlurb: 'Quiet, independent kitty seeking a calm home',
    structuredNotes: 'Found as a stray. Initially skittish but warming up. Uses litter box reliably. Loves window perches.',
    idealAdopterNotes: 'Quiet household, no young children. Patient adopter willing to let Mochi adjust at his own pace.',

    // Step 9
    photoUris: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600'],
    coverPhotoIndex: 0,
    assessorRole: 'foster_parent',
    assessmentMethod: 'foster_report',
    observationHours: 40,
    overallConfidence: 4,
  },
  {
    id: 'shelter-pet-003',
    status: 'draft',
    completionPercent: 35,
    lastUpdated: '2026-02-20T16:45:00Z',
    createdAt: '2026-02-20T16:00:00Z',

    // Step 1
    name: 'Biscuit',
    species: 'dog',
    breed: 'Pit Bull Mix',
    sex: 'male',
    ageYears: 3,
    ageMonths: 0,
    ageConfidence: 'estimated',
    weightLbs: 55,
    sizeCategory: 'large',
    intakeDate: '2026-02-18',
    intakeSource: 'confiscation',
    adoptionFee: 200,
    adoptionStatus: 'on_hold',

    // Step 2
    vaccineStatus: 'partial',
    microchipped: false,
    spayNeuterStatus: 'no',
    medsNeeded: true,
    medsFrequency: 'Daily heartworm preventative',
    specialDiet: false,
    specialDietType: '',
    knownConditions: [{ name: 'Heartworm', severity: 'moderate' }],
    groomingNeed: 'low',
    mobilityLimit: 'none',
    petAllergies: '',

    // Step 3 — mostly defaults (staff hasn't finished)
    friendlinessAdults: 4,
    friendlinessKids: 3,
    friendlinessDogs: 2,
    friendlinessCats: 1,
    confidenceLevel: 4,
    touchSensitivity: 4,

    // Step 4
    startleResponse: 3,
    vocalizationLevel: 3,
    preyDrive: 4,
    resourceGuardingRisk: 3,
    separationAnxietyRisk: 3,
    leashReactivity: 4,

    // Step 5
    energyLevel: 4,
    exerciseMinPerDay: 45,
    enrichmentMinPerDay: 20,
    pottyBreaksPerDay: 5,
    aloneTimeTolerance: 3,
    houseTraining: 'in_progress',
    leashTraining: 'none',
    crateTraining: 'in_progress',
    destructiveRisk: 4,
    escapeRisk: 3,
    sheddingLevel: 2,
    barkingLevel: 3,

    // Step 6 — not filled yet
    bestHousingTypes: [],
    yardRequirement: 'none',
    stairsOk: true,
    noiseTolerance: 3,
    singlePetOnly: false,
    compatibleWithDogs: false,
    compatibleWithCats: false,
    compatibleWithKids: true,
    minimumKidAge: 10,
    needsExperiencedOwner: true,

    // Step 7 — not filled yet
    trainingFocusAreas: [],
    trainingUrgency: 'moderate',
    estTrainingHoursFirstMonth: 10,
    estTrainingHoursOngoingWeekly: 2,
    recommendedFormat: [],
    knownTriggers: [],
    managementTools: [],

    // Step 8 — not filled yet
    topStrengths: [],
    topChallenges: [],
    oneLineBlurb: '',
    structuredNotes: '',
    idealAdopterNotes: '',

    // Step 9 — not filled yet
    photoUris: [],
    coverPhotoIndex: 0,
    assessorRole: null,
    assessmentMethod: null,
    observationHours: 0,
    overallConfidence: 3,
  },
];
