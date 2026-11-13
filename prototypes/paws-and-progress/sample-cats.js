const mockCats = [
  {
    id: "mock_001",
    name: "Luna",
    age: "3 years",
    description: "Luna is a gentle tortoiseshell who takes time to warm up. She loves quiet evenings by the window and will slowly become your devoted shadow once she trusts you.",
    personality: { energy: 2, vocal: 1, social: 2, affectionate: 3 },
    apartment: true,
    shelter: { name: "NYC Animal Care Centers", city: "Manhattan, NY", adoptionId: "ACC-2024-8821", url: "https://www.nycacc.org" }
  },
  {
    id: "mock_002",
    name: "Mochi",
    age: "1 year",
    description: "Mochi is a tiny bundle of unstoppable energy! This orange tabby kitten wants to play all day and will zoom through your apartment at full speed.",
    personality: { energy: 5, vocal: 3, social: 4, affectionate: 4 },
    apartment: true,
    shelter: { name: "Brooklyn Animal Care Centers", city: "Brooklyn, NY", adoptionId: "ACC-2024-9034", url: "https://www.nycacc.org" }
  },
  {
    id: "mock_003",
    name: "Shadow",
    age: "5 years",
    description: "Shadow is a regal black cat who prefers solitude and observes the world from his favorite windowsill. He's not antisocial — just very selective about his company.",
    personality: { energy: 1, vocal: 1, social: 1, affectionate: 2 },
    apartment: true,
    shelter: { name: "Queens Animal Care Centers", city: "Queens, NY", adoptionId: "ACC-2024-7612", url: "https://www.nycacc.org" }
  },
  {
    id: "mock_004",
    name: "Biscuit",
    age: "2 years",
    description: "Biscuit is the ultimate people-cat. This golden tabby runs to greet everyone at the door and demands cuddles at all times. Perfect for families!",
    personality: { energy: 3, vocal: 4, social: 5, affectionate: 5 },
    apartment: true,
    shelter: { name: "Happy Paws Rescue", city: "Hoboken, NJ", adoptionId: "HPR-2024-0445", url: "https://happypawsrescue.org" }
  },
  {
    id: "mock_005",
    name: "Cleo",
    age: "4 years",
    description: "Cleo is a chatty Siamese mix who will narrate her entire day to you. She loves interactive play and follows her person from room to room.",
    personality: { energy: 4, vocal: 5, social: 4, affectionate: 4 },
    apartment: false,
    shelter: { name: "Anjellicle Cats Rescue", city: "New York, NY", adoptionId: "ANJEL-2024-112", url: "https://anjellicle.org" }
  },
  {
    id: "mock_006",
    name: "Oliver",
    age: "6 years",
    description: "Oliver is the perfect couch companion. This laid-back British Shorthair loves naps, gentle strokes, and watching TV with his person. No surprises, please.",
    personality: { energy: 1, vocal: 2, social: 3, affectionate: 4 },
    apartment: true,
    shelter: { name: "ASPCA Adoption Center", city: "New York, NY", adoptionId: "ASPCA-2024-8823", url: "https://www.aspca.org/adopt" }
  },
  {
    id: "mock_007",
    name: "Nala",
    age: "2 years",
    description: "Nala came from a hoarding situation and is still learning to trust humans. With patience and a quiet home, she blossoms into a deeply loving companion.",
    personality: { energy: 2, vocal: 1, social: 1, affectionate: 3 },
    apartment: true,
    shelter: { name: "Little Wanderers NYC", city: "Bronx, NY", adoptionId: "LW-2024-0567", url: "https://littlewanderersnyc.org" }
  },
  {
    id: "mock_008",
    name: "Peanut",
    age: "1 year",
    description: "Peanut is a curious, playful grey kitten who investigates everything. He's social, adaptable, and great with other cats. Always in motion!",
    personality: { energy: 5, vocal: 3, social: 5, affectionate: 3 },
    apartment: true,
    shelter: { name: "City Critters NYC", city: "New York, NY", adoptionId: "CC-2024-3344", url: "https://citycritters.org" }
  },
  {
    id: "mock_009",
    name: "Rosie",
    age: "7 years",
    description: "Rosie is a senior cat looking for her forever home. She's calm, affectionate, and perfectly content to spend her golden years curled up with you.",
    personality: { energy: 1, vocal: 2, social: 3, affectionate: 5 },
    apartment: true,
    shelter: { name: "Zani's Furry Friends", city: "Jersey City, NJ", adoptionId: "ZFF-2024-0089", url: "https://zanisfurryfriends.org" }
  },
  {
    id: "mock_010",
    name: "Tiger",
    age: "3 years",
    description: "Tiger is an adventure-loving tabby who needs space to roam. He's friendly and talkative but needs vigorous interactive play every day to stay happy.",
    personality: { energy: 4, vocal: 4, social: 4, affectionate: 3 },
    apartment: false,
    shelter: { name: "North Shore Animal League", city: "Port Washington, NY", adoptionId: "NSAL-2024-5521", url: "https://www.animalleague.org" }
  }
];

// ─── Compatibility Scoring ────────────────────────────────────────────────────
function computeCompatibility(prefs, cat) {
  const p = cat.personality;
  let score = 100;
  score -= Math.abs(prefs.energy - p.energy) * 6;
  score -= Math.abs(prefs.noise - p.vocal) * 5;
  score -= Math.abs(prefs.social - p.social) * 5;
  score -= Math.abs(prefs.cuddle - p.affectionate) * 5;

  if (prefs.apartment && cat.apartment) score += 3;
  if (prefs.firstTime && p.social >= 3 && p.energy <= 3) score += 2;
  if (prefs.home && p.social >= 3) score += 2;

  return Math.min(99, Math.max(70, Math.round(score)));
}

