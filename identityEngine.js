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

  const normalized = normalizeTraits(totals, answerHistory.length);
  const {
    impulse,
    restraint,
    social,
    mischief,
    practicality,
    curiosity,
    influence
  } = normalized;

  const balanceTraits = [curiosity, restraint, mischief, influence];
  const balanceAverage = balanceTraits.reduce((sum, value) => sum + value, 0) / balanceTraits.length;
  const balanceSpread = balanceTraits.reduce((sum, value) => sum + Math.abs(value - balanceAverage), 0);
  const balanceScoreBasedOnEvenness = balanceAverage * 1.85 - balanceSpread * 0.55 + Math.min(...balanceTraits) * 0.95;

  const scores = {
    sinnerAmateur: restraint * 1.35 + practicality * 0.75 - impulse * 0.35 - mischief * 0.15,
    ethicallyCreative: practicality * 1.15 + mischief * 1.05 + restraint * 0.2,
    chaosCurator: mischief * 1.0 + curiosity * 1.05 + impulse * 0.15,
    wellnessOutlaw: curiosity * 0.95 + restraint * 1.0 + practicality * 0.3,
    certifiedMenace: mischief * 1.25 + impulse * 1.35 + curiosity * 0.1 - restraint * 0.15,
    professionalBadInfluence: influence * 1.25 + social * 0.85 + mischief * 0.2,
    dailySinSaint: balanceScoreBasedOnEvenness
  };

  applyArchetypeBoosts(scores, normalized);

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

function normalizeTraits(totals, answerCount) {
  const ceilings = getTraitCeilings(answerCount);

  return Object.keys(totals).reduce((normalized, trait) => {
    const ceiling = ceilings[trait] || Math.max(answerCount * 2, 1);
    normalized[trait] = totals[trait] / ceiling;
    return normalized;
  }, {});
}

function getTraitCeilings(answerCount) {
  const ceilings = {
    impulse: 0,
    restraint: 0,
    social: 0,
    mischief: 0,
    practicality: 0,
    curiosity: 0,
    influence: 0
  };

  if (!Array.isArray(globalThis.QUESTIONS)) {
    Object.keys(ceilings).forEach((trait) => {
      ceilings[trait] = Math.max(answerCount * 2, 1);
    });
    return ceilings;
  }

  globalThis.QUESTIONS.slice(0, answerCount).forEach((question) => {
    Object.keys(ceilings).forEach((trait) => {
      const possible = question.answers.map((answer) => Number(answer.traits[trait]) || 0);
      ceilings[trait] += Math.max(...possible, 0);
    });
  });

  Object.keys(ceilings).forEach((trait) => {
    ceilings[trait] = Math.max(ceilings[trait], 1);
  });

  return ceilings;
}

function applyArchetypeBoosts(scores, traits) {
  const rankedTraits = Object.entries(traits).sort((a, b) => b[1] - a[1]);
  const strongestTrait = rankedTraits[0] ? rankedTraits[0][0] : "";
  const secondTrait = rankedTraits[1] ? rankedTraits[1][0] : "";

  if (strongestTrait === "influence" || secondTrait === "influence") {
    scores.professionalBadInfluence += 0.12;
  }

  if (strongestTrait === "restraint" && traits.impulse < 0.42) {
    scores.sinnerAmateur += 0.2;
  }

  if (traits.practicality >= 0.55 && traits.mischief >= 0.35) {
    scores.ethicallyCreative += 0.18;
  }

  if (traits.curiosity >= 0.55 && traits.mischief >= 0.35) {
    scores.chaosCurator += 0.18;
  }

  if (traits.curiosity >= 0.5 && traits.restraint >= 0.45) {
    scores.wellnessOutlaw += 0.18;
  }

  if (traits.impulse >= 0.55 && traits.mischief >= 0.45) {
    scores.certifiedMenace += 0.35;
  }

  const saintTraits = [traits.curiosity, traits.restraint, traits.mischief, traits.influence];
  const saintSpread = Math.max(...saintTraits) - Math.min(...saintTraits);
  if (saintSpread <= 0.28 && saintTraits.every((value) => value >= 0.2)) {
    scores.dailySinSaint += 0.45;
  }
}

globalThis.IDENTITIES = IDENTITIES;
globalThis.calculateIdentity = calculateIdentity;
