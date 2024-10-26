import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

import { FIREBASE_API } from 'src/config-global';

console.log({ FIREBASE_API });

const app = initializeApp(FIREBASE_API);
const auth = getAuth(app);

export { app, auth };
