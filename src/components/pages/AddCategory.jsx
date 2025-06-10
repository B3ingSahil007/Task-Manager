import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Button, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
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

  const handleFormSubmit = async (values) => {
    console.log('API response:', values);
    try {
      const response = await axios.post(`${url}category/add`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API response:', response);
      setResMessage(response.data.message);

      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/catogery');
        }, 1000);
      } else {
        navigate('/logout');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      navigate('/logout');
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '500px',
          margin: '100px auto',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff'
        }}
      >
        <h2
          style={{
            marginBottom: '20px',
            color: '#333',
            fontWeight: '500'
          }}
        >Add Category</h2>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            name: ''
          }}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="20px">
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Category Name"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  Create New Category
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {showPopup && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">
              <AlertTitle>{resMessage}</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}

      {showError && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">
              <AlertTitle>{resMessage}</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}
    </>
  );
}

export default AddCategory;
