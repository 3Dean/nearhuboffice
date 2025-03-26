import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';
import { auth } from './auth/resource';

export const backend = defineBackend({
  auth,
  storage,
});
