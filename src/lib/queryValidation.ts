const bannedExactInputs = new Set([
  "hi",
  "hello",
  "hey",
  "hehe",
  "haha",
  "how are you",
  "sup",
  "yo",
]);

const bannedPatterns = [
  /^(ha|he){2,}$/i,
  /^\W+$/,
  /^(ok+|hmm+|lol+|lmao+)$/i,
];

const topicHintWords = [
  "learn",
  "roadmap",
  "plan",
  "course",
  "study",
  "prepare",
  "master",
  "in",
  "months",
  "weeks",
  "become",
  "build",
  "system design",
  "dsa",
  "ai",
  "frontend",
  "backend",
  "devops",
  "machine learning",
  "python",
  "react",
  "java",
  "interview",
];

export function normalizeQuery(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function validateResearchQuery(input: string): { valid: boolean; reason?: string } {
  const query = normalizeQuery(input);

  if (!query) {
    return { valid: false, reason: "Enter a topic and timeline (example: DSA in 3 months)." };
  }

  const lowered = query.toLowerCase();

  if (bannedExactInputs.has(lowered)) {
    return { valid: false, reason: "Please enter a real learning goal, not casual chat." };
  }

  if (bannedPatterns.some((pattern) => pattern.test(lowered))) {
    return { valid: false, reason: "This query looks too vague. Add a real topic and timeline." };
  }

  if (query.length < 8) {
    return { valid: false, reason: "Add more detail so we can generate useful research." };
  }

  const wordCount = query.split(" ").length;
  if (wordCount < 3) {
    return { valid: false, reason: "Use at least 3 words (example: Learn React in 2 months)." };
  }

  const hasHintWord = topicHintWords.some((word) => lowered.includes(word));
  if (!hasHintWord) {
    return {
      valid: false,
      reason: "Include a skill/topic and goal (example: Master Node.js backend in 4 months).",
    };
  }

  return { valid: true };
}
