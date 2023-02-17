import { Timestamp } from "firebase/firestore";

export interface Activity {
    activityName: string,
    date: Date | Timestamp,
    activityID: string,
    podium?: any[] // TODO: change to type Player[],
    tournamentType?: 'brackets' | 'points',
}
export interface Player {
    PlayerID: string,
    displayName: string,
    email: string,
    photoURL: string
}
export interface Match {
    player1?: Player,
    player2?: Player,
    winner?: number,
    id?: string
}