// filepath: src/pages/ImportExamPage.tsx
// CẦN CHỈNH SỬA
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImportExamHero } from '../components/exams/ImportExamHero';
import { ExamJsonImportGuide } from '../components/exams/ExamJsonImportGuide';
import { ExamJsonImportPastePanel } from '../components/exams/ExamJsonImportPastePanel';
import { ExamJsonImportPromptModal } from '../components/exams/ExamJsonImportPromptModal';
import { ExamJsonImportValidationSummary } from '../components/exams/ExamJsonImportValidationSummary';
import { ExamJsonImportSuccessCard } from '../components/exams/ExamJsonImportSuccessCard';
import { ExamJsonImportReviewOnlyNotice } from '../components/exams/ExamJsonImportReviewOnlyNotice';
import { ExamVisibilityField } from '../components/exams/ExamVisibilityField';
import { ExamListeningMediaField } from '../components/exams/ExamListeningMediaField';
import { useExamJsonIngestion } from '../features/exams/hooks/useExamJsonIngestion';
import { ExamListeningMediaType } from '../features/exams/types';

export default function ImportExamPage() {
  const navigate = useNavigate();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  
  // States cho cấu hình metadata đề
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [mediaType, setMediaType] = useState<ExamListeningMediaType>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  
  // Sử dụng Ingestion Hook mới
  const { 
    status, error, validationErrors, importedPaperId, importedPaperTitle, 
    processJsonString, reset 
  } = useExamJsonIngestion();

  const handleImport = (jsonStr: string) => {
    try {
      // Inject metadata config vào payload JSON trước khi truyền cho hook
      const parsed = JSON.parse(jsonStr);
      parsed.visibility = visibility;
      parsed.media = {
        type: mediaType,
        url: mediaUrl.trim() || null
      };
      processJsonString(JSON.stringify(parsed));
    } catch {
      // Nếu JSON lỗi, truyền thẳng chuỗi gốc để ingestion validator bắt và báo lỗi JSON invalid.
      processJsonString(jsonStr);
    }
  };

  const renderContent = () => {
    if (status === 'success' && importedPaperId) {
      return (
        <ExamJsonImportSuccessCard 
          paperId={importedPaperId}
          paperTitle={importedPaperTitle}
          onReset={reset}
          onNavigateDetail={() => navigate(`/exams/${importedPaperId}`)}
          onNavigateLibrary={() => navigate('/exams')}
        />
      );
    }

    const isProcessing = status === 'validating' || status === 'importing';

    return (
      <div className="space-y-6">
        <ExamJsonImportReviewOnlyNotice />
        <ExamJsonImportGuide onOpenPromptModal={() => setIsPromptModalOpen(true)} />
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
          <ExamVisibilityField 
            value={visibility} 
            onChange={setVisibility} 
            disabled={isProcessing}
          />
          
          <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />
          
          <ExamListeningMediaField 
            type={mediaType}
            url={mediaUrl}
            onTypeChange={setMediaType}
            onUrlChange={setMediaUrl}
            disabled={isProcessing}
          />
        </div>

        <ExamJsonImportValidationSummary errors={validationErrors} />
        
        <ExamJsonImportPastePanel 
          onImport={handleImport}
          isLoading={isProcessing}
          error={error}
        />
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto w-full animate-fade-in pb-24">
      <button 
        onClick={() => navigate('/exams')} 
        className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 mb-6 flex items-center transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại thư viện
      </button>

      <ImportExamHero />

      {renderContent()}

      <ExamJsonImportPromptModal 
        isOpen={isPromptModalOpen} 
        onClose={() => setIsPromptModalOpen(false)} 
      />
    </div>
  );
}