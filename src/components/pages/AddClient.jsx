import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Header from '../../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddClient = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);
  const isNonMobile = useMediaQuery('(min-width:600px)');
  //   const url = process.env.REACT_APP_URL;
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');
  //   const navigate = useNavigate();
  const { id } = useParams(); // Get the client ID from the route

  const [openAddReferenceDialog, setOpenAddReferenceDialog] = useState(false);
  const [newReferenceName, setNewReferenceName] = useState('');
  const [newReferenceMobile, setNewReferenceMobile] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    firmName: '',
    panNo: '',
    gstNo: '',
    email: '',
    address: '',
    mobile: '',
    reference: ''
  });

  const handleAddReference = async () => {
    try {
      const response = await axios.post(
        'https://catask.co.in/api/v1/reference/create',
        {
          referenceName: newReferenceName,
          mobileNo: newReferenceMobile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.statusCode === 200 || 201) {
        setReferences([...references, response.data.data]);
        setNewReferenceName('');
        setNewReferenceMobile('');
        setOpenAddReferenceDialog(false);
      } else {
        console.error('Failed to add reference:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding reference:', error);
      navigate('/logout');
    }
  };

  // Fetch client data for editing
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const response = await axios.get(`${url}client/get/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const clientData = response.data.data;
          setInitialValues({
            name: clientData.name || '',
            firmName: clientData.firmName || '',
            panNo: clientData.panNo || '',
            gstNo: clientData.gstNo || '',
            email: clientData.email || '',
            address: clientData.address || '',
            mobile: clientData.mobile || '',
            reference: clientData.reference || ''
          });
          if (response.status != 200) {
            navigate('/logout');
          }
        } catch (error) {
          console.error('Error fetching client data:', error);
          navigate('/logout');
        }
      };

      fetchClient();
    }
  }, [id, url, token]);

  // Fetch references
  useEffect(() => {
    const fetchReferences = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}reference/all?search=${searchTerm}&page=1&size=10`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReferences(response.data.data.content);
        if (response.status != 200) {
          navigate('/logout');
        }
      } catch (error) {
        console.error('Error fetching references:', error);
        navigate('/logout');
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [searchTerm, token, url]);

  const handleFormSubmit = async (values) => {
    try {
      const endpoint = id ? `${url}client/editclient/${id}` : `${url}client/addclient`;
      const method = id ? 'put' : 'post';

      const response = await axios[method](endpoint, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/Client');
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
      if (response.status != 200) {
        navigate('/logout');
      }
    } catch (error) {
      navigate('/logout');
      console.error('Error submitting form:', error);
    }
  };

  const addMoreOption = { referenceName: 'Add more...' };

  return (
    <>
      <Box
        m="20px"
        sx={{
          width: '40%',
          margin: '20px auto',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h2>Add Client</h2>
        {/* <Header title={id ? 'EDIT CLIENT' : 'CREATE CLIENT'} subtitle={id ? 'Edit the Client Profile' : 'Create a New Client Profile'} /> */}

        <Formik
          enableReinitialize
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
        // validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Name"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.name && !!errors.name}
                  // helperText={touched.name && errors.name}
                  sx={{ gridColumn: 'span 4' }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Firm Name"
                  name="firmName"
                  value={values.firmName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.firmName && !!errors.firmName}
                  // helperText={touched.firmName && errors.firmName}
                  sx={{ gridColumn: 'span 4' }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.email && !!errors.email}
                  // helperText={touched.email && errors.email}
                  sx={{ gridColumn: 'span 4' }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Address"
                  required
                  name="address"
                  value={values.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.address && !!errors.address}
                  // helperText={touched.address && errors.address}
                  sx={{ gridColumn: 'span 4' }}
                  multiline
                  rows={4}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  required
                  label="PAN Card"
                  name="panNo"
                  value={values.panNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.panNo && !!errors.panNo}
                  // helperText={touched.panNo && errors.panNo}
                  sx={{ gridColumn: 'span 2' }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="GST Number"
                  name="gstNo"
                  value={values.gstNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.gstNo && !!errors.gstNo}
                  // helperText={touched.gstNo && errors.gstNo}
                  sx={{ gridColumn: 'span 2' }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Mobile"
                  required
                  name="mobile"
                  value={values.mobile}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // error={!!touched.mobile && !!errors.mobile}
                  // helperText={touched.mobile && errors.mobile}
                  sx={{ gridColumn: 'span 2' }}
                />

                <Autocomplete
                  fullWidth
                  id="reference"
                  required
                  name="reference"
                  sx={{ gridColumn: 'span 2' }}
                  options={[{ referenceName: 'Add more...' }, ...references]} // Add "Add more..." option
                  getOptionLabel={(option) => option.referenceName || ''}
                  value={references.find((ref) => ref.referenceName === values.reference) || null}
                  onChange={(event, newValue) => {
                    if (newValue && newValue.referenceName === 'Add more...') {
                      setOpenAddReferenceDialog(true); // Open the dialog for adding reference
                    } else {
                      setFieldValue('reference', newValue ? newValue.referenceName : '');
                    }
                  }}
                  onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Reference"
                      variant="outlined"
                    // error={!!touched.reference && !!errors.reference}
                    // helperText={touched.reference && errors.reference}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.referenceName === value}
                  loading={loading}
                  noOptionsText="No references found"
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.referenceName === 'Add more...' ? (
                        <Button onClick={() => setOpenAddReferenceDialog(true)} fullWidth variant="outlined">
                          Add More
                        </Button>
                      ) : (
                        <ListItemText primary={option.referenceName} />
                      )}
                    </li>
                  )}
                />
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  {id ? 'Update Client' : 'Create Client'}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {showPopup && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="success">
            <AlertTitle>{id ? 'Client Updated Successfully' : 'Client Created Successfully'}</AlertTitle>
          </Alert>
        </Stack>
      )}

      {showError && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="error">
            <AlertTitle>{resMessage}</AlertTitle>
          </Alert>
        </Stack>
      )}

      <Dialog open={openAddReferenceDialog} onClose={() => setOpenAddReferenceDialog(false)}>
        <DialogTitle>Add New Reference</DialogTitle>
        <DialogContent>
          <TextField
            label="Reference Name"
            value={newReferenceName}
            onChange={(e) => setNewReferenceName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField label="Mobile Number" value={newReferenceMobile} onChange={(e) => setNewReferenceMobile(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddReferenceDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddReference} color="secondary">
            Add Reference
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  firmName: yup.string().required('Firm Name is required'),
  panNo: yup.string().required('PAN Card is required'),
  gstNo: yup.string().required('GST Number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  address: yup.string().required('Address is required'),
  mobile: yup.string().required('Mobile is required'),
  reference: yup.string().required('Reference is required')
});

export default AddClient;
