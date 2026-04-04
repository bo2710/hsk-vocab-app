// filepath: src/pages/ExamReviewPage.tsx
// CẦN CHỈNH SỬA
import { useNavigate, useParams } from 'react-router-dom';
import { useExamReview } from '../features/exams/hooks/useExamReview';
import { useExamVocabularyEncounters } from '../features/exams/hooks/useExamVocabularyEncounters';
import { useExamMistakeInsights } from '../features/exams/hooks/useExamMistakeInsights';
import { useExamWeakWords } from '../features/exams/hooks/useExamWeakWords';
import { 
  ExamReviewHeader, 
  ExamReviewNavigator, 
  ExamAnswerComparisonCard,
  ExamTranscriptPanel,
  ExamExplanationPanel,
  ExamReviewEmptyState,
  ExamSessionProgress,
  ExamVocabularyEncounterPanel,
  ExamMistakeInsightPanel,
  ExamWeakWordsPanel,
  ExamReviewQuestionGridPanel
} from '../components/exams';
import { ReadingPassagePanel } from '../components/exams/ReadingPassagePanel';
import { WritingPromptPanel } from '../components/exams/WritingPromptPanel';

export default function ExamReviewPage() {
  const navigate = useNavigate();
  const { paperId, attemptId } = useParams();
  
  const { 
    data, isLoading, error, 
    questions, currentQuestion, currentQuestionIndex, 
    currentSection, currentOptions, currentResponse, 
    isGridOpen, setIsGridOpen,
    goNext, goPrev, goToQuestion
  } = useExamReview(paperId, attemptId);

  const handleExit = () => {
    navigate(`/exams/${paperId}/result/${attemptId}`);
  };

  const isReading = currentSection?.skill === 'reading';
  const isWriting = currentSection?.skill === 'writing';

  const config = currentQuestion?.render_config_json as any;
  const readingPassage = isReading ? (config?.passage || currentQuestion?.prompt_rich_text || currentSection?.instructions) : null;

  // Gọi hook quét Encounter Vocabulary cho câu hỏi hiện tại
  const { 
    encounters, 
    isLoading: isEncountersLoading, 
    error: encountersError 
  } = useExamVocabularyEncounters(currentQuestion, currentSection, currentOptions, readingPassage);

  // Gọi hook tạo Mistake Insights toàn bài
  const {
    insights,
    recommendations,
    isLoading: isInsightsLoading,
    error: insightsError
  } = useExamMistakeInsights(data?.attempt, data?.responses, data?.bundle);

  // Gọi hook trích xuất Weak Words từ lỗi sai
  const {
    weakWords,
    isLoading: isWeakWordsLoading,
    error: weakWordsError
  } = useExamWeakWords(data?.responses, data?.bundle, insights);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error || !data || !currentQuestion) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
        <ExamReviewEmptyState message={error || undefined} onBack={handleExit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 animate-fade-in">
      <ExamSessionProgress currentIndex={currentQuestionIndex} total={questions.length} />
      
      <ExamReviewHeader 
        title={data.bundle.paper.title} 
        score={data.attempt.total_score}
        onExit={handleExit} 
        onToggleGrid={() => setIsGridOpen(prev => !prev)}
      />

      <main className="max-w-4xl mx-auto p-4 md:p-6 md:mt-6">
        
        {/* Khối Tổng hợp & Insight (Hiển thị đầu trang để định hướng) */}
        {currentQuestionIndex === 0 && (
          <div className="space-y-6 mb-8">
            <ExamMistakeInsightPanel
              insights={insights}
              recommendations={recommendations}
              isLoading={isInsightsLoading}
              error={insightsError}
            />
            
            <ExamWeakWordsPanel
              weakWords={weakWords}
              isLoading={isWeakWordsLoading}
              error={weakWordsError}
            />
          </div>
        )}

        {/* Khối Context chung (Passage / Image / Prompt) */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {currentSection?.section_name}
            </span>
          </div>

          {isReading && readingPassage && (
            <div className="mb-6"><ReadingPassagePanel content={readingPassage} /></div>
          )}
          {isWriting && (
            <WritingPromptPanel 
              instruction={currentSection?.instructions || null}
              content={currentQuestion.prompt_rich_text || currentQuestion.prompt_text}
              imageUrl={config?.image_url}
              wordLimit={config?.word_limit}
            />
          )}

          {!isWriting && currentQuestion.prompt_text && (
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                {currentQuestion.prompt_text}
              </p>
            </div>
          )}
        </div>

        {/* Khối Trả lời & So sánh đáp án */}
        <ExamAnswerComparisonCard 
          question={currentQuestion} 
          options={currentOptions} 
          response={currentResponse} 
        />

        {/* Khối Bổ trợ: Transcript, Giải thích, và TỪ VỰNG (Encounter cho 1 câu cụ thể) */}
        <div className="space-y-6 mt-8">
          <ExamVocabularyEncounterPanel 
            encounters={encounters} 
            isLoading={isEncountersLoading} 
            error={encountersError} 
          />
          <ExamTranscriptPanel transcript={currentQuestion.transcript_text || currentSection?.transcript_text || null} />
          <ExamExplanationPanel explanation={currentQuestion.explanation_text || currentSection?.explanation_text || null} />
        </div>

        {/* Chuyển trang */}
        <ExamReviewNavigator 
          currentIndex={currentQuestionIndex} 
          total={questions.length} 
          onNext={goNext} 
          onPrev={goPrev} 
        />
      </main>

      <ExamReviewQuestionGridPanel 
        isOpen={isGridOpen}
        onClose={() => setIsGridOpen(false)}
        questions={questions}
        sections={data.bundle.sections}
        responses={data.responses}
        currentIndex={currentQuestionIndex}
        onJump={goToQuestion}
      />
    </div>
  );
}