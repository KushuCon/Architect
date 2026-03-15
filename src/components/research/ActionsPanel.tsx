import { Download } from "lucide-react";
import type { ResearchResult } from "@/types/research";

interface ActionsPanelProps {
  result: ResearchResult;
  query: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const ActionsPanel = ({ result, query }: ActionsPanelProps) => {
  const handleExportPdf = () => {
    const phaseHtml = result.phases
      .map(
        (phase) => `
          <section class="phase">
            <h3>${escapeHtml(phase.week)} - ${escapeHtml(phase.title)}</h3>
            <p>${escapeHtml(phase.description)}</p>
            <p><strong>Milestone:</strong> ${escapeHtml(phase.milestone)}</p>
            <ul>
              ${phase.topics
                .map(
                  (topic) => `
                    <li>
                      <strong>${escapeHtml(topic.name)}</strong> (${escapeHtml(topic.difficulty)}, ~${topic.estimatedHours}h)
                      <div>${topic.subtopics.map((subtopic) => escapeHtml(subtopic)).join(", ")}</div>
                    </li>
                  `,
                )
                .join("")}
            </ul>
          </section>
        `,
      )
      .join("");

    const sourcesHtml = result.allSources
      .map(
        (source) =>
          `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.name)}</a> - ${escapeHtml(source.domain)}</li>`,
      )
      .join("");

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Roadmap Export</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 24px;
              color: #111;
              background: #fff;
              font-family: "Segoe UI", Arial, sans-serif;
              line-height: 1.45;
              font-size: 12px;
            }
            h1, h2, h3 { margin: 0 0 8px; color: #000; }
            h1 { font-size: 22px; }
            h2 { font-size: 16px; margin-top: 20px; }
            h3 { font-size: 14px; }
            p, li, div { word-break: break-word; overflow-wrap: anywhere; }
            section.phase {
              border: 1px solid #000;
              padding: 10px;
              margin-top: 10px;
              page-break-inside: avoid;
            }
            ul { margin: 8px 0 0; padding-left: 18px; }
            a { color: #000; text-decoration: none; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; }
            .meta div { border: 1px solid #000; padding: 8px; }
            @page { margin: 14mm; }
          </style>
        </head>
        <body>
          <h1>Learning Roadmap</h1>
          <p><strong>Query:</strong> ${escapeHtml(query)}</p>
          <p>${escapeHtml(result.summary)}</p>

          <div class="meta">
            ${result.stats
              .map((stat) => `<div><strong>${escapeHtml(stat.label)}:</strong> ${escapeHtml(stat.value)}</div>`)
              .join("")}
          </div>

          <h2>Roadmap</h2>
          ${phaseHtml}

          <h2>Sources</h2>
          <ul>${sourcesHtml}</ul>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const objectUrl = URL.createObjectURL(blob);

    const printWindow = window.open(objectUrl, "_blank", "width=900,height=700");
    if (!printWindow) {
      URL.revokeObjectURL(objectUrl);
      return;
    }

    const onPrint = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 3000);
    };

    printWindow.addEventListener("load", onPrint, { once: true });
  };

  return (
    <div className="sticky top-20 space-y-4">
      <div>
        <p className="label-text mb-3">Quick Actions</p>
        <div className="space-y-1.5">
          <button
            onClick={handleExportPdf}
            className="w-full surface-card !p-3 flex items-center gap-2 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="surface-card !p-4">
        <p className="label-text mb-3">Research Summary</p>
        <div className="space-y-2.5">
          {result.stats.map((stat, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-mono font-medium text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card !p-4">
        <p className="label-text mb-2">About this Roadmap</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {result.summary}
        </p>
      </div>
    </div>
  );
};

export default ActionsPanel;
