import React from 'react';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const AppFooter = () => {
    const loadedCount = useSelector(state => state.loadedCount);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color="black" sx={{ top: 'auto', bottom: 0, backgroundColor: 'black' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
                        Products Loaded: {loadedCount}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppFooter;
