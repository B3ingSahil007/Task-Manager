import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Category() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/login');
    } else {
      console.log('User is logged in');
    }
  }, [navigate]);
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_URL_API;
  const userRole = localStorage.getItem('userRole');
  // const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editFormData, setEditFormData] = useState({ id: '', name: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}category/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status != 200) {
        console.log("hello");
        
        navigate('/logout');
      }
      const categories = response.data.data.map((category) => ({
        id: category.workCategoryId,
        name: category.name
      }));
      setRows(categories);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      navigate('/logout');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Set up columns
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
              <>
                <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
                  <Edit />
                </IconButton>
                {userRole !== 'ROLE_USER' && (
                  <IconButton color="error" onClick={() => openDeleteDialog(params.row.id)}>
                    <Delete />
                  </IconButton>
                )}
              </>
            )
          }
        : {}
    ];
    setColumns(columns);
  }, [userRole]);

  // Edit category
  const handleEdit = (row) => {
    setEditFormData({ id: row.id, name: row.name });
    setIsEditDialogOpen(true);
  };

  const handleEditFormSubmit = async () => {
    try {
      await axios.put(
        `${url}category/update/${editFormData.id}`,
        { name: editFormData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsEditDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error editing category:', error);
      setError('Failed to update category. Please try again.');
      navigate('/logout');
    }
  };

  // Delete category
  const openDeleteDialog = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${url}category/delete/${categoryToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDeleteDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      navigate('/logout');
      setError('Failed to delete category. Please try again.');
    }
  };

  // Navigate to Add Category
  const handleAddCategory = () => {
    navigate('/AddCategory');
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>Categories</h1>
        <Button variant="contained" onClick={handleAddCategory}>
          Add CATEGORY
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box mt="20px" height="75vh">
          <DataGrid rows={rows} columns={columns} />
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditFormSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Category;
