import React, { useEffect, useState } from 'react';
import './BillGenerate.css';
import { TextField } from '@mui/material';

const PaymentCollected = () => {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPaymentCollected = async (currentPage) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_URL_API}task/clientpaymentcollected?userId=${userId}&page=${currentPage}&size=${size}`;
      
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

      if (!response.ok) throw new Error('Failed to fetch payment collected data');

      const data = await response.json();
      setBillData(data?.data?.content || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentCollected(page);
  }, [page, searchTerm]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="bill-container">
      <h2 className="bill-heading">Payment Collected List</h2>

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
                  <th>Firm Name</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {billData.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskId}</td>
                    <td>{task.name}</td>
                    <td>{task.client?.name || '-'}</td>
                    <td>{task.assignName?.name || '-'}</td>
                    <td>{task.client?.firmName || '-'}</td>
                    <td>{task.status}</td>
                    <td>COLLECTED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : !loading && billData.length === 0 ? (
        <p>No collected payments found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
      ) : null}
    </div>
  );
};

export default PaymentCollected;