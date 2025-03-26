import { defineBackend } from '@aws-amplify/backend';
import { storage } from '@aws-amplify/backend-storage';

export const backend = defineBackend({
  storage: storage({
    access: (allow) => ({
      'public/*': [allow.read, allow.write],
    }),
  }),
});