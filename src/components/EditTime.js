import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTime = () => {
  const { entryid } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    role: '',
    timein: '',
    workorder: '',
    subaccount: '',
    activity: '',
    timeout: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeEntry = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/time/${entryid}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(data.timeEntry);  // Update form data with fetched time entry
        } else {
          console.error('Failed to fetch time entry');
        }
      } catch (error) {
        console.error('Error fetching time entry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeEntry();
  }, [entryid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/time/${entryid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (response.ok) {
        navigate('/viewtime');
      } else {
        console.error('Failed to update time entry');
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Edit Time Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="equipment">Equipment</option>
            <option value="laborer">Laborer</option>
            <option value="mechanic">Mechanic</option>
            <option value="payment">Payment</option>
          </select>
        </div>
        <div className="form-group">
          <label>Time In</label>
          <input
            type="time"
            className="form-control"
            name="timein"
            value={formData.timein}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Workorder</label>
          <input
            type="text"
            className="form-control"
            name="workorder"
            value={formData.workorder}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Subaccount</label>
          <select
            className="form-control"
            name="subaccount"
            value={formData.subaccount}
            onChange={handleChange}
            required
          >
            <option value="">Select subaccount</option>
            <option value="10100">10100</option>
            <option value="01">01</option>
          </select>
        </div>
        <div className="form-group">
          <label>Activity</label>
          <select
            className="form-control"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            required
          >
            <option value="">Select activity</option>
            <option value="carpenter">Carpenter</option>
            <option value="clerk">Clerk</option>
            <option value="foreman">Foreman</option>
            <option value="laborer">Laborer</option>
          </select>
        </div>
        <div className="form-group">
          <label>Time Out</label>
          <input
            type="time"
            className="form-control"
            name="timeout"
            value={formData.timeout}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Entry</button>
      </form>
    </div>
  );
};

export default EditTime;
