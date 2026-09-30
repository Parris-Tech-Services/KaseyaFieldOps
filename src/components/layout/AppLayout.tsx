import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Layers, PlayCircle, Book, Map, Activity, XOctagon, BrainCircuit, Search, Settings, ClipboardCheck } from 'lucide-react';
import { CommandPalette } from '../../features/search/CommandPalette';
import { OnboardingModal } from '../../features/onboarding/OnboardingModal';

export function AppLayout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/modules', icon: Layers },
    { name: 'Product Map', path: '/map', icon: Map },
    { name: 'Quick Reference', path: '/reference', icon: Book },
    { name: 'Shift Simulator', path: '/shift', icon: PlayCircle },
    { name: 'Field Test', path: '/simulator', icon: ClipboardCheck },
    { name: 'Reviews', path: '/review', icon: BrainCircuit },
    { name: 'Mistakes', path: '/mistakes', icon: XOctagon },
    { name: 'Progress', path: '/progress', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      <OnboardingModal />
      <CommandPalette />
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-surface border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-textMain tracking-tight">Kaseya Field Ops</h1>
          <p className="text-xs text-textMuted mt-1">Avance Business Technology</p>
        </div>
        
        <div className="px-4 mb-4">
          <button 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm text-textMuted hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2"><Search size={16} /> Search...</span>
            <kbd className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Ctrl+K</kbd>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-textMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border text-xs text-textMuted text-center">
          v1.0.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-16 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav for Mobile: horizontally scrollable so every native route remains reachable. */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-center h-16 z-50 overflow-x-auto overscroll-x-contain">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full space-y-1 min-w-[76px] px-2 ${
                isActive ? 'text-primary' : 'text-textMuted'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
