import React, { useState } from 'react';
import { VocabularyItem, VocabularyContext } from '../../types/models';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

// Mở rộng Payload để bao gồm contexts theo chuẩn đã sửa ở EditService
export type EditVocabularyPayload = Partial<Omit<VocabularyItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
  contexts?: Partial<VocabularyContext>[];
};

interface EditWordFormProps {
  initialData: VocabularyItem;
  initialContexts?: VocabularyContext[]; // KHÔI PHỤC CONTRACT: Nhận thêm mảng ngữ cảnh
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
  });

  // 2. STATE NGỮ CẢNH (Lấy context đầu tiên làm đại diện để chỉnh sửa)
  const primaryContext = initialContexts && initialContexts.length > 0 ? initialContexts[0] : null;
  const [contextData, setContextData] = useState({
    id: primaryContext?.id || '',
    context_name: primaryContext?.context_name || '',
    context_type: primaryContext?.context_type || 'sentence',
    context_note: primaryContext?.context_note || '',
    // Chuyển ISO string sang định dạng YYYY-MM-DD để dùng cho input type="date"
    learned_at: primaryContext?.learned_at 
      ? new Date(primaryContext.learned_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const payload: EditVocabularyPayload = {
      hanzi: formData.hanzi.normalize('NFC').trim(),
      meaning_vi: formData.meaning_vi.normalize('NFC').trim(),
      status: formData.status as any,
      pinyin: normalizeField(formData.pinyin),
      han_viet: normalizeField(formData.han_viet),
      note: normalizeField(formData.note),
      example: normalizeField(formData.example),
      hsk_level: formData.hsk_level ? (parseInt(formData.hsk_level, 10) as any) : (null as any),
      tags: (tagsArray.length > 0 ? tagsArray : null) as any,
      
      // XÂY DỰNG LẠI CONTEXT PAYLOAD
      contexts: contextData.context_name.trim() ? [{
        id: contextData.id || undefined, // Để trống nếu là context mới thêm
        context_name: contextData.context_name.normalize('NFC').trim(),
        context_type: contextData.context_type as any,
        context_note: contextData.context_note.normalize('NFC').trim(),
        learned_at: new Date(contextData.learned_at).toISOString(), // Parse ngược lại ISO cho CSDL
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái học</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow">
            <option value="new">Từ mới (New)</option>
            <option value="learning">Đang học (Learning)</option>
            <option value="reviewing">Cần ôn tập (Reviewing)</option>
            <option value="mastered">Đã thuộc (Mastered)</option>
          </select>
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cấp độ HSK</label>
          <select name="hsk_level" value={formData.hsk_level} onChange={handleChange} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow">
            <option value="">Chưa phân loại</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
              <option key={level} value={level}>HSK {level}</option>
            ))}
          </select>
        </div>
      </div>

      <Textarea label="Ghi chú (Note)" name="note" value={formData.note} onChange={handleChange} rows={2} />
      <Textarea label="Ví dụ từ điển (Example)" name="example" value={formData.example} onChange={handleChange} rows={3} />
      <Input label="Nhãn (Tags)" name="tagsStr" value={formData.tagsStr} onChange={handleChange} placeholder="Cách nhau bằng dấu phẩy" />

      {/* KHU VỰC KHÔI PHỤC: NGỮ CẢNH GỐC */}
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