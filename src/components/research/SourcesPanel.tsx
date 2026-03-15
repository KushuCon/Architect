import { motion } from "framer-motion";
import { ExternalLink, Video, BookOpen, FileText, Code, GraduationCap, Wrench, FlaskConical } from "lucide-react";
import type { Source } from "@/types/research";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.3 };
const cardVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const typeIcons: Record<Source["type"], React.ReactNode> = {
  video: <Video className="w-2.5 h-2.5" />,
  book: <BookOpen className="w-2.5 h-2.5" />,
  article: <FileText className="w-2.5 h-2.5" />,
  repo: <Code className="w-2.5 h-2.5" />,
  course: <GraduationCap className="w-2.5 h-2.5" />,
  paper: <FlaskConical className="w-2.5 h-2.5" />,
  tool: <Wrench className="w-2.5 h-2.5" />,
};

interface SourcesPanelProps {
  sources: Source[];
}

const SourcesPanel = ({ sources }: SourcesPanelProps) => {
  return (
    <div className="sticky top-20">
      <p className="label-text mb-3 flex items-center gap-1.5">
        <BookOpen className="w-3 h-3" />
        Sources & Citations ({sources.length})
      </p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        className="space-y-1.5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
      >
        {sources.map((source, i) => (
          <motion.a
            key={i}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            variants={cardVariants}
            transition={transition}
            className="surface-card !p-2.5 block cursor-pointer hover:bg-muted transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-foreground truncate leading-tight">{source.name}</p>
                {source.creatorName && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{source.creatorName}</p>
                )}
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{source.domain}</p>
                <p className="text-[9px] font-mono text-muted-foreground/80 truncate mt-0.5">{source.url}</p>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-accent text-accent-foreground uppercase">
                {typeIcons[source.type]}
                {source.type}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground">
                {Math.round(source.relevance * 100)}% match
              </span>
              {source.sourceOrigin && (
                <span className="text-[9px] font-mono text-muted-foreground/80 uppercase">
                  {source.sourceOrigin}
                </span>
              )}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default SourcesPanel;
