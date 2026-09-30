import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scenarios } from '../data/scenarios';
import { modules } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import type { ConfidenceLevel } from '../data/types';
import { AlertCircle, CheckCircle, XCircle, ArrowRight, Flag } from 'lucide-react';

export function ScenarioDrill() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { markScenarioCompleted, addXP, addMistake, updateCompetency, isShiftActive, processReviewResult } = useAppStore();
  
  const scenario = scenarios.find(s => s.id === scenarioId);
  const module = scenario ? modules.find(m => m.id === scenario.moduleId) : null;
  
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [logicalStepCount, setLogicalStepCount] = useState(1);
  const [wrongAnswersThisStep, setWrongAnswersThisStep] = useState(0);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  
  useEffect(() => {
    if (scenario && !currentStepId) {
      setCurrentStepId(scenario.firstStepId);
    }
  }, [scenario, currentStepId]);

  if (!scenario || !module || !currentStepId) {
    return <div className="p-8 text-center">Scenario not found.</div>;
  }

  const step = scenario.steps[currentStepId];
  if (!step) {
    return <div className="p-8 text-center">Step not found.</div>;
  }
  const selectedOption = selectedOptionId ? step.options.find(o => o.id === selectedOptionId) : null;

  const handleOptionSelect = (optionId: string) => {
    if (!hasSubmitted) setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setHasSubmitted(true);
    
    if (selectedOption?.isCorrect) {
      if (wrongAnswersThisStep === 0) {
        addXP(10);
        updateCompetency(scenario.moduleId, step.competencyArea || 'decisionMaking', 10);
        processReviewResult({
          itemId: currentStepId,
          itemType: 'scenario_decision',
          moduleId: scenario.moduleId,
          rating: confidence === 'highly_confident' ? 'easy' : confidence === 'guessing' ? 'hard' : 'good',
          confidence
        });
      } else {
        addXP(2);
        updateCompetency(scenario.moduleId, step.competencyArea || 'decisionMaking', 2);
        processReviewResult({
          itemId: currentStepId,
          itemType: 'scenario_decision',
          moduleId: scenario.moduleId,
          rating: 'again',
          confidence
        });
      }
    } else {
      setWrongAnswersThisStep(prev => prev + 1);
      const expectedOption = step.options.find(o => o.isCorrect);
      addMistake({
        date: new Date().toISOString(),
        moduleId: scenario.moduleId,
        activityType: 'scenario',
        activityId: scenario.id,
        userAnswer: selectedOption?.text || 'Unknown',
        expectedReasoning: expectedOption?.text || 'The correct path',
        explanation: selectedOption?.feedback || 'Incorrect choice.',
        confidenceBeforeAnswer: confidence,
        severity: 'medium', // Default severity
      });
    }
  };

  const handleNext = () => {
    if (!selectedOption) return;
    
    if (selectedOption.nextStepId) {
      if (selectedOption.nextStepId !== currentStepId) {
        setLogicalStepCount(prev => prev + 1);
        setWrongAnswersThisStep(0);
      }
      setHistory([...history, currentStepId]);
      setCurrentStepId(selectedOption.nextStepId);
      setSelectedOptionId(null);
      setConfidence(null);
      setHasSubmitted(false);
    } else {
      // Scenario complete
      markScenarioCompleted(scenario.id, scenario.moduleId);
      if (isShiftActive) {
        navigate('/shift');
      } else {
        navigate(`/modules/${scenario.moduleId}`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${module.color}`}>
            {module.name}
          </span>
          <h1 className="text-2xl font-bold mt-2">{scenario.title}</h1>
        </div>
        <div className="text-textMuted flex items-center gap-2 text-sm font-medium">
          <Flag size={16} />
          Step {logicalStepCount}
        </div>
      </div>

      <div className="card shadow-md mb-6 bg-white border-t-4 border-t-primary">
        <p className="text-lg leading-relaxed text-textMain mb-6">
          {step.text}
        </p>

        <div className="space-y-3">
          {step.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            let optionClass = "border-border hover:border-primary hover:bg-slate-50";
            
            if (hasSubmitted) {
              if (isSelected && option.isCorrect) optionClass = "border-success bg-green-50 ring-2 ring-success ring-opacity-50";
              else if (isSelected && !option.isCorrect) optionClass = "border-danger bg-red-50 ring-2 ring-danger ring-opacity-50";
              else if (option.isCorrect) optionClass = "border-success bg-green-50/50 border-dashed"; // Show what would have been correct
              else optionClass = "border-border opacity-50";
            } else if (isSelected) {
              optionClass = "border-primary bg-blue-50 ring-2 ring-primary ring-opacity-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={hasSubmitted}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {hasSubmitted && isSelected && option.isCorrect && <CheckCircle className="text-success" size={20} />}
                    {hasSubmitted && isSelected && !option.isCorrect && <XCircle className="text-danger" size={20} />}
                    {(!hasSubmitted || !isSelected) && <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary' : 'border-slate-300'}`} />}
                  </div>
                  <span className="font-medium text-slate-800">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {hasSubmitted && selectedOption && (
        <div aria-live="polite" className={`card mb-6 animate-fade-in ${selectedOption.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`mt-0.5 shrink-0 ${selectedOption.isCorrect ? 'text-success' : 'text-danger'}`} />
            <div>
              <h3 className={`font-bold ${selectedOption.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {selectedOption.isCorrect ? 'Correct!' : 'Not quite.'}
              </h3>
              <p className="mt-1 text-slate-700">{selectedOption.feedback}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-end gap-4 mt-8">
        {!hasSubmitted && selectedOptionId && (
          <div className="animate-fade-in w-full card bg-slate-50 border-slate-200">
            <p className="text-sm font-semibold text-textMain mb-3 text-center">How confident are you in this decision?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'guessing', label: 'Guessing' },
                { id: 'somewhat', label: 'Somewhat' },
                { id: 'confident', label: 'Confident' },
                { id: 'highly_confident', label: 'Highly Confident' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setConfidence(c.id as ConfidenceLevel)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    confidence === c.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-primary'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!selectedOptionId || !confidence}
            className={`btn ${selectedOptionId && confidence ? 'btn-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Submit Decision
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="btn btn-primary gap-2 animate-fade-in"
          >
            {selectedOption?.nextStepId ? 'Next Step' : 'Complete Scenario'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
