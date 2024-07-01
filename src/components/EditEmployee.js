import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    address: '',
    phonenumber: '',
    email: '',
    datestarted: '',
    access: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setEmployee(data.employee);
        } else {
          console.error('Failed to fetch employee');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessValue = parseInt(employee.access);
    if (!isNaN(accessValue) && (accessValue !== 0 && accessValue !== 1)) {
      alert('Access value should be either 0 or 1');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee),
        credentials: 'include'
      });
      if (response.ok) {
        console.log("Employee",employee.id,"updated succesfully")
        navigate('/viewemployees');
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={employee.name || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={employee.address || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <InputMask
            mask="999-999-9999"
            maskChar="_"
            type="text"
            name="phonenumber"
            value={employee.phonenumber || ''}
            onChange={handleChange}
            required
          />
          <small>Format: 999-999-9999</small>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={employee.email || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Date Started:</label>
          <input type="date" name="datestarted" value={employee.datestarted || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Access:</label>
          <select name="access" value={employee.access.toString() || ''} onChange={handleChange} required>
            <option value="">Select Access</option>
            <option value="0">0 - Admin</option>
            <option value="1">1 - User</option>
          </select>
        </div>
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
