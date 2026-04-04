// filepath: src/features/exams/hooks/useExamJsonIngestion.ts
// CẦN TẠO MỚI
import { useState, useCallback } from 'react';
import { ExamJsonHandoffEnvelope } from '../types';
import { examImportService } from '../services/examImportService';
import { validateJsonHandoffEnvelope } from '../../../lib/validators/exams';

export const useExamJsonIngestion = () => {
  const [status, setStatus] = useState<'idle' | 'validating' | 'importing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [importedPaperId, setImportedPaperId] = useState<string | null>(null);
  const [importedPaperTitle, setImportedPaperTitle] = useState<string>('');

  const processJsonString = useCallback(async (jsonString: string) => {
    try {
      setStatus('validating');
      setError(null);
      setValidationErrors({});

      // Bước 1: Dọn dẹp chuỗi JSON thô
      let cleanString = jsonString.trim();
      if (cleanString.startsWith('```json')) cleanString = cleanString.replace(/^```json/, '');
      if (cleanString.startsWith('```')) cleanString = cleanString.replace(/^```/, '');
      if (cleanString.endsWith('```')) cleanString = cleanString.replace(/```$/, '');
      cleanString = cleanString.trim();

      // Bước 2: Parse JSON
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(cleanString);
      } catch (e) {
        throw new Error('Dữ liệu không phải định dạng JSON hợp lệ. Vui lòng kiểm tra lại output từ ChatGPT.');
      }

      // Bước 3: Deep Validation để chặn sai sót structure và lộ answer key
      const validationResult = validateJsonHandoffEnvelope(parsedPayload);
      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors);
        setStatus('error');
        setError('Dữ liệu JSON không đúng chuẩn. Vui lòng xem chi tiết lỗi bên dưới.');
        return;
      }

      const payload = parsedPayload as ExamJsonHandoffEnvelope;
      setImportedPaperTitle(payload.title);

      // Bước 4: Ingestion qua Service Layer
      setStatus('importing');
      const result = await examImportService.submitJsonHandoff(payload);

      if (result.status === 'error') {
        throw result.error || new Error('Lỗi khi lưu trữ đề thi vào hệ thống.');
      }

      // Record kết quả
      setImportedPaperId(result.data?.paper_id || null);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Đã có lỗi xảy ra trong quá trình xử lý JSON.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setValidationErrors({});
    setImportedPaperId(null);
    setImportedPaperTitle('');
  }, []);

  return {
    status,
    error,
    validationErrors,
    importedPaperId,
    importedPaperTitle,
    processJsonString,
    reset
  };
};