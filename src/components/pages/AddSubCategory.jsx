import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Alert, AlertTitle, Stack } from '@mui/material';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddSubCategory() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
//   const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}category/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status != 200) {
          navigate('/logout');
        }
        setCategories(response.data.data);
      } catch (error) {
        navigate('/logout');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [url, token]);

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${url}subcategory/saveSubCategories`,
        [
          {
            name: values.name,
            workCategory: {
              workCategoryId: selectedCategoryId
            }
          }
        ],
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status != 200) {
        navigate('/logout');
      }
      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/SubCategory');
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      navigate('/logout');
      setShowError(true);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={{
        name: ''
      }}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          borderRadius={2}
          boxShadow={3}
          sx={{
            width: '40%',
            margin: '20px auto',
            backgroundColor: '#f9f9f9'
          }}
          onSubmit={handleSubmit}
        >
          <h2
            style={{
              marginBottom: '20px',
              color: '#333',
              fontWeight: '500'
            }}
          >
            Create Subcategory
          </h2>

          <TextField
            style={{ width: '100%', marginBottom: '20px' }}
            label="Subcategory Name"
            variant="outlined"
            name="name"
            required
            value={values.name}
            onBlur={handleBlur}
            onChange={handleChange}
            error={!!touched.name && !!errors.name}
            helperText={touched.name && errors.name}
          />

          <TextField
            style={{ width: '100%', marginBottom: '20px' }}
            select
            variant="outlined"
            required
            label="Select Category"
            value={selectedCategoryId || ''}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.workCategoryId} value={category.workCategoryId}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" color="primary" style={{ width: '50%' }} type="submit">
            Create Subcategory
          </Button>

          {showPopup && (
            <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                {resMessage || 'Subcategory created successfully!'}
              </Alert>
            </Stack>
          )}

          {showError && (
            <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {resMessage || 'An error occurred while creating the subcategory.'}
              </Alert>
            </Stack>
          )}
        </Box>
      )}
    </Formik>
  );
}

export default AddSubCategory;
