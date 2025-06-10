import { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Alert, AlertTitle } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddUser = () => {
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
  const [roles, setRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false); // Fixed naming convention
  const [resMessage, setResMessage] = useState();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}role/allrole`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status != 200) {
          navigate('/logout');
        }
        console.log(response.data.data);
        const filteredRoles = response.data.data.filter((role) => role.id !== 1);
        setRoles(filteredRoles);
      } catch (error) {
        navigate('/logout');
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, [url, token]);

  const handleFormSubmit = async (values) => {
    console.log('values', values);
    console.log('token', token);
    try {
      const response = await axios.post(`${url}user/addUser`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status != 200) {
        navigate('/logout');
      }
      console.log('User added successfully:', response);
      setResMessage(response.data.message);

      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false); // Hide the popup after 4 seconds
          navigate('/ShowUsers'); // Navigate after popup is hidden
        }, 4000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <>
      <Box m="20px">
        {/* <Header title="CREATE USER" subtitle="Create a New User Profile" /> */}
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            name: '',
            email: '',
            mobile: '',
            password: '',
            role: ''
          }}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  width: '40%',
                  margin: '20px auto',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center', // Center content vertically
                  flexDirection: 'column',
                  padding: '15px', // Add padding for spacing
                  borderRadius: '12px', // Optional: add rounded corners
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Optional: add a shadow for better visuals
                }}
              >
                <h3
                  style={{
                    color: '#333',
                    height: '7px',
                    fontSize: '20px'
                  }}
                >
                  Add User
                </h3>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  sx={{ gridColumn: 'span 12' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  sx={{ gridColumn: 'span 12' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Mobile"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobile}
                  name="mobile"
                  sx={{ gridColumn: 'span 12' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: 'span 12' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  select
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  sx={{ gridColumn: 'span 12' }}
                >
                  {Array.isArray(roles) &&
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                </TextField>
                {/* <Box width="100%" mt="20px"> */}
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{ width: '150px' }} // Ensure button spans full width
                >
                  Create New User
                </Button>
                {/* </Box> */}
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {showPopup && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">
              <AlertTitle>Log In successfully</AlertTitle>
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
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  mobile: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('required'),
  role: yup.string().required('required'),
  password: yup.string().required('required')
});

export default AddUser;
