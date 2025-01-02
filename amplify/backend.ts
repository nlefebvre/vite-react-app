import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { connectionsData } from './connectionsData/resource';

defineBackend({
  auth,
  data,
  connectionsData
});
