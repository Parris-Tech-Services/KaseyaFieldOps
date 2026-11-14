import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { scenarios } from '../data/scenarios';
import { useAppStore } from '../store/useAppStore';
import * as Icons from 'lucide-react';
import { CheckCircle } from 'lucide-react';

export function ModulesList() {
  const { completedScenarios } = useAppStore();
  

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Modules</h1>
        <p className="text-textMuted mt-2">Master the stack and the networking underneath it. Work through orientation and field scenarios for each module.</p>
      </div>

      {[
        { key: 'product', title: 'Kaseya & Datto Products', items: modules.filter(m => m.category !== 'networking') },
        { key: 'networking', title: 'MSP Networking Fundamentals', items: modules.filter(m => m.category === 'networking') },
      ].filter(g => g.items.length > 0).map(group => (
        <section key={group.key} className="space-y-3">
          <h2 className="text-lg font-semibold text-textMuted">{group.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...group.items].sort((a, b) => a.order - b.order).map(m => {
          // @ts-ignore
          const IconComponent = Icons[m.iconName] || Icons.Box;

          return (
            <Link 
              key={m.id} 
              to={`/modules/${m.id}`}
              className="card hover:border-primary transition-all flex flex-col group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${m.color} text-white`}>
                  <IconComponent size={24} />
                </div>
                {completedScenarios.filter(id => id.startsWith(m.id)).length > 0 && <CheckCircle size={16} className="text-success" />}
              </div>
              
              <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{m.name}</h2>
              <p className="text-sm text-textMuted mt-2 mb-6 flex-1">{m.description}</p>
              
              {(() => {
                const moduleScenarios = scenarios.filter((s: any) => s.moduleId === m.id);
                const completedModuleScenarios = moduleScenarios.filter((s: any) => completedScenarios.includes(s.id));
                const completionPct = moduleScenarios.length > 0 
                  ? Math.round((completedModuleScenarios.length / moduleScenarios.length) * 100) 
                  : 0;
                
                return (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-4">
                    <div 
                      className={`h-full ${m.color}`} 
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                );
              })()}
            </Link>
          );
        })}
          </div>
        </section>
      ))}
    </div>
  );
}
