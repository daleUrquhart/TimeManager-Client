import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ViewJobs = () => {
  const { isAdmin } = useAuth();  
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobdata', {
        credentials: 'include'
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Retrieved job data:",data)

        if (Array.isArray(data.jobData)) { 
          const validJobs = data.jobData.filter(job => job.customer !== undefined && job.customer !== null);   
          const sortedJobs = validJobs.sort((a, b) => a.customer.localeCompare(b.customer));  
          setJobs(sortedJobs);
        } else {
          console.error('Unexpected response data:', data.jobData);
          setJobs([]);
        }
      } else {
        console.error('Error fetching job data:', response.statusText);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setJobs([]);
    }
  };
  
  const handleEdit = (workorder) => {
    console.log("Editing job with workorder:", workorder);
    navigate(`/editjob/${workorder}`);
  };

  const handleDelete = async (workorder) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobdata/delete/${workorder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentJob: false }),
        credentials: 'include'
      });

      if (response.ok) {
        setJobs(prevJobs => prevJobs.filter(job => job.workorder !== workorder));
        window.location.reload();
      } else {
        console.error('Error toggling currentJob:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling currentJob:', error);
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobdata/export', {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_job_data.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        console.log("Export successful");
      } else {
        console.error('Error exporting all job data:', response.statusText);
      }
    } catch (error) {
      console.error('Error exporting all job data:', error);
    }
  };

  const handleAddJob = () => {
    navigate('/addjob');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobs = jobs.filter(job =>
    job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.workorder.toString().includes(searchTerm) ||
    job.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1>Job Data</h1>
      <div className="d-flex justify-content-between mb-3">
        {isAdmin && (
          <button className="btn btn-success" onClick={handleAddJob}>
            Add Job
          </button>
        )}
        <button className="btn btn-primary" onClick={handleExportAll}>
          Export Jobs
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by customer, workorder, property, or address"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>workorder</th>
            <th>customer</th>
            <th>property</th>
            <th>address</th> 
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map(job => (
            <tr key={job.workorder}>
              <td>{job.workorder}</td>
              <td>{job.customer}</td>
              <td>{job.property}</td>
              <td>{job.address}</td>
              <td>
                {isAdmin && (
                  <>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(job.workorder)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.workorder)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewJobs;
