import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';

function ShowClientDetails() {
  const { id } = useParams(); // Get client ID from route params
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Adjust based on where your token is stored

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        // Get the token from localStorage or sessionStorage (or other source)

        // If token is not available, you can handle this situation here (e.g., redirect to login)
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        // Set Authorization header with Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`${import.meta.env.VITE_URL_API}client/get/${id}`, config);
        setClientDetails(response.data.data); // Adjust based on API response structure
      } catch (err) {
        navigate('/logout');
        setError('Failed to fetch client details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  const CardWrapper = styled(Card)(({ theme }) => ({
    '&:hover': {
      boxShadow: theme.shadows[6],
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease'
    },
    cursor: 'pointer'
  }));

  return (
    <Box m={4} display="flex" flexDirection="column">
      <Typography variant="h4" gutterBottom>
        Client Details
      </Typography>

      <h3 style={{ color: '#1677FF' }}>Personal Information</h3>
      {/* <hr /> */}
      <p>
        <b>Name : </b> {clientDetails.name}
        <br />
        <b>Firm Name : </b> {clientDetails.firmName || 'N/A'}
        <br />
        <b>PAN Card Number : </b> {clientDetails.panNo || 'N/A'}
        <br />
        <b>GST Number : </b> {clientDetails.gstNo || 'N/A'}
        <br />
      </p>
      <h3 style={{ color: '#1677FF' }}>Contact Information</h3>
      {/* <hr /> */}
      <p>
        <b>Email : </b> {clientDetails.email || 'N/A'}
        <br />
        <b>Mobile Number : </b> {clientDetails.mobile || 'N/A'}
        <br />
        <b>Reference : </b> {clientDetails.reference || 'N/A'}
        <br />
      </p>
      <h3 style={{ color: '#1677FF' }}>Address</h3>
      {/* <hr /> */}
      <p>
        <b>Address : </b> {clientDetails.address || 'N/A'}
        <br />
      </p>
    </Box>
  );
}

export default ShowClientDetails;
