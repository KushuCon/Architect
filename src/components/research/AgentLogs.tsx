import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.3 };

interface AgentLogsProps {
  logs: string[];
  onComplete: () => void;
}

const AgentLogs = ({ logs, onComplete }: AgentLogsProps) => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setVisibleLogs([]);
    setDone(false);

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        const log = logs[i];
        i++;
        setVisibleLogs((prev) => [...prev, log]);
      } else {
        clearInterval(interval);
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [logs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <p className="label-text">Agent Logs</p>
      </div>
      <div className="bg-foreground rounded-lg p-5 font-mono text-xs space-y-1.5 min-h-[280px] overflow-hidden">
        {visibleLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.12 }}
            className={
              log.startsWith("> ✓")
                ? "text-green-400 font-medium"
                : log.startsWith("> Found") || log.startsWith("> Retained")
                ? "text-blue-400"
                : "text-muted-foreground/60"
            }
          >
            {log}
          </motion.div>
        ))}
        {!done && (
          <span className="inline-block w-1.5 h-4 bg-primary animate-blink" />
        )}
      </div>
    </motion.div>
  );
};

export default AgentLogs;
