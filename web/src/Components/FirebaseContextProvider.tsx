// Import the functions you need from the SDKs you need
import { FirebaseApp, getApps, initializeApp } from '@firebase/app';
import { createContext, ReactNode, useContext, useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
interface FirebaseContextProvider {
    children: ReactNode;
}
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};
interface FirebaseContext {
    firebaseApp?: FirebaseApp
}
const context: FirebaseContext = {
    firebaseApp: undefined
};
const FirebaseContext = createContext(context);
function getFirebaseApp(config = {...firebaseConfig}) {
    const apps = getApps();
    if (!apps.length) {
        const app = initializeApp(config);
        return app;
    }  else {
        return apps[0];
    }
}
export function FirebaseContextProvider({ children }: FirebaseContextProvider) {
    const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>(getFirebaseApp());
    const firebaseContextProviderValues: FirebaseContext = {
        firebaseApp: firebaseApp
    }
    return <FirebaseContext.Provider value={firebaseContextProviderValues}>
    {children}
    </FirebaseContext.Provider>
}

// export const getFirebaseContext = () => useContext(FirebaseContext);