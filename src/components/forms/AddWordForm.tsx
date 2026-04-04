// filepath: src/components/forms/AddWordForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAddVocabulary } from '../../features/vocabulary/hooks/useAddVocabulary';
import { AddVocabularyFormData } from '../../features/vocabulary/types';
import { CONTEXT_TYPES } from '../../lib/constants';
import { VocabularyMetadataFields } from './VocabularyMetadataFields';

// BẢN ĐỒ DỊCH TỪ TYPE TIẾNG ANH SANG TIẾNG VIỆT ĐỂ CHỌN THỂ LOẠI
const CONTEXT_TYPE_LABELS: Record<string, string> = {
  sentence: 'Câu (Sentence)',
  paragraph: 'Đoạn văn (Paragraph)',
  video: 'Video',
  conversation: 'Hội thoại (Conversation)',
  article: 'Bài viết (Article)',
  book: 'Sách (Book)',
  audio: 'Audio',
  other: 'Khác (Other)'
};

const initialFormState: AddVocabularyFormData & { 
  preferred_audio_provider?: string; 
  has_context_audio?: boolean; 
} = {
  hanzi: '',
  pinyin: '',
  han_viet: '',
  meaning_vi: '',
  note: '',
  example: '',
  context_name: '',
  context_type: 'sentence',
  learned_at: new Date().toISOString().split('T')[0],
  hsk_level: undefined,
  hsk20_level: undefined,
  hsk30_band: undefined,
  hsk30_level: undefined,
  source_scope: 'private',
  preferred_audio_provider: '',
  has_context_audio: false,
};

export const AddWordForm: React.FC = () => {
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  
  const { 
    submit, 
    submitContextToExisting,
    isLoading, 
    error, 
    validationErrors, 
    isSuccess, 
    resetState,
    duplicateData,
    isDuplicateMode,
    clearDuplicateState
  } = useAddVocabulary();

  let parsedDupData = duplicateData;
  if (duplicateData && duplicateData.id && duplicateData.id.startsWith('{')) {
      try {
          parsedDupData = JSON.parse(duplicateData.id);
      } catch(e) { /* ignore */ }
  }

  // Tự động đóng form sau 1.5s nếu thêm context thành công
  useEffect(() => {
    if (isSuccess && isDuplicateMode) {
       const timer = setTimeout(() => {
           clearDuplicateState();
       }, 1500);
       return () => clearTimeout(timer);
    }
  }, [isSuccess, isDuplicateMode, clearDuplicateState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue: any = value;
    // Xử lý type cast cho số
    if (['hsk_level', 'hsk20_level', 'hsk30_band', 'hsk30_level'].includes(name)) {
      processedValue = value ? Number(value) : undefined;
    }
    // Type checkbox override được xử lý ở wrapper component gửi value là boolean
    if (typeof value === 'boolean') {
      processedValue = value;
    }

    setFormData(prev => ({ 
      ...prev, 
      [name]: processedValue 
    }));
    
    if (isSuccess || error) resetState();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submit(formData as AddVocabularyFormData);
    if (success) {
      setFormData(initialFormState); 
    }
  };

  const handleAddContextToExisting = async () => {
    const success = await submitContextToExisting(formData as AddVocabularyFormData);
    if (success) {
      setFormData(initialFormState);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && !isDuplicateMode && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        {isSuccess && !isDuplicateMode && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-lg border border-green-200 dark:border-green-800">
            Lưu dữ liệu thành công! Bạn có thể tiếp tục thêm từ mới.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Input 
              label="Chữ Hán (Hanzi) *" 
              name="hanzi" 
              placeholder="Ví dụ: 学习"
              value={formData.hanzi} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
            {validationErrors.hanzi && <p className="text-sm text-red-500 mt-1">{validationErrors.hanzi}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input 
                label="Pinyin" 
                name="pinyin" 
                placeholder="xué xí"
                value={formData.pinyin} 
                onChange={handleChange} 
                disabled={isLoading} 
              />
              {validationErrors.pinyin && <p className="text-sm text-red-500 mt-1">{validationErrors.pinyin}</p>}
            </div>
            <div>
              <Input 
                label="Hán Việt" 
                name="han_viet" 
                placeholder="Học tập"
                value={formData.han_viet} 
                onChange={handleChange} 
                disabled={isLoading} 
              />
            </div>
          </div>

          <div>
            <Input 
              label="Nghĩa tiếng Việt *" 
              name="meaning_vi" 
              placeholder="Học, học tập"
              value={formData.meaning_vi} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
            {validationErrors.meaning_vi && <p className="text-sm text-red-500 mt-1">{validationErrors.meaning_vi}</p>}
          </div>

          <div>
            <Textarea 
              label="Ghi chú (Note)" 
              name="note" 
              rows={2}
              placeholder="Mẹo nhớ từ, cách dùng..."
              value={formData.note} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
          </div>
          
          <div>
            <Textarea 
              label="Ví dụ từ điển (Example)" 
              name="example" 
              rows={2}
              placeholder="Ví dụ mẫu không gắn với ngữ cảnh học..."
              value={formData.example} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
          </div>
        </div>

        {/* NHÚNG COMPONENT METADATA V2 VÀO ĐÂY */}
        <VocabularyMetadataFields 
          formData={formData} 
          onChange={handleChange} 
          disabled={isLoading} 
        />

        <hr className="my-6 border-gray-200 dark:border-gray-800" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ngữ cảnh gốc (Context)</h3>
          
          <div>
            <Textarea 
              label="Nội dung ngữ cảnh / Câu chứa từ *" 
              name="context_name" 
              rows={3}
              placeholder="Ngữ cảnh bạn đã bắt gặp từ này..."
              value={formData.context_name} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
            {validationErrors.context_name && !isDuplicateMode && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.context_name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                Nguồn / Thể loại
              </label>
              <select 
                name="context_type" 
                value={formData.context_type} 
                onChange={handleChange} 
                disabled={isLoading} 
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 transition-shadow"
              >
                {CONTEXT_TYPES.map(type => (
                  <option key={type} value={type} className="dark:bg-gray-900">
                    {CONTEXT_TYPE_LABELS[type] || type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input 
                type="date" 
                label="Ngày học" 
                name="learned_at" 
                value={formData.learned_at} 
                onChange={handleChange} 
                disabled={isLoading} 
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? 'Đang lưu từ vựng...' : 'Lưu từ vựng'}
        </Button>
      </form>

      <Modal
        isOpen={isDuplicateMode}
        title="Từ vựng đã tồn tại"
        onClose={clearDuplicateState}
        actions={
          <>
            <Button variant="secondary" onClick={clearDuplicateState} disabled={isLoading}>
              Hủy bỏ / Quay lại
            </Button>
            <Button variant="primary" onClick={handleAddContextToExisting} disabled={isLoading || isSuccess}>
              {isLoading ? 'Đang lưu...' : 'Thêm ngữ cảnh vào từ này'}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-gray-700 dark:text-gray-300">Từ vựng bạn vừa nhập đã có sẵn trong kho lưu trữ của bạn:</p>
        
        {parsedDupData && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 relative">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{parsedDupData.hanzi}</p>
            <p className="text-primary-600 dark:text-primary-500 font-medium mt-1">{parsedDupData.pinyin}</p>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Nghĩa:</span> {parsedDupData.meaning_vi || 'Đang tải...'}
            </p>
            <p className="absolute top-4 right-4 text-xs font-semibold text-gray-500">Đã gặp: {parsedDupData.encounter_count || 0} lần</p>
          </div>
        )}

        {isSuccess ? (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-lg border border-green-200 dark:border-green-800 font-medium">
            ✅ Đã lưu ngữ cảnh mới thành công!
          </div>
        ) : (
          <p className="font-medium text-gray-900 dark:text-gray-100">Bạn có muốn thêm ngữ cảnh vừa nhập vào từ vựng này không?</p>
        )}
        
        {validationErrors.context_name && (
          <p className="text-sm text-red-500 mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900">
            {validationErrors.context_name}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
};