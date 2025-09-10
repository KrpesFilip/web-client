import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../context/global';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 20px;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 400px;

  th, td {
    border: 1px solid #ccc;
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  button {
    padding: 5px 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #c0392b;
  }

  @media (max-width: 600px) {
    border: 0;

    tr {
      display: block;
      margin-bottom: 15px;
      border-bottom: 2px solid #ddd;
    }

    td {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border: none;
      border-bottom: 1px solid #eee;
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
      flex-basis: 50%;
    }

    td:last-child {
      border-bottom: 0;
    }

    th {
      display: none;
    }
  }
`;

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const { user, token } = useGlobalContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <TableWrapper>
      <h1>Admin Panel</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label="Username">{u.username}</td>
                <td data-label="Role">{u.role}</td>
                <td data-label="Actions">
                  {u.role !== 'admin' && u.username !== user.username && (
                    <button onClick={() => deleteUser(u.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}

      <Link to="/">⬅ Back to Homepage</Link>
    </TableWrapper>
  );
}

export default AdminPanel;
