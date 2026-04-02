import { VocabularyItem, VocabularyContext } from '../../types/models';

export interface BackupData {
  appVersion: string;
  exportedAt: string;
  vocabulary: VocabularyItem[];
  contexts: VocabularyContext[];
}

export interface ImportSummary {
  success: boolean;
  importedVocabCount: number;
  importedContextCount: number;
  error?: string;
}