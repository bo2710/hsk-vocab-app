import React, { useState, useEffect } from 'react';
import { VocabularyContext } from '../../types/models';
import { contextService } from '../../features/contexts/services/contextService';
import { InlineAudioPlayer } from '../audio';
import { useAudioPreferences } from '../../features/audio/hooks/useAudioPreferences';
import { useAudioPlayback } from '../../features/audio/hooks/useAudioPlayback';

// BẢN ĐỒ DỊCH TỪ TYPE TIẾNG ANH SANG TIẾNG VIỆT
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

interface WordDetailContextsProps {
  contexts: VocabularyContext[];
}

export const WordDetailContexts: React.FC<WordDetailContextsProps> = ({ contexts: initialContexts }) => {
  const [localContexts, setLocalContexts] = useState<VocabularyContext[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<VocabularyContext>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-play settings
  const { settings } = useAudioPreferences();
  const { playContext } = useAudioPlayback();
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  useEffect(() => {
    setLocalContexts(initialContexts);
  }, [initialContexts]);

  // Hỗ trợ tự động phát âm ngữ cảnh đầu tiên nếu cấu hình Settings bật
  useEffect(() => {
    if (settings.auto_play_context_audio && localContexts.length > 0 && !hasAutoPlayed) {
      setHasAutoPlayed(true);
      const timer = setTimeout(() => {
        playContext({
          text: localContexts[0].context_name,
          context_id: localContexts[0].id,
          audio_text_override: localContexts[0].audio_text_override
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [settings.auto_play_context_audio, localContexts, hasAutoPlayed, playContext]);

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
    if (!editingId || !editData.vocabulary_id) {
      alert('Không tìm thấy thông tin định danh của từ. Vui lòng tải lại trang.');
      return;
    }

    setIsProcessing(true);
    
    const payload = {
      context_name: (editData.context_name || '').normalize('NFC').trim(),
      context_type: editData.context_type || 'sentence',
      context_note: (editData.context_note || '').normalize('NFC').trim(),
      learned_at: editData.learned_at || new Date().toISOString()
    };

    const result = await contextService.editContext(editingId, editData.vocabulary_id, payload);
    
    if (result.status === 'success' && result.data) {
      setLocalContexts(prev => prev.map(c => c.id === editingId ? result.data! : c));
      setEditingId(null);
    } else {
      alert('Đã xảy ra lỗi khi lưu ngữ cảnh. Vui lòng kiểm tra lại kết nối mạng.');
    }
    setIsProcessing(false);
  };

  if (!localContexts || localContexts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center mt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ngữ cảnh sử dụng</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Từ vựng này chưa được liên kết với ngữ cảnh (văn bản, video, hội thoại) nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ngữ cảnh sử dụng ({localContexts.length})</h3>
      
      <div className="space-y-4">
        {localContexts.map((ctx) => (
          <div key={ctx.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            
            {editingId === ctx.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nội dung ngữ cảnh</label>
                  <textarea 
                    value={editData.context_name} 
                    onChange={e => setEditData({...editData, context_name: e.target.value})}
                    className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Nhập nội dung ngữ cảnh..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nguồn / Thể loại</label>
                    <select 
                      value={editData.context_type || 'sentence'} 
                      onChange={e => setEditData({...editData, context_type: e.target.value as VocabularyContext['context_type']})}
                      className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày học</label>
                    <input 
                      type="date"
                      value={editData.learned_at ? new Date(editData.learned_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                      onChange={e => {
                        const newDate = new Date(e.target.value).toISOString();
                        setEditData({...editData, learned_at: newDate});
                      }}
                      className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ghi chú</label>
                  <input 
                    type="text"
                    value={editData.context_note || ''} 
                    onChange={e => setEditData({...editData, context_note: e.target.value})}
                    className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ghi chú thêm về ngữ cảnh..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setEditingId(null)} disabled={isProcessing} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Hủy</button>
                  <button onClick={handleSaveEdit} disabled={isProcessing} className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">Lưu lại</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <div className="flex items-start gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed break-words">{ctx.context_name}</h4>
                    <InlineAudioPlayer 
                      type="context" 
                      request={{ text: ctx.context_name, context_id: ctx.id, audio_text_override: ctx.audio_text_override }} 
                      size="sm" 
                      className="mt-0.5 shrink-0" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                    {ctx.context_type && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium whitespace-nowrap">
                        {CONTEXT_TYPE_LABELS[ctx.context_type] || ctx.context_type}
                      </span>
                    )}
                    <div className="flex gap-1 ml-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 p-0.5">
                      <button onClick={() => handleEditClick(ctx)} className="p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Chỉnh sửa ngữ cảnh">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <div className="w-px bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
                      <button onClick={() => handleDelete(ctx.id)} className="p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Xóa ngữ cảnh">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {ctx.context_note && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm italic border-l-[3px] border-primary-300 dark:border-primary-700 pl-3 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded-r-md">
                    {ctx.context_note}
                  </p>
                )}
                
                {ctx.learned_at && (
                  <p className="text-gray-500 dark:text-gray-400 mt-4 text-xs flex items-center font-medium">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Đã học ngày: {new Date(ctx.learned_at).toLocaleDateString('vi-VN')}
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