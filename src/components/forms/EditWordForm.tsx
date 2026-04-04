// filepath: src/components/forms/EditWordForm.tsx
import React, { useState } from 'react';
import { VocabularyItem, VocabularyContext } from '../../types/models';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { VocabularyMetadataFields } from './VocabularyMetadataFields';

export type EditVocabularyPayload = Partial<Omit<VocabularyItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
  contexts?: Partial<VocabularyContext>[];
};

interface EditWordFormProps {
  initialData: VocabularyItem;
  initialContexts?: VocabularyContext[];
  onSubmit: (data: EditVocabularyPayload) => Promise<boolean>;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export const EditWordForm: React.FC<EditWordFormProps> = ({
  initialData,
  initialContexts,
  onSubmit,
  isSubmitting,
  onCancel,
  onDelete,
}) => {
  const initialTagsStr = initialData.tags ? initialData.tags.join(', ') : '';

  // 1. STATE TỪ VỰNG
  const [formData, setFormData] = useState({
    hanzi: initialData.hanzi || '',
    pinyin: initialData.pinyin || '',
    han_viet: initialData.han_viet || '',
    meaning_vi: initialData.meaning_vi || '',
    note: initialData.note || '',
    example: initialData.example || '',
    status: initialData.status || 'new',
    hsk_level: initialData.hsk_level ? String(initialData.hsk_level) : '',
    tagsStr: initialTagsStr,
    // V2 Fields
    hsk20_level: initialData.hsk20_level ? String(initialData.hsk20_level) : '',
    hsk30_band: initialData.hsk30_band ? String(initialData.hsk30_band) : '',
    hsk30_level: initialData.hsk30_level ? String(initialData.hsk30_level) : '',
    source_scope: initialData.source_scope || 'private',
    preferred_audio_provider: initialData.preferred_audio_provider || '',
    has_context_audio: Boolean(initialData.has_context_audio),
  });

  // 2. STATE NGỮ CẢNH
  const primaryContext = initialContexts && initialContexts.length > 0 ? initialContexts[0] : null;
  const [contextData, setContextData] = useState({
    id: primaryContext?.id || '',
    context_name: primaryContext?.context_name || '',
    context_type: primaryContext?.context_type || 'sentence',
    context_note: primaryContext?.context_note || '',
    learned_at: primaryContext?.learned_at 
      ? new Date(primaryContext.learned_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Xử lý boolean từ VocabularyMetadataFields truyền lên
    const finalValue = typeof value === 'boolean' ? value : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContextData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tagsStr
      .split(',')
      .map(t => t.normalize('NFC').trim())
      .filter(t => t.length > 0);

    const normalizeField = (val: string) => (val.normalize('NFC').trim() || null) as any;
    const parseIntSafe = (val: string) => val ? parseInt(val, 10) : null;

    const payload: EditVocabularyPayload = {
      hanzi: formData.hanzi.normalize('NFC').trim(),
      meaning_vi: formData.meaning_vi.normalize('NFC').trim(),
      status: formData.status as any,
      pinyin: normalizeField(formData.pinyin),
      han_viet: normalizeField(formData.han_viet),
      note: normalizeField(formData.note),
      example: normalizeField(formData.example),
      hsk_level: parseIntSafe(formData.hsk_level) as any,
      tags: (tagsArray.length > 0 ? tagsArray : null) as any,
      
      // V2 Map
      hsk20_level: parseIntSafe(formData.hsk20_level) as any,
      hsk30_band: parseIntSafe(formData.hsk30_band) as any,
      hsk30_level: parseIntSafe(formData.hsk30_level) as any,
      source_scope: formData.source_scope as any,
      preferred_audio_provider: formData.preferred_audio_provider || null,
      has_context_audio: formData.has_context_audio,
      
      contexts: contextData.context_name.trim() ? [{
        id: contextData.id || undefined,
        context_name: contextData.context_name.normalize('NFC').trim(),
        context_type: contextData.context_type as any,
        context_note: contextData.context_note.normalize('NFC').trim(),
        learned_at: new Date(contextData.learned_at).toISOString(),
      }] : [],
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Chữ Hán (Hanzi) *" name="hanzi" value={formData.hanzi} onChange={handleChange} required />
        <Input label="Pinyin" name="pinyin" value={formData.pinyin} onChange={handleChange} />
        <Input label="Nghĩa tiếng Việt *" name="meaning_vi" value={formData.meaning_vi} onChange={handleChange} required />
        <Input label="Âm Hán Việt" name="han_viet" value={formData.han_viet} onChange={handleChange} />
      </div>

      <div className="space-y-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái học</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full md:w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow">
          <option value="new">Từ mới (New)</option>
          <option value="learning">Đang học (Learning)</option>
          <option value="reviewing">Cần ôn tập (Reviewing)</option>
          <option value="mastered">Đã thuộc (Mastered)</option>
        </select>
      </div>

      <Textarea label="Ghi chú (Note)" name="note" value={formData.note} onChange={handleChange} rows={2} />
      <Textarea label="Ví dụ từ điển (Example)" name="example" value={formData.example} onChange={handleChange} rows={3} />
      <Input label="Nhãn (Tags)" name="tagsStr" value={formData.tagsStr} onChange={handleChange} placeholder="Cách nhau bằng dấu phẩy" />

      {/* NHÚNG COMPONENT METADATA V2 VÀO ĐÂY */}
      <VocabularyMetadataFields 
        formData={formData} 
        onChange={handleChange} 
        disabled={isSubmitting} 
      />

      {/* KHU VỰC NGỮ CẢNH */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ngữ cảnh gốc (Context)</h3>
        
        <div className="space-y-6">
          <Textarea 
            label="Nội dung ngữ cảnh / Câu chứa từ" 
            name="context_name" 
            value={contextData.context_name} 
            onChange={handleContextChange} 
            rows={3} 
            placeholder="Ngữ cảnh bạn đã bắt gặp từ này..." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nguồn / Thể loại</label>
              <select 
                name="context_type" 
                value={contextData.context_type} 
                onChange={handleContextChange} 
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              >
                <option value="sentence">Câu (Sentence)</option>
                <option value="paragraph">Đoạn văn (Paragraph)</option>
                <option value="video">Video</option>
                <option value="conversation">Hội thoại (Conversation)</option>
                <option value="article">Bài viết (Article)</option>
                <option value="book">Sách (Book)</option>
                <option value="audio">Audio</option>
                <option value="other">Khác (Other)</option>
              </select>
            </div>

            <Input 
              type="date"
              label="Ngày học" 
              name="learned_at" 
              value={contextData.learned_at} 
              onChange={handleContextChange} 
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
        <Button 
          type="button" 
          onClick={onDelete} 
          disabled={isSubmitting}
          className="!bg-red-50 dark:!bg-red-900/20 !text-red-600 dark:!text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/40 !border-red-200 dark:!border-red-800"
        >
          Xóa từ này
        </Button>
        <div className="flex space-x-3 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Hủy bỏ</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>
    </form>
  );
};