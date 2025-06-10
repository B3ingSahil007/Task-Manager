import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Autocomplete, Alert, AlertTitle, Checkbox, ListItemText, FormControlLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import Header from '../../components/Header';
import useMediaQuery from '@mui/material/useMediaQuery';

function UpdateTask() {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  //   const url = process.env.REACT_APP_URL;
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('name');
  const [selectedWorkCategory, setSelectedWorkCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [client, setClient] = useState([]);
  const [assignName, setAssignName] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formValues, setFormValues] = useState({
    workCategory: '',
    taskDescription: '',
    notes: '',
    taskEndDate: '',
    subCategory: '',
    client: '',
    assignName: '',
    coWork: [],
    status: 'pending',
    paymentStatus: 'pending',
    financialYear: '',
    billRequired: false,
    deleted: false
  });
  const { id } = useParams();

  // Financial Year options
  const financialYearOptions = [
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2026-2027', label: '2026-2027' }
  ];

  useEffect(() => {
    const fetchTaskData = async () => {
      if (id) {
        try {
          const response = await axios.get(`${url}task/singleTask/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.status != 200) {
            navigate('/logout');
          }
          const taskData = response.data.data;
          console.log("==>>> data ", taskData);
          // Set form values with the fetched task data
          setFormValues({
            workCategory: taskData.workCategory.workCategoryId || '',
            taskDescription: taskData.description || '',
            notes: taskData.notes || '',
            taskEndDate: taskData.taskEndDate || '',
            subCategory: taskData.subCategory.subCategoryId || '',
            client: taskData.client.id || '',
            assignName: taskData.assignName.id || '',
            coWork: taskData.coWork.map((coWorker) => coWorker.id) || [],
            status: taskData.status || 'pending',
            paymentStatus: taskData.paymentStatus || 'pending',
            financialYear: taskData.financialYear || '',
            billRequired: taskData.isBillRequired === 'YES' || taskData.isBillRequired === true || false,
            deleted: taskData.deleted || false
          });
          console.log("==>>> form  ", taskData);

        } catch (error) {
          console.error('Error fetching task data:', error);
        }
      }
    };
    fetchTaskData();
  }, [id, url, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}subcategory/subCategoryList`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const categories = response.data.data.map((category) => ({
          id: category.subCategoryId,
          name: category.name,
          workCategoryId: category.workCategory ? category.workCategory.id : null
        }));
        setSubcategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [url, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}category/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [url, token]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        if (selectedWorkCategory) {
          const selectedCategory = categories.find((category) => category.workCategoryId === selectedWorkCategory);
          if (selectedCategory) {
            const response = await axios.get(`${url}subcategory/workcategory`, {
              headers: {
                Authorization: `Bearer ${token}`
              },
              params: {
                workCategoryId: selectedCategory.workCategoryId
              }
            });
            setSubcategories(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    fetchSubcategories();
  }, [url, token, categories, selectedWorkCategory]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${url}client/allclient`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClient(response.data.data.clientList);
        console.log("clienst===> ", response.data.data.clientList);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClient();
  }, [url, token]);

  useEffect(() => {
    const fetchAssignName = async () => {
      try {
        const response = await axios.get(`${url}user/allusers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check if data exists and map correctly
        const filteredUsers = response.data.data.userList
          .map((user) => ({
            id: user.id,
            name: user.name,
            roleId: user.role.id
          }))
          .filter((user) => user.roleId !== 1); // Filter out users with role ID 1
        console.log("filteredUsers==>>", filteredUsers);
        setAssignName(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAssignName();
  }, [url, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.workCategory) errors.workCategory = 'Work category is required.';
    if (!formValues.subCategory) errors.subCategory = 'Subcategory is required.';
    if (!formValues.client) errors.client = 'Client is required.';
    if (!formValues.assignName) errors.assignName = 'Assign name is required.';
    if (!formValues.taskDescription) errors.taskDescription = 'Task description is required.';
    if (!formValues.taskEndDate) errors.taskEndDate = 'Task end date is required.';
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
    console.log(formValues);

    const payload = {
      name: formValues.taskDescription || '',
      workCategoryId: formValues.workCategory || null,
      subCategoryId: formValues.subCategory || null,
      clientId: formValues.client || null,
      description: formValues.taskDescription || '',
      assignNameId: formValues.assignName || null,
      coWorkIds: formValues.coWork || [],
      status: formValues.status || 'pending',
      notes: formValues.notes || '',
      taskEndDate: formValues.taskEndDate || '',
      paymentStatus: formValues.paymentStatus || 'pending',
      financialYear: formValues.financialYear || '',
      billRequired: formValues.billRequired ? 'YES' : 'NO',
      updatedById: userRole || null,
      updatedOn: new Date().toISOString(),
      deleted: formValues.deleted || false
    };
    console.log(payload);


    try {
      const response = await axios.put(`${url}task/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(payload);

      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/tasklist');
        }, 2000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      navigate('/logout');
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  const handleBillRequiredChange = async (e) => {
    const newValue = e.target.checked;
    try {
      // Call the API to update bill required status
      const response = await axios.put(
        `${url}task/billrequired?taskIds=${id}`, // Using the task ID from URL params
        {
          isBillRequired: newValue
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Update local state to reflect the change
        setFormValues(prevValues => ({
          ...prevValues,
          billRequired: newValue
        }));
      }
    } catch (error) {
      console.error('Error updating bill required status:', error);
      // You might want to show an error notification here
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
        {/* <Header title="EDIT TASK" subtitle="Edit an Existing Task" /> */}
        {showPopup && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <AlertTitle>Task Updated</AlertTitle>
            The task has been updated successfully.
          </Alert>
        )}

        {showError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <AlertTitle>Error</AlertTitle>
            There was an error updating the task.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap="20px" gridTemplateColumns="repeat(4, 1fr)">
            {/* Client Field */}
            <Box gridColumn="span 4">
              <Autocomplete
                fullWidth
                options={client}
                getOptionLabel={(option) => option.name}
                value={client.find((cl) => cl.id === formValues.client) || null}
                onChange={(event, newValue) => {
                  console.log("==>>>", formValues.client);
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    client: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    variant="outlined"
                  // error={!!validationErrors.client}
                  // helperText={validationErrors.client}
                  />
                )}
              />
            </Box>

            {/* Notes Field */}
            <Box gridColumn="span 4">
              <TextField
                fullWidth
                variant="outlined"
                label="Notes"
                onChange={handleInputChange}
                value={formValues.notes}
                name="notes"
                multiline
                rows={6}
              // error={!!validationErrors.notes}
              // helperText={validationErrors.notes}
              />
            </Box>

            {/* Task Description Field */}
            <Box gridColumn="span 4">
              <TextField
                fullWidth
                variant="outlined"
                label="Task Description"
                onChange={handleInputChange}
                value={formValues.taskDescription}
                name="taskDescription"
                multiline
                rows={6}
              // error={!!validationErrors.taskDescription}
              // helperText={validationErrors.taskDescription}
              />
            </Box>

            {/* Assign Name Field */}
            <Box gridColumn="span 4">
              <Autocomplete
                fullWidth
                options={assignName}
                getOptionLabel={(option) => option.name}
                value={assignName.find((user) => user.id === formValues.assignName) || null}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    assignName: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Name"
                    variant="outlined"
                  // error={!!validationErrors.assignName}
                  // helperText={validationErrors.assignName}
                  />
                )}
              />
            </Box>

            {/* Work Category and Sub Category */}
            <Box gridColumn="span 2">
              {categories.length > 0 && (
                <Autocomplete
                  fullWidth
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={categories.find((cat) => cat.workCategoryId === formValues.workCategory) || null}
                  onChange={(event, newValue) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      workCategoryId: newValue ? newValue.workCategoryId : ''
                    }));
                    setSelectedWorkCategory(newValue ? newValue.workCategoryId : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Work Category"
                      variant="outlined"
                    // error={!!validationErrors.workCategory}
                    // helperText={validationErrors.workCategory}
                    />
                  )}
                />
              )}
            </Box>
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={subcategories}
                getOptionLabel={(option) => option.name}
                value={subcategories.find((sub) => sub.id === formValues.subCategory) || null}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    subCategory: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    variant="outlined"
                  // error={!!validationErrors.subCategory}
                  // helperText={validationErrors.subCategory}
                  />
                )}
              />
            </Box>

            {/* Status and Payment Status */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'ONGOING', label: 'Ongoing' },
                  { value: 'COMPLETED', label: 'Completed' }
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'ONGOING', label: 'Ongoing' },
                    { value: 'COMPLETED', label: 'Completed' }
                  ].find((status) => status.value === formValues.status) || null
                }
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    status: newValue ? newValue.value : ''
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
              />
            </Box>

            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'PAID', label: 'Paid' }
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'PAID', label: 'Paid' }
                  ].find((status) => status.value === formValues.paymentStatus) || null
                }
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    paymentStatus: newValue ? newValue.value : ''
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Payment Status" variant="outlined" />}
              />
            </Box>

            {/* Financial Year Field */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={financialYearOptions}
                getOptionLabel={(option) => option.label}
                value={financialYearOptions.find((option) => option.value === formValues.financialYear) || null}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    financialYear: newValue ? newValue.value : ''
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Financial Year" variant="outlined" />}
              />
            </Box>

            <Box gridColumn="span 2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.billRequired === true || formValues.billRequired === 'YES'}
                    onChange={handleBillRequiredChange}
                    name="billRequired"
                  />
                }
                label="Bill Required"
              />
            </Box>

            <Box gridColumn="span 2">
              <Autocomplete
                multiple
                id="coWork"
                value={assignName.filter((user) => formValues.coWork.includes(user.id))} // Ensure the value is a list of full user objects (not just ids)
                onChange={(event, newValue) => {
                  // Store only the ids when a coworker is selected
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    coWork: newValue.map((coWorker) => coWorker.id) // Only store ids
                  }));
                }}
                options={assignName}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id} // Compare using `id`
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Co Workers"
                    variant="outlined"
                  // error={!!validationErrors.coWork}
                  // helperText={validationErrors.coWork}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Checkbox checked={formValues.coWork.includes(option.id)} />
                    <ListItemText primary={option.name} />
                  </li>
                )}
              />
            </Box>

            <Box gridColumn="span 2">
              <TextField
                fullWidth
                variant="outlined"
                label="Task End Date"
                type="date" // Set the input type to date
                onChange={handleInputChange}
                value={formValues.taskEndDate}
                name="taskEndDate"
                InputLabelProps={{
                  shrink: true // Ensures the label shrinks when displaying a selected date
                }}
              // error={!!validationErrors.taskEndDate}
              // helperText={validationErrors.taskEndDate}
              />
            </Box>
          </Box>

          <Button color="primary" type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Update Task
          </Button>
        </form>
      </Box>
    </>
  );
}

export default UpdateTask;