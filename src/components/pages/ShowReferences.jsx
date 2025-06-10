import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ShowReferences = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);

  const url = import.meta.env.VITE_URL_API;

  // States
  const [references, setReferences] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState(null);

  // Columns for DataGrid
  const columns = [
    { field: 'srNo', headerName: 'Sr No.', width: 100 },
    { field: 'referenceName', headerName: 'Reference Name', flex: 1 },
    { field: 'mobileNo', headerName: 'Mobile Number', flex: 1 },
    localStorage.getItem('role') !== 'ROLE_USER'
      ? {
          field: 'actions',
          headerName: 'Actions',
          width: 100,
          sortable: false,
          renderCell: ({ row }) => (
            <Box display="flex" justifyContent="space-between" width="100%">
              <IconButton color="secondary" onClick={() => handleEdit(row.id)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedReferenceId(row.id);
                  setOpenDialog(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      : {}
  ];

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}reference/all`, {
        params: { page: page + 1, size: pageSize, status: filter, search: searchQuery },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status !== 200) {
        navigate('/logout');
      }
      if (response.status === 200) {
        setReferences(
          response.data.data.content.map((item, index) => ({
            id: item.referenceId,
            srNo: index + 1,
            referenceName: item.referenceName,
            mobileNo: item.mobileNo
          }))
        );
      } else {
        navigate('/logout');
      }
    } catch (error) {
      navigate('/logout');
      console.error('Error fetching data:', error);
    }
  };

  // Edit Handler
  const handleEdit = (id) => {
    navigate(`/AddRef/${id}`);
  };

  // Delete Handler
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}reference/delete/${selectedReferenceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status !== 200) {
        navigate('/logout');
      }
      if (response.status === 200) {
        fetchData();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error deleting reference:', error);
      setOpenDialog(false);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(0); // Reset page number on page size change
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box m="20px">
      <h1>References</h1>
      <Box display="flex" justifyContent="space-between" mb="20px">
        <FormControl variant="outlined" sx={{ width: '30%' }}>
          <InputLabel>Status</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="Search references"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '40%' }}
        />
        <Link to="/AddRef">
          <Button variant="contained" color="primary">
            Add Reference
          </Button>
        </Link>
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={references}
          columns={columns}
          pageSize={pageSize}
          pagination={false} // Disable default pagination
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
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this reference?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowReferences;
