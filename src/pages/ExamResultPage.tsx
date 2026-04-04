import { useNavigate, useParams } from 'react-router-dom';
import { useExamResult } from '../features/exams/hooks/useExamResult';
import { Button } from '../components/ui/Button';
import { 
  ExamResultSummary, 
  ExamResultBreakdown, 
  ExamResultStatusCard,
  ExamResultEmptyState 
} from '../components/exams';

export default function ExamResultPage() {
  const navigate = useNavigate();
  const { paperId, attemptId } = useParams();
  const { data, isLoading, error } = useExamResult(paperId, attemptId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
        <ExamResultEmptyState message={error || undefined} onBack={() => navigate('/exams')} />
      </div>
    );
  }

  const { attempt, bundle, responses } = data;
  const sectionScores = attempt.section_scores_json as Record<string, number> | null;
  const hasSubjective = responses.some(r => r.subjective_answer_text !== null && r.subjective_answer_text !== undefined);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kết quả: {bundle.paper.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Hoàn thành lúc {new Date(attempt.submitted_at || attempt.updated_at).toLocaleString('vi-VN')}
        </p>
      </div>

      <ExamResultStatusCard hasSubjective={hasSubjective} />

      <ExamResultSummary 
        score={attempt.total_score || 0}
        accuracy={attempt.accuracy_rate || 0}
        correct={attempt.correct_count}
        wrong={attempt.wrong_count}
        unanswered={attempt.unanswered_count}
        durationSeconds={attempt.duration_seconds}
      />

      {sectionScores && (
        <ExamResultBreakdown sections={bundle.sections} scores={sectionScores} />
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button onClick={() => navigate(`/exams/${paperId}/review/${attemptId}`)} variant="primary" className="flex-1 py-3 text-lg">
          Xem lại đáp án chi tiết
        </Button>
        <Button onClick={() => navigate(`/exams/${paperId}`)} variant="outline" className="flex-1 py-3 text-lg">
          Về trang thông tin đề
        </Button>
      </div>
    </div>
  );
}