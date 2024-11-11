import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
    Box, Button, CssBaseline, FormControlLabel, Checkbox,
    TextField, Typography, Link, Divider, Container, Card
} from '@mui/material';
import { GoogleIcon, FacebookIcon } from './CustomIcons.js';
import { login } from '../redux/userSlice';

const AppBody = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login/login', {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store token
                dispatch(login(response.data.token)); // Dispatch login action to Redux
                window.location.reload(); // Trigger a re-render after login
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('Invalid credentials or server error.');
            console.log(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    justifyContent: 'center',
                    marginTop: '7.5vh',
                    marginBottom: '7.5vw',
                }}
            >
                <Card sx={{ padding: 4, width: '100%', boxShadow: 3 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMessage && (
                            <Typography color="error" variant="body2" align="center">
                                {errorMessage}
                            </Typography>
                        )}
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Divider sx={{ my: 2 }}>or</Divider>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Facebook')}
                            startIcon={<FacebookIcon />}
                        >
                            Sign in with Facebook
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Box>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                Don&apos;t have an account?{' '}
                                <Link href="#" variant="body2">
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Container>
    );
};

export default AppBody;
