import { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Alert, AlertTitle } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Header from '../../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditForm = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  //   const url = process.env.REACT_APP_URL;
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
  const [roles, setRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}role/allrole`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request headers
          }
        });
        if (response.status != 200) {
          navigate('/logout');
        }
        // Filter out role with ID 1
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
    console.log('click updateUser');
    const id = user.id;
    console.log(id);

    // Prepare the data in the required format
    const payload = {
      name: values.name,
      mobile: values.mobile,
      email: values.email,
      role: {
        id: values.role // Wrap role ID as an object
      }
    };

    try {
      const response = await axios.put(`${url}user/edituser/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status != 200) {
        navigate('/logout');
      }
      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/ShowUsers');
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

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
        {/* <Header title="EDIT USER" subtitle="Edit User Profile" /> */}

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            name: user.name || '',
            mobile: user.mobile || '',
            email: user.email || '', // Include email in initialValues
            role: user.role?.id || '' // Set role safely with fallback
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
                  '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled
                  type="text"
                  label="Email"
                  value={user.email}
                  sx={{ gridColumn: 'span 4' }}
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
                  error={!!touched.mobile && !!errors.mobile}
                  helperText={touched.mobile && errors.mobile}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  select
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  sx={{ gridColumn: 'span 4' }}
                >
                  {Array.isArray(roles) &&
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  Update User
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
              <AlertTitle> Update success </AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}
      {showError && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">
              <AlertTitle> {resMessage} </AlertTitle>
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
  mobile: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('required'),
  role: yup.string().required('required')
});

export default EditForm;
