import { addOperation } from './operationQueueStore';
import { PublicVocabularyContribution } from '../../features/publicVocabulary/types';

export const queuePublicContribution = async (contribution: Partial<PublicVocabularyContribution>) => {
  return addOperation({
    operationType: 'CREATE',
    entityType: 'PUBLIC_CONTRIBUTION',
    payload: contribution
  });
};