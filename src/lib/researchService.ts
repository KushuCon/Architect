import { creatorCatalog, type CreatorCatalogEntry } from "@/data/creatorCatalog";
import type { Phase, ResearchResult, Source } from "@/types/research";

interface TavilyResult {
  title: string;
  url: string;
  score?: number;
}

interface YouTubeItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
  };
}

interface ModelRoadmapResponse {
  summary: string;
  dailyCommitment: string;
  difficulty: string;
  phases: Array<{
    week: string;
    title: string;
    description: string;
    milestone: string;
    problemCount: number;
    topics: Array<{
      name: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      estimatedHours: number;
      subtopics: string[];
    }>;
  }>;
}

interface TimelineSpec {
  labels: string[];
  displayDuration: string;
  totalUnits: number;
  unit: "week" | "month";
}

interface QueryIntent {
  topicTags: string[];
  timeline: TimelineSpec;
  level: "beginner" | "intermediate" | "advanced";
  preferredFormat: "video" | "article" | "course" | "repo" | "mixed";
  regionPreference: "india" | "international" | "mixed";
}

interface RankedCreator {
  creator: CreatorCatalogEntry;
  score: number;
}

const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";
const NVIDIA_MODEL = import.meta.env.VITE_NVIDIA_MODEL || "moonshotai/kimi-k2-instruct";
const NVIDIA_BASE_URL = import.meta.env.VITE_NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const USE_NVIDIA_PROXY = import.meta.env.DEV && (import.meta.env.VITE_USE_NVIDIA_PROXY || "true") !== "false";
const NVIDIA_CHAT_COMPLETIONS_URL = USE_NVIDIA_PROXY
  ? "/api/nvidia/chat/completions"
  : `${NVIDIA_BASE_URL}/chat/completions`;

const TOTAL_SOURCE_TARGET = 5;
const CURATED_SOURCE_TARGET = 2;
const LIVE_SOURCE_TARGET = 3;
const MODEL_SOURCE_LIMIT = 5;
const NVIDIA_TIMEOUT_MS = 20000;

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function mapSourceType(url: string): Source["type"] {
  const normalized = url.toLowerCase();
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "video";
  }
  if (normalized.includes("github.com") || normalized.includes("gitlab.com")) {
    return "repo";
  }
  if (normalized.includes("coursera") || normalized.includes("udemy") || normalized.includes("edx")) {
    return "course";
  }
  if (normalized.includes("arxiv") || normalized.includes("springer") || normalized.includes("ieee")) {
    return "paper";
  }
  if (normalized.includes("sheet") || normalized.includes("roadmap") || normalized.includes("guide")) {
    return "tool";
  }
  return "article";
}

function parseTimeline(query: string): TimelineSpec {
  const match = query.match(/(?:in|within|for)\s+(\d+)\s*(week|weeks|month|months|year|years)\b/i);

  if (!match) {
    return buildTimelineSpec(12, "month");
  }

  const rawTotal = Number.parseInt(match[1], 10);
  if (!Number.isFinite(rawTotal) || rawTotal <= 0) {
    return buildTimelineSpec(12, "month");
  }

  const rawUnit = match[2].toLowerCase();
  if (rawUnit.startsWith("year")) {
    return buildTimelineSpec(rawTotal * 12, "month");
  }
  if (rawUnit.startsWith("week")) {
    return buildTimelineSpec(rawTotal, "week");
  }
  return buildTimelineSpec(rawTotal, "month");
}

function buildTimelineSpec(totalUnits: number, unit: "week" | "month"): TimelineSpec {
  const safeTotal = Math.max(1, totalUnits);
  const phaseCount = Math.min(4, safeTotal);
  const labels: string[] = [];

  for (let index = 0; index < phaseCount; index += 1) {
    const start = Math.floor((index * safeTotal) / phaseCount) + 1;
    const end = Math.floor(((index + 1) * safeTotal) / phaseCount);
    const normalizedEnd = Math.max(start, end);
    const prefix = unit === "week" ? "Week" : "Month";

    labels.push(start === normalizedEnd ? `${prefix} ${start}` : `${prefix}s ${start}-${normalizedEnd}`);
  }

  return {
    labels,
    totalUnits: safeTotal,
    unit,
    displayDuration: `${safeTotal} ${safeTotal === 1 ? (unit === "week" ? "week" : "month") : `${unit}s`}`,
  };
}

function inferTopicTags(query: string): string[] {
  const lowered = query.toLowerCase();
  const detected = new Set<string>();

  const tagPatterns: Array<[string, RegExp]> = [
    ["dsa", /dsa|data structures|algorithms|leetcode|competitive programming/],
    ["system design", /system design|scalability|distributed systems|backend architecture/],
    ["web dev", /web dev|frontend|backend|javascript|typescript|html|css|react|next\.js|full ?stack/],
    ["full stack", /full ?stack/],
    ["backend", /backend|node|express|api|server/],
    ["ml", /machine learning|ml\b|deep learning|neural network/],
    ["ai", /\bai\b|llm|genai|artificial intelligence/],
    ["data science", /data science|analytics|pandas|numpy|kaggle/],
    ["python", /python/],
    ["devops", /devops|docker|kubernetes|terraform|ci\/cd/],
    ["interviews", /interview|faang|placements|job prep/],
    ["placements", /placements|campus|college|off campus/],
    ["career", /career|roadmap|job|resume/],
    ["courses", /course|cohort|bootcamp|certification/],
    ["cs fundamentals", /operating system|dbms|os\b|computer networks|cn\b|oop|cs fundamentals/],
  ];

  tagPatterns.forEach(([tag, pattern]) => {
    if (pattern.test(lowered)) {
      detected.add(tag);
    }
  });

  if (detected.size === 0) {
    detected.add("career");
  }

  return Array.from(detected);
}

function inferPreferredFormat(query: string): QueryIntent["preferredFormat"] {
  const lowered = query.toLowerCase();
  if (/video|playlist|youtube/.test(lowered)) {
    return "video";
  }
  if (/article|blog|read/.test(lowered)) {
    return "article";
  }
  if (/course|cohort|bootcamp|certification/.test(lowered)) {
    return "course";
  }
  if (/repo|github|project/.test(lowered)) {
    return "repo";
  }
  return "mixed";
}

function inferLevel(query: string): QueryIntent["level"] {
  const lowered = query.toLowerCase();
  if (/advanced|expert|hard/.test(lowered)) {
    return "advanced";
  }
  if (/intermediate/.test(lowered)) {
    return "intermediate";
  }
  return "beginner";
}

function inferRegionPreference(query: string): QueryIntent["regionPreference"] {
  const lowered = query.toLowerCase();
  if (/india|indian|placements|college|gate/.test(lowered)) {
    return "india";
  }
  if (/global|international|faang/.test(lowered)) {
    return "international";
  }
  return "mixed";
}

function inferQueryIntent(query: string): QueryIntent {
  return {
    topicTags: inferTopicTags(query),
    timeline: parseTimeline(query),
    level: inferLevel(query),
    preferredFormat: inferPreferredFormat(query),
    regionPreference: inferRegionPreference(query),
  };
}

function scoreCreator(creator: CreatorCatalogEntry, intent: QueryIntent): number {
  const topicScore = intent.topicTags.reduce((score, tag) => {
    return score + (creator.tags.includes(tag) ? 18 : 0);
  }, 0);

  const formatScore =
    intent.preferredFormat === "mixed"
      ? 6
      : intent.preferredFormat === "video" && creator.platform === "youtube"
        ? 14
        : intent.preferredFormat === "course" && creator.tags.includes("courses")
          ? 12
          : intent.preferredFormat === "repo" && creator.platform === "website"
            ? 8
            : intent.preferredFormat === "article" && creator.platform === "website"
              ? 10
              : 0;

  const regionScore =
    intent.regionPreference === "mixed"
      ? 4
      : creator.region === intent.regionPreference
        ? 10
        : 0;

  const levelScore =
    intent.level === "beginner" && creator.tags.some((tag) => ["career", "roadmaps", "cs fundamentals"].includes(tag))
      ? 6
      : intent.level === "advanced" && creator.tags.some((tag) => ["system design", "ml", "ai", "competitive programming"].includes(tag))
        ? 6
        : 3;

  return topicScore + formatScore + regionScore + levelScore + creator.credibilityWeight * 40;
}

function creatorToSource(creator: CreatorCatalogEntry, intent: QueryIntent, score: number): Source {
  const primaryTag = intent.topicTags.find((tag) => creator.tags.includes(tag)) || creator.tags[0] || "learning";

  return {
    name: `${primaryTag.toUpperCase()} with ${creator.name}`,
    creatorName: creator.name,
    domain: creator.domain,
    url: creator.profileUrl,
    type: creator.platform === "youtube" ? "video" : mapSourceType(creator.profileUrl),
    relevance: Math.min(0.99, Math.max(0.72, score / 100)),
    sourceOrigin: "curated",
  };
}

function pickCuratedSources(intent: QueryIntent, count: number): Source[] {
  const rankedCreators: RankedCreator[] = creatorCatalog
    .map((creator) => ({ creator, score: scoreCreator(creator, intent) }))
    .sort((left, right) => right.score - left.score);

  return rankedCreators.slice(0, count).map(({ creator, score }) => creatorToSource(creator, intent, score));
}

async function getTavilySources(query: string, logs: string[]): Promise<Source[]> {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
  if (!apiKey) {
    logs.push("> A web source connector is unavailable.");
    return [];
  }

  logs.push("> Collecting live references...");

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: 4,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Web source request failed: ${response.status}`);
  }

  const data = await response.json();
  const results: TavilyResult[] = data?.results || [];

  return results
    .filter((item) => item?.title && item?.url)
    .map((item, index) => ({
      name: item.title,
      domain: getDomain(item.url),
      url: item.url,
      type: mapSourceType(item.url),
      relevance: Math.max(0.64, Math.min(0.95, item.score ?? 0.88 - index * 0.04)),
      sourceOrigin: "live",
    }));
}

async function getYouTubeSources(query: string, logs: string[]): Promise<Source[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    logs.push("> A video source connector is unavailable.");
    return [];
  }

  logs.push("> Collecting live media references...");

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: "3",
    key: apiKey,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Video source request failed: ${response.status}`);
  }

  const data = await response.json();
  const items: YouTubeItem[] = data?.items || [];

  return items
    .filter((item) => item?.id?.videoId && item?.snippet?.title)
    .map((item, index) => ({
      name: item.snippet?.title || "YouTube Video",
      creatorName: item.snippet?.channelTitle || undefined,
      domain: "youtube.com",
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      type: "video",
      relevance: Math.max(0.62, 0.9 - index * 0.06),
      sourceOrigin: "live",
    }));
}

function canonicalUrl(source: Source): string {
  try {
    const parsed = new URL(source.url);
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `${parsed.hostname}/watch?v=${parsed.searchParams.get("v")}`.toLowerCase();
    }
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, "").toLowerCase();
  } catch {
    return source.url.toLowerCase();
  }
}

function identityKey(source: Source): string {
  return (source.creatorName || source.domain || canonicalUrl(source)).toLowerCase();
}

function dedupeSources(sources: Source[]): Source[] {
  const urlSeen = new Set<string>();
  return sources.filter((source) => {
    const key = canonicalUrl(source);
    if (urlSeen.has(key)) {
      return false;
    }
    urlSeen.add(key);
    return true;
  });
}

function enforceDiversity(sources: Source[], maxPerIdentity = 2): Source[] {
  const identityCounts = new Map<string, number>();

  return sources.filter((source) => {
    const key = identityKey(source);
    const count = identityCounts.get(key) || 0;
    if (count >= maxPerIdentity) {
      return false;
    }
    identityCounts.set(key, count + 1);
    return true;
  });
}

function blendSources(curatedSources: Source[], liveSources: Source[]): Source[] {
  const dedupedCurated = dedupeSources(curatedSources);
  const dedupedLive = dedupeSources(liveSources);

  const blended: Source[] = [];
  blended.push(...dedupedCurated.slice(0, CURATED_SOURCE_TARGET));
  blended.push(...dedupedLive.slice(0, LIVE_SOURCE_TARGET));

  const fallbackFill = dedupedCurated.slice(CURATED_SOURCE_TARGET).concat(dedupedLive.slice(LIVE_SOURCE_TARGET));
  blended.push(...fallbackFill);

  return enforceDiversity(dedupeSources(blended)).slice(0, TOTAL_SOURCE_TARGET);
}

function fallbackRoadmap(query: string, sources: Source[], timeline: TimelineSpec): Phase[] {
  return timeline.labels.map((label, index) => {
    const stageNumber = index + 1;
    const stageTitle =
      stageNumber === 1
        ? "Foundations"
        : stageNumber === timeline.labels.length
          ? "Mastery and Outcome"
          : `Acceleration Stage ${stageNumber}`;

    return {
      week: label,
      title: stageTitle,
      description: `Structured progression for ${query} during ${label}.`,
      milestone: `Complete ${label} goals with measurable improvement.`,
      problemCount: 50 + stageNumber * 20,
      topics: [
        {
          name: "Core Concepts",
          difficulty: stageNumber === 1 ? "beginner" : stageNumber === timeline.labels.length ? "advanced" : "intermediate",
          estimatedHours: 20 + stageNumber * 8,
          subtopics: ["Fundamentals", "Practice set", "Revision", "Assessment"],
        },
        {
          name: "Applied Practice",
          difficulty: stageNumber === 1 ? "beginner" : "intermediate",
          estimatedHours: 18 + stageNumber * 6,
          subtopics: ["Hands-on tasks", "Problem solving", "Feedback loop", "Progress tracking"],
        },
      ],
      resources: sources.slice(index, index + 3),
    };
  });
}

function buildPrompt(query: string, sources: Source[], timeline: TimelineSpec): string {
  const compactSources = sources.slice(0, MODEL_SOURCE_LIMIT).map((source, index) => ({
    id: index + 1,
    title: source.name,
    creator: source.creatorName || null,
    domain: source.domain,
    url: source.url,
    type: source.type,
    origin: source.sourceOrigin || "live",
  }));

  return [
    "You are a strict roadmap planner.",
    `Goal query: ${query}`,
    `Total timeline: ${timeline.displayDuration}`,
    `Create exactly ${timeline.labels.length} phases with phase labels exactly:`,
    ...timeline.labels.map((phase) => `- ${phase}`),
    "Each phase must include:",
    "- title, description, milestone, problemCount",
    "- 3 to 5 topics",
    "- each topic has: name, difficulty(beginner|intermediate|advanced), estimatedHours, and 3 to 6 subtopics",
    "Output ONLY valid JSON with this shape:",
    JSON.stringify(
      {
        summary: "",
        dailyCommitment: "",
        difficulty: "",
        phases: [
          {
            week: timeline.labels[0] || "Month 1",
            title: "",
            description: "",
            milestone: "",
            problemCount: 80,
            topics: [
              {
                name: "",
                difficulty: "beginner",
                estimatedHours: 10,
                subtopics: ["", "", ""],
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
    "Use only the source list below as citation context:",
    JSON.stringify(compactSources, null, 2),
  ].join("\n");
}

function tryParseJson(text: string): ModelRoadmapResponse | null {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
}

function isValidModelResponse(value: ModelRoadmapResponse | null): value is ModelRoadmapResponse {
  if (!value || !Array.isArray(value.phases) || value.phases.length === 0) {
    return false;
  }

  return value.phases.every((phase) => {
    return Boolean(
      phase.week &&
        phase.title &&
        phase.description &&
        phase.milestone &&
        Number.isFinite(phase.problemCount) &&
        Array.isArray(phase.topics) &&
        phase.topics.length > 0,
    );
  });
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function callNvidiaModel(prompt: string, logs: string[]): Promise<ModelRoadmapResponse | null> {
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
  if (!apiKey) {
    logs.push("> Primary planner unavailable.");
    return null;
  }

  logs.push("> Generating roadmap draft...");

  const response = await fetchWithTimeout(
    NVIDIA_CHAT_COMPLETIONS_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
    NVIDIA_TIMEOUT_MS,
  );

  if (!response.ok) {
    throw new Error(`Primary planner request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? tryParseJson(content) : null;
}

async function callGroqModel(prompt: string, logs: string[]): Promise<ModelRoadmapResponse | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    logs.push("> Backup planner unavailable.");
    return null;
  }

  logs.push("> Switching to backup planner...");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Backup planner request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? tryParseJson(content) : null;
}

function normalizePhases(modelPhases: ModelRoadmapResponse["phases"], sources: Source[], timeline: TimelineSpec): Phase[] {
  const byWindow = new Map(modelPhases.map((phase) => [phase.week, phase]));

  return timeline.labels.map((windowLabel, index) => {
    const raw = byWindow.get(windowLabel) || modelPhases[index];

    if (!raw) {
      return {
        week: windowLabel,
        title: "Focused Development",
        description: "Structured progression for this timeline window.",
        milestone: "Finish this stage with measurable confidence.",
        problemCount: 80,
        topics: [
          {
            name: "Core Topic Stack",
            difficulty: "intermediate",
            estimatedHours: 30,
            subtopics: ["Foundations", "Application", "Practice"],
          },
        ],
        resources: sources.slice(index, index + 3),
      };
    }

    return {
      week: windowLabel,
      title: raw.title,
      description: raw.description,
      milestone: raw.milestone,
      problemCount: raw.problemCount,
      topics: raw.topics,
      resources: sources.slice(index, index + 3),
    };
  });
}

function calculateDifficulty(phases: Phase[]): string {
  const hasBeginner = phases.some((phase) => phase.topics.some((topic) => topic.difficulty === "beginner"));
  const hasAdvanced = phases.some((phase) => phase.topics.some((topic) => topic.difficulty === "advanced"));

  if (hasBeginner && hasAdvanced) {
    return "Beginner -> Advanced";
  }
  if (hasAdvanced) {
    return "Intermediate -> Advanced";
  }
  return "Beginner -> Intermediate";
}

export async function runResearch(query: string): Promise<ResearchResult> {
  const intent = inferQueryIntent(query);
  const timeline = intent.timeline;

  const logs: string[] = [
    "> Initializing research agents...",
    "> Scoring trusted references for this query...",
  ];

  const sourceBatches = await Promise.allSettled([getTavilySources(query, logs), getYouTubeSources(query, logs)]);

  const liveSources = sourceBatches.flatMap((batch) => {
    if (batch.status === "fulfilled") {
      return batch.value;
    }

    logs.push(`> Source warning: ${batch.reason instanceof Error ? batch.reason.message : "unknown error"}`);
    return [];
  });

  const curatedTarget = liveSources.length > 0 ? CURATED_SOURCE_TARGET : TOTAL_SOURCE_TARGET;
  const curatedSources = pickCuratedSources(intent, curatedTarget + 2);
  const allSources = blendSources(curatedSources, liveSources);

  logs.push(`> Curated and ranked ${allSources.length} citations.`);

  const prompt = buildPrompt(query, allSources, timeline);

  let modelOutput: ModelRoadmapResponse | null = null;

  try {
    const primaryOutput = await callNvidiaModel(prompt, logs);
    if (isValidModelResponse(primaryOutput)) {
      modelOutput = primaryOutput;
    } else {
      logs.push("> Primary planner returned incomplete output.");
    }
  } catch (error) {
    logs.push(`> Primary planner warning: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  if (!modelOutput) {
    try {
      const fallbackOutput = await callGroqModel(prompt, logs);
      if (isValidModelResponse(fallbackOutput)) {
        modelOutput = fallbackOutput;
      } else {
        logs.push("> Backup planner returned incomplete output.");
      }
    } catch (error) {
      logs.push(`> Backup planner warning: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  const phases = modelOutput
    ? normalizePhases(modelOutput.phases, allSources, timeline)
    : fallbackRoadmap(query, allSources, timeline);

  const totalTopics = phases.reduce((sum, phase) => sum + phase.topics.length, 0);
  const totalProblems = phases.reduce((sum, phase) => sum + phase.problemCount, 0);
  const summary = modelOutput?.summary || `A live ${timeline.displayDuration} trajectory for ${query} based on curated and live sources.`;
  const difficulty = modelOutput?.difficulty || calculateDifficulty(phases);
  const dailyCommitment = modelOutput?.dailyCommitment || "1.5-2.5 hrs/day";

  logs.push("> Finalizing roadmap timeline and citations...");
  logs.push(`> Done. ${allSources.length} citations. ${totalTopics} topics. Duration ${timeline.displayDuration}.`);

  return {
    query,
    summary,
    totalSources: allSources.length,
    totalTopics,
    estimatedDuration: timeline.displayDuration,
    dailyCommitment,
    difficulty,
    phases,
    allSources,
    agentLogs: logs,
    stats: [
      { label: "Sources Analyzed", value: String(allSources.length) },
      { label: "Topics Covered", value: String(totalTopics) },
      { label: "Practice Problems", value: `${totalProblems}+` },
      { label: "Est. Duration", value: timeline.displayDuration },
      { label: "Daily Commitment", value: dailyCommitment },
      { label: "Difficulty Span", value: difficulty },
    ],
  };
}
