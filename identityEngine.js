const IDENTITIES = {
  sinnerAmateur: {
    title: "SINNER AMATEUR",
    displayTitle: ["SINNER", "Amateur"],
    cardBack: "#FAD5D8",
    cardText: "black",
    descriptions: [
      "You keep flirting with bad decisions. Then apologising to them.",
      "You're dangerous only in theory.",
      "You've read the rulebook. You're just curious about the footnotes.",
      "You enjoy the idea of rebellion almost as much as bedtime.",
      "Every villain has an origin story. You're still in chapter one.",
      "You like your chaos with a safety briefing.",
      "You're one questionable decision away from becoming interesting.",
      "Your impulse control still has parental supervision.",
      "You rebel politely.",
      "You still ask, \"Is this a bad idea?\" before doing it anyway."
    ],
    previousOffences: [
      ["Saying \"I'll only have one.\"", "Looking guilty before anything happened.", "Testing boundaries one toe at a time."],
      ["Reading warning labels out of curiosity.", "Taking the scenic route to trouble.", "Double-checking if this counts as rebellion."],
      ["Asking for permission after the fact.", "Being the least convincing liar in the room.", "Making tiny mistakes with enormous commitment."]
    ]
  },

  ethicallyCreative: {
    title: "ETHICALLY CREATIVE",
    displayTitle: ["ETHICALLY", "Creative"],
    cardBack: "#CE3728",
    cardText: "white",
    descriptions: [
      "You don't break rules. You simply negotiate with them.",
      "Morality is less of a line and more of a suggestion.",
      "If there's a loophole, you've probably named it.",
      "You believe every problem has an elegant workaround.",
      "You colour outside the lines, then redraw the lines.",
      "You can justify almost anything with surprising confidence.",
      "You don't cheat. You optimise.",
      "Rules fascinate you because they usually have exceptions.",
      "You make bad ideas sound strangely responsible.",
      "You're the reason terms and conditions keep getting longer."
    ],
    previousOffences: [
      ["Finding loopholes before instructions.", "Saying \"Technically...\"", "Winning arguments nobody wanted."],
      ["Solving problems creatively.", "Bending rules without breaking eye contact.", "Explaining yourself far too convincingly."],
      ["Reading between the lines.", "Inventing shortcuts.", "Making impossible things sound obvious."]
    ]
  },

  socialLiability: {
    title: "SOCIAL LIABILITY",
    displayTitle: ["SOCIAL", "Liability"],
    cardBack: "#F3C84A",
    cardText: "black",
    descriptions: [
      "Good intentions. Questionable execution.",
      "Every group has one. Congratulations.",
      "You don't create problems. You simply arrive before they do.",
      "Somehow every ordinary outing becomes a story people tell for years.",
      "People invite you knowing exactly what might happen.",
      "You have an incredible ability to make \"just one\" apply to everything.",
      "If there's a group photo, you're probably the reason it exists.",
      "You never mean to escalate things. You just hate leaving a good story unfinished.",
      "Your friends should technically know better by now.",
      "You're the reason \"it seemed like a good idea at the time\" became a sentence."
    ],
    previousOffences: [
      ["Opening Blinkit \"just to browse.\"", "Saying \"Just one.\"", "Convincing others it was their idea."],
      ["Turning plans into detours.", "Ordering dessert without consulting the table.", "Making tomorrow's problem today's entertainment."],
      ["Being suspiciously persuasive.", "Starting stories with \"You'll never guess...\"", "Never being technically at fault."]
    ]
  },

  chaosCurator: {
    title: "CHAOS CURATOR",
    displayTitle: ["CHAOS", "Curator"],
    cardBack: "#EAB145",
    cardText: "black",
    descriptions: [
      "You don't create problems. You arrange them beautifully.",
      "Disorder follows you with remarkable consistency.",
      "Calm rooms become memorable after you arrive.",
      "You treat unpredictability like an interior design choice.",
      "You don't stir the pot. You season it.",
      "Coincidence keeps using your address.",
      "Everything gets slightly more interesting around you.",
      "You believe every plan deserves a plot twist.",
      "Your timing is suspiciously entertaining.",
      "You mistake stability for unfinished business."
    ],
    previousOffences: [
      ["Rearranging perfectly good plans.", "Turning silence into conversation.", "Making ordinary days memorable."],
      ["Asking \"What if...?\"", "Creating accidental traditions.", "Improving stories through poor decisions."],
      ["Being in the wrong place at the funniest time.", "Collecting coincidences.", "Keeping life unnecessarily interesting."]
    ]
  },

  certifiedMenace: {
    title: "CERTIFIED MENACE",
    displayTitle: ["CERTIFIED", "Menace"],
    cardBack: "#0B0B0B",
    cardText: "white",
    descriptions: [
      "Entirely delightful. Slightly concerning.",
      "Warning labels quietly follow you around.",
      "You make terrible ideas look incredibly approachable.",
      "You possess excellent judgement and rarely use it.",
      "Chaos seems unusually cooperative around you.",
      "You smile like someone about to suggest something expensive.",
      "You enjoy plausible deniability as a lifestyle.",
      "You never start the fire. You simply bring marshmallows.",
      "You know exactly where the line is. That's why you're standing beside it.",
      "Your confidence has caused several unnecessary adventures."
    ],
    previousOffences: [
      ["Saying \"Hear me out.\"", "Encouraging curiosity.", "Looking innocent afterwards."],
      ["Testing limits recreationally.", "Escalating perfectly manageable situations.", "Accidentally becoming the ringleader."],
      ["Making caution optional.", "Creating unforgettable first impressions.", "Being suspiciously calm during chaos."]
    ]
  },

  professionalBadInfluence: {
    title: "PROFESSIONAL BAD INFLUENCE",
    displayTitle: ["PROFESSIONAL", "Bad Influence"],
    cardBack: "#CC6780",
    cardText: "white",
    descriptions: [
      "You don't force anyone. You simply make questionable ideas look irresistible.",
      "You're rarely the first idea. You're almost always the second yes.",
      "People blame you because they're secretly grateful.",
      "You have an extraordinary talent for making \"why not?\" sound convincing.",
      "History suggests following your advice is a terrible idea. People keep doing it anyway.",
      "You never pressure anyone. You simply remove their excuses.",
      "You make spontaneity sound responsible.",
      "You have accidentally become everyone's favourite bad idea.",
      "Your suggestions usually begin with laughter.",
      "You turn hesitation into commitment with alarming efficiency."
    ],
    previousOffences: [
      ["Saying \"Come on.\"", "Making bad plans sound excellent.", "Encouraging \"just one.\""],
      ["Being the second opinion nobody needed.", "Volunteering everyone else.", "Improving weekends dramatically."],
      ["Convincing sensible people otherwise.", "Creating stories worth repeating.", "Being impossible to say no to."]
    ]
  },

  dailySinSaint: {
    title: "THE DAILY SIN SAINT",
    displayTitle: ["THE DAILY SIN", "Saint"],
    cardBack: "#005E69",
    cardText: "white",
    descriptions: [
      "Fully enlightened. Entirely unqualified to give life advice.",
      "You somehow make contradictions look balanced.",
      "You've made peace with temptation instead of fighting it.",
      "You believe moderation includes occasional exceptions.",
      "You understand that life is rarely either/or.",
      "You collect stories more carefully than achievements.",
      "You don't chase perfection. You chase interesting.",
      "You've stopped pretending good decisions have to be boring.",
      "You know restraint is more satisfying when it's optional.",
      "You've mastered the art of behaving responsibly just often enough."
    ],
    previousOffences: [
      ["Choosing curiosity over certainty.", "Making peace with contradictions.", "Refusing boring solutions."],
      ["Appreciating life's small temptations.", "Keeping an open mind.", "Making balance look effortless."],
      ["Smiling at impossible choices.", "Collecting memorable moments.", "Making self-care look like mischief."]
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

  const traits = normalizeTraits(totals, answerHistory.length);
  const balanceTraits = [traits.curiosity, traits.restraint, traits.mischief, traits.influence];
  const balanceAverage = balanceTraits.reduce((sum, value) => sum + value, 0) / balanceTraits.length;
  const balanceSpread = Math.max(...balanceTraits) - Math.min(...balanceTraits);

  const scores = {
    sinnerAmateur: traits.restraint * 1.35 + traits.practicality * 0.85 - traits.impulse * 0.35,
    ethicallyCreative: traits.practicality * 1.15 + traits.mischief * 0.85 + traits.restraint * 0.25,
    socialLiability: traits.social * 1.2 + traits.influence * 0.85 + traits.impulse * 0.45,
    chaosCurator: traits.mischief * 1.15 + traits.curiosity * 0.9 + traits.impulse * 0.25,
    certifiedMenace: traits.impulse * 1.25 + traits.mischief * 1.05 - traits.restraint * 0.18,
    professionalBadInfluence: traits.influence * 1.35 + traits.social * 0.95 + traits.mischief * 0.2,
    dailySinSaint: balanceAverage * 1.9 - balanceSpread * 0.6 + Math.min(...balanceTraits) * 0.9
  };

  applyArchetypeBoosts(scores, traits);

  const tieBreakPriority = [
    "socialLiability",
    "professionalBadInfluence",
    "certifiedMenace",
    "ethicallyCreative",
    "chaosCurator",
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

  if (strongestTrait === "social" || secondTrait === "social") {
    scores.socialLiability += 0.22;
  }

  if (strongestTrait === "influence" || secondTrait === "influence") {
    scores.professionalBadInfluence += 0.16;
  }

  if (strongestTrait === "restraint" && traits.impulse < 0.45) {
    scores.sinnerAmateur += 0.24;
  }

  if (traits.practicality >= 0.5 && traits.mischief >= 0.3) {
    scores.ethicallyCreative += 0.2;
  }

  if (traits.curiosity >= 0.45 && traits.mischief >= 0.35) {
    scores.chaosCurator += 0.2;
  }

  if (traits.impulse >= 0.5 && traits.mischief >= 0.4) {
    scores.certifiedMenace += 0.28;
  }

  const saintTraits = [traits.curiosity, traits.restraint, traits.mischief, traits.influence];
  const saintSpread = Math.max(...saintTraits) - Math.min(...saintTraits);
  if (saintSpread <= 0.3 && saintTraits.every((value) => value >= 0.18)) {
    scores.dailySinSaint += 0.36;
  }
}

globalThis.IDENTITIES = IDENTITIES;
globalThis.calculateIdentity = calculateIdentity;
