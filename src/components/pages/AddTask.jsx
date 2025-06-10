import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  AlertTitle,
  Select,
  Checkbox,
  ListItemText,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  FormControlLabel
} from '@mui/material';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import Header from '../../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddTask() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);
  // const isNonMobile = useMediaQuery('(min-width:600px)');
  // const url = process.env.REACT_APP_URL;
  const url = import.meta.env.VITE_URL_API;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  const userName = localStorage.getItem('name');
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [client, setClient] = useState([]);

  const [clientForm, setClientForm] = useState({
    name: '',
    firmName: '',
    email: '',
    address: '',
    panNo: '',
    gstNo: '',
    mobile: '',
    reference: ''
  });

  const handleClientInputChange = (event) => {
    const { name, value } = event.target;
    setClientForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };




  const [loading, setLoading] = useState(false); // To manage loading state
  const [searchTerm, setSearchTerm] = useState(''); // If needed, for filtering
  const [value, setValue] = useState(''); // Current value selected in the dropdown
  const [priority, setPriority] = useState(''); // Current value selected in the dropdown
  const [references, setReferences] = useState([]); // To store the references



  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');

  // This will run every time formValues changes


  // Step 2: Handle the change in the selected financial year



  // Function to fetch references from the API
  const fetchReferences = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}reference/all?search=${searchTerm}&page=1&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }
      setReferences(response.data.data.content);
    } catch (error) {
      // navigate('/logout');
      console.error('Error fetching references:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch references on component mount
  useEffect(() => {
    fetchReferences();
  }, [searchTerm]);

  const financialYearOptions = [
    { value: '2005-06', label: '2005-06' },
    { value: '2006-07', label: '2006-07' },
    { value: '2007-08', label: '2007-08' },
    { value: '2008-09', label: '2008-09' },
    { value: '2009-10', label: '2009-10' },
    { value: '2010-11', label: '2010-11' },
    { value: '2011-12', label: '2011-12' },
    { value: '2012-13', label: '2012-13' },
    { value: '2013-14', label: '2013-14' },
    { value: '2014-15', label: '2014-15' },
    { value: '2015-16', label: '2015-16' },
    { value: '2016-17', label: '2016-17' },
    { value: '2017-18', label: '2017-18' },
    { value: '2018-19', label: '2018-19' },
    { value: '2019-20', label: '2019-20' },
    { value: '2020-21', label: '2020-21' },
    { value: '2021-22', label: '2021-22' },
    { value: '2022-23', label: '2022-23' },
    { value: '2023-24', label: '2023-24' },
    { value: '2024-25', label: '2024-25' },
    { value: '2025-26', label: '2025-26' },
    { value: '2026-27', label: '2026-27' },
    { value: '2027-28', label: '2027-28' },
    { value: '2028-29', label: '2028-29' },
    { value: '2029-30', label: '2029-30' },
    { value: '2030-31', label: '2030-31' }
  ];

  const handleFinancialYearChange = (event, newValue) => {
    // Update the selected financial year in the state
    if (newValue) {
      setSelectedFinancialYear(newValue.value);
    }
  };

  const [assignName, setAssignName] = useState([]);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState('0');
  const [selectsedSubCategory, setSelectsedSubCategory] = useState('0');
  const [subcategories, setSubcategories] = useState([]);
  const [loading1, setLoading1] = useState(true);
  // API endpoint URL

  // category pop

  const [openClientPopup, setOpenClientPopup] = useState(false);
  const [openCategoryPopup, setOpenCategoryPopup] = useState(false);
  const [categoryFormValues, setCategoryFormValues] = useState({
    categoryName: ''
  });

  const handleAddMoreClientClick = () => setOpenClientPopup(true);
  const handleAddMoreCategoryClick = () => setOpenCategoryPopup(true);
  const handleCategoryPopupClose = () => setOpenCategoryPopup(false);
  const handleClientPopupClose = () => setOpenClientPopup(false);

  const handleCategoryInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySave = async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    try {
      const response = await axios.post(
        `${url}category/add`,
        { name: categoryFormValues.categoryName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      // if (response.status != 200) {
      //   navigate('/logout');
      // }
      console.log('Category added successfully:', response.data);
      setCategories((prev) => [...prev, response.data]); // Update categories list
      setCategoryFormValues({ categoryName: '' }); // Reset form
      setOpenCategoryPopup(false); // Close popup
      // NO navigate or redirection logic here
    } catch (error) {
      // navigate('/logout');
      console.error('Error adding category:', error);
    }

    fetchWorkCategories();
  };

  const handleClientSave = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }
    try {
      // API call
      const response = await fetch(`${url}client/addclient`, {
        method: 'POST', // Specify the HTTP method
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: clientForm.clientName,
          email: clientForm.email,
          firmName: clientForm.firmName,
          address: clientForm.address,
          mobile: clientForm.mobileNumber,
          gstNo: clientForm.gstNumber,
          panNo: clientForm.panCard,
          reference: clientForm.reference
        })
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to add client');
      }

      const data = await response.json(); // Parse the JSON response
      console.log('Client added successfully:', data);
      console.log("==>>> Form", clientForm);

      // Reset form and close dialog
      setClientForm({
        name: '',
        firmName: '',
        email: '',
        address: '',
        panNo: '',
        gstNo: '',
        mobile: '',
        reference: ''
      });
      setOpenClientPopup(false);
    } catch (error) {
      // navigate('/logout');
      console.error('Error adding client:', error);
    }
  };

  const [formValues, setFormValues] = useState({
    workCategory: '',
    taskDescription: '',
    notes: '',
    taskEndDate: new Date() + "T00:00:00",
    isBillRequired: false,
    financialYearStartDate: '',
    financialYearEndDate: '',
    subCategory: '',
    client: '',
    assignName: '',
    coWork: [],
    status: 'PENDING',
    paymentStatus: 'PENDING',
    createdBy: '',
    updateBy: '',
    updateOn: '',
    deleted: false
  });

  const { id } = useParams(); // Get the task id from the URL if available
  const [roles, setRoles] = useState([]);
  console.log('l', roles);
  const [userOpenPopup, setUserOpenPopup] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}role/allrole`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // if (response.status != 200) {
        //   navigate('/logout');
        // }
        console.log(response.data.data);
        const filteredRoles = response.data.data.filter((role) => role.id !== 1);
        setRoles(filteredRoles);
      } catch (error) {
        // navigate('/logout');
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, [url, token]);
  // State for form values inside the popup
  const [userFormValues, setUserFormValues] = useState({
    userName: '',
    userEmail: '',
    userMobile: '',
    userPassword: '',
    userRole: ''
  });

  const [userApiError, setUserApiError] = useState(null);

  // Function to handle input changes
  const userHandleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  // Function to handle "Add More" button click
  const userHandleAddMoreClick = () => {
    setUserOpenPopup(true); // Show the popup
  };

  // Function to close the popup
  const userHandlePopupClose = () => {
    setUserOpenPopup(false); // Hide the popup
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.workCategory)
      errors.workCategory = "Work category is required.";
    if (!formValues.subCategory)
      errors.subCategory = "Subcategory is required.";
    if (!formValues.client) errors.client = "Client is required.";
    if (!formValues.assignName) errors.assignName = "Assign name is required.";
    if (!formValues.taskDescription)
      errors.taskDescription = "Task description is required.";
    if (!formValues.taskEndDate)
      errors.taskEndDate = "Task end date is required.";
    if (!formValues.isBillRequired) {
      errors.isBillRequired = "Is build required is required.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: checked
    }));
  };


  // Function to handle form submission (e.g., save new co-worker)
  // Function to handle form submission (e.g., save new co-worker)
  const userHandleSave = async (event) => {
    console.log('djjdj');
    event.preventDefault(); // Prevent the default form submission

    // Get the token from localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('No auth token found');
      setUserApiError('No auth token found');
      return;
    }

    // Prepare the form data to send in the request body
    const data = {
      name: userFormValues.userName,
      email: userFormValues.userEmail,
      mobile: userFormValues.userMobile,
      password: userFormValues.userPassword,
      role: userFormValues.userRole
    };

    try {
      // Send POST request to the API
      const response = await axios.post(`${url}user/addUser`, data, {
        headers: {
          Authorization: `Bearer ${authToken}` // Passing token in the Authorization header
        }
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }

      // Handle successful response
      console.log('User added successfully:', response.data);
      setUserOpenPopup(false); // Close the popup after successful save
      setUserApiError(null); // Clear any previous errors

      // Reset the form to initial values
      setUserFormValues({
        userName: '',
        userEmail: '',
        userMobile: '',
        userPassword: '',
        userRole: ''
      });

      // Optionally, show a success message using a toaster
      toast.success('User added successfully!');

      // Refresh the assign names or relevant list
      fetchAssignName(); // Replace with your actual function to refresh data
    } catch (error) {
      // Handle error response
      console.error('Error adding user:', error.response || error.message);
      setUserApiError(error.response?.data?.message || 'An error occurred');

      // Optionally, show an error message using a toaster
      toast.error('Error adding user. Please try again.');
    }
  };

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

          // Set form values based on the response
          setFormValues({
            workCategory: taskData.workCategory.workCategoryId || '', // Use the nested workCategoryId
            taskDescription: taskData.description || '',
            notes: taskData.notes || '',
            taskEndDate: taskData.taskEndDate || '',
            isBillRequired: taskData.isBillRequired || false,
            subCategory: taskData.subCategory.subCategoryId || '', // Use the nested subCategoryId
            client: taskData.client.id || '', // Use the client id
            assignName: taskData.assignName.id || '', // Assign to id
            coWork: taskData.coWork.map((coWorker) => coWorker.id) || [], // Extract coWork IDs
            status: taskData.status || 'pending',
            paymentStatus: taskData.paymentStatus || 'pending',
            deleted: taskData.deleted || false // Handle deleted status
          });
        } catch (error) {
          console.error('Error fetching task data:', error);
        }
      }
    };
    fetchTaskData();
  }, [id, url, token]);

  const [validationErrors, setValidationErrors] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}subcategory/subCategoryList`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }

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

  useEffect(() => {
    fetchCategories();
  }, [url, token]);

  const fetchWorkCategories = async () => {
    try {
      const response = await axios.get(`${url}category/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchWorkCategories();
  }, [url, token]);

  const fetchSubcategoriesBasedOnCategory = async () => {
    try {
      console.log('Fetching');
      const response = await axios.get(`${url}category/subcategory/${selectedWorkCategory.workCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },

      });
      console.log(response.data);

      // if (response.status == 403) {
      //   navigate('/logout');
      // }
      await setSubcategories(response.data.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };
  useEffect(() => {
    fetchSubcategoriesBasedOnCategory();
  }, [url, token]);



  const fetchSubcategories = async () => {
    try {
      console.log("Fetching subcategories...");

      if (selectedWorkCategory) {
        const selectedCategory = categories.find(
          (category) => category.workCategoryId === selectedWorkCategory
        );

        console.log("Selected Category:", selectedCategory);

        if (selectedCategory) {
          const response = await axios.get(
            `${url}category/subcategory/${selectedCategory.workCategoryId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          // ✅ Handle case when response.data or response.data.data is undefined/null
          if (response.data && Array.isArray(response.data.data)) {
            setSubcategories(response.data.data);
          } else {
            console.warn("No subcategories found or invalid data structure.");
            setSubcategories([]); // Reset subcategories to empty array
          }
        } else {
          setSubcategories([]); // Reset when no valid category is found
        }
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]); // Prevent breaking UI by setting empty array
    }
  };

  // ✅ Remove `subcategories` from dependency array to prevent infinite re-renders
  useEffect(() => {
    fetchSubcategories();
  }, [url, token, categories, selectedWorkCategory]);


  const [searchClient, setSearchClient] = useState('');
  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("searchClient", searchClient);

        const response = await axios.get(`${url}client/allclient?size=100`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            search: searchClient
          }
        });
        // if (response.status != 200) {
        //   navigate('/logout');
        // }

        // Map over the clientList array to create the format 'clientName - firmName' for each client
        const formattedClientList = response.data.data.clientList.map((client) => {
          console.log('Client ', client.firmName);
          return {
            id: client.id, // Assuming each client has a unique 'id'
            name: `${client.name} - ${client.firmName}` // Concatenated string 'clientName - firmName'
          };
        });

        setClient(formattedClientList); // Store the formatted list in the state
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClient();
  }, [url, token, searchClient]);

  const fetchAssignName = async () => {
    try {
      const response = await axios.get(`${url}user/allusers?search=`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // if (response.status != 200) {
      //   navigate('/logout');
      // }

      // Check if data exists and map correctly
      const filteredUsers = response.data.data.userList
        .map((user) => ({
          id: user.id,
          name: user.name,
          roleId: user.role.id
        }))
        .filter((user) => user.roleId !== 1); // Filter out users with role ID 1

      setAssignName(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchAssignName();
    setLoading1(false);
  }, [url, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Financial Year Start:', formValues.financialYearStartDate, 'End:', formValues.financialYearEndDate);
    console.log('Form Values:', formValues);

    try {
      // Choose between PUT or POST based on `id` presence
      const response = id
        ? await axios.put(
          `${url}task/updatetask/${id}`,
          {
            name: formValues.taskDescription || '',
            workCategoryId: formValues.workCategory || null,
            subCategoryId: formValues.subCategory || null,
            clientId: formValues.client || null,
            description: formValues.taskDescription || '',
            assignNameId: formValues.assignName || null,
            coWorkIds: formValues.coWork || [],
            status: formValues.status || 'pending',
            priorityOfTask: priority,
            notes: formValues.notes || '',
            taskEndDate: formValues.taskEndDate || '',
            isBillRequired: formValues.isBillRequired || false,
            financialYearStartDate: formValues.financialYearStartDate, // Direct data
            financialYearEndDate: formValues.financialYearEndDate, // Direct data
            paymentStatus: formValues.paymentStatus || 'pending',
            updatedById: userId || null,
            updatedOn: new Date().toISOString(),
            deleted: formValues.deleted || false
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        : await axios.post(
          `${url}task/createTask`,
          {
            name: formValues.taskDescription || '',
            workCategoryId: formValues.workCategory || null,
            subCategoryId: formValues.subCategory || null,
            clientId: formValues.client || null,
            description: formValues.taskDescription || '',
            assignNameId: formValues.assignName || null,
            coWorkIds: formValues.coWork || [],
            status: formValues.status || 'pending',
            notes: formValues.notes || '',
            taskEndDate: formValues.taskEndDate + "T00:00:00" || '',
            isBillRequired: formValues.isBillRequired || false,
            financialYearStartDate: formValues.financialYearStartDate, // Direct data
            financialYearEndDate: formValues.financialYearEndDate, // Direct data
            paymentStatus: formValues.paymentStatus || 'pending',
            updatedById: userId || null,
            updatedOn: new Date().toISOString(),
            deleted: formValues.deleted || false
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      if (response.status != 200) {
        navigate('/logout');
      }
      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/tasklist');
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
    } catch (error) {
      console.error('Error submitting task:', error.response?.data || error);
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  // sub cat
  const [openSubCategoryPopup, setOpenSubCategoryPopup] = useState(false);
  const [subCategoryFormValues, setSubCategoryFormValues] = useState({
    subCategoryName: ''
  });

  const handleAddMoreSubCategoryClick = () => {
    setOpenSubCategoryPopup(true);
  };

  const handleCloseSubCategoryPopup = () => {
    setOpenSubCategoryPopup(false);
    setSubCategoryFormValues({ subCategoryName: '' }); // Reset form when closed
  };

  useEffect(() => {
    if (formValues && formValues.financialYearStartDate && formValues.financialYearEndDate) {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      const startDate = new Date(`${currentYear}-04-01`);
      const endDate = new Date(`${nextYear}-03-31`);

      const financialYear =
        new Date() < startDate
          ? `${currentYear}-${nextYear.toString().substring(2)}`
          : `${nextYear}-${(nextYear + 1).toString().substring(2)}`;

      const formFinancialYear = `${formValues.financialYearStartDate.split("-")[0]}-${formValues.financialYearEndDate.split("-")[0].substring(2)}`;

      setSelectedFinancialYear(formFinancialYear || financialYear);
    }
  }, [formValues]); // Dependency array to re-run when formValues change

  const handleSubCategorySave = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    try {
      console.log(authToken);
      const response = await axios.post(
        `${url}subcategory/saveSubCategories`,
        [
          {
            name: subCategoryFormValues.subCategoryName,
            workCategory: {
              workCategoryId: subCategoryFormValues.workCategory,
            },
          },
        ],
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Subcategory added successfully:", response.data);
      setSubcategories((prev) => [...prev, response.data]);
      setSubCategoryFormValues({ subCategoryName: "", workCategory: "" });
      setOpenSubCategoryPopup(false);
      await fetchCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  // const [references, setReferences] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [value, setValue] = useState(null);
  // const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [newReference, setNewReference] = useState({ referenceName: '', mobileNo: '' });
  // const [showPopup, setShowPopup] = useState(false);

  // const token = localStorage.getItem('token');
  // const url = 'https://catask.co.in/api/v1v1';

  // Fetch References
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${url}reference/list`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setReferences(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching references:', error);
        setLoading(false);
      });
  }, [token, url]);

  // Handle Dialog Form Submission
  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}reference/create`, newReference, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);

      setReferences((prev) => [...prev, response.data.data]);
      setShowPopup(true);
      setNewReference({ referenceName: '', mobileNo: '' });
      setTimeout(() => setShowPopup(false), 2000);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding reference:', error);
    }
  };

  return (
    <>
      <Box m="20px">
        {/* <Header title="CREATE TASK" subtitle="Create a New Task" /> */}
        {showPopup && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {resMessage}
          </Alert>
        )}

        {showError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            There was an issue creating the task.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, 1fr)" // Four-column layout for better flexibility
            sx={{
              width: '50%',
              margin: '20px auto',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h2>Add Task</h2>
            {/* Client Field */}
            <Box gridColumn="span 4">
              {/* Client Selection Dropdown */}
              <Autocomplete
                fullWidth
                options={client}
                getOptionLabel={(option) => option.name}
                value={client.find((cl) => cl.id === formValues.client) || null} // Match client ID
                onChange={(event, newValue) => {
                  console.log("==>>>Onchange : ", formValues.client);
                  const clientId = newValue ? newValue.id : null;
                  const clientName = newValue ? newValue.name.split(' - ')[0] : ''; // Extract client name

                  console.log("===>>>> ", clientName, clientId); // Debugging

                  setFormValues((prevValues) => ({
                    ...prevValues,
                    client: clientId // Save the clientId to formValues
                  }));
                }}
                error={!!validationErrors.client}
                helperText={validationErrors.client}
                renderInput={(params) => (
                  <div style={{ display: 'flex', itemsAlign: 'center', justifyContent: 'center' }}>
                    <TextField
                      {...params}
                      label="Client"
                      required
                      variant="outlined"
                      error={!!validationErrors.client}
                      helperText={validationErrors.client}
                      value={searchClient}
                      onChange={(e) => {
                        setSearchClient(e.target.value); // Update search term
                      }}

                    />
                    <Button
                      onClick={handleAddMoreClientClick}
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2, // Add spacing between dropdown and button
                        backgroundColor: '#fafafb', // Light background
                        fontSize: '14px',
                        width: '20%',
                        height: '51px',
                        margin: '0px 0px 0px 10px',
                        color: '#8e8e8e',
                        borderColor: '#d9d9d9',
                        '&:hover': {
                          backgroundColor: '#ddd' // Hover effect
                        }
                      }}
                    >Add Task
                    </Button>
                  </div>
                )}
              />

              {/* "Add More" Button Below Dropdown */}

            </Box>


            {/* Task Description Field */}
            <Box gridColumn="span 4">
              <TextField
                fullWidth
                variant="outlined"
                label="Task Name"
                required
                onChange={handleInputChange}
                value={formValues.taskDescription}
                name="taskDescription"
                // multiline
                // rows={6}
                error={!!validationErrors.taskDescription}
                helperText={validationErrors.taskDescription}
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
                rows={1}
                error={!!validationErrors.notes}
                helperText={validationErrors.notes}
              />
            </Box>
            {/* Task coworker */}
            <Box gridColumn="span 4">
              <Autocomplete
                value={priority}
                onChange={(event, newValue) => setPriority(newValue)}
                options={['High', 'Medium', 'Low']}
                renderInput={(params) => <TextField {...params} label="Priority" required />}
              />
            </Box>

            {/* Assign Name Field */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { id: 'addMore', name: 'Add More' }, // Add "Add More" option first
                  ...assignName // Then the rest of the assignName options
                ]}
                getOptionLabel={(option) => option.name}
                value={assignName.find((user) => user.id === formValues.assignName) || null}
                onChange={(event, newValue) => {
                  if (newValue?.id === 'addMore') {
                    userHandleAddMoreClick(); // Open the popup
                  } else {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      assignName: newValue ? newValue.id : ''
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Name"
                    variant="outlined"
                    required
                    error={!!validationErrors.assignName}
                    helperText={validationErrors.assignName}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.id === 'addMore' ? (
                      <Button onClick={userHandleAddMoreClick} fullWidth variant="outlined">
                        Add More
                      </Button>
                    ) : (
                      <ListItemText primary={option.name} />
                    )}
                  </li>
                )}
              />
            </Box>

            <Box gridColumn="span 2">
              <Autocomplete
                multiple
                id="coWork"
                value={assignName.filter((user) => formValues.coWork.includes(user.id))}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    coWork: newValue.map((coWorker) => coWorker.id) // Only store ids
                  }));
                }}
                options={[
                  { id: 'addMore', name: 'Add More' }, // Add "Add More" option first
                  ...assignName // Then the rest of the assignName options
                ]}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Co Workers"
                    variant="outlined"
                    helperText={validationErrors.coWork}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.id === 'addMore' ? (
                      <Button onClick={userHandleAddMoreClick} fullWidth variant="outlined">
                        Add More
                      </Button>
                    ) : (
                      <>
                        <Checkbox checked={formValues.coWork.includes(option.id)} />
                        <ListItemText primary={option.name} />
                      </>
                    )}
                  </li>
                )}
              />

              {/* Add More Popup */}
              <Dialog open={userOpenPopup} onClose={userHandlePopupClose}>
                <DialogTitle>Add More Co-Workers</DialogTitle>
                <form onSubmit={userHandleSave}>
                  <div style={{ padding: '16px' }}>
                    {/* Name Field */}
                    <TextField
                      fullWidth
                      label="Co-Worker Name"
                      variant="outlined"
                      margin="normal"
                      name="userName"
                      value={userFormValues.userName}
                      onChange={userHandleInputChange}
                    />

                    {/* Email Field */}
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      name="userEmail"
                      value={userFormValues.userEmail}
                      onChange={userHandleInputChange}
                    />

                    {/* Mobile Field */}
                    <TextField
                      fullWidth
                      label="Mobile"
                      variant="outlined"
                      margin="normal"
                      name="userMobile"
                      value={userFormValues.userMobile}
                      onChange={userHandleInputChange}
                    />

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      name="userPassword"
                      type="password"
                      value={userFormValues.userPassword}
                      onChange={userHandleInputChange}
                    />

                    {/* Role Field */}
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="userRole"
                        value={userFormValues.userRole} // Ensure this is set to the selected role id
                        onChange={userHandleInputChange}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name.replace('ROLE_', '')} {/* Display the role name without "ROLE_" */}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Dialog Actions */}
                  <DialogActions>
                    <Button onClick={userHandlePopupClose} color="primary">
                      Cancel
                    </Button>
                    <Button type="button" onClick={userHandleSave} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Box>



            {/* Work Category  */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { workCategoryId: 'addMore', name: 'Add More' }, // "Add More" option first
                  ...categories // Then the rest of the categories options
                ]}
                getOptionLabel={(option) => option.name}
                value={categories.find((cat) => cat.workCategoryId === formValues.workCategory) || null}
                onChange={(event, newValue) => {
                  if (newValue?.workCategoryId === 'addMore') {
                    handleAddMoreCategoryClick(); // Open popup for "Add More"
                  } else {
                    console.log("===>>>>NewValue", " ", newValue);
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      workCategory: newValue ? newValue.workCategoryId : ''
                    }));
                    setSelectedWorkCategory(newValue ? newValue.workCategoryId : '');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Work Category"
                    required
                    variant="outlined"
                    error={!!validationErrors.workCategory}
                    helperText={validationErrors.workCategory}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.workCategoryId === 'addMore' ? (
                      <Button onClick={handleAddMoreCategoryClick} fullWidth variant="outlined">
                        Add More
                      </Button>
                    ) : (
                      <ListItemText primary={option.name} />
                    )}
                  </li>
                )}
              />
            </Box>


            {/*  Sub Category */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { id: 'addMore', name: 'Add More' },  // Add "Add More" option first
                  ...subcategories // Then the rest of the subcategory options
                ]}
                getOptionLabel={(option) => option.name}
                value={subcategories.find((sub) => sub.subCategoryId === formValues.subCategory) || null}
                onChange={(event, newValue) => {
                  // console.log("sub ", formValues.subCategory);
                  // console.log("===>>>>NewValue"," ",newValue.subCategoryId);
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    subCategory: newValue ? newValue.subCategoryId : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    required
                    variant="outlined"
                    error={!!validationErrors.subCategory}
                    helperText={validationErrors.subCategory}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.id === 'addMore' ? (
                      <Button onClick={handleAddMoreSubCategoryClick} fullWidth variant="outlined">
                        Add More
                      </Button>
                    ) : (
                      <span>{option.name}</span>
                    )}
                  </li>
                )}
              />

              {/* Add More Sub-Category Popup */}
              <Dialog open={openSubCategoryPopup} onClose={handleCloseSubCategoryPopup}>
                <DialogTitle>Add New Sub-Category</DialogTitle>
                <form onSubmit={handleSubCategorySave}>
                  <div style={{ padding: '16px' }}>
                    {/* Sub-Category Name Field */}
                    <TextField
                      fullWidth
                      label="Sub-Category Name"
                      variant="outlined"
                      margin="normal"
                      name="subCategoryName"
                      value={subCategoryFormValues.subCategoryName}
                      onChange={(event) =>
                        setSubCategoryFormValues({
                          ...subCategoryFormValues,
                          subCategoryName: event.target.value
                        })
                      }
                    />

                    {/* Work Category Dropdown */}
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Work Category</InputLabel>
                      <Select
                        name="workCategory"
                        value={subCategoryFormValues.workCategory || ''}
                        onChange={(event) =>
                          setSubCategoryFormValues({
                            ...subCategoryFormValues,
                            workCategory: event.target.value
                          })
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.workCategoryId} value={category.workCategoryId}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Dialog Actions */}
                  <DialogActions>
                    <Button onClick={handleCloseSubCategoryPopup} color="primary">
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSubCategorySave} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Box>

            {/* Status and Payment Status */}
            {/* Status and Payment Status */}
            <Box gridColumn="span 2">
              <TextField
                fullWidth
                label="Status"
                variant="outlined"
                value="PENDING" // Default value is PENDING
                disabled // Makes the input field disabled
                onChange={(e) =>
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    status: 'PENDING' // Set status to 'PENDING' when the field changes (it will remain the same in this case)
                  }))
                }
              />
            </Box>
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                disabled
                options={[
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'PAID', label: 'PAID' }
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { value: 'PENDING', label: 'PENDING' },
                    { value: 'PAID', label: 'PAID' }
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
            <Box gridColumn="span 2">
              <TextField
                fullWidth
                variant="outlined"
                label="Task End Date"
                required
                type="date" // Set the input type to date
                onChange={handleInputChange}
                value={formValues.taskEndDate}
                name="taskEndDate"
                InputLabelProps={{
                  shrink: true // Ensures the label shrinks when displaying a selected date
                }}
                error={!!validationErrors.taskEndDate}
                helperText={validationErrors.taskEndDate}
              />
            </Box>
            {/* <Box gridColumn="span 2">
              <Autocomplete
              fullWidth
              options={financialYearOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleFinancialYearChange}
              value={financialYearOptions.find(
                (option) =>
                  option.value ===
                    `${formValues.financialYearStartDate.split('-')[0]}-${formValues.financialYearEndDate.split('-')[0].substring(2)}`
                    )}
                renderInput={(params) => <TextField {...params} label="Financial Year" variant="outlined" />}
              />
            </Box> */}

            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={financialYearOptions}
                getOptionLabel={(option) => option.label}
                onChange={handleFinancialYearChange} // Update state when a user selects a new financial year
                value={financialYearOptions.find((option) => option.value === selectedFinancialYear)} // Set the default or selected value
                renderInput={(params) => <TextField {...params} label="Financial Year" variant="outlined" />}
              />
            </Box>
            <Box gridColumn="span 2" display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.isBillRequired}
                    onChange={handleCheckboxChange}
                    name="isBillRequired"
                    color="primary"
                  />
                }
                label="Build Required"
              />
            </Box>

            <Box gridColumn="span 4">
              {' '}
              {/* Wrap the button in a Box with matching styling */}
              <Button color="primary" type="submit" fullWidth variant="contained" sx={{ width: '100%' }}>
                Create Task
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      {/* Add More Category Popup */}
      <Dialog open={openCategoryPopup} sx={{ '& .MuiDialog-paper': { width: '40%' } }} onClose={handleCategoryPopupClose}>
        <DialogTitle>Add New Work Category</DialogTitle>
        <form onSubmit={handleCategorySave}>
          <div style={{ padding: '16px' }}>
            {/* Work Category Name Field */}
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              margin="normal"
              name="categoryName"
              value={categoryFormValues.categoryName}
              onChange={handleCategoryInputChange}
            />
          </div>

          {/* Dialog Actions */}
          <DialogActions>
            <Button onClick={handleCategoryPopupClose} color="primary">
              Cancel
            </Button>
            <Button type="button" onClick={handleCategorySave} color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Add client popup */}
      <Dialog open={openClientPopup} onClose={handleClientPopupClose} sx={{ '& .MuiDialog-paper': { width: '40%' } }}>
        <DialogTitle>Add New Work Client</DialogTitle>
        <form onSubmit={handleClientSave}>
          <div style={{ padding: '16px' }}>
            {/* Client Name */}
            <TextField
              fullWidth
              label="Client Name"
              variant="outlined"
              margin="normal"
              name="clientName"
              value={clientForm.clientName || ''}
              onChange={handleClientInputChange}
            />
            {/* Firm Name */}
            <TextField
              fullWidth
              label="Firm Name"
              variant="outlined"
              margin="normal"
              name="firmName"
              value={clientForm.firmName || ''}
              onChange={handleClientInputChange}
            />
            {/* Email Address */}
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              name="email"
              value={clientForm.email || ''}
              onChange={handleClientInputChange}
            />
            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              required
              name="address"
              value={clientForm.address || ''}
              onChange={handleClientInputChange}
            />
            {/* PAN Card */}
            <TextField
              fullWidth
              label="PAN Card"
              variant="outlined"
              margin="normal"
              name="panCard"
              required
              value={clientForm.panCard || ''}
              onChange={handleClientInputChange}
            />
            {/* GST Number */}
            <TextField
              fullWidth
              label="GST Number"
              variant="outlined"
              margin="normal"
              name="gstNumber"
              value={clientForm.gstNumber || ''}
              onChange={handleClientInputChange}
            />
            {/* Mobile Number */}
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              required
              margin="normal"
              name="mobileNumber"
              value={clientForm.mobileNumber || ''}
              onChange={handleClientInputChange}
            />
            {/* Reference */}
            <Autocomplete
              fullWidth
              id="reference"
              name="reference"
              required
              options={[
                ...references,
                {
                  id: 'addMore',
                  referenceName: 'Add More'
                }
              ]}
              getOptionLabel={(option) => option.referenceName || ''}
              value={value}
              onChange={(event, newValue) => {
                if (newValue?.id === 'addMore') {
                  setOpenDialog(true); // Open dialog for adding a new reference
                } else {
                  setValue(newValue); // Set the selected value
                }
              }}
              onInputChange={(event, newInputValue) => {
                setSearchTerm(newInputValue);
                console.log(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="Reference" variant="outlined" />}
              isOptionEqualToValue={(option, value) => option.referenceName === value.referenceName}
              loading={loading}
              noOptionsText="No references found"
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.id === 'addMore' ? (
                    <Button
                      onClick={() => setOpenDialog(true)}
                      fullWidth
                      variant="outlined"
                      sx={{
                        backgroundColor: '#fff',
                        fontSize: '14px',
                        '&:hover': {
                          backgroundColor: '#ddd'
                        }
                      }}
                    >
                      Add More
                    </Button>
                  ) : (
                    option.referenceName
                  )}
                </li>
              )}
            />

            {/* Dialog for Adding New Reference */}
            <Dialog open={openDialog} sx={{ '& .MuiDialog-paper': { width: '40%' } }} onClose={() => setOpenDialog(false)} fullWidth>
              <DialogTitle>Add New Reference</DialogTitle>
              <form onSubmit={handleDialogSubmit}>
                <Box padding={2}>
                  <TextField
                    fullWidth
                    label="Reference Name"
                    variant="outlined"
                    margin="normal"
                    name="referenceName"
                    value={newReference.referenceName}
                    onChange={(e) => setNewReference((prev) => ({ ...prev, referenceName: e.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    margin="normal"
                    name="mobileNo"
                    value={newReference.mobileNo}
                    onChange={(e) => setNewReference((prev) => ({ ...prev, mobileNo: e.target.value }))}
                  />
                </Box>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            </Dialog>

            {/* Success Alert */}
            {showPopup && (
              <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Reference added successfully!
                </Alert>
              </Stack>
            )}
          </div>

          {/* Dialog Actions */}
          <DialogActions>
            <Button onClick={handleClientPopupClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default AddTask;
