import React, { useState, memo } from 'react';
import { VocabularyContext } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { CONTEXT_TYPES } from '../../lib/constants';
import { useEditContext, useDeleteContext, EditContextFormData } from '../../features/contexts';
import { InlineAudioPlayer } from '../audio';

interface ContextItemProps {
  context: VocabularyContext;
  onUpdated: (updated: VocabularyContext) => void;
  onDeleted: (id: string) => void;
}

const ContextItemComponent: React.FC<ContextItemProps> = ({ context, onUpdated, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { submitEdit, isLoading: isEditingLoading, error: editError, validationErrors } = useEditContext();
  const { remove, isLoading: isDeletingLoading, error: deleteError } = useDeleteContext();

  const [formData, setFormData] = useState<EditContextFormData>({
    context_name: context.context_name,
    context_type: context.context_type,
    learned_at: context.learned_at ? context.learned_at.split('T')[0] : '',
    context_note: context.context_note || '',
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updatedContext = await submitEdit(context.id, context.vocabulary_id, formData);
    if (updatedContext) {
      setIsEditing(false);
      onUpdated(updatedContext);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Khôi phục form data về giá trị gốc
    setFormData({
      context_name: context.context_name,
      context_type: context.context_type,
      learned_at: context.learned_at ? context.learned_at.split('T')[0] : '',
      context_note: context.context_note || '',
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngữ cảnh này? Hành động này không thể hoàn tác.')) {
      const success = await remove(context.id);
      if (success) {
        onDeleted(context.id);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-primary-200 dark:border-primary-900/30 space-y-3">
        {editError && <p className="text-sm text-red-500">{editError}</p>}
        
        <div>
          <Textarea 
            name="context_name" 
            value={formData.context_name} 
            onChange={handleEditChange}
            placeholder="Nội dung ngữ cảnh..."
            rows={2}
            disabled={isEditingLoading}
          />
          {validationErrors.context_name && <p className="text-xs text-red-500 mt-1">{validationErrors.context_name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <select 
              name="context_type" 
              value={formData.context_type} 
              onChange={handleEditChange} 
              disabled={isEditingLoading}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {CONTEXT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {validationErrors.context_type && <p className="text-xs text-red-500 mt-1">{validationErrors.context_type}</p>}
          </div>
          <div>
            <Input 
              type="date" 
              name="learned_at" 
              value={formData.learned_at} 
              onChange={handleEditChange} 
              disabled={isEditingLoading} 
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <Input 
            name="context_note" 
            value={formData.context_note || ''} 
            onChange={handleEditChange}
            placeholder="Ghi chú thêm (không bắt buộc)"
            disabled={isEditingLoading}
            className="text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={handleCancel} disabled={isEditingLoading}>
            Hủy
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isEditingLoading}>
            {isEditingLoading ? 'Đang lưu...' : 'Lưu lại'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
      {deleteError && <p className="text-sm text-red-500 mb-2">{deleteError}</p>}
      
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-start gap-2">
            <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
              {context.context_name}
            </p>
            <InlineAudioPlayer 
              type="context" 
              request={{ text: context.context_name, context_id: context.id, audio_text_override: context.audio_text_override }} 
              size="sm" 
              className="mt-0.5 shrink-0" 
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md uppercase tracking-wider font-semibold">
              {context.context_type}
            </span>
            <span>•</span>
            <span>{new Date(context.learned_at).toLocaleDateString('vi-VN')}</span>
          </div>
          {context.context_note && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic border-l-2 border-gray-200 dark:border-gray-700 pl-2">
              {context.context_note}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} disabled={isDeletingLoading} className="px-2 py-1">
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeletingLoading} className="px-2 py-1">
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ContextItem = memo(ContextItemComponent, (prevProps, nextProps) => {
  return prevProps.context.id === nextProps.context.id && 
         prevProps.context.updated_at === nextProps.context.updated_at;
});