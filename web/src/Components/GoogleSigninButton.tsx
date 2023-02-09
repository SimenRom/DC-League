import { signInWithRedirect, GoogleAuthProvider, signOut } from "@firebase/auth";
import { Button, CircularProgress } from "@mui/material";
import { useFirebaseContext } from "./FirebaseContextProvider";

const provider = new GoogleAuthProvider();

export default function() {
    let firebaseAppContext = useFirebaseContext();
    function Signin() {
        if(firebaseAppContext.auth) {
            signInWithRedirect(firebaseAppContext.auth, provider);
        }
    }
    function Signout() {
        if(firebaseAppContext.auth) {
            signOut(firebaseAppContext.auth)
        }
    }

    if(firebaseAppContext.userLoading) { 
        return <CircularProgress />
    } else {
        if(firebaseAppContext.user) {
            return <Button variant="contained" sx={{backgroundColor: "green"}} onClick={Signout}>Logg ut</Button>
        } else {
            return <Button variant="contained" onClick={Signin}>Logg inn</Button>
        }
    }
}