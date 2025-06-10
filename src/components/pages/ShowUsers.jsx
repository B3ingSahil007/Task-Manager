import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShowUsers = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const url = import.meta.env.VITE_URL_API;

  const [teamData, setTeamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    { field: 'srNo', headerName: 'Sr No.', width: 100 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell'
    },
    {
      field: 'mobile',
      headerName: 'Phone Number',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      flex: 1,
      renderCell: ({ row: { access } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={access === 'admin' ? '#4caf50' : access === 'manager' ? '#8bc34a' : '#c8e6c9'}
          borderRadius="4px"
          mt={2.5}
        >
          {access === 'admin' && <AdminPanelSettingsOutlinedIcon />}
          {access === 'manager' && <SecurityOutlinedIcon />}
          {access === 'user' && <LockOpenOutlinedIcon />}
          <Typography color="textSecondary" sx={{ ml: '5px' }}>
            {access}
          </Typography>
        </Box>
      )
    },
    localStorage.getItem('role') !== 'ROLE_USER'
      ? {
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          flex: 1,
          renderCell: ({ row }) => {
            const handleEdit = async () => {
              const id = row.id;
              try {
                const response = await axios.get(`${url}user/getuserbyid/${id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                if (response.status !== 200) {
                  navigate('/logout');
                }
                if (response.data.statusCode === 200) {
                  localStorage.setItem('user', JSON.stringify(response.data.data));
                  navigate(`/EditForm/${id}`);
                }
              } catch (error) {
                console.error('Edit error:', error);
              }
            };

            const handleDeleteClick = (id) => {
              setDeleteUserId(id);
              setOpenDialog(true);
            };

            return (
              <Box display="flex" justifyContent="space-around" mt={1}>
                <IconButton aria-label="edit" color="success" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => handleDeleteClick(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          }
        }
      : {}
  ];

  useEffect(() => {
    fetchData(page, pageSize, searchQuery);
  }, [page, pageSize, searchQuery]);

  const fetchData = async (page, pageSize, searchQuery) => {
    try {
      const response = await axios.get(`${url}user/allusers?search=${searchQuery}&page=${page + 1}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status == 401 || response.status == 403) {
        navigate('/logout');
      }
console.log(Array.isArray(response.data.data.userList));
      // Adding seNo field to each data entry with a sequence number
      const updatedData = response.data.data.userList.map((item, index) => ({
        ...item, // Spread the existing properties
        srNo: index + 1 // Add the sequential number starting from 1
      }));

      // Set the modified data
      setTeamData(updatedData);
      setFilteredData(updatedData);
      setTotalRows(response.data.data.totalElements);
    } catch (error) {
      // navigate('/logout');
      console.error('Error fetching team data:', error);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      axios
        .delete(`${url}user/deleteuser/${deleteUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            fetchData(page, pageSize, searchQuery);
          }
        })
        .catch((error) => {
          console.error('Delete error:', error);
        });
      setOpenDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(0); // Reset to the first page
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box m="20px">
      <h1>Users</h1>
      <Box display="flex" justifyContent="flex-end" mb="20px">
        {userRole === '1' && (
          <Button color="primary" variant="contained" onClick={() => navigate('/AddUser')}>
            Add User
          </Button>
        )}
      </Box>

      <Box mb="20px" display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none'
          },
          '& .name-column--cell': {
            color: '#4caf50' // Green accent
          }
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          pagination
          pageSize={pageSize}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          rowsPerPageOptions={[10, 25, 50]} // Ensure this is correctly set
          paginationMode="server" // Ensures server-side pagination
          rowCount={totalRows}
          disableSelectionOnClick
          hideFooter
        />
      </Box>

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
          <Button disabled={filteredData.length < page} onClick={() => handlePageChange(page + 1)}>Next</Button>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone. Please confirm.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowUsers;
