import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { runResearch } from "@/lib/researchService";
import { normalizeQuery, validateResearchQuery } from "@/lib/queryValidation";
import AgentLogs from "@/components/research/AgentLogs";
import SourcesPanel from "@/components/research/SourcesPanel";
import RoadmapTimeline from "@/components/research/RoadmapTimeline";
import ActionsPanel from "@/components/research/ActionsPanel";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/sonner";

type Stage = "scanning" | "results";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.4 };

const ResearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useMemo(() => normalizeQuery(searchParams.get("q") || "Master DSA in 3 months"), [searchParams]);
  const queryValidation = useMemo(() => validateResearchQuery(query), [query]);

  useEffect(() => {
    if (!queryValidation.valid) {
      toast.error(queryValidation.reason || "Please enter a valid research query.");
      navigate("/", { replace: true });
    }
  }, [queryValidation, navigate]);

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["research", query],
    queryFn: () => runResearch(query),
    enabled: queryValidation.valid,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const [stage, setStage] = useState<Stage>("scanning");

  const handleLogsComplete = useCallback(() => {
    if (result) {
      setStage("results");
    }
  }, [result]);

  useEffect(() => {
    setStage("scanning");
  }, [query]);

  useEffect(() => {
    if (isError) {
      const message = error instanceof Error ? error.message : "Unable to fetch research right now.";
      toast.error(message);
    }
  }, [isError, error]);

  const loadingLogs = [
    "> Initializing research agents...",
    "> Collecting live references...",
    "> Ranking relevance and deduplicating citations...",
    "> Synthesizing personalized roadmap...",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Query Bar */}
      <div className="pt-16 border-b" style={{ boxShadow: "0 1px 0 rgba(0,0,0,.05)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm font-medium text-foreground truncate">{query}</p>
          </div>
          {stage === "results" && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4"
            >
              {result.stats.slice(0, 3).map((stat, i) => (
                <div key={i} className="hidden md:flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{stat.label}:</span>
                  <span className="text-[10px] font-mono font-medium text-foreground">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {stage === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
            className="py-16 px-6"
          >
            <div className="text-center mb-8">
              <p className="label-text mb-2">Researching</p>
              <h2 className="text-xl font-bold text-foreground tracking-tight">"{query}"</h2>
            </div>
            <AgentLogs logs={result?.agentLogs || loadingLogs} onComplete={handleLogsComplete} />
            {(isLoading || !result) && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Fetching live citations and building your roadmap...
              </p>
            )}
            {isError && (
              <p className="text-center text-xs text-destructive mt-4">
                Live search failed. Check your API keys and try again.
              </p>
            )}
          </motion.div>
        )}

        {stage === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="py-8 px-6"
          >
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
              {/* Sources Sidebar */}
              <div className="col-span-12 lg:col-span-3 order-2 lg:order-1">
                <SourcesPanel sources={result.allSources} />
              </div>

              {/* Main Roadmap */}
              <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
                <RoadmapTimeline phases={result.phases} />
              </div>

              {/* Actions Sidebar */}
              <div className="col-span-12 lg:col-span-3 order-3">
                <ActionsPanel result={result} query={query} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchPage;
