import React, { useEffect, useState } from 'react';
import './BillGenerate.css';
import { Switch, TextField } from '@mui/material';

const BillGenerate = () => {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const handleBillGenerate = async (taskId) => {
    console.log('Clicked');
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_URL_API}task/changestatusbillgenerate?taskId=${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update bill status');
      }

      const data = await response.json();
      console.log(data, 'UPDATED DATA');
      fetchBillData(); // Refresh the data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillData = async () => {
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const userId = localStorage.getItem('id');
      let url = `${import.meta.env.VITE_URL_API}task/readyforbillgenerate?userId=${userId}&page=${page}&size=${size}`;
      
      // Add search term to URL if it exists
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bill data');
      }

      const data = await response.json();
      console.log(data, 'FETCHED DATA');

      setBillData(data?.data?.content || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, [page, searchTerm]); // Added searchTerm as dependency

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="bill-container">
      <h2 className="bill-heading">Bill Generate</h2>

      {/* Search Input */}
      <div className="search-container">
        <TextField
          label="Search Tasks"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          placeholder="Search by task name, client, or assignee..."
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!loading && billData.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Name</th>
                  <th>Client</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Bill Generate</th>
                </tr>
              </thead>
              <tbody>
                {billData.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskId}</td>
                    <td>{task.name}</td>
                    <td>{task.client?.name || '-'}</td>
                    <td>{task.assignName?.name || '-'}</td>
                    <td>{task.status}</td>
                    <td>{task.paymentStatus}</td>
                    <td>
                      <Switch
                        checked={task.isBillGenerated}
                        onChange={() => handleBillGenerate(task.taskId)}
                        color="primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePrevious} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages-1}
            </span>
            <button onClick={handleNext} disabled={page === totalPages-1}>
              Next
            </button>
          </div>
        </>
      ) : !loading && billData.length === 0 ? (
        <p>No tasks found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
      ) : null}
    </div>
  );
};

export default BillGenerate;