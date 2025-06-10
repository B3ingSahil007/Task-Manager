import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { tokens } from "../../theme";
import axios from 'axios';
// import Header from "../../components/Header";
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SubCategory() {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_URL_API;
  // const url = process.env.REACT_APP_URL;
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', workCategoryId: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null); // Store subcategory to be deleted
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}subcategory/subCategoryList`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status != 200) {
          navigate('/logout');
        }
        console.log('>>>>>>', response.data.data);
        const categories = response.data.data.map((category, index) => ({
          id: category.subCategoryId,
          subCategoryId: category.subCategoryId,
          name: category.name,
          workCategoryId: category.workCategory ? category.workCategory.id : null
        }));
        setRows(categories);
      } catch (error) {
        navigate('/logout');
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [url, token]);

  useEffect(() => {
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Category', flex: 6 },
      localStorage.getItem('role') != 'ROLE_USER'
        ? {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
              <strong>
                <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => openDeleteDialog(params.row.subCategoryId)}>
                  <DeleteIcon />
                </IconButton>
              </strong>
            )
          }
        : {}
    ];
    setColumns(columns);
  }, []);

  const handleEdit = (row) => {
    console.log('Edit category with ID:', row.id);
    setEditFormData({ id: row.subCategoryId, name: row.name, workCategoryId: row.workCategoryId });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subCategoryId) => {
    setSubcategoryToDelete(subCategoryId);
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDelete = async () => {
    console.log('Delete category with ID:', subcategoryToDelete);
    try {
      const response = await axios.delete(`${url}subcategory/subCategorydelete/${subcategoryToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status != 200) {
        navigate('/logout');
      }
      console.log('delete success', response);
      if (response.data.statusCode === 200) {
        const updatedResponse = await axios.get(`${url}subcategory/subCategoryList`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedCategories = updatedResponse.data.data.map((category, index) => ({
          id: category.subCategoryId,
          subCategoryId: category.subCategoryId,
          name: category.name,
          workCategoryId: category.workCategory.id
        }));
        setRows(updatedCategories);
        setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditFormSubmit = async () => {
    try {
      const response = await axios.put(
        `${url}subcategory/editsubcategory/${editFormData.id}`,
        {
          name: editFormData.name,
          workCategoryId: editFormData.workCategoryId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status != 200) {
        navigate('/logout');
      }
      console.log('edit success', response.data.statusCode);
      if (response.data.statusCode === 200) {
        setIsEditDialogOpen(false);
        const updatedResponse = await axios.get(`${url}subcategory/subCategoryList`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedCategories = updatedResponse.data.data.map((category, index) => ({
          id: category.subCategoryId,
          subCategoryId: category.subCategoryId,
          name: category.name,
          workCategoryId: category.workCategory.id
        }));
        setRows(updatedCategories);
      }
    } catch (error) {
      navigate('/logout');
      console.error('Error editing category:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/AddSubCategory');
  };

  return (
    <Box m="20px">
      {/* <Header title="SUB CATEGORY" subtitle="List of CATEGORY " /> */}
      <h1>Sub Categories</h1>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleAddUser}>
          Add SUB CATEGORY
        </Button>
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
          }
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this subcategory?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubCategory;
