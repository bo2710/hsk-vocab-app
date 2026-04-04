import { addOperation } from './operationQueueStore';
import { ExamAttempt, ExamAttemptResponse } from '../../features/exams/types';

export const queueExamAttemptCreate = async (attempt: ExamAttempt) => {
  return addOperation({
    operationType: 'CREATE',
    entityType: 'EXAM_ATTEMPT',
    payload: attempt
  });
};

export const queueExamAttemptSubmit = async (attemptId: string, updates: Partial<ExamAttempt>, responses: Partial<ExamAttemptResponse>[]) => {
  return addOperation({
    operationType: 'SUBMIT',
    entityType: 'EXAM_ATTEMPT',
    payload: { attemptId, updates, responses }
  });
};