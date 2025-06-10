import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useForm } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Badge from './Badge';

const TaskList = () => {
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_URL_API;
  const userId = localStorage.getItem('id');
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || {};

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const statusNew = queryParams.get('status');
  const [filter, setFilter] = useState(statusNew || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr. No',
      width: 60,
      renderCell: ({ row }) => {
        const today = new Date();
        const dueDate = new Date(row.taskEndDate);
        const differenceInDays = (dueDate - today) / (1000 * 60 * 60 * 24);

        let badgeColor = 'black';

        if (row.status === 'COMPLETED') {
          badgeColor = 'green';
        } else if (row.status === 'PENDING' || row.status === 'ONGOING') {
          if (differenceInDays < 0) {
            badgeColor = 'red';
          } else if (differenceInDays <= 2) {
            badgeColor = 'orange';
          } else {
            badgeColor = 'blue';
          }
        }

        return (
          <Box display="flex" alignItems="center" sx={{ marginTop: '12px' }}>
            <Typography style={{ marginTop: '3px' }}>{row.srNo}</Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: badgeColor,
                marginLeft: '5px'
              }}
            />
          </Box>
        );
      }
    },
    { field: 'Priority', headerName: 'Priority', width: 150 },
    { field: 'ClientName', headerName: 'Client Name', width: 240 },
    { field: 'name', headerName: 'Task Name', width: 390 },
    { field: 'firmName', headerName: 'Firm Name', width: 280 },
    { field: 'reference', headerName: 'Reference', width: 180 },
    {
      field: 'billRequired',
      headerName: 'Bill Required',
      width: 140,
      renderCell: ({ row }) => {
        const handleToggle = async (event) => {
          const newValue = event.target.checked;
          try {
            // Call the API to update bill required status
            const response = await axios.put(
              `${url}task/billrequired?taskIds=${row.taskId}`,
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
              const updatedTasks = tasks.map(task =>
                task.taskId === row.taskId
                  ? { ...task, billRequired: newValue ? 'YES' : 'NO' }
                  : task
              );
              setTasks(updatedTasks);
              setFilteredTasks(updatedTasks);
            }
          } catch (error) {
            console.error('Error updating bill required status:', error);
            // You might want to show an error notification here
          }
        };

        // Determine the current state (handles both boolean and string values)
        const isBillRequired = row.billRequired === true || row.billRequired === 'YES';

        return (
          <FormControlLabel
            control={
              <Switch
                checked={isBillRequired}
                onChange={handleToggle}
                color="primary"
              />
            }
            label={isBillRequired ? 'YES' : 'NO'}
            labelPlacement="end"
          />
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: ({ row }) => {
        return (
          <FormControl fullWidth>
            <Select value={row.status} sx={{ marginTop: '5px' }} onChange={(e) => handleStatusChange(row.taskId, e.target.value)}>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="ONGOING">ONGOING</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            </Select>
          </FormControl>
        );
      }
    },
    { field: 'assignName', headerName: 'Assigned Name', width: 180 },
    { field: 'assignDate', headerName: 'Assign Date', width: 120 },
    {
      field: 'taskEndDate',
      headerName: 'Due Date',
      width: 130,
      headerClassName: 'datagrid-header',
      renderCell: ({ row }) => {
        const today = new Date();
        const dueDate = new Date(row.taskEndDate);
        const differenceInDays = (dueDate - today) / (1000 * 60 * 60 * 24);

        let color = 'black';

        if (row.status === 'COMPLETED') {
          color = 'green';
        } else if (row.status === 'PENDING' || row.status === 'ONGOING') {
          if (differenceInDays < 0) {
            color = 'red';
          } else if (differenceInDays <= 2) {
            color = 'orange';
          }
        }

        return (
          <Typography style={{ color }} mt={2}>
            {row.taskEndDate}
          </Typography>
        );
      }
    },
    { field: 'updateOn', headerName: 'Updated On', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => {
        const handleEdit = () => navigate(`/editTask/${row.taskId}`);
        const handleViewDetails = () => navigate(`/TaskDetails/${row.taskId}`);
        const handleDeleteClick = () => {
          setSelectedTaskId(row.taskId);
          setOpenDeleteDialog(true);
        };

        return (
          <Box display="flex" justifyContent="space-around">
            <IconButton aria-label="view" color="primary" onClick={handleViewDetails}>
              <VisibilityIcon />
            </IconButton>
            <IconButton aria-label="edit" color="secondary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            {userRole !== 'ROLE_USER' && (
              <IconButton aria-label="delete" color="error" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}task/allTaskList`, {
        params: {
          page: page + 1,
          size: pageSize,
          userId: userId,
          status: filter || status,
          search: searchQuery || '',
          financialYearStartDate: yearStart,
          financialYearEndDate: yearEnd
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status != 200) {
        navigate('/logout');
      }

      if (response.status === 200) {
        const tasks = response.data.data.map((item, index) => ({
          srNo: index + 1 + page * pageSize,
          Priority: item.client?.priorityOfTask || 'N/A',
          ClientName: item.client?.name || 'N/A',
          firmName: item.client?.firmName || 'N/A',
          reference: item.client?.reference || 'N/A',
          id: item.taskId,
          taskId: item.taskId,
          name: item.name || 'Unnamed Task',
          status: item.status || 'No Status',
          billRequired: item.isBillRequired || 'NO',
          assignDate: item.assignDate,
          taskEndDate: item.taskEndDate,
          notes: item.notes || 'No Notes',
          updateBy: item.updateBy || 'Unknown',
          updateOn: item.updateOn || 'Unknown',
          assignName: item.assignName?.name || 'N/A',
          client: item.client?.name || 'N/A',
          workCategory: item.workCategory?.name || 'N/A',
          subCategory: item.subCategory?.name || 'N/A'
        }));

        setTasks(tasks);
        setFilteredTasks(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    try {
      const response = await axios.get(`${url}task/excel`, {
        params: {
          userId: userId,
          status: filter,
          search: searchQuery || ''
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      if (response.status != 200) {
        navigate('/logout');
      }

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tasks.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      navigate('/logout');
      console.error('Error exporting tasks:', error);
      alert('An error occurred while exporting the file. Please try again.');
    }
  };

  const handleAddTask = () => navigate('/addTask');
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}task/deleteTask/${selectedTaskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setOpenDeleteDialog(false);
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `${url}task/update-status/${taskId}?status=${newStatus}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [year, setYear] = useState('');
  const paginatedRows = filteredTasks.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, setValue } = useForm();

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    setLoading(true);

    const formattedStartDate = new Date(data.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(data.endDate).toISOString().split('T')[0];
    console.log(data.user, formattedStartDate, formattedEndDate);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    try {
      const response = await axios.get(
        `${url}task/userreport?userId=${data.user}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          params: {
            userId: userId,
            status: filter,
            search: searchQuery || ''
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      if (response.status != 200) {
        navigate('/logout');
      }

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tasks.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      navigate('/logout');
      console.error('Error exporting tasks:', error);
      alert('An error occurred while exporting the file. Please try again.');
    }
  };

  const [usersData, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}user/allusers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("==>>>", response.data.data.userList);
      setUsers(response.data.data.content);

      if (response.status === 200) {
        setUsers(response.data.data.userList);
      }
    } catch (err) {
      setError('Error fetching userss');
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log('Fetch');
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box m="20px">
      <h1>Tasks</h1>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb="20px"
      >
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Export By Dates
        </Button>
        <FormControl
          variant="outlined"
          sx={{
            minWidth: '200px',
            flex: '1'
          }}
        >
          <InputLabel>Status</InputLabel>

          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Status" defaultValue="">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="ONGOING">ONGOING</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: '2',
            minWidth: '300px'
          }}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={handleAddTask}
          sx={{
            flex: '0 0 auto'
          }}
        >
          Add Task
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleExport}
          sx={{
            flex: '0 0 auto'
          }}
        >
          Export Tasks
        </Button>
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSize={pageSize}
          pagination={false}
          disableSelectionOnClick
          autoHeight
          hideFooter
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2}>
          <Box display="flex" alignItems="center">
            <Typography>Rows per page:</Typography>
            <Select value={pageSize} onChange={handlePageSizeChange} size="small" sx={{ ml: 2 }}>
              {[15, 25, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display="flex" alignItems="center">
            <Button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
              Previous
            </Button>
            <Typography mx={2}>Page {page + 1}</Typography>
            <Button onClick={() => handlePageChange(page + 1)}>Next</Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>User Form</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Choose User</InputLabel>
              <Select {...register('user')} label="Choose User" defaultValue="">
                {loading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : error ? (
                  <MenuItem value="" disabled>
                    {error}
                  </MenuItem>
                ) : Array.isArray(usersData) && usersData.length > 0 ? (
                  usersData.map((user, index) => (
                    <MenuItem key={index} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No users available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <div className="mt-4">
              <label>Start Date:</label>
              <br />
              <input
                type="date"
                {...register('startDate')}
                defaultValue=""
                onChange={(e) => setValue('startDate', e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label>End Date:</label>
              <br />
              <input
                type="date"
                {...register('endDate')}
                defaultValue=""
                onChange={(e) => setValue('endDate', e.target.value)}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Are you sure you want to delete this task?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;