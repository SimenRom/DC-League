import { Add, Refresh, Remove } from "@mui/icons-material";
import { Avatar, Button, ButtonGroup, Chip, Container, Typography } from "@mui/material";
import { collection, getDocs, doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Activity, Player } from "../DCLeagueTypes";
import { useFirebaseContext } from "./FirebaseContextProvider";

interface Props {
    pointsCounter: Activity;
}
export default function(props: Props) {
    let firebaseContext = useFirebaseContext();
    let db = firebaseContext.db;
    let [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    let [scores, setScores] = useState<any[]>([]);
    // useEffect(()=>{
    //     if(db) {
    //         const unsub = onSnapshot(doc(db, "scoreCounter", props.pointsCounter.activityID), (doc) => {
    //             let data = doc.data()?.scores;
    //             if(data){
    //                 setScores(data);
    //             }
    //         });
    //     } else {
    //         console.log('didnt have db');
            
    //     }
    // });
    async function refreshScores() {
        if(db) {
            console.log('get scoreCounter');
            
            let newScores = (await getDoc(doc(db, "scoreCounter", props.pointsCounter.activityID))).data();
            if(newScores?.scores){
                setScores(newScores.scores);
            }
        }
    }
    async function updateScore(PlayerID: string, change: number) {
        if(db) {
            let scoreCountDocRef = doc(db, "scoreCounter", props.pointsCounter.activityID);
            console.log(scores);
            
            let newScores = scores;
            if(!newScores.some(scoreObj => scoreObj.PlayerID === PlayerID)){
                newScores.push({
                    PlayerID: PlayerID,
                    score: 0
                })
            }
            newScores = newScores.map(scoreObj=> {
                if(scoreObj.PlayerID === PlayerID) {
                    scoreObj.score += change;
                }
                return scoreObj;
            })
            console.log(newScores);
            
            await setDoc(scoreCountDocRef, { scores: newScores }, { merge: true });
            await refreshScores();
        }
    }


    async function getAvailablePlayers() {
        if(db) {
            console.log('get users!');
            
            const querySnapshot = await getDocs(collection(db, "users"));
            let players: any[] = [];
            querySnapshot.forEach((doc) => {
                let player: Player = doc.data() as Player;
                player.PlayerID = doc.id;
                players.push(player);
            })
            setAvailablePlayers(players);
        };
    }
    useEffect(()=>{
        getAvailablePlayers();
        console.log('get players useEffect');
        
    }, []);
    return <Container sx={{display: 'flex', flexDirection: 'column', maxWidth: '600px', alignItems: 'center'}}>
            <Typography variant="h5">
                <>Poeng for {props.pointsCounter.activityName} - {props.pointsCounter.date instanceof Date ? props.pointsCounter.date.toDateString() : null}</>
            </Typography>
            <Button variant="contained" startIcon={<Refresh/>} onClick={refreshScores}>
            Refresh data
            </Button>
            <Typography variant="body1" gutterBottom>
            Dataen blir tatt vare på selv om du logger ut og inn. Alle innloggede spillere kan også endre på poengene i sanntid. Om noen endrer på poeng samtidig, kan det hende du må trykke på "Refresh data"-knappen.
        </Typography>
        {availablePlayers.map((player, index) => {
            
            return <ButtonGroup key={index} variant="outlined" aria-label="outlined button group">
                        <Avatar alt={player.displayName} src={player.photoURL} />
                        <Button variant="text" sx={{width: '200px'}}>
                            {player.displayName}
                        </Button>
                        <Button color="error" onClick={()=>updateScore(player.PlayerID, -1)}><Remove/></Button>
                        <Button color="success" onClick={()=>updateScore(player.PlayerID, 1)}><Add/></Button>
                        
                        <Button variant="text">
                            <Chip label={scores?.find(scoreObj => scoreObj.PlayerID === player.PlayerID)?.score || 0}/>
                        </Button>
                    </ButtonGroup>
        })}
    </Container>
}