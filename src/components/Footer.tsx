const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-surface" style={{ boxShadow: "0 -1px 0 rgba(0,0,0,.05)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xs font-medium text-foreground">Architect</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          From chaos to curriculum. Built for engineers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
