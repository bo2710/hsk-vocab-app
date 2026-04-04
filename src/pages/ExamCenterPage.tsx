import { ExamCenterHero, ExamPaperLibrary } from '../components/exams';

export default function ExamCenterPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full animate-fade-in">
      <ExamCenterHero />
      <ExamPaperLibrary />
    </div>
  );
}