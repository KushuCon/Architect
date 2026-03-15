export interface Source {
  name: string;
  domain: string;
  url: string;
  type: "video" | "book" | "article" | "repo" | "course" | "paper" | "tool";
  relevance: number;
  creatorName?: string;
  sourceOrigin?: "curated" | "live";
}

export interface Topic {
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  subtopics: string[];
}

export interface Phase {
  week: string;
  title: string;
  description: string;
  topics: Topic[];
  resources: Source[];
  milestone: string;
  problemCount: number;
}

export interface ResearchResult {
  query: string;
  summary: string;
  totalSources: number;
  totalTopics: number;
  estimatedDuration: string;
  dailyCommitment: string;
  difficulty: string;
  phases: Phase[];
  allSources: Source[];
  agentLogs: string[];
  stats: {
    label: string;
    value: string;
  }[];
}
