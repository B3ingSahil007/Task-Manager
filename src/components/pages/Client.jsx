import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogActions, Switch, IconButton, TextField, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Client() {
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_URL_API; // Modify the API URL here if necessary
  const userRole = localStorage.getItem('userRole');

  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [clientStatusToChange, setClientStatusToChange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filePath, setFilePath] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${url}client/allclient`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            search: searchTerm,
            page: page,
            size: 10
          }
        });
        if (response.status !== 200) {
          navigate('/logout');
        }
        const clientsWithSerial = response.data.data.clientList.map((client, index) => ({
          ...client,
          srNo: (page - 1) * 10 + (index + 1)
        }));
        setRows(clientsWithSerial);
        setTotalCount(response.data.data.totalCount);
      } catch (error) {
        navigate('/logout');
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, [url, token, searchTerm, page]);

  const [pageSize, setPageSize] = useState(25);
  const handleExport = async () => {
    try {
      const response = await axios.get(`${url}client/excel`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      if (response.status !== 200) {
        navigate('/logout');
      }
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Clients.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error exporting tasks:', error);
      alert('An error occurred while exporting the file. Please try again.');
    }
  };

  const columns = [
    { field: 'srNo', headerName: 'SR No.', width: 70 },
    { field: 'name', headerName: 'Client', width: 200 },
    { field: 'firmName', headerName: 'Firm Name', width: 150 },
    { field: 'panNo', headerName: 'PAN Card', width: 120 },
    { field: 'gstNo', headerName: 'GST Number', width: 120 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'mobile', headerName: 'Mobile', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 70,
      renderCell: (params) => (
        <Typography color={params.row.status ? 'textPrimary' : 'textSecondary'}>{params.row.status ? 'Active' : 'Inactive'}</Typography>
      )
    },
    {
      field: 'switch',
      headerName: 'Switch',
      width: 70,
      renderCell: (params) => (
        <Switch checked={params.row.status} onChange={() => handleStatusChangeClick(params.row.id, !params.row.status)} color="primary" />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <strong>
          <IconButton color="secondary" onClick={() => handleShow(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          {userRole !== 'ROLE_USER' && (
            <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}>
              <Delete />
            </IconButton>
          )}
        </strong>
      )
    }
  ];

  const handleShow = (row) => {
    navigate(`/showClientDetails/${row.id}`);
  };

  const handleEdit = (row) => {
    navigate(`/editClient/${row.id}`);
  };

  const handleDeleteClick = (clientId) => {
    setClientIdToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}client/deleteclient/${clientIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status !== 200) {
        navigate('/logout');
      }
      if (response.data.statusCode === 200) {
        const updatedResponse = await axios.get(`${url}client/allclient`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(updatedResponse.data.data.clientList);
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleStatusChangeClick = (clientId, status) => {
    setClientStatusToChange({ clientId, status });
    setStatusChangeDialogOpen(true);
  };

  const handleStatusChange = async () => {
    try {
      const response = await axios.put(
        `${url}client/statuschange/${clientStatusToChange.clientId}`,
        { status: clientStatusToChange.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status !== 200) {
        navigate('/logout');
      }
      if (response.data.statusCode === 200) {
        const updatedResponse = await axios.get(`${url}client/allclient`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(updatedResponse.data.data.clientList);
        setStatusChangeDialogOpen(false);
      }
    } catch (error) {
      console.error('Error changing client status:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/AddClient');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (event) => {
    setFilePath(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (filePath) {
      const formData = new FormData();
      formData.append('file', filePath);

      try {
        const response = await axios.post(`${url}client/bulk`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status !== 200) {
          navigate('/logout');
        }
        if (response.data.statusCode === 200) {
          setUploadDialogOpen(false);
          setSuccessSnackbarOpen(true);
        } else {
          setErrorMessage('Upload failed. PAN number or GST number already exists.');
          setErrorSnackbarOpen(true);
          setUploadDialogOpen(false);
        }
      } catch (error) {
        setErrorMessage('Error uploading file. Please try again.');
        setErrorSnackbarOpen(true);
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  return (
    <Box m="20px">
      <h1>Clients</h1>
      <Box mb="20px" display="flex" justifyContent="space-between" alignItems="center">
        <TextField label="Search by name or email" variant="outlined" value={searchTerm} onChange={handleSearch} />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add Client
        </Button>
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
        <Button variant="contained" onClick={handleUploadDialogOpen}>
          Upload Excel
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 25, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        paginationMode="server"
        rowCount={totalCount}
        page={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        components={{
          Footer: () => (
            <Box display="flex" justifyContent="flex-end" alignItems="center" p={1}>
              <Typography>
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </Typography>
            </Box>
          )
        }}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this client?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={statusChangeDialogOpen} onClose={() => setStatusChangeDialogOpen(false)}>
        <DialogTitle>Are you sure you want to change the status?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusChangeDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload Excel</DialogTitle>
        <Box p="20px">
          <input type="file" onChange={handleFileChange} />
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpload} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        message="Upload successful!"
        onClose={() => setSuccessSnackbarOpen(false)}
      />
      <Snackbar open={errorSnackbarOpen} autoHideDuration={3000} message={errorMessage} onClose={() => setErrorSnackbarOpen(false)} />
    </Box>
  );
}

export default Client;
