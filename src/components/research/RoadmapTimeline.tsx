import { motion } from "framer-motion";
import { Clock, Target, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Phase } from "@/types/research";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.3 };
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

interface RoadmapTimelineProps {
  phases: Phase[];
}

const RoadmapTimeline = ({ phases }: RoadmapTimelineProps) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  const togglePhase = (index: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div>
      <p className="label-text mb-3 flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        The Roadmap
      </p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-3"
      >
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            transition={transition}
            className="phase-card"
          >
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(i)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="label-text text-primary">{phase.week}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {phase.problemCount} problems
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedPhases.has(i) ? "rotate-180" : ""
                  }`}
                />
              </div>
              <h3 className="text-base font-semibold text-foreground mt-1">{phase.title}</h3>
              <p className="body-text text-muted-foreground mt-1">{phase.description}</p>
            </button>

            {/* Expanded Content */}
            {expandedPhases.has(i) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={transition}
                className="mt-4 space-y-4"
              >
                {/* Topics */}
                <div>
                  <p className="label-text mb-2">Topics</p>
                  <div className="space-y-2">
                    {phase.topics.map((topic, j) => (
                      <div
                        key={j}
                        className="bg-background rounded-md p-3"
                        style={{ boxShadow: "var(--shadow-sm)" }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-foreground">{topic.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${difficultyColors[topic.difficulty]}`}>
                              {topic.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              ~{topic.estimatedHours}h
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topic.subtopics.map((sub, k) => (
                            <span
                              key={k}
                              className="text-[9px] font-mono px-1.5 py-0.5 bg-muted rounded-sm text-muted-foreground"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Resources */}
                <div>
                  <p className="label-text mb-2">Key Resources</p>
                  <div className="space-y-1">
                    {phase.resources.map((res, j) => (
                      <a
                        key={j}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[11px] py-1 hover:opacity-80 transition-opacity"
                      >
                        <BookOpen className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium truncate">{res.name}</span>
                        <span className="text-muted-foreground font-mono text-[9px]">
                          {res.domain}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Milestone */}
                <div className="bg-accent rounded-md p-3 flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="label-text text-primary mb-0.5">Milestone</p>
                    <p className="text-xs text-foreground">{phase.milestone}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RoadmapTimeline;
