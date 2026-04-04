// filepath: src/components/exams/ExamPaperSettingsModal.tsx
// CẦN CHỈNH SỬA
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ExamPaper, ExamOwnerScope, ExamListeningMediaType } from '../../features/exams/types';
import { useEditExamPaper } from '../../features/exams/hooks/useEditExamPaper';
import { examPaperService } from '../../features/exams/services/examPaperService';
import { ExamListeningMediaField } from './ExamListeningMediaField';
import { ExamVisibilityField } from './ExamVisibilityField';

interface ExamPaperSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: ExamPaper;
  onSuccess: () => void;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export const ExamPaperSettingsModal: React.FC<ExamPaperSettingsModalProps> = ({ 
  isOpen, onClose, paper, onSuccess, isAdmin = false, isOwner = false 
}) => {
  const navigate = useNavigate();
  const { updatePaper, deletePaper, isSaving, isDeleting, error, validationErrors } = useEditExamPaper();
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const [title, setTitle] = useState(paper.title || '');
  const [examLevel, setExamLevel] = useState<number | ''>(paper.exam_level ?? '');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    paper.total_duration_seconds ? Math.round(paper.total_duration_seconds / 60) : ''
  );
  const [ownerScope, setOwnerScope] = useState<ExamOwnerScope>(paper.owner_scope);
  const [mediaType, setMediaType] = useState<ExamListeningMediaType>(paper.listening_media_type);
  const [mediaUrl, setMediaUrl] = useState(paper.listening_media_url || '');

  // Xác định quyền hạn thực tế
  const canDirectEdit = isAdmin || isOwner;
  const isPublic = paper.owner_scope === 'system';

  useEffect(() => {
    if (isOpen) {
      setTitle(paper.title || '');
      setExamLevel(paper.exam_level ?? '');
      setDurationMinutes(paper.total_duration_seconds ? Math.round(paper.total_duration_seconds / 60) : '');
      setOwnerScope(paper.owner_scope);
      setMediaType(paper.listening_media_type);
      setMediaUrl(paper.listening_media_url || '');
    }
  }, [isOpen, paper]);

  const handleSave = async () => {
    const payload = {
      title,
      exam_level: examLevel === '' ? null : Number(examLevel),
      total_duration_seconds: durationMinutes === '' ? null : Number(durationMinutes) * 60,
      owner_scope: ownerScope,
      listening_media_type: mediaType,
      listening_media_url: mediaUrl,
    };

    if (canDirectEdit) {
      const success = await updatePaper(paper.id, payload);
      if (success) {
        onSuccess();
        onClose();
      }
    } else if (isPublic) {
      setIsSubmittingRequest(true);
      const res = await examPaperService.createEditRequest(paper.id, payload);
      if (res.status === 'success') {
        alert('Đã gửi yêu cầu chỉnh sửa thành công! Vui lòng chờ Admin phê duyệt.');
        onClose();
      } else {
        alert('Lỗi: ' + res.error?.message);
      }
      setIsSubmittingRequest(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá vĩnh viễn đề thi này không? Dữ liệu không thể khôi phục.')) {
      const success = await deletePaper(paper.id);
      if (success) {
        onClose();
        navigate('/exams'); 
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={canDirectEdit ? "Cài đặt đề thi" : "Đề xuất chỉnh sửa đề thi"}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSaving || isDeleting || isSubmittingRequest}>Hủy</Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving || isSubmittingRequest} disabled={isDeleting}>
            {canDirectEdit ? 'Lưu thay đổi' : 'Gửi đề xuất'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {!canDirectEdit && isPublic && (
          <div className="p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
            Bạn đang sửa một đề thi cộng đồng. Các thay đổi của bạn sẽ được gửi tới Quản trị viên để xét duyệt.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Input
              label="Tên đề thi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên đề thi..."
              disabled={isSaving || isDeleting || isSubmittingRequest}
            />
            {validationErrors.title && <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cấp độ HSK (Tuỳ chọn)"
              type="number"
              min={1}
              max={9}
              value={examLevel}
              onChange={(e) => setExamLevel(e.target.value ? Number(e.target.value) : '')}
              placeholder="VD: 4"
              disabled={isSaving || isDeleting || isSubmittingRequest}
            />
            
            <div>
              <Input
                label="Thời lượng (Phút)"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')}
                placeholder="VD: 120"
                disabled={isSaving || isDeleting || isSubmittingRequest}
              />
              {validationErrors.total_duration_seconds && <p className="text-sm text-red-500 mt-1">{validationErrors.total_duration_seconds}</p>}
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        <ExamVisibilityField 
          value={ownerScope === 'system' ? 'public' : 'private'} 
          onChange={(val) => setOwnerScope(val === 'public' ? 'system' : 'user_private')}
          // Cấm người dùng thường tự ý thay đổi visibility của đề Public
          disabled={isSaving || isDeleting || isSubmittingRequest || !canDirectEdit}
        />

        <hr className="border-gray-200 dark:border-gray-800" />

        <div>
          <ExamListeningMediaField 
            type={mediaType}
            url={mediaUrl}
            onTypeChange={setMediaType}
            onUrlChange={setMediaUrl}
            disabled={isSaving || isDeleting || isSubmittingRequest}
          />
          {validationErrors.listening_media_url && <p className="text-sm text-red-500 mt-1">{validationErrors.listening_media_url}</p>}
        </div>

        {/* Khu vực Delete chỉ hiển thị cho người có quyền Direct Edit (Owner/Admin) */}
        {canDirectEdit && (
          <>
            <hr className="border-gray-200 dark:border-gray-800" />
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-400 mb-1">Khu vực nguy hiểm</h4>
              <p className="text-xs text-red-600 dark:text-red-300 mb-3">
                Hành động này sẽ xóa hoàn toàn đề thi và mọi dữ liệu liên quan khỏi hệ thống.
              </p>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDelete} 
                isLoading={isDeleting}
                disabled={isSaving}
              >
                Xóa đề thi này
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};