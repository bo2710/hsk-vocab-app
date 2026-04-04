// filepath: src/pages/ExamSessionPage.tsx
// CẦN CHỈNH SỬA
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useExamSession } from '../features/exams/hooks/useExamSession';
import { 
  ExamSessionHeader, 
  ExamSessionProgress, 
  ExamSessionNavigation, 
  ExamSessionEmptyState,
  ExamQuestionShell,
  ExamSubmitBar,
  ExamSessionQuestionGridPanel
} from '../components/exams';

export default function ExamSessionPage() {
  const navigate = useNavigate();
  const { paperId } = useParams<{ paperId: string }>();
  const location = useLocation();
  
  // Handoff từ ExamPaperPage: state: { selectedSectionIds: string[] }
  const selectedSectionIds: string[] = location.state?.selectedSectionIds || [];

  const {
    status,
    error,
    bundle,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex,
    elapsedSeconds,
    autosaveStatus,
    responses,
    isGridOpen,
    setIsGridOpen,
    goNext,
    goPrev,
    goToQuestion,
    handleResponseChange,
    toggleMarkForLater,
    submitAttempt
  } = useExamSession(paperId, selectedSectionIds);

  const handleExit = () => {
    if (window.confirm('Bạn có chắc muốn thoát? Quá trình làm bài đã được tự động lưu.')) {
      navigate(`/exams/${paperId}`);
    }
  };

  const handleFinalSubmit = async () => {
    const result = await submitAttempt();
    if (result.success && result.attemptId) {
      navigate(`/exams/${paperId}/result/${result.attemptId}`, { replace: true });
    } else {
      alert(result.error || 'Có lỗi xảy ra khi nộp bài.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <svg className="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Đang chuẩn bị đề thi...</p>
      </div>
    );
  }

  if (status === 'error' || activeQuestions.length === 0) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <ExamSessionEmptyState message={error || 'Đề thi không có nội dung câu hỏi nào hợp lệ để hiển thị.'} />
      </div>
    );
  }

  const answeredCount = Object.keys(responses).filter(id => !!(responses[id].selected_option_id || responses[id].selected_text || responses[id].subjective_answer_text)).length;
  const isCurrentMarked = currentQuestion ? !!responses[currentQuestion.id]?.is_marked_for_later : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <ExamSessionProgress currentIndex={currentQuestionIndex} total={activeQuestions.length} />
      
      <ExamSessionHeader 
        title={bundle?.paper.title || 'Bài thi HSK'} 
        elapsedSeconds={elapsedSeconds} 
        autosaveStatus={autosaveStatus}
        onSubmit={handleFinalSubmit}
        onExit={handleExit}
        onToggleGrid={() => setIsGridOpen(prev => !prev)}
      />

      <main className="max-w-4xl mx-auto p-4 md:p-6 md:mt-6">
        {currentQuestion ? (
          <ExamQuestionShell 
            question={currentQuestion} 
            index={currentQuestionIndex}
            section={bundle?.sections.find(s => s.id === currentQuestion.exam_section_id)}
            options={bundle?.options.filter(o => o.exam_question_id === currentQuestion.id) || []}
            response={responses[currentQuestion.id]}
            onResponseChange={(val, optId, isSub) => handleResponseChange(currentQuestion.id, val, optId, isSub)}
          />
        ) : (
          <div className="text-center p-10 text-gray-500">Lỗi không xác định: Không tìm thấy câu hỏi hiện tại.</div>
        )}

        <ExamSessionNavigation 
          currentIndex={currentQuestionIndex} 
          total={activeQuestions.length} 
          onNext={goNext} 
          onPrev={goPrev}
          isMarked={isCurrentMarked}
          onToggleMark={() => currentQuestion && toggleMarkForLater(currentQuestion.id)}
        />
      </main>

      <ExamSubmitBar 
        answeredCount={answeredCount} 
        totalCount={activeQuestions.length} 
        onSubmit={handleFinalSubmit} 
        isSubmitting={status === 'submitting'}
      />

      {bundle && (
        <ExamSessionQuestionGridPanel 
          isOpen={isGridOpen}
          onClose={() => setIsGridOpen(false)}
          questions={activeQuestions}
          sections={bundle.sections}
          responses={responses}
          currentIndex={currentQuestionIndex}
          onJump={goToQuestion}
        />
      )}
    </div>
  );
}