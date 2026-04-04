// filepath: src/components/exams/ExamJsonImportPromptModal.tsx
// CẦN TẠO MỚI
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ExamJsonImportPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROMPT_TEMPLATE = `Bạn là một chuyên gia bóc tách dữ liệu đề thi HSK. Hãy đọc file đính kèm và trích xuất TOÀN BỘ nội dung thành định dạng JSON CHUẨN XÁC theo schema sau.
TUYỆT ĐỐI TUÂN THỦ CÁC QUY TẮC:
1. KHÔNG được bỏ sót bất kỳ câu hỏi nào. Giữ nguyên số thứ tự câu (question_order).
2. Các phần listening, reading, writing phải phân tách rõ ràng vào \`sections\`.
3. Nếu file có chứa transcript/audio script, TUYỆT ĐỐI đưa vào \`review_only.transcripts\`, KHÔNG để lẫn vào nội dung câu hỏi.
4. Nếu file có đáp án (answer key), TUYỆT ĐỐI đưa vào \`review_only.answer_keys\`. KHÔNG CUNG CẤP ĐÁP ÁN TRONG PHẦN \`sections\`.
5. Chỉ trả về mã JSON nguyên bản, không thêm văn bản giải thích nào khác.

SCHEMA:
{
  "title": "Tên đề thi (ví dụ: HSK 4 Past Paper H41001)",
  "exam_type": "HSK",
  "exam_level": 4,
  "total_sections": 3,
  "total_questions": 100,
  "sections": [
    {
      "section_code": "listening",
      "section_name": "Listening",
      "skill": "listening",
      "instructions": "Hướng dẫn làm bài",
      "questions": [
        {
          "question_order": 1,
          "question_type": "multiple_choice",
          "prompt_text": "Nội dung câu hỏi nếu có",
          "options": [
            { "option_key": "A", "option_text": "Lựa chọn A" }
          ]
        }
      ]
    }
  ],
  "review_only": {
    "answer_keys": [
      { "question_order": 1, "correct_option_key": "A", "subjective_answer": null }
    ],
    "transcripts": [
      { "section_code": "listening", "question_order": 1, "text": "Nội dung bài nghe câu 1" }
    ]
  }
}`;

export const ExamJsonImportPromptModal: React.FC<ExamJsonImportPromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prompt ChatGPT">
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Hãy copy đoạn prompt dưới đây, mở ChatGPT và dán vào khung chat, sau đó đính kèm file PDF bài thi của bạn.
        </p>
        
        <div className="relative group">
          <textarea
            readOnly
            className="w-full h-64 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={PROMPT_TEMPLATE}
          />
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-gray-500 hover:text-primary-600 transition-colors"
            title="Copy"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            )}
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleCopy}>
            {copied ? 'Đã copy!' : 'Copy Prompt'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};