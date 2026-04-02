import React, { useState } from 'react';
import { VocabularyItem } from '../../types/models';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export type EditVocabularyPayload = Partial<Omit<VocabularyItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

interface EditWordFormProps {
  initialData: VocabularyItem;
  onSubmit: (data: EditVocabularyPayload) => Promise<boolean>;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export const EditWordForm: React.FC<EditWordFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  onDelete,
}) => {
  const initialTagsStr = initialData.tags ? initialData.tags.join(', ') : '';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: EditVocabularyPayload = {
      hanzi: formData.hanzi.trim(),
      meaning_vi: formData.meaning_vi.trim(),
      status: formData.status as any,
      
      // FIX TYPESCRIPT: Ép kiểu as any cho toàn bộ các trường truyền null để xóa dữ liệu
      // Việc này giúp thỏa mãn TypeScript mà vẫn gửi được lệnh xóa (null) xuống Supabase
      pinyin: (formData.pinyin.trim() || null) as any,
      han_viet: (formData.han_viet.trim() || null) as any,
      note: (formData.note.trim() || null) as any,
      example: (formData.example.trim() || null) as any,
      hsk_level: formData.hsk_level ? (parseInt(formData.hsk_level, 10) as any) : (null as any),
      tags: (tagsArray.length > 0 ? tagsArray : null) as any,
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

      <Textarea label="Ghi chú" name="note" value={formData.note} onChange={handleChange} rows={2} />
      <Textarea label="Ví dụ" name="example" value={formData.example} onChange={handleChange} rows={3} />
      <Input label="Nhãn (Tags)" name="tagsStr" value={formData.tagsStr} onChange={handleChange} placeholder="Cách nhau bằng dấu phẩy" />

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