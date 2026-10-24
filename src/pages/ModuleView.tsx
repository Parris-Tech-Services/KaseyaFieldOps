import { useParams, Link, useNavigate } from 'react-router-dom';
import { modules } from '../data/modules';
import { scenarios } from '../data/scenarios';
import { useAppStore } from '../store/useAppStore';
import { ChevronLeft, Play, CheckCircle2, AlertTriangle, Lightbulb, Link2, BookMarked, Brain, HelpCircle, BookOpen } from 'lucide-react';
import { LessonText } from '../components/LessonText';

export function ModuleView() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { completedScenarios } = useAppStore();
  
  const module = modules.find(m => m.id === moduleId);
  const moduleScenarios = scenarios.filter(s => s.moduleId === module?.id);
  const completedModuleScenarios = moduleScenarios.filter(s => completedScenarios.includes(s.id));
  const completionPct = moduleScenarios.length > 0 
    ? Math.round((completedModuleScenarios.length / moduleScenarios.length) * 100) 
    : 0;


  const isNetworking = module?.category === 'networking';

  if (!module) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Module not found</h2>
        <button onClick={() => navigate('/modules')} className="btn btn-secondary mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Link to="/modules" className="inline-flex items-center text-sm font-medium text-textMuted hover:text-textMain mb-2">
        <ChevronLeft size={16} className="mr-1" />
        {isNetworking ? 'Back to Modules' : 'Back to Products'}
      </Link>
      
      <header className="flex items-start gap-6 border-b border-border pb-6">
        <div className={`w-20 h-20 rounded-2xl ${module.color} flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-md`}>
          {module.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-textMain">{module.name}</h1>
              <p className="text-lg text-textMuted mt-1">{module.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-1">Completion</div>
              <div className="text-2xl font-black text-textMain">{completionPct}%</div>
            </div>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full ${module.color}`} 
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Learning & Theory) */}
        <div className="lg:col-span-2 space-y-8">
          
          {module.lessonSections && module.lessonSections.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-cyan-600" />
                Lesson
              </h2>
              {module.lessonSections.map((sec, i) => (
                <div key={i} className="card">
                  <h3 className="font-semibold text-textMain mb-3">{i + 1}. {sec.title}</h3>
                  <LessonText body={sec.body} />
                </div>
              ))}
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="text-amber-500" />
              {isNetworking ? 'Why It Matters' : 'Mental Model'}
            </h2>
            <div className="card prose dark:prose-invert">
              <p className="font-medium text-textMain">{isNetworking ? 'Why MSP technicians need this' : 'What problem does this solve?'}</p>
              <p className="text-textMuted">{module.problemSolved || "This product solves a specific IT management or security challenge for MSPs. (Content pending)"}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-medium text-textMain">{isNetworking ? 'In short' : 'Plain English Explanation'}</p>
                <p className="text-textMuted">{module.mentalModel || "A simplified explanation of how this tool fits into the MSP ecosystem. (Content pending)"}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              Practical Application
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="font-semibold mb-2">{isNetworking ? "After this module you'll be able to:" : 'I would use this to:'}</h3>
                <ul className="list-disc pl-5 text-sm text-textMuted space-y-1">
                  {module.actualUseCases ? module.actualUseCases.map((use, i) => (
                    <li key={i}>{use}</li>
                  )) : (
                    <>
                      <li>Perform core product actions</li>
                      <li>Resolve specific client requests</li>
                      <li>Automate daily tasks</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="card">
                <h3 className="font-semibold mb-2">{isNetworking ? 'Commands to know:' : 'Common Workflows:'}</h3>
                <ul className="list-disc pl-5 text-sm text-textMuted space-y-1">
                  {module.commonWorkflows ? module.commonWorkflows.map((flow, i) => (
                    <li key={i}>{flow}</li>
                  )) : (
                    <>
                      <li>Initial deployment and setup</li>
                      <li>Daily monitoring and triage</li>
                      <li>Generating client reports</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
              <AlertTriangle />
              {isNetworking ? 'Common Mistakes' : 'When NOT to use this'}
            </h2>
            <div className="card border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <ul className="list-disc pl-5 text-sm text-textMuted space-y-1">
                {module.whenNotToUse ? module.whenNotToUse.map((reason, i) => (
                  <li key={i}>{reason}</li>
                )) : (
                  <li>Don't use this when a different tool is explicitly designed for that purpose. (Content pending)</li>
                )}
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Play className="text-primary" />
              Scenario Drills
            </h2>
            
            {moduleScenarios.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800 border border-border border-dashed rounded-xl p-8 text-center text-textMuted">
                No scenarios available for this module yet.
              </div>
            ) : (
              <div className="space-y-3">
                {moduleScenarios.map(s => {
                  const isCompleted = completedScenarios.includes(s.id);
                  return (
                    <Link 
                      key={s.id}
                      to={`/scenarios/${s.id}`}
                      className={`card flex items-start gap-4 transition-all hover:shadow-md ${isCompleted ? 'border-l-4 border-l-success' : 'border-l-4 border-l-transparent hover:border-l-primary'}`}
                    >
                      <div className={`mt-1 ${isCompleted ? 'text-success' : 'text-slate-300 dark:text-slate-600'}`}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{s.title}</h3>
                        <p className="text-textMuted mt-1">{s.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar (Terminology & Relationships) */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookMarked size={18} className="text-blue-500" />
              Key Terminology
            </h3>
            <div className="space-y-3">
              {module.keyTerminology ? module.keyTerminology.map((term, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-textMain">{term.term}: </span>
                  <span className="text-textMuted">{term.definition}</span>
                </div>
              )) : (
                <p className="text-sm text-textMuted">Terminology list pending.</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Link2 size={18} className="text-purple-500" />
              {isNetworking ? 'Builds On' : 'Related Products'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {module.relatedProducts ? module.relatedProducts.map((prod, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-textMain">{prod}</span>
              )) : (
                <p className="text-sm text-textMuted">Connections pending.</p>
              )}
            </div>
          </div>

          {!(isNetworking && !module.commonConfusions) && <div className="card bg-slate-50 dark:bg-slate-800 border-none">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={18} className="text-orange-500" />
              Common Confusions
            </h3>
            <ul className="list-disc pl-5 text-sm text-textMuted space-y-1">
              {module.commonConfusions ? module.commonConfusions.map((conf, i) => (
                <li key={i}>{conf}</li>
              )) : (
                <li>Comparisons to similar tools pending.</li>
              )}
            </ul>
          </div>}
          
          <div className="card border-primary bg-primary/5">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              Learning Activities
            </h3>
            <div className="space-y-2 mt-4">
              <Link to="/review" className="btn btn-primary w-full text-sm justify-center">Review Knowledge Cards</Link>
              <Link to="/reference" className="btn btn-outline w-full text-sm justify-center">View Quick Reference</Link>
            </div>
          </div>

          {module.sources && module.sources.length > 0 && (
            <div className="card border-border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Link2 size={18} className="text-slate-500" />
                Verified Sources
              </h3>
              <div className="space-y-4">
                {module.sources.map((src, i) => (
                  <div key={i} className="text-xs">
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-start gap-1">
                      {src.title}
                    </a>
                    <div className="text-textMuted mt-1">
                      <span className="font-semibold">Verified: </span>
                      {new Date(src.verifiedAt).toLocaleDateString()}
                    </div>
                    {src.supports && src.supports.length > 0 && (
                      <div className="text-textMuted mt-1">
                        <span className="font-semibold">Supports: </span>
                        <ul className="list-disc pl-4 mt-1">
                          {src.supports.map((s, j) => <li key={j}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
