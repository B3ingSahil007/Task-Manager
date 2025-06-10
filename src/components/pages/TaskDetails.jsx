import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';

function ShowTaskDetails() {
  const { id } = useParams(); // Get task ID from route params
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Adjust based on where your token is stored

  useEffect(() => {
    const fetchtaskDetails = async () => {
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

        const response = await axios.get(`${import.meta.env.VITE_URL_API}task/singleTask/${id}`, config);
        if (response.status != 200) {
          navigate('/logout');
        }
        setTaskDetails(response.data.data); // Adjust based on API response structure
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch task details. Please try again later.');
        navigate('/logout');
      } finally {
        setLoading(false);
      }
    };

    fetchtaskDetails();
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
      <h1>Task Details</h1>

      <h3 style={{ color: '#1677FF' }}>Task Information</h3>
      {/* <hr /> */}
      <p>
        <b>Task Name : </b> {taskDetails.name}
        <br />
        <b>Task Notes : </b> {taskDetails.notes}
        <br />
        <b>Assign Name : </b> {taskDetails.assignName.name || 'N/A'}
        <br />
        <b>Client Name : </b> {taskDetails.client.name || 'N/A'}
        <br />
        <b>Task Description : </b> {taskDetails.description || 'N/A'}
        <br />
        <b>Task Assign Date : </b> {taskDetails.assignDate || 'N/A'}
        <br />
        <b>Task End Date : </b> {taskDetails.taskEndDate || 'N/A'}
        <br />
      </p>
      <h3 style={{ color: '#1677FF' }}>Category Information</h3>
      {/* <hr /> */}
      <p>
        <b>Category : </b> {taskDetails.workCategory.name || 'N/A'}
        <br />
        <b>Sub Category : </b> {taskDetails.subCategory.name || 'N/A'}
        <br />
        
        <b>Reference : </b> {taskDetails.reference || 'N/A'}
        <br />
      </p>
      <h3 style={{ color: '#1677FF' }}>Status</h3>
      {/* <hr /> */}
      <p>
        <b>Task Status : </b> {taskDetails.status || 'N/A'}
        <br />
        <b>Payment Status : </b> {taskDetails.paymentStatus || 'N/A'}
        <br />
      </p>
    </Box>
  );
}

export default ShowTaskDetails;
