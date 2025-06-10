import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Alert,
  AlertTitle
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';

const CombinedLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL_API;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(`${url}user/login`, values);
      setResMessage(response.data.message);

      if (response.data.statusCode === 200) {
        await localStorage.setItem('email', response.data.data.userInfo.email);
        await localStorage.setItem('id', response.data.data.userInfo.id);
        await localStorage.setItem('token', response.data.data.token);
        await localStorage.setItem('role', response.data.data.userInfo.role.id);
        await localStorage.setItem('userRole', response.data.data.userInfo.role.name);

        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      {showError && (
        <Alert severity="error">
          <AlertTitle>{resMessage}</AlertTitle>
        </Alert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required')
        })}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
              />
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '12px' }}>
                Login
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CombinedLoginForm;
