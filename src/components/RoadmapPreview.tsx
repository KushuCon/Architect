import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Video, FileText, Clock } from "lucide-react";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.3 };

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const sources = [
  { name: "Designing Data-Intensive Apps", domain: "oreilly.com", type: "book" },
  { name: "System Design Primer", domain: "github.com", type: "repo" },
  { name: "MIT 6.824 Distributed Systems", domain: "mit.edu", type: "course" },
  { name: "Gaurav Sen - System Design", domain: "youtube.com", type: "video" },
  { name: "ByteByteGo Newsletter", domain: "bytebytego.com", type: "article" },
  { name: "Martin Kleppmann's Blog", domain: "martin.kleppmann.com", type: "article" },
  { name: "CAP Theorem Explained", domain: "arxiv.org", type: "paper" },
];

const phases = [
  {
    week: "Weeks 1–2",
    title: "Foundations",
    description: "Networking basics, client-server architecture, HTTP/TCP, DNS resolution, and CDN fundamentals.",
    topics: ["Networking", "HTTP/TCP", "DNS", "CDNs"],
    resources: 3,
  },
  {
    week: "Weeks 3–4",
    title: "Data Layer",
    description: "SQL vs NoSQL trade-offs, database indexing, sharding strategies, replication, and caching patterns.",
    topics: ["SQL/NoSQL", "Indexing", "Sharding", "Caching"],
    resources: 4,
  },
  {
    week: "Weeks 5–6",
    title: "Architecture Patterns",
    description: "Load balancing, microservices vs monolith, message queues, event-driven architecture, and API gateway design.",
    topics: ["Load Balancing", "Microservices", "Message Queues", "API Design"],
    resources: 4,
  },
  {
    week: "Weeks 7–8",
    title: "Advanced & Practice",
    description: "CAP theorem, consensus algorithms, rate limiting, real-world case studies (Twitter, Uber, Netflix).",
    topics: ["CAP Theorem", "Consensus", "Rate Limiting", "Case Studies"],
    resources: 3,
  },
];

const RoadmapPreview = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="text-center mb-12"
        >
          <p className="label-text mb-3">Sample Output</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            The Roadmap View
          </h2>
          <p className="body-text text-muted-foreground mt-2 max-w-lg mx-auto">
            Every research prompt produces a structured, actionable roadmap with sources, phases, and timeline.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar: Sources */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
            className="col-span-12 lg:col-span-3"
          >
            <div className="sticky top-20">
              <p className="label-text mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Sources & Citations
              </p>
              <div className="space-y-2">
                {sources.map((source, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    transition={transition}
                    className="surface-card !p-3 cursor-pointer hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{source.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{source.domain}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-accent text-accent-foreground">
                        {source.type === "video" && <Video className="w-2.5 h-2.5" />}
                        {source.type === "book" && <BookOpen className="w-2.5 h-2.5" />}
                        {source.type !== "video" && source.type !== "book" && <FileText className="w-2.5 h-2.5" />}
                        {source.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main: Roadmap Timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="col-span-12 lg:col-span-9"
          >
            <p className="label-text mb-3 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              The Roadmap
            </p>
            <div className="space-y-4">
              {phases.map((phase, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  transition={transition}
                  className="phase-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="label-text text-primary">{phase.week}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px] font-mono text-muted-foreground">{phase.resources} resources</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{phase.title}</h3>
                  <p className="body-text text-muted-foreground mb-3">{phase.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.topics.map((topic, j) => (
                      <span
                        key={j}
                        className="text-[10px] font-mono px-2 py-1 rounded-sm bg-accent text-accent-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapPreview;
