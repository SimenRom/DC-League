import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function() {
    let rows: any[] = [
        {name: 'Trym', points: 5},
        {name: 'Simen R', points: 3},
        {name: 'Brian', points: 2},
    ]
    return (
        <TableContainer component={Paper}
        sx={{ margin: 'auto', width: 'auto', maxWidth: '500px'}}>
            <Table aria-label="simple table">
                <TableHead sx={{
                    backgroundColor: 'rgb(224, 144, 63)'}}>
                    <TableRow>
                        <TableCell>Poengtavle</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 }, 
                        '&:nth-of-type(even)':  {backgroundColor: 'lightgray'},
                        '&:nth-of-type(odd)':  {backgroundColor: 'rgb(241, 241, 241)'},
                    }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.points}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}