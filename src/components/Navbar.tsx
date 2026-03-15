import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.05)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Architect</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="label-text cursor-pointer hover:text-foreground transition-colors"></span>
          <span className="label-text cursor-pointer hover:text-foreground transition-colors"></span>
          <button className="text-xs font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Start Researching
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
