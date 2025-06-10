import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Stack, Alert, AlertTitle } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddReference = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);
  const { id } = useParams();
  // const url = process.env.REACT_APP_URL;
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');

  const [referenceData, setReferenceData] = useState({
    referenceName: '',
    mobileNo: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();

  // Fetch the reference data if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${url}reference/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setReferenceData({
            referenceName: response.data.data.referenceName,
            mobileNo: response.data.data.mobileNo
          });
        })
        .catch((error) => {
          console.error('Error fetching reference data:', error);
          navigate('/logout');
          setShowError(true);
        });
    }
  }, [id, url, token]);

  const handleFormSubmit = async (values) => {
    try {
      const endpoint = id
        ? `${url}reference/update/${id}` // PUT for updating
        : `${url}reference/create`; // POST for creating

      const method = id ? 'put' : 'post';

      const response = await axios({
        method,
        url: endpoint,
        data: values,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status != 200) {
        navigate('/logout');
      }

      setResMessage(response.data.message);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate(-1);
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Error creating/updating reference:', error);
      
      setShowError(true);
    }
  };

  const validationSchema = yup.object().shape({
    referenceName: yup.string().required('Reference Name is required'),
    mobileNo: yup
      .string()
      .matches(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/, 'Invalid mobile number format')
      .required('Mobile Number is required')
  });

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={referenceData} validationSchema={validationSchema} enableReinitialize={true}>
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
            {id ? 'Edit Reference' : 'Add References'}
          </h2>

          <TextField
            style={{ width: '100%', marginBottom: '20px' }}
            label="Reference Name"
            required
            variant="outlined"
            name="referenceName"
            value={values.referenceName}
            onBlur={handleBlur}
            onChange={handleChange}
            error={!!touched.referenceName && !!errors.referenceName}
            helperText={touched.referenceName && errors.referenceName}
          />

          <TextField
            style={{ width: '100%', marginBottom: '20px' }}
            label="Mobile number"
            required
            variant="outlined"
            name="mobileNo"
            value={values.mobileNo}
            onBlur={handleBlur}
            onChange={handleChange}
            error={!!touched.mobileNo && !!errors.mobileNo}
            helperText={touched.mobileNo && errors.mobileNo}
          />

          <Button variant="contained" color="primary" style={{ width: '50%' }} type="submit">
            {id ? 'Update Reference' : 'Add Reference'}
          </Button>

          {showPopup && (
            <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                {resMessage || 'Reference saved successfully!'}
              </Alert>
            </Stack>
          )}

          {showError && (
            <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {resMessage || 'An error occurred while saving the reference.'}
              </Alert>
            </Stack>
          )}
        </Box>
      )}
    </Formik>
  );
};

export default AddReference;
