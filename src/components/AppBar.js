import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import EchoValleyPic from '../assets/EchoValley.png';
import axios from 'axios';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function AppBar(props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [openHistory, setOpenHistory] = useState(false);
    const inputRef = useRef(null); // Reference for the input field
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

    // Check if a valid token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
            // Optionally, validate the token (you can decode or check expiration here)
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Fetch products from the backend
    useEffect(() => {
        axios.get('http://localhost:4000/login/getProducts')
            .then(response => {
                setProducts(response.data);  // Assuming response.data is the products array
            })
            .catch(error => {
                console.error("There was an error fetching the products:", error);
            });
    }, []);

    // Load search history from localStorage
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(storedHistory);
    }, []);

    // Handle search change with debouncing
    const handleSearchChange = (e) => {
        const newSearchQuery = e.target.value;
        setSearchQuery(newSearchQuery);

        // Clear the previous timeout if the user is still typing
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout to add the search term to history after 500ms of idle time
        const newTimeout = setTimeout(() => {
            if (newSearchQuery && !searchHistory.includes(newSearchQuery)) {
                const updatedHistory = [newSearchQuery, ...searchHistory].slice(0, 5);
                setSearchHistory(updatedHistory);
                localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            }
        }, 500); // Adjust the debounce time (500ms)

        setTypingTimeout(newTimeout); // Store the timeout ID
    };

    // Handle focus and blur events to toggle the search history dropdown
    const handleFocus = () => {
        setOpenHistory(true);
    };

    const handleBlur = () => {
        // Delay hiding history to allow user to click on a history item
        setTimeout(() => {
            setOpenHistory(false);
        }, 200);
    };

    // Handle selecting a search history item
    const handleHistorySelect = (query) => {
        setSearchQuery(query);
        setOpenHistory(false);
    };

    // Filter products based on the search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <MuiAppBar elevation={1} sx={{ backgroundColor: 'black' }} position="fixed" {...props}>
                <Toolbar>
                    {/* Logo on the top left */}
                    <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
                        <img
                            src={EchoValleyPic}
                            alt="Logo"
                            style={{ height: '55px', width: 'auto' }}
                        />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        EchoValley
                    </Typography>

                    {/* Render Search bar only if logged in */}
                    {isLoggedIn && (
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search products…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                inputRef={inputRef} // Assign the ref to the input field

                            />
                        </Search>
                    )}

                    {/* Display the search history dropdown */}
                    {openHistory && searchHistory.length > 0 && (
                        <Popper open={openHistory} placement="bottom-end" transition>
                            <Paper sx={{ marginRight: '0', marginLeft: '200vh', }}>
                                {searchHistory.map((query, index) => (
                                    <MenuItem key={index} onClick={() => handleHistorySelect(query)}>
                                        {query}
                                    </MenuItem>
                                ))}
                            </Paper>
                        </Popper>
                    )}
                </Toolbar>
            </MuiAppBar>

            {/* Display the filtered products only if searchQuery is not empty */}
            <div style={{ marginTop: '100px' }}>
                {searchQuery && filteredProducts.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">
                        No products found
                    </Typography>
                ) : (
                    searchQuery && (
                        <div>
                            {filteredProducts.map(product => (
                                <div key={product.id}>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <img src={product.picture} alt={product.name} width="50" />
                                    <Typography variant="body1">${product.price}</Typography>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AppBar;
