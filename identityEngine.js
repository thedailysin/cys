const IDENTITIES = {
  sinnerAmateur: {
    title: "SINNER AMATEUR",
    displayTitle: ["SINNER", "Amateur"],
    description: "You keep flirting with bad decisions. Then apologising to them.",
    knownFor: [
      "Taking one small risk and narrating it.",
      "Feeling guilty before anything happens.",
      "Being dangerous only in theory."
    ]
  },

  ethicallyCreative: {
    title: "ETHICALLY CREATIVE",
    displayTitle: ["ETHICALLY", "Creative"],
    description: "You don't break rules. You simply negotiate with them.",
    knownFor: [
      "Finding loopholes with excellent posture.",
      "Making bad ideas sound reasonable.",
      "Using morality as a flexible material."
    ]
  },

  chaosCurator: {
    title: "CHAOS CURATOR",
    displayTitle: ["CHAOS", "Curator"],
    description: "You don't create problems. You arrange them beautifully.",
    knownFor: [
      "Making confusion look intentional.",
      "Walking into calm rooms and improving the plot.",
      "Turning minor inconvenience into atmosphere."
    ]
  },

  wellnessOutlaw: {
    title: "WELLNESS OUTLAW",
    displayTitle: ["WELLNESS", "Outlaw"],
    description: "You reject boring wellness and find health in suspicious places.",
    knownFor: [
      "Trusting ingredients, not beige packaging.",
      "Making better choices look slightly illegal.",
      "Treating self-care like a small rebellion."
    ]
  },

  certifiedMenace: {
    title: "CERTIFIED MENACE",
    displayTitle: ["CERTIFIED", "Menace"],
    description: "Entirely delightful. Slightly concerning.",
    knownFor: [
      "Being the reason warning labels exist.",
      "Starting sentences with \"hear me out.\"",
      "Creating situations no one can technically object to."
    ]
  },

  professionalBadInfluence: {
    title: "PROFESSIONAL BAD INFLUENCE",
    displayTitle: ["PROFESSIONAL", "Bad Influence"],
    description: "You don't force anyone. You just make questionable choices look irresistible.",
    knownFor: [
      "Being the second yes.",
      "Turning plans into stories.",
      "Making people say, \"Fine, but only because you're going.\""
    ]
  },

  dailySinSaint: {
    title: "THE DAILY SIN SAINT",
    displayTitle: ["THE DAILY SIN", "Saint"],
    description: "Fully enlightened. Entirely unqualified to give life advice.",
    knownFor: [
      "Balancing restraint and temptation suspiciously well.",
      "Making peace with contradiction.",
      "Choosing stories over purity."
    ]
  }
};

function calculateIdentity(answerHistory) {
  if (!Array.isArray(answerHistory) || answerHistory.length === 0) {
    return "sinnerAmateur";
  }

  const totals = {
    impulse: 0,
    restraint: 0,
    social: 0,
    mischief: 0,
    practicality: 0,
    curiosity: 0,
    influence: 0
  };

  answerHistory.forEach((traits) => {
    if (!traits || typeof traits !== "object") {
      return;
    }

    Object.keys(totals).forEach((trait) => {
      const value = Number(traits[trait]);
      if (Number.isFinite(value)) {
        totals[trait] += value;
      }
    });
  });

  const {
    impulse,
    restraint,
    social,
    mischief,
    practicality,
    curiosity,
    influence
  } = totals;

  const balanceTraits = [curiosity, restraint, mischief, influence];
  const balanceAverage = balanceTraits.reduce((sum, value) => sum + value, 0) / balanceTraits.length;
  const balanceSpread = balanceTraits.reduce((sum, value) => sum + Math.abs(value - balanceAverage), 0);
  const balanceScoreBasedOnEvenness = balanceAverage * 2.2 - balanceSpread * 0.8 + Math.min(...balanceTraits) * 0.6;

  const scores = {
    sinnerAmateur: restraint * 1.4 + practicality * 0.6 - impulse * 0.3,
    ethicallyCreative: practicality * 1.1 + mischief * 1.0 + curiosity * 0.4,
    chaosCurator: mischief * 1.3 + curiosity * 1.0 + impulse * 0.4,
    wellnessOutlaw: curiosity * 1.2 + restraint * 0.8 + practicality * 0.4,
    certifiedMenace: mischief * 1.4 + impulse * 1.2 + influence * 0.3,
    professionalBadInfluence: influence * 1.4 + social * 1.1 + mischief * 0.5,
    dailySinSaint: balanceScoreBasedOnEvenness
  };

  const tieBreakPriority = [
    "professionalBadInfluence",
    "certifiedMenace",
    "ethicallyCreative",
    "chaosCurator",
    "wellnessOutlaw",
    "dailySinSaint",
    "sinnerAmateur"
  ];

  return tieBreakPriority.reduce((winner, key) => {
    if (!winner) {
      return key;
    }

    return scores[key] > scores[winner] ? key : winner;
  }, null) || "sinnerAmateur";
}

globalThis.IDENTITIES = IDENTITIES;
globalThis.calculateIdentity = calculateIdentity;
