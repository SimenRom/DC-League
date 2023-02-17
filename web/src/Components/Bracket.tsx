import { Avatar, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Paper, Radio, RadioGroup, Select, Typography } from "@mui/material";
import { useFirebaseContext } from "./FirebaseContextProvider";
import { Firestore, getFirestore, doc, getDoc, getDocs, query, collection, where, setDoc, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Home } from "@mui/icons-material";
import { Activity, Match, Player } from "../DCLeagueTypes";

interface Props {
    activity: Activity;
    setActivity: any;
}
async function getAvailablePlayers(db: Firestore | undefined, setAvailablePlayers: any) {
    if(db) {
        console.log('getAvailablePlayers');
        
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
    let [rounds, setRounds] = useState<Match[][]>([[]]);
    let [waitingUpdate, setWaitingUpdate] = useState<boolean>(false);
    let [newMatch, setNewMatch] = useState<Match>({winner: 0, id: ''+Math.floor((Math.random()*1000000))});
    useEffect(()=>{
        getAvailablePlayers(db, setAvailablePlayers);
        getExistingBracket(db, props.activity);
    }, []);

    async function getExistingBracket(db: Firestore | undefined, activity: Activity) {
        if(db) {        
            console.log('getExistingBracket');
            
            const querySnapshot = await getDoc(doc(db, `activities/${activity.activityID}`));
            if(querySnapshot.exists()) {
                let tempRounds: any[] = []
                for(let i = 0; i < 10; i++) {
                    let activity = querySnapshot.data();
                    if(activity['round'+i]) {
                        tempRounds[i] = activity['round'+i];
                    }
                }
                setRounds(await fromDatabaseFormat(tempRounds));
            } else {
                setDoc(doc(db, `activities/${activity.activityID}`), activity);
            }
        };
    }
    async function fromDatabaseFormat(databaseRounds: any[][]) {
        let correctFormatRounds = await Promise.all(databaseRounds.map(async (round: any) => {
            return await Promise.all(round.map(async (matchObject : any) => {
                console.log('get playerdata for player 1 and 2');
                
                let player1 = (await getDoc(matchObject.player1)).data() as Player;
                player1.PlayerID = matchObject.player1.id;
                let player2 = (await getDoc(matchObject.player2)).data() as Player;
                player2.PlayerID = matchObject.player1.id;
                
                let match: Match = {
                    player1: player1,
                    player2: player2,
                    winner: matchObject.winner,
                    id: matchObject.id
                }
                return match;
            }));
        }))
        return correctFormatRounds;
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
    async function addNewMatch() {
        if(newMatch.player1 && newMatch.player2) {            
            setWaitingUpdate(true);
             
            const newState = [...rounds];
            if(newState.length === 0) {
                newState[0] = [];
            }
            newState[0].push({...newMatch});
            setRounds(newState);
            
            setNewMatch({winner: 0, id: ''+Math.floor((Math.random()*1000000))});
        }
    }
    useEffect(() => {        
        updateRoundsFirestore();                
    }, [rounds]);

    async function updateRoundsFirestore(){
        if(db && waitingUpdate) {

            let tempRounds = rounds.map(round => {
                return round.map(match => {                    
                    if(db) {
                        return {
                            player1: doc(db, 'users/'+match.player1?.PlayerID),
                            player2: doc(db, 'users/'+match.player2?.PlayerID),
                            id: match.id,
                            winner: match.winner
                        }
                    }
                })
            })
            let updateObj: any = {};
            tempRounds.forEach((round, index) => updateObj['round'+index] = round);
            
            await setDoc(doc(db, 'activities/'+props.activity.activityID), { ...updateObj }, { merge: true })
            setWaitingUpdate(false);
        };
    }

    async function handleWinnerSelected(e: any, w: any, roundToEdit: number) {
        
        if(db) {
            console.log('handleWinnerSelected');
            
            let activity = (await getDoc(doc(db, `activities/${props.activity.activityID}`))).data();
            if(!activity) {
                return;
            }
            
            
            let roundsUpdated: any[] = []
            
            for(let i = 0; i < 10; i++) {
                if(activity['round'+i]) {
                    if(roundsUpdated[0]?.length === 0) {
                        roundsUpdated[0] = activity['round'+i]; 
                    } else {
                        roundsUpdated.push(activity['round'+i]);
                    }
                }
            }
            
            let updatedWinnerMatches = roundsUpdated[roundToEdit-1].map((match: any) => {
                if(match.id === w) {
                    match.winner = Number.parseInt(e.target.value);
                }
                return match;
            })
            roundsUpdated[roundToEdit-1] = updatedWinnerMatches;
            
            let tempRoundsUpdated = await fromDatabaseFormat(roundsUpdated.map(match => {
                if(match.id === w) {                    
                    match.winner = Number.parseInt(e.target.value);
                }
                return match;
            }));
            setRounds(tempRoundsUpdated);
            
            let updateObj: any = {};
            roundsUpdated.forEach((round, index) => updateObj['round'+index] = round);
            await setDoc(doc(db, 'activities/'+props.activity.activityID), { ...updateObj }, { merge: true })

            console.log([...roundsUpdated]);
            
            roundsUpdated.forEach((round, index)=> {
                let endedMatches = round.filter((match: any) => match.winner);
                console.log([...endedMatches]);
                
                let tempMatchesNextRound = [];

                for(let i = 0; i < endedMatches.length; i += 2) {
                    let winnerA: any = '';
                    if(endedMatches[i].winner === 1){
                        winnerA = availablePlayers?.find(player => player.PlayerID === endedMatches[i].player1?.PlayerID); 
                    } else if(endedMatches[i].winner === 2) {
                        winnerA = availablePlayers?.find(player => player.PlayerID === endedMatches[i].player2?.PlayerID); 
                    }
                    let tempNewRoundMatch: Match = {
                        player1: winnerA,
                        player2: undefined,
                        winner: 0,
                    }
                    if(endedMatches[i+1]) {
                        if(endedMatches[i+1].winner === 1){
                            tempNewRoundMatch.player2 = availablePlayers?.find(player=>player.PlayerID === endedMatches[i+1].player1?.PlayerID);
                        } else if(endedMatches[i+1].winner === 2) {
                            tempNewRoundMatch.player2 = availablePlayers?.find(player=>player.PlayerID === endedMatches[i+1].player2?.PlayerID);
                        }
                    } else {
                        tempNewRoundMatch.winner = 1;
                    }
                    tempMatchesNextRound.push(tempNewRoundMatch);
                }
                roundsUpdated[index+1] = (tempMatchesNextRound)
            })
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
                    <InputLabel>Spiller 1 / leder for lag 1</InputLabel>
                    <Select
                        label="Player 1"
                        onChange={handleChangePlayer1}
                        defaultValue=""
                        // value={newMatch.player1?.PlayerID}
                        >
                        {availablePlayers.map(player => <MenuItem key={player.PlayerID} value={player.PlayerID}>{player.displayName}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Spiller 2 / leder for lag 2</InputLabel>
                    <Select
                        label="Player 2"
                        onChange={handleChangePlayer2}
                        // value={newMatch.player2?.PlayerID}
                        defaultValue=""
                    >
                        {availablePlayers.map(player => <MenuItem key={player.PlayerID} value={player.PlayerID}>{player.displayName}</MenuItem>)}
                        <MenuItem value='empty'>Ingen motstander</MenuItem>
                    </Select>
                    <Button variant="contained" onClick={addNewMatch}>Legg til</Button>
                </FormControl></> : null }
                <Container sx={{display: "flex", justifyContent: 'space-around'}}>
                    {rounds.map((round, index) => (
                        <Container key={index}>
                            <Typography variant="h4" gutterBottom>
                                Round {index}
                            </Typography>
                            {round?.map((match, index) => {                    
                                return <Paper elevation={2} sx={{maxWidth: '250px'}} key={index}>
                                    <FormControl>
                                        <FormLabel>Match #{match.id}</FormLabel>
                                        <RadioGroup
                                            // defaultValue="female"
                                            name="winner"
                                            onChange={(e)=>handleWinnerSelected(e, match.id, 1)}
                                            value={match.winner}
                                        >
                                            <FormControlLabel value={0} control={<Radio />} label="Uspilt" />
                                            <FormControlLabel value={1} control={<Radio />} label={match.player1?.displayName} />
                                            <FormControlLabel value={2} control={<Radio />} label={match.player2?.displayName} />
                                        </RadioGroup>
                                    </FormControl>
                                </Paper>
                            })}
                        </Container>
                    ))}
                </Container>
            </Container>
}