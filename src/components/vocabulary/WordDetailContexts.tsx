import React, { useState, useEffect } from 'react';
import { VocabularyContext } from '../../types/models';
import { contextService } from '../../features/contexts/services/contextService';

interface WordDetailContextsProps {
  contexts: VocabularyContext[];
}

export const WordDetailContexts: React.FC<WordDetailContextsProps> = ({ contexts: initialContexts }) => {
  const [localContexts, setLocalContexts] = useState<VocabularyContext[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<VocabularyContext>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Đồng bộ hóa nếu prop từ component cha thay đổi
  useEffect(() => {
    setLocalContexts(initialContexts);
  }, [initialContexts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ngữ cảnh này?')) return;
    setIsProcessing(true);
    const result = await contextService.removeContext(id);
    if (result.status === 'success') {
      setLocalContexts(prev => prev.filter(c => c.id !== id));
    } else {
      alert('Đã xảy ra lỗi khi xóa ngữ cảnh.');
    }
    setIsProcessing(false);
  };

  const handleEditClick = (ctx: VocabularyContext) => {
    setEditingId(ctx.id);
    setEditData(ctx);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData.vocabulary_id) return;
    setIsProcessing(true);
    
    const payload = {
      context_name: editData.context_name || '',
      context_type: editData.context_type || 'sentence',
      context_note: editData.context_note || '',
      learned_at: editData.learned_at || new Date().toISOString()
    };

    const result = await contextService.editContext(editingId, editData.vocabulary_id, payload);
    
    if (result.status === 'success' && result.data) {
      setLocalContexts(prev => prev.map(c => c.id === editingId ? result.data! : c));
      setEditingId(null);
    } else {
      alert('Đã xảy ra lỗi khi lưu ngữ cảnh. Vui lòng kiểm tra lại.');
    }
    setIsProcessing(false);
  };

  if (!localContexts || localContexts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ngữ cảnh sử dụng</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Từ vựng này chưa được liên kết với ngữ cảnh (văn bản, video, hội thoại) nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ngữ cảnh sử dụng ({localContexts.length})</h3>
      
      <div className="space-y-4">
        {localContexts.map((ctx) => (
          <div key={ctx.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            
            {editingId === ctx.id ? (
              /* GIAO DIỆN CHỈNH SỬA */
              <div className="space-y-3">
                <textarea 
                  value={editData.context_name} 
                  onChange={e => setEditData({...editData, context_name: e.target.value})}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="Nội dung ngữ cảnh..."
                />
                <input 
                  type="text"
                  value={editData.context_note || ''} 
                  onChange={e => setEditData({...editData, context_note: e.target.value})}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ghi chú ngữ cảnh..."
                />
                <div className="flex gap-2">
                  <select 
                    value={editData.context_type || 'sentence'} 
                    /* FIX LỖI TYPESCRIPT: Ép kiểu as VocabularyContext['context_type'] */
                    onChange={e => setEditData({...editData, context_type: e.target.value as VocabularyContext['context_type']})}
                    className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} disabled={isProcessing} className="px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">Hủy</button>
                  <button onClick={handleSaveEdit} disabled={isProcessing} className="px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Lưu</button>
                </div>
              </div>
            ) : (
              /* GIAO DIỆN XEM */
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base">{ctx.context_name}</h4>
                  <div className="flex items-center gap-2">
                    {ctx.context_type && (
                      <span className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs font-medium whitespace-nowrap">
                        {ctx.context_type}
                      </span>
                    )}
                    {/* NÚT ACTION */}
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => handleEditClick(ctx)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors" title="Sửa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(ctx.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Xóa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {ctx.context_note && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm italic border-l-2 border-blue-200 dark:border-blue-800 pl-3 py-1">
                    "{ctx.context_note}"
                  </p>
                )}
                
                {ctx.learned_at && (
                  <p className="text-gray-400 dark:text-gray-500 mt-3 text-xs flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Đã học vào: {new Date(ctx.learned_at).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};