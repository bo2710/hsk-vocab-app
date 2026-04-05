// filepath: src/components/publicVocabulary/PublicVocabularyContributionForm.tsx
// CẦN CHỈNH SỬA
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ContributionFormData } from '../../features/publicVocabulary/types';
import { PublicVocabularyValidationSummary } from './PublicVocabularyValidationSummary';

interface ContributionFormProps {
  onSubmit: (data: ContributionFormData) => Promise<boolean>;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
  onCancel: () => void;
}

const initialForm: ContributionFormData = {
  hanzi: '',
  pinyin: '',
  meaning_vi: '',
  han_viet: '',
  note: '',
  example: '',
  example_translation_vi: '',
  hsk20_level: '',
  hsk30_band: '',
  hsk30_level: '',
  tags: '',
};

export const PublicVocabularyContributionForm: React.FC<ContributionFormProps> = ({
  onSubmit,
  isSubmitting,
  validationErrors,
  onCancel
}) => {
  const [formData, setFormData] = useState<ContributionFormData>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm border border-blue-100 dark:border-blue-800 mb-4">
        <strong>Lưu ý:</strong> Từ vựng bạn đóng góp sẽ được chuyển vào trạng thái <strong>Chờ duyệt (Pending)</strong> để đảm bảo chất lượng từ điển cộng đồng.
      </div>

      <PublicVocabularyValidationSummary errors={validationErrors} />

      <div className="space-y-4">
        <div>
          <Input 
            label="Chữ Hán (Hanzi) *" 
            name="hanzi" 
            placeholder="Ví dụ: 学习"
            value={formData.hanzi} 
            onChange={handleChange} 
            disabled={isSubmitting} 
          />
          {validationErrors.hanzi && <p className="text-sm text-red-500 mt-1">{validationErrors.hanzi}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input 
              label="Pinyin *" 
              name="pinyin" 
              placeholder="xué xí"
              value={formData.pinyin} 
              onChange={handleChange} 
              disabled={isSubmitting} 
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
              disabled={isSubmitting} 
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
            disabled={isSubmitting} 
          />
          {validationErrors.meaning_vi && <p className="text-sm text-red-500 mt-1">{validationErrors.meaning_vi}</p>}
        </div>

        {/* BỔ SUNG TRƯỜNG NHẬP NGỮ CẢNH/VÍ DỤ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Textarea 
              label="Ví dụ / Ngữ cảnh" 
              name="example" 
              rows={2}
              placeholder="Ví dụ chứa từ vựng (Tiếng Trung)"
              value={formData.example} 
              onChange={handleChange} 
              disabled={isSubmitting} 
            />
          </div>
          <div>
            <Textarea 
              label="Dịch nghĩa ví dụ" 
              name="example_translation_vi" 
              rows={2}
              placeholder="Bản dịch của ví dụ"
              value={formData.example_translation_vi} 
              onChange={handleChange} 
              disabled={isSubmitting} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
          <div className="space-y-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 2.0</label>
            <select name="hsk20_level" value={formData.hsk20_level} onChange={handleChange} disabled={isSubmitting} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Không</option>
              {[1,2,3,4,5,6].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>
          <div className="space-y-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 3.0 Band</label>
            <select name="hsk30_band" value={formData.hsk30_band} onChange={handleChange} disabled={isSubmitting} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Không</option>
              <option value="1">Sơ cấp (1-3)</option>
              <option value="2">Trung cấp (4-6)</option>
              <option value="3">Cao cấp (7-9)</option>
            </select>
          </div>
          <div className="space-y-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 3.0 Level</label>
            <select name="hsk30_level" value={formData.hsk30_level} onChange={handleChange} disabled={isSubmitting} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Không</option>
              {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Textarea 
            label="Ghi chú (Tùy chọn)" 
            name="note" 
            rows={2}
            value={formData.note} 
            onChange={handleChange} 
            disabled={isSubmitting} 
          />
        </div>

        <div>
          <Input 
            label="Nhãn (Tags)" 
            name="tags" 
            placeholder="Cách nhau bằng dấu phẩy. VD: noun, verb..."
            value={formData.tags} 
            onChange={handleChange} 
            disabled={isSubmitting} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi đóng góp'}
        </Button>
      </div>
    </form>
  );
};