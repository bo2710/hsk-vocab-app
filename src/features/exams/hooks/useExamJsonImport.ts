// filepath: src/features/exams/hooks/useExamJsonImport.ts
// CẦN TẠO MỚI
import { useState, useCallback } from 'react';
import { ExamJsonHandoffEnvelope } from '../types';
import { examImportService } from '../services/examImportService';

type ImportStatus = 'idle' | 'validating' | 'importing' | 'success' | 'error';

export const useExamJsonImport = () => {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const processJsonString = useCallback(async (jsonString: string) => {
    try {
      setStatus('validating');
      setError(null);

      // Bước 1: Dọn dẹp JSON string nếu có markdown bọc ngoài
      let cleanString = jsonString.trim();
      if (cleanString.startsWith('```json')) {
        cleanString = cleanString.replace(/^```json/, '');
      }
      if (cleanString.startsWith('```')) {
        cleanString = cleanString.replace(/^```/, '');
      }
      if (cleanString.endsWith('```')) {
        cleanString = cleanString.replace(/```$/, '');
      }
      cleanString = cleanString.trim();

      // Bước 2: Parse JSON
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(cleanString);
      } catch (e) {
        throw new Error('Dữ liệu không phải định dạng JSON hợp lệ. Vui lòng kiểm tra lại output từ ChatGPT.');
      }

      // Bước 3: Basic envelope validation
      if (!parsedPayload.title) {
        throw new Error('Thiếu trường "title" trong dữ liệu JSON.');
      }
      if (!Array.isArray(parsedPayload.sections)) {
        throw new Error('Thiếu mảng "sections" hoặc định dạng không đúng.');
      }
      if (!parsedPayload.review_only || !Array.isArray(parsedPayload.review_only.answer_keys)) {
        throw new Error('Thiếu trường "review_only.answer_keys". Các đáp án bắt buộc phải nằm ở cấu trúc review_only chứ không lộ ở màn hình thi.');
      }

      // Ép kiểu sau khi qua validation cơ bản
      const payload = parsedPayload as ExamJsonHandoffEnvelope;

      // Bước 4: Chuyển dữ liệu cho service
      setStatus('importing');
      const result = await examImportService.submitJsonHandoff(payload);

      if (result.status === 'error') {
        throw result.error || new Error('Lỗi khi lưu trữ cấu trúc đề thi.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Đã có lỗi xảy ra trong quá trình xử lý JSON.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return {
    status,
    error,
    processJsonString,
    reset
  };
};