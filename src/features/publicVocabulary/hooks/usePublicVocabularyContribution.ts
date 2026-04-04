// filepath: src/features/publicVocabulary/hooks/usePublicVocabularyContribution.ts
// CẦN CHỈNH SỬA
import { useState, useCallback } from 'react';
import { ContributionFormData, PublicVocabularyEntry, PublicVocabularyContribution } from '../types';
import { publicVocabularyContributionService } from '../services/publicVocabularyContributionService';
import { buildContributionPayloadFromForm } from '../../../lib/normalizers/publicVocabulary';
import { validateContributionForm } from '../../../lib/validators/publicVocabulary';

export const usePublicVocabularyContribution = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateCandidates, setDuplicateCandidates] = useState<PublicVocabularyEntry[]>([]);
  const [pendingFormData, setPendingFormData] = useState<ContributionFormData | null>(null);

  // States cho User History
  const [userContributions, setUserContributions] = useState<PublicVocabularyContribution[]>([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(false);

  const fetchUserContributions = useCallback(async () => {
    setIsLoadingContributions(true);
    const result = await publicVocabularyContributionService.getUserContributions();
    if (result.status === 'success') {
      setUserContributions(result.data || []);
    }
    setIsLoadingContributions(false);
  }, []);

  const submit = async (formData: ContributionFormData, ignoreDuplicates: boolean = false): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);

    try {
      const formValidation = validateContributionForm(formData);
      if (!formValidation.isValid) {
        setValidationErrors(formValidation.errors);
        return false;
      }

      const payload = buildContributionPayloadFromForm(formData);
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
      fetchUserContributions(); // Làm mới danh sách khi submit thành công
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
    return await submit(pendingFormData, true); 
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
    resetStatus,
    userContributions,
    isLoadingContributions,
    fetchUserContributions
  };
};