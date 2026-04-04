// filepath: src/features/publicVocabulary/hooks/usePublicVocabularyContribution.ts
import { useState } from 'react';
import { ContributionFormData, PublicVocabularyEntry } from '../types';
import { publicVocabularyContributionService } from '../services/publicVocabularyContributionService';
import { buildContributionPayloadFromForm } from '../../../lib/normalizers/publicVocabulary';
import { validateContributionForm } from '../../../lib/validators/publicVocabulary';

export const usePublicVocabularyContribution = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  // States cho Duplicate Detection
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateCandidates, setDuplicateCandidates] = useState<PublicVocabularyEntry[]>([]);
  const [pendingFormData, setPendingFormData] = useState<ContributionFormData | null>(null);

  const submit = async (formData: ContributionFormData, ignoreDuplicates: boolean = false): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);

    try {
      // 1. Form Level Validation
      const formValidation = validateContributionForm(formData);
      if (!formValidation.isValid) {
        setValidationErrors(formValidation.errors);
        return false;
      }

      // 2. Build Payload
      const payload = buildContributionPayloadFromForm(formData);

      // 3. Call Service
      const result = await publicVocabularyContributionService.submitContribution(payload, ignoreDuplicates);

      if (result.status === 'validation_error') {
        setValidationErrors(result.validationErrors || {});
        return false;
      }

      if (result.status === 'duplicate_warning') {
        setDuplicateCandidates(result.duplicateCandidates);
        setPendingFormData(formData);
        setShowDuplicateWarning(true);
        return false;
      }

      if (result.status === 'error') {
        throw result.error;
      }

      setIsSuccess(true);
      setShowDuplicateWarning(false);
      setPendingFormData(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi gửi đóng góp.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSubmit = async (): Promise<boolean> => {
    if (!pendingFormData) return false;
    return await submit(pendingFormData, true); // Gọi lại submit với cờ bỏ qua cảnh báo trùng lặp
  };

  const cancelDuplicateWarning = () => {
    setShowDuplicateWarning(false);
  };

  const resetStatus = () => {
    setIsSuccess(false);
    setError(null);
    setValidationErrors({});
    setShowDuplicateWarning(false);
    setDuplicateCandidates([]);
    setPendingFormData(null);
  };

  return {
    submit,
    confirmSubmit,
    cancelDuplicateWarning,
    isSubmitting,
    error,
    validationErrors,
    isSuccess,
    showDuplicateWarning,
    duplicateCandidates,
    resetStatus
  };
};