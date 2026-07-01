const QUESTIONS = [
  {
    id: "q1",
    question: "You've ordered Zomato. Then you remember you're supposed to go to the gym.",
    answers: [
      {
        text: "Cancel the gym",
        retort: "The gym has survived worse.",
        traits: { impulse: 2, practicality: 1 }
      },
      {
        text: "Cancel the order",
        retort: "The Zomato rider was already downstairs. History can't be undone.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q2",
    question: "You have 30 minutes for lunch. The salad arrives in 5 minutes. The burger arrives in 10.",
    answers: [
      {
        text: "Burger",
        retort: "Good things take time. So do clogged arteries.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Salad",
        retort: "You spent the burger's waiting time thinking about the burger.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q3",
    question: "It's your bhua's birthday.",
    answers: [
      {
        text: "React 👍 in the family WhatsApp",
        retort: "Minimal effort. Maximum visibility.",
        traits: { practicality: 2, mischief: 1 }
      },
      {
        text: "Call her",
        retort: "You signed up for forty-five minutes and three marriage questions.",
        traits: { social: 2, restraint: 1 }
      }
    ]
  },
  {
    id: "q4",
    question: "Your annoying coworker is celebrating at an excellent restaurant.",
    answers: [
      {
        text: "Go for the food",
        retort: "You wished them exactly one happy birthday. That's enough.",
        traits: { impulse: 1, social: 1, practicality: 1 }
      },
      {
        text: "Skip it",
        retort: "The pasta didn't deserve this.",
        traits: { restraint: 1, practicality: 2 }
      }
    ]
  },
  {
    id: "q5",
    question: "It's midnight. You want a snack.",
    answers: [
      {
        text: "Make Maggi",
        retort: "Two minutes can change a person.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Eat an apple",
        retort: "You looked inside the fridge twice before committing.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q6",
    question: "Blinkit was supposed to be for toothpaste. Your cart is now ₹986.",
    answers: [
      {
        text: "Checkout",
        retort: "Blinkit knows you better than your therapist.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Close the app",
        retort: "You closed it. You opened it again four minutes later.",
        traits: { restraint: 1, practicality: 2 }
      }
    ]
  },
  {
    id: "q7",
    question: "The traffic light turns green. The car ahead hasn't moved.",
    answers: [
      {
        text: "Honk",
        retort: "One Mississippi. That's all they got.",
        traits: { impulse: 1, mischief: 1 }
      },
      {
        text: "Wait",
        retort: "Your patience deserves tax benefits.",
        traits: { restraint: 2, social: 1 }
      }
    ]
  },
  {
    id: "q8",
    question: "Nike drops the shoes you've wanted for months. They're just above budget.",
    answers: [
      {
        text: "Buy them",
        retort: "Budgets are surprisingly flexible documents.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Walk away",
        retort: "You checked if they were still in stock before sleeping.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q9",
    question: "You just had the best dessert of your life.",
    answers: [
      {
        text: "Brush tomorrow",
        retort: "Your dentist has entered the chat.",
        traits: { impulse: 2, mischief: 1 }
      },
      {
        text: "Brush now",
        retort: "Mint and cake had an awkward handshake.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q10",
    question: "The card machine asks if you'd like a receipt.",
    answers: [
      {
        text: "Print it",
        retort: "Future drawer clutter secured.",
        traits: { practicality: 1, impulse: 1 }
      },
      {
        text: "Skip it",
        retort: "One tiny victory for the planet.",
        traits: { restraint: 1, practicality: 2 }
      }
    ]
  },
  {
    id: "q11",
    question: "Someone offers you \"just one cigarette.\"",
    answers: [
      {
        text: "Take it",
        retort: "\"Just one\" has started many interesting stories.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Offer them a Daily Sin instead",
        retort: "Unexpected plot twist. Nicely played.",
        traits: { influence: 2, mischief: 1, curiosity: 1 }
      }
    ]
  },
  {
    id: "q12",
    question: "You're browsing Zomato even though you're not hungry.",
    answers: [
      {
        text: "Add to cart",
        retort: "Curiosity has a delivery fee.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Close the app",
        retort: "The app took that personally.",
        traits: { restraint: 2, practicality: 1 }
      }
    ]
  },
  {
    id: "q13",
    question: "Your mother says, \"Taste this.\" You're already full.",
    answers: [
      {
        text: "Take a bite",
        retort: "Resistance was always temporary.",
        traits: { social: 2, impulse: 1 }
      },
      {
        text: "Negotiate",
        retort: "You've entered the diplomacy phase.",
        traits: { practicality: 2, social: 1 }
      }
    ]
  },
  {
    id: "q14",
    question: "Someone is running for the lift as the doors close.",
    answers: [
      {
        text: "Hold it",
        retort: "Humanity survives another day.",
        traits: { social: 2, restraint: 1 }
      },
      {
        text: "Pretend not to see",
        retort: "You suddenly became fascinated by the floor numbers.",
        traits: { mischief: 1, practicality: 1 }
      }
    ]
  },
  {
    id: "q15",
    question: "You've finished the pack. One candy remains.",
    answers: [
      {
        text: "Eat it",
        retort: "You were never saving it for later.",
        traits: { impulse: 2, curiosity: 1 }
      },
      {
        text: "Save it",
        retort: "You enjoy lying to your future self.",
        traits: { restraint: 1, practicality: 2 }
      }
    ]
  },
  {
    id: "q16",
    question: "Someone asks, \"Is this actually healthy?\" while holding your Daily Sin pack.",
    answers: [
      {
        text: "\"Open it.\"",
        retort: "The reveal works every single time.",
        traits: { influence: 2, curiosity: 1 }
      },
      {
        text: "Explain Ayurveda",
        retort: "You lost them at \"adaptogen\".",
        traits: { curiosity: 2, social: 1 }
      }
    ]
  },
  {
    id: "q17",
    question: "Your friend mistakes the pack for cigarettes.",
    answers: [
      {
        text: "Let them panic for a second",
        retort: "Comedy needs timing.",
        traits: { mischief: 2, influence: 1 }
      },
      {
        text: "Correct them immediately",
        retort: "You have admirable restraint. Slightly disappointing, though.",
        traits: { restraint: 2, social: 1 }
      }
    ]
  },
  {
    id: "q18",
    question: "You finish your Daily Sin.",
    answers: [
      {
        text: "Buy another",
        retort: "Preparedness is an underrated virtue.",
        traits: { practicality: 2, curiosity: 1 }
      },
      {
        text: "Wait until you miss it",
        retort: "Absence is excellent marketing.",
        traits: { restraint: 1, curiosity: 2 }
      }
    ]
  },
  {
    id: "q19",
    question: "You accidentally liked someone's Instagram photo from 2019.",
    answers: [
      {
        text: "Unlike immediately",
        retort: "Too late. The notification has already escaped.",
        traits: { impulse: 1, practicality: 1 }
      },
      {
        text: "Commit to it",
        retort: "Confidence is rarely this accidental.",
        traits: { mischief: 2, influence: 1 }
      }
    ]
  },
  {
    id: "q20",
    question: "Your Uber driver misses the exit.",
    answers: [
      {
        text: "Say nothing",
        retort: "You're sightseeing now.",
        traits: { restraint: 1, social: 1 }
      },
      {
        text: "Politely mention it",
        retort: "You both pretended the GPS wasn't judging.",
        traits: { practicality: 2, social: 1 }
      }
    ]
  },
  {
    id: "q21",
    question: "Someone says, \"Try one bite.\"",
    answers: [
      {
        text: "One bite",
        retort: "One bite is a unit with no scientific definition.",
        traits: { impulse: 2, social: 1 }
      },
      {
        text: "Decline",
        retort: "An impressive display of self-control. Everyone noticed.",
        traits: { restraint: 2, social: 1 }
      }
    ]
  }
];

globalThis.QUESTIONS = QUESTIONS;
