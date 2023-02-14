import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar, Container } from "@mui/material";

export default function() {
    let rows = [
        {activityName: 'Biljard', podium: ['Trym', 'Simen R', 'Simen L'], date: new Date('3. feb. 2023')},
        {activityName: 'Curling', date: new Date('17. feb. 2023')},
        {activityName: 'Paddel', date: new Date('19. aug. 2023')},
        {activityName: 'Minigolf', date: new Date('15. sep. 2023')},
        {activityName: 'Bowling', date: new Date('15. sep. 2023')},
        {activityName: 'Go-Kart', date: new Date('5. dec. 2023')},
    ]
    return (
        <TableContainer component={Paper}
        sx={{ margin: 'auto', width: 'auto', maxWidth: '500px', marginBottom: '15px', marginTop: '5px'}}>
            <Table aria-label="simple table">
                <TableHead sx={{
                    backgroundColor: 'rgb(224, 144, 63)'}}>
                    <TableRow>
                        <TableCell>Aktivitet</TableCell>
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
                            {row.podium ? (
                                <Container>
                                    <Chip sx={{
                                        background: "linear-gradient(45deg, rgba(255,245,172,1) 0%, rgba(255,246,0,1) 100%)"
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
                            {row.date.toDateString()}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}