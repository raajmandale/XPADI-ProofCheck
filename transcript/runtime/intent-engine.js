const INTENTS = {

  VERIFY_RECOVERABILITY: {
    risk: "MEDIUM",
    recoverability: "HIGH",
    description:
      "Validate continuity and recovery readiness."
  },

  VERIFY_CONTINUITY: {
    risk: "LOW",
    recoverability: "HIGH",
    description:
      "Validate continuity chain."
  },

  OBSERVE_STATE: {
    risk: "LOW",
    recoverability: "UNKNOWN",
    description:
      "Observe current runtime state."
  }

};

function evaluateIntent(intent) {

  return (
    INTENTS[intent] || {
      risk: "UNKNOWN",
      recoverability: "UNKNOWN",
      description:
        "Undefined intent."
    }
  );

}

module.exports = {
  evaluateIntent
};