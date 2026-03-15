import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { normalizeQuery, validateResearchQuery } from "@/lib/queryValidation";

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], duration: 0.5 };

const suggestions = [
  "Master DSA in 3 months",
  "Learn system design for backend engineers",
  "Build a full-stack app with React & Node.js",
  "Prepare for FAANG interviews in 8 weeks",
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = normalizeQuery(query) || suggestions[0];
    const validation = validateResearchQuery(q);
    if (!validation.valid) {
      toast.error(validation.reason || "Please enter a valid research query.");
      return;
    }
    navigate(`/research?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestion = (s: string) => {
    navigate(`/research?q=${encodeURIComponent(s)}`);
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          <p className="label-text mb-4">AI Research Engine</p>
          <h1 className="display-text text-foreground mb-4">
            From chaos to curriculum.
          </h1>
          <p className="body-text text-muted-foreground max-w-xl mx-auto mb-10">
            Enter a research prompt. Our multi-agent system searches, analyzes, and architects a structured roadmap — topics, resources, and timeline — in seconds.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.15 }}
          className="relative max-w-2xl mx-auto"
        >
          <input
            type="text"
            className="search-input pr-14"
            placeholder="Research the best way to learn system design..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.3 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[10px] font-mono text-muted-foreground/60 mr-1">Try:</span>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-surface text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              {s}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <span className="font-mono text-xs text-muted-foreground">14 Sources Analyzed</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="font-mono text-xs text-muted-foreground">3 Learning Paths</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="font-mono text-xs text-muted-foreground">12m Reading Time</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
