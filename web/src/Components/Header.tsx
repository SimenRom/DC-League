import { Box, AppBar, Toolbar, Avatar } from '@mui/material';
import { useFirebaseContext } from './FirebaseContextProvider';
import GoogleSigninButton from './GoogleSigninButton';
import styles from './Header.module.css';

export default function () {
    let firebaseAppContext = useFirebaseContext();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", maxWidth: "500px", flexGrow: 1}}>
                    <div className={styles.logoWrapper}>
                        <img src={'DCLeagueLogo.png'} className={styles.logo} alt="Logo"/>
                    </div>
                    
                    <div className={styles.profile}>
                        {firebaseAppContext.user ? <Avatar alt="Remy Sharp" src={firebaseAppContext.user.photoURL || ''} sx={{marginRight: '10px'}}/> : null }
                        <GoogleSigninButton/>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}