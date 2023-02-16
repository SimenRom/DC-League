import { Avatar, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Paper, Radio, RadioGroup, Select } from "@mui/material";
import { useFirebaseContext } from "./FirebaseContextProvider";
import { Firestore, getFirestore, doc, getDoc, getDocs, query, collection, where, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Home } from "@mui/icons-material";
import { Activity, Match, Player } from "../DCLeagueTypes";

interface Props {
    activity: Activity;
    setActivity: any;
}
async function getAvailablePlayers(db: Firestore | undefined, setAvailablePlayers: any) {
    if(db) {
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


export default function(props: Props) {
    let firebaseAppContext = useFirebaseContext();
    let db = firebaseAppContext.db;
    let [availablePlayers, setAvailablePlayers] = useState<Player[]>();
    let [matchesRound1, setMatches] = useState<Match[]>([]);
    let [newMatch, setNewMatch] = useState<Match>({id: ''+Math.floor((Math.random()*1000000))});
    useEffect(()=>{
        getAvailablePlayers(db, setAvailablePlayers);
        getExistingBracket(db, props.activity);
    }, []);

    async function getExistingBracket(db: Firestore | undefined, activity: Activity) {
        if(db) {        
            const querySnapshot = await getDoc(doc(db, `activities/${activity.activityID}`));
            if(querySnapshot.exists()) {
                let tempMatches = await Promise.all(querySnapshot.data().matchesRound1.map(async function(matchDoc: any) {
                    let player1 = (await getDoc(matchDoc.player1)).data() as Player;
                    player1.PlayerID = matchDoc.player1.id;
                    let player2 = (await getDoc(matchDoc.player2)).data() as Player;

                    let match: Match = {
                        player1: player1,
                        player2: player2,
                        winner: matchDoc.winner,
                        id: matchDoc.id
                    }
                    return match;
                }));
                setMatches(tempMatches);
                // console.log(tempMatches);
            } else {
                setDoc(doc(db, `activities/${activity.activityID}`), activity);
            }
        };
    }
    function handleChangePlayer1(e: any) {
        let match = newMatch;
        let player: Player | undefined = availablePlayers?.find(player=> player.PlayerID === e.target.value);
        match.player1 = player;
        if(player) {
            setNewMatch(match);
        }
    }
    function handleChangePlayer2(e: any) {
        let match = newMatch;
        let player: Player | undefined = availablePlayers?.find(player=> player.PlayerID === e.target.value);
        match.player2 = player;
        if(player) {
            setNewMatch(match);
        }
    }
    function addNewMatch() {
        let temp = matchesRound1;
        if(temp) {
            temp.push(newMatch)
            setMatches(temp);
            setNewMatch({id: ''+Math.floor((Math.random()*1000000))});
        }
        if(db) {
            let tempMatches = temp.map(match => {
                if(db) {
                    return {
                        player1: doc(db, 'users/'+match.player1?.PlayerID),
                        player2: doc(db, 'users/'+match.player2?.PlayerID),
                        id: match.id,
                    }
                }
            }) 
            setDoc(doc(db, 'activities/'+props.activity.activityID), { matchesRound1: tempMatches }, { merge: true })
        }
    }
    async function handleWinnerSelected(e: any, w: any) {
        if(db) {
            let matches: any[] = (await getDoc(doc(db, `activities/${props.activity.activityID}`))).get('matchesRound1');
            let updatedWinnerMatches = matches.map(match => {
                if(match.id === w) {                    
                    match.winner = Number.parseInt(e.target.value);
                }
                return match;
            })
            
            setMatches(matchesRound1.map(match => {
                if(match.id === w) {                    
                    match.winner = Number.parseInt(e.target.value);
                }
                return match;
            }));
            setDoc(doc(db, `activities/${props.activity.activityID}`), { matchesRound1: updatedWinnerMatches }, { merge: true })
        }

    }
    

    return <Container>
                <Button variant="outlined" startIcon={<Home />} onClick={()=>props.setActivity(null)}>
                    Tilbake
                </Button>
                {props.activity.activityName}
                {availablePlayers && availablePlayers.length > 0 ?
                <>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Spiller 1 / leder for lag 1</InputLabel>
                    <Select
                        label="Player 1"
                        onChange={handleChangePlayer1}
                        defaultValue=""
                        >
                        {availablePlayers.map(player => <MenuItem key={player.PlayerID} value={player.PlayerID}>{player.displayName}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Spiller 2 / leder for lag 2</InputLabel>
                    <Select
                        label="Player 2"
                        onChange={handleChangePlayer2}
                        defaultValue=""
                    >
                        {availablePlayers.map(player => <MenuItem key={player.PlayerID} value={player.PlayerID}>{player.displayName}</MenuItem>)}
                        <MenuItem value='empty'>Ingen motstander</MenuItem>
                    </Select>
                    <Button variant="contained" onClick={addNewMatch}>Legg til</Button>
                </FormControl></> : null }
                
                {matchesRound1?.map((match, index) => {
                    return <Paper elevation={2} sx={{maxWidth: '250px'}} key={index}>
                        <FormControl>
                            <FormLabel>Marker vinner</FormLabel>
                            <RadioGroup
                                // defaultValue="female"
                                name="winner"
                                onChange={(e)=>handleWinnerSelected(e, match.id)}
                                value={match.winner}
                            >
                                <FormControlLabel value={1} control={<Radio />} label={match.player1?.displayName} />
                                <FormControlLabel value={2} control={<Radio />} label={match.player2?.displayName} />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                })}
            </Container>
}