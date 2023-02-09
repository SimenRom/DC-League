// Import the functions you need from the SDKs you need
import { FirebaseApp, getApps, initializeApp } from '@firebase/app';
import { Auth, getAuth, getRedirectResult, onAuthStateChanged, User, GoogleAuthProvider } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
interface FirebaseContextProvider {
    children: ReactNode;
}
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
};
interface firebaseContext {
    firebaseApp?: FirebaseApp,
    auth?: Auth,
    user?: User,
    userLoading: boolean
}
const context: firebaseContext = {
    firebaseApp: undefined,
    auth: undefined,
    user: undefined,
    userLoading: true,
};
export const firebaseContext = createContext(context);
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
    const [auth, setAuth] = useState<Auth>(getAuth(firebaseApp));
    const [user, setUser] = useState<User | null>();
    const [userLoading, setUserLoading] = useState<boolean>(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
            setUser(newUser);
            setUserLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchResult = async (auth: Auth) => {
            return await getRedirectResult(auth);
        };
        if(auth){
            fetchResult(auth)
                .then((result) => {
                    if(result) {
                        // The signed-in user info.
                        const user = result.user;
                        // IdP data available using getAdditionalUserInfo(result)
                        // ...
                        console.log(result);
                    }
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
        }

      }, [auth]);

    const firebaseContextProviderValues: firebaseContext = {
        firebaseApp: firebaseApp,
        auth: auth,
        user: user || undefined,
        userLoading
    }
    return <firebaseContext.Provider value={firebaseContextProviderValues}>
    {children}
    </firebaseContext.Provider>
}
export const useFirebaseContext = () => useContext(firebaseContext);
