import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoadedCount } from '../redux/actions';
import InfiniteScroll from 'react-infinite-scroll-component';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);  // State to store products
    const [error, setError] = useState(null);  // State for error handling
    const [hasMore, setHasMore] = useState(true);  // To track if more data exists
    const [page, setPage] = useState(1);  // Track the current page
    const [loading, setLoading] = useState(false);  // State for loading indicator
    const [productIds, setProductIds] = useState(new Set());  // To avoid duplicates

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/login/getProducts', {
                    params: { page, limit: 20 },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newData = response.data;

                // If no products are returned, or we have loaded 100 products, stop the scroll
                if (newData.length === 0 || data.length >= 100) {
                    setHasMore(false);  // No more data or reached 100 products
                } else {
                    // Filter out already loaded products by product ID
                    const filteredData = newData.filter(product => !productIds.has(product.id));

                    if (filteredData.length > 0) {
                        setLoading(true);  // Start the loading spinner

                        // Introduce a 5-second delay before showing new data
                        setTimeout(() => {
                            // Add filtered data and update the product IDs
                            setData(prevData => {
                                const updatedData = [...prevData, ...filteredData];
                                dispatch(setLoadedCount(updatedData.length));  // Update loaded count in Redux
                                return updatedData;
                            });

                            // Update product IDs to avoid duplicates
                            setProductIds(prevIds => {
                                const newProductIds = newData.map(product => product.id);
                                return new Set([...prevIds, ...newProductIds]);
                            });

                            setLoading(false);  // Stop the loading spinner
                        }, 5000);  // Delay for 5 seconds before loading the new products
                    }
                }
            } catch (error) {
                setError('Error fetching products data.');
                setLoading(false);  // Stop loading spinner in case of an error
            }
        };

        getDashboardData();
    }, [page, dispatch, productIds, data.length]);  // Trigger effect when page or data.length changes

    const loadMoreData = () => {
        if (!loading && data.length < 100) {
            setPage(prevPage => prevPage + 1);  // Load next page
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', marginBottom: '10vh' }}>
            <h2>Products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <InfiniteScroll
                dataLength={data.length}  // Current number of products
                next={loadMoreData}  // Function to load more data
                hasMore={hasMore}  // Whether more data exists
                loader={loading && <p>Loading...</p>}  // Show loading spinner
                endMessage={<p>No more products to display.</p>}  // End message when no more products
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {data.map(product => (
                        <div key={product._id} style={{ margin: '10px', textAlign: 'center' }}>
                            <img src={product.picture} alt={product.name} width="200" />
                            <h3>{product.name}</h3>
                            <p>Product ID: {product.id}</p>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Dashboard;
