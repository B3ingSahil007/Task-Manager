import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentCollected = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Token & User ID from localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchCollectedPayments = async () => {
      try {
        const response = await axios.get('https://catask.co.in/api/v1/task/clientpaymentcollected', {
          params: {
            userId: userId,
            page: page,
            size: size
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('API Response:', response.data);
        setData(response.data.data.content);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchCollectedPayments();
  }, [page, size, token, userId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Collected Payment Tasks</h2>

      {data.length === 0 ? (
        <div className="text-center text-gray-600 bg-yellow-100 p-4 rounded-md shadow-sm">
          <p className="text-lg font-medium">No Payment Collected</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left border">#</th>
                <th className="px-4 py-3 text-left border">Title</th>
                <th className="px-4 py-3 text-left border">Description</th>
                {/* Add more table headers if needed */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="px-4 py-3 border">{item.title || 'Untitled'}</td>
                  <td className="px-4 py-3 border">{item.description || 'N/A'}</td>
                  {/* Add more data columns here */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentCollected;
