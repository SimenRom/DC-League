import { TableRestaurant } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar } from "@mui/material";
import styles from './GameList.module.css';

export default function() {
    let rows = [
        {activityName: 'Biljard', winner: 'Trym', date: new Date('3. feb. 2023')},
        {activityName: 'Curling', date: new Date('17. feb. 2023')},
        {activityName: 'Paddel', date: new Date('19. aug. 2023')},
        {activityName: 'Minigolf', date: new Date('15. sep. 2023')},
        {activityName: 'Bowling', date: new Date('15. sep. 2023')},
        {activityName: 'Go-Kart', date: new Date('5. dec. 2023')},
    ]
    return (
        <TableContainer component={Paper}
        sx={{ margin: 'auto', width: 'auto', maxWidth: '500px'}}>
            <Table aria-label="simple table">
                <TableHead sx={{
                    backgroundColor: 'rgb(224, 144, 63)'}}>
                    <TableRow>
                        <TableCell>Aktivitet</TableCell>
                        <TableCell>Førsteplass</TableCell>
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
                            {row.winner ? <Chip label={row.winner ? row.winner : ''} avatar={<Avatar alt={row.winner ? row.winner : 'Winner Pic'} src="/static/images/avatar/1.jpg" />}/> : null}
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                            {row.date.toDateString()}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}