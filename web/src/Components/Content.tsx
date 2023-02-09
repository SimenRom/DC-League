import { CircularProgress } from "@mui/material";
import { useFirebaseContext } from "./FirebaseContextProvider";
import GameList from "./GameList";
import Scoreboard from "./Scoreboard";

export default function() {
    let firebaseAppContext = useFirebaseContext();
    return <>
    {firebaseAppContext.user ? <>
        <GameList/>
        <Scoreboard/>
       </> : firebaseAppContext.userLoading ? <CircularProgress /> : <p style={{width:'100%'}}>Vennligst logg inn</p>}
    </>
}