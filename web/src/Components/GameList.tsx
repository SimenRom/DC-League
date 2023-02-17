import { AccountTree, ExpandMore, Scoreboard } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar, Container, Button } from "@mui/material";
import { Activity } from "../DCLeagueTypes";
interface Props {
    setActivity: React.Dispatch<React.SetStateAction<Activity | null>>
    setPointsCounter: React.Dispatch<React.SetStateAction<Activity | null>>
}
export default function(props: Props) {
    let rows: Activity[] = [
        {activityID: 'biljard', activityName: 'Biljard', podium: ['Trym', 'Simen R', 'Simen L'], date: new Date('3. feb. 2023'), tournamentType: 'brackets'},
        {activityID: 'curling', activityName: 'Curling', date: new Date('17. feb. 2023'), tournamentType: 'points'},
        {activityID: 'padel', activityName: 'Padel', date: new Date('19. aug. 2023'), tournamentType: 'brackets'},
        {activityID: 'minigolf', activityName: 'Minigolf', date: new Date('15. sep. 2023'), tournamentType: 'points'},
        {activityID: 'bowling', activityName: 'Bowling', date: new Date('15. sep. 2023'), tournamentType: 'points'},
        {activityID: 'gokart', activityName: 'Go-Kart', date: new Date('5. dec. 2023'), tournamentType: 'points'},
    ]
    return (
        <TableContainer component={Paper}
        sx={{ margin: 'auto', width: 'auto', maxWidth: '800px', marginBottom: '15px', marginTop: '5px'}}>
            <Table aria-label="simple table">
                <TableHead sx={{
                    backgroundColor: 'rgb(224, 144, 63)'}}>
                    <TableRow>
                        <TableCell>Aktivitet</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Pallplass</TableCell>
                        <TableCell align="right">Dato</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.activityName}
                    sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 }, 
                        '&:nth-of-type(even)':  {backgroundColor: 'lightgray'},
                        '&:nth-of-type(odd)':  {backgroundColor: 'rgb(241, 241, 241)'},
                     }}
                    >
                        <TableCell component="th" scope="row">
                        {row.activityName}
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {row.tournamentType === 'points' ? 
                                <Button variant="outlined" endIcon={<Scoreboard />} onClick={()=>{props.setPointsCounter(row)}}>
                                    Poengteller
                                </Button> : 
                                <Button variant="outlined" endIcon={<AccountTree />} onClick={()=>{props.setActivity(row)}}>
                                    Brackets
                                </Button>
                            }
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {row.podium ? (
                                <Container>
                                    <Chip sx={{
                                        background: "linear-gradient(90deg, rgba(255,246,0,1) 0%, rgba(255,245,172,1) 100%)"
                                    }} label={row.podium ? row.podium[0] : ''} avatar={<Avatar sx={{background: 'lightgray'}} alt='Førsteplass' src="/static/images/avatar/1.jpg">1</Avatar>}/>
                                    <Chip sx={{
                                        background: "linear-gradient(45deg, rgba(170,169,158,1) 0%, rgba(193,194,170,1) 100%)"
                                    }} label={row.podium ? row.podium[1] : ''} avatar={<Avatar sx={{background: 'lightgray'}} alt='Andreplass' src="/static/images/avatar/1.jpg" >2</Avatar>}/>
                                    <Chip sx={{
                                        background: "linear-gradient(45deg, rgba(255,126,0,1) 0%, rgba(255,176,113,1) 100%)"
                                    }} label={row.podium ? row.podium[2] : ''} avatar={<Avatar sx={{background: 'lightgray'}} alt='Tredjeplass' src="/static/images/avatar/1.jpg" >3</Avatar>}/>
                                </Container>
                                ): null}
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                            {row.date instanceof Date ? row.date.toDateString() : row.date.toString()}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}