import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { Activity } from "../DCLeagueTypes";
import Bracket from "./Bracket";
import { useFirebaseContext } from "./FirebaseContextProvider";
import GameList from "./GameList";
import Scoreboard from "./Scoreboard";

export default function() {
    let firebaseAppContext = useFirebaseContext();
    let [activity, setActivity] = useState<Activity | null>(null);


    return <>
    {activity ? <Bracket activity={activity} setActivity={setActivity}/> : (firebaseAppContext.user ? <>
        <GameList setActivity={setActivity}/>
        <Scoreboard/>
       </> : firebaseAppContext.userLoading ? <CircularProgress /> : <p style={{width:'100%'}}>Vennligst logg inn</p>)}
    </>
}