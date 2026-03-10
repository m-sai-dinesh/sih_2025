import React, { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import { DisasterType, DrillScenario, User } from '../types';
import { generateDrillScenario } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';

type DrillState = 'idle' | 'selecting' | 'generating' | 'in_progress' | 'completed';

interface VirtualDrillProps {
  currentUser: User;
}

const VirtualDrill: React.FC<VirtualDrillProps> = ({ currentUser }) => {
  const { t } = useTranslation();
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [drillData, setDrillData] = useState<DrillScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

  const handleStartDrill = async (disasterType: DisasterType) => {
    setDrillState('generating');
    const data = await generateDrillScenario(disasterType, currentUser.role);
    if (data) {
      setDrillData(data);
      setDrillState('in_progress');
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      alert(t('virtualDrill.error'));
      setDrillState('selecting');
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !drillData) return;

    const currentQuestion = drillData.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setFeedback({ correct: isCorrect, explanation: currentQuestion.explanation });
  };
  
  const handleNextQuestion = () => {
    if (drillData && currentQuestionIndex < drillData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setDrillState('completed');
    }
  };

  const resetDrill = () => {
    setDrillState('idle');
    setDrillData(null);
  };
  
  const renderContent = () => {
    switch (drillState) {
        case 'idle':
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 font-mono text-light">{t('virtualDrill.idleTitle')}</h2>
                    <p className="mb-6 text-dark-300">{t('virtualDrill.idleSubtitle')}</p>
                    <Button onClick={() => setDrillState('selecting')} variant="primary">{t('virtualDrill.idleButton')}</Button>
                </div>
            );
        case 'selecting':
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 font-mono text-light">{t('virtualDrill.selectingTitle')}</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.values(DisasterType).map(type => (
                            <Button key={type} onClick={() => handleStartDrill(type)} variant="secondary">{t(`disasters.${type}`)}</Button>
                        ))}
                    </div>
                </div>
            );
      case 'generating':
        return (
          <div className="text-center font-mono">
            <h2 className="text-2xl font-bold mb-4 animate-pulse text-secondary">{t('virtualDrill.generatingTitle')}</h2>
            <p className="text-dark-300">{t('virtualDrill.generatingSubtitle')}</p>
          </div>
        );
      case 'in_progress':
        if (!drillData) return null;
        const question = drillData.questions[currentQuestionIndex];
        return (
          <div className="w-full">
            <p className="bg-dark-900/50 text-secondary p-4 rounded-lg mb-6 font-medium font-mono border border-secondary/30">{drillData.scenario}</p>
            <h3 className="text-xl font-semibold mb-4 text-light">{t('virtualDrill.questionTitle', { current: currentQuestionIndex + 1, total: drillData.questions.length, text: question.questionText })}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={!!feedback}
                  className={`block w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-semibold ${
                    selectedAnswer === option ? 'border-primary bg-primary/10' : 'border-dark-700 hover:bg-dark-700/50 hover:border-secondary'
                  } ${feedback && option === question.correctAnswer ? '!bg-accent/10 !border-accent text-light' : ''} ${feedback && selectedAnswer === option && !feedback.correct ? '!bg-danger/10 !border-danger text-light' : ''} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && (
              <div className={`mt-4 p-4 rounded-lg animate-fade-in-up ${feedback.correct ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
                <p className="font-bold font-mono">{feedback.correct ? t('virtualDrill.feedbackCorrect') : t('virtualDrill.feedbackIncorrect')}</p>
                <p>{feedback.explanation}</p>
              </div>
            )}
            <div className="mt-6 text-right">
                {feedback ? (
                    <Button onClick={handleNextQuestion} variant="secondary">
                        {currentQuestionIndex < drillData.questions.length - 1 ? t('virtualDrill.nextButton') : t('virtualDrill.finishButton')}
                    </Button>
                ) : (
                    <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>{t('virtualDrill.submitButton')}</Button>
                )}
            </div>
          </div>
        );
      case 'completed':
        if (!drillData) return null;
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4 font-mono">{t('virtualDrill.completedTitle')}</h2>
            <p className="text-xl text-light mb-2">{t('virtualDrill.completedScore')}</p>
            <p className="text-5xl font-bold text-secondary mb-6 font-mono">{`${score} / ${drillData.questions.length}`}</p>
            <p className="text-dark-300 mb-8">{t('virtualDrill.completedSubtitle')}</p>
            <Button onClick={resetDrill} variant="accent">{t('virtualDrill.completedButton')}</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-light mb-6 font-mono">&gt; {t('virtualDrill.title')}</h1>
        <Card className="max-w-4xl mx-auto min-h-[300px] flex items-center justify-center">
            {renderContent()}
        </Card>
    </div>
  );
};

export default VirtualDrill;
