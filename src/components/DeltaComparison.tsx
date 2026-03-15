import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.5 };

const manualTabs = [
  "Google: system design", "Reddit: best resources", "YouTube: system design tutorial",
  "Medium: microservices guide", "HackerNews: learning path", "Stack Overflow: where to start",
  "Notion: messy notes", "Twitter: recommendations", "Udemy: courses", "GitHub: awesome-system-design",
  "Google Scholar: papers", "Discord: advice", "Blog: distributed systems", "Quora: career advice",
  "Wikipedia: CAP theorem", "Bookmark: save for later", "Notes: copy paste", "Tab 18", "Tab 19", "Tab 20",
];

const architectLogs = [
  "> Initializing research agents...",
  "> Agent 1: Querying Google Scholar for 'system design'...",
  "> Agent 2: Scanning Reddit /r/cscareerquestions...",
  "> Agent 3: Analyzing top-rated Udemy & Coursera courses...",
  "> Found 47 relevant sources across 6 platforms",
  "> Ranking sources by relevance and recency...",
  "> Clustering topics: Load Balancing, Caching, Databases, APIs...",
  "> Generating learning path with prerequisites...",
  "> Building timeline based on 2hr/day commitment...",
  "> Synthesizing roadmap...",
  "> ✓ Roadmap complete. 14 sources. 3 paths. 8 weeks.",
];

const DeltaComparison = () => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < architectLogs.length) {
        const log = architectLogs[i];
        i++;
        setVisibleLogs((prev) => [...prev, log]);
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="text-center mb-12"
        >
          <p className="label-text mb-3">The Delta</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            See the difference.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Side */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="elevated-card overflow-hidden"
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ boxShadow: "0 1px 0 rgba(0,0,0,.06)" }}>
              <span className="label-text text-destructive">Manual Research (120 mins)</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/15" />
              </div>
            </div>
            <div className="p-4">
              {/* Simulated browser tabs chaos */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {manualTabs.map((tab, i) => (
                  <div
                    key={i}
                    className="text-[10px] font-mono px-2 py-1 bg-muted rounded-sm text-muted-foreground truncate max-w-[140px]"
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="bg-muted rounded-md p-4 space-y-2">
                <div className="h-2 bg-muted-foreground/10 rounded w-3/4" />
                <div className="h-2 bg-muted-foreground/10 rounded w-full" />
                <div className="h-2 bg-muted-foreground/10 rounded w-5/6" />
                <div className="h-2 bg-muted-foreground/10 rounded w-2/3" />
                <div className="h-2 bg-muted-foreground/10 rounded w-4/5" />
                <div className="mt-4 text-[10px] font-mono text-muted-foreground/60 italic">
                  // TODO: organize these notes somehow...
                </div>
              </div>
            </div>
          </motion.div>

          {/* Architect Side */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="elevated-card overflow-hidden"
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ boxShadow: "0 1px 0 rgba(0,0,0,.06)" }}>
              <span className="label-text text-primary">Architect (15 seconds)</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/15" />
              </div>
            </div>
            <div className="p-4">
              <div className="bg-foreground rounded-md p-4 min-h-[200px] font-mono text-xs space-y-1 overflow-hidden">
                {visibleLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`${log.startsWith("> ✓") ? "text-green-400" : "text-muted-foreground/70"}`}
                  >
                    {log}
                  </motion.div>
                ))}
                {visibleLogs.length < architectLogs.length && isInView && (
                  <span className="inline-block w-1.5 h-3.5 bg-primary animate-blink" />
                )}
              </div>

              {visibleLogs.length >= architectLogs.length && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: 0.2 }}
                  className="mt-4 space-y-2"
                >
                  <div className="flex gap-3">
                    <div className="flex-1 bg-accent rounded-md p-3">
                      <p className="label-text text-accent-foreground mb-1">Sources</p>
                      <p className="text-lg font-semibold text-foreground">14</p>
                    </div>
                    <div className="flex-1 bg-accent rounded-md p-3">
                      <p className="label-text text-accent-foreground mb-1">Paths</p>
                      <p className="text-lg font-semibold text-foreground">3</p>
                    </div>
                    <div className="flex-1 bg-accent rounded-md p-3">
                      <p className="label-text text-accent-foreground mb-1">Weeks</p>
                      <p className="text-lg font-semibold text-foreground">8</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeltaComparison;
