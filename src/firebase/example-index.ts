import { AngularFireModule } from 'angularfire2';

// Must export the config (angularfire2 config)
export const firebaseConfig = {
    apiKey: 'API_KEY',
    authDomain: 'AUTH_DOMAIN',
    databaseURL: 'DATABASE_URL',
    storageBucket: 'STORAGE_BUCKET'
};

export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig);