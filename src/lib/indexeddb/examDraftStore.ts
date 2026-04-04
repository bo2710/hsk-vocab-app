import { initDB } from './db';
import { ExamDraft } from '../../types/indexeddb';

export const saveExamDraft = async (draft: ExamDraft): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  await db.put('exam_drafts', draft);
};

export const getExamDraft = async (paperId: string): Promise<ExamDraft | undefined> => {
  const db = await initDB();
  if (!db) return undefined;
  return db.get('exam_drafts', paperId);
};

export const deleteExamDraft = async (paperId: string): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  await db.delete('exam_drafts', paperId);
};