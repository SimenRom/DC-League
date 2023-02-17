import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { Activity } from "../DCLeagueTypes";
import Bracket from "./Bracket";
import { useFirebaseContext } from "./FirebaseContextProvider";
import GameList from "./GameList";
import PointsCounter from "./PointsCounter";
import Scoreboard from "./Scoreboard";

export default function() {
    let firebaseAppContext = useFirebaseContext();
    let [activity, setActivity] = useState<Activity | null>(null);
    let [pointsCounter, setPointsCounter] = useState<Activity | null>(null);


    return <>
    {pointsCounter ? <PointsCounter pointsCounter={pointsCounter}/> : (activity ? <Bracket activity={activity} setActivity={setActivity}/> : (firebaseAppContext.user ? <>
        <GameList setPointsCounter={setPointsCounter} setActivity={setActivity}/>
        <Scoreboard/>
       </> : firebaseAppContext.userLoading ? <CircularProgress /> : <p style={{width:'100%'}}>Vennligst logg inn</p>))}
    </>
}