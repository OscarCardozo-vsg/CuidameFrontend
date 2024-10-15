import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
    return (
        <>
            <AppBar
                position="static"
                style={{backgroundColor: '#CAE2EE', color: 'black', height: '100%'}}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        style={{ fontFamily: 'Ubuntu', color: '#255088', width: '90vw', textAlign: 'center' }}
                    >
                        CuidaMe
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
