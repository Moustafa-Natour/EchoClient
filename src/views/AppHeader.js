import React from 'react'
import Box from '@mui/material/Box';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
const AppHeader = () => {
    return (
        <div>
            <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Box />

                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
    )
}

export default AppHeader