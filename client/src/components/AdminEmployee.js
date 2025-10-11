import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

const PostEmployee = () => {
  const [AllEmployee, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [user_password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit functionality states
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const DeleteEmp = async (username) => {
    if (!window.confirm(`Are you sure you want to delete employee "${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
        const response = await fetch(`http://localhost:5000/employee/${username}`, {
            method: "DELETE"
        });
        
        const data = await response.json();
        
        if (data.success) {
            setEmployees(AllEmployee.filter(emp => emp.username !== username));
            setFilteredEmployees(filteredEmployees.filter(emp => emp.username !== username));
            setSuccess(`✅ Employee "${username}" has been removed from the system.`);
            setTimeout(() => setSuccess(''), 4000);
        } else {
            setError(`❌ ${data.message || 'Failed to delete employee. Please try again.'}`);
            setTimeout(() => setError(''), 4000);
        }
    } catch (error) {
        console.error('Delete employee error:', error);
        setError('❌ Network error occurred while deleting employee. Please check your connection.');
        setTimeout(() => setError(''), 4000);
    }
  };
  
  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredEmployees(AllEmployee);
    } else {
      const filtered = AllEmployee.filter(emp => 
        emp.username.toLowerCase().includes(term.toLowerCase()) ||
        emp.full_name.toLowerCase().includes(term.toLowerCase()) ||
        emp.email.toLowerCase().includes(term.toLowerCase()) ||
        emp.emp_id.toString().includes(term)
      );
      setFilteredEmployees(filtered);
    }
  };
  
  // Edit functionality
  const startEdit = (employee) => {
    setEditingEmployee(employee.emp_id);
    setEditUsername(employee.username);
    setEditFullName(employee.full_name);
    setEditEmail(employee.email);
  };
  
  const cancelEdit = () => {
    setEditingEmployee(null);
    setEditUsername('');
    setEditFullName('');
    setEditEmail('');
  };
  
  const saveEdit = async () => {
    try {
      const body = {
        username: editUsername,
        full_name: editFullName,
        email: editEmail
      };
      
      const response = await fetch(`http://localhost:5000/employee/${editingEmployee}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Employee "${editFullName}" updated successfully! ✅`);
        setTimeout(() => setSuccess(''), 4000);
        cancelEdit();
        GetEmployees(false);
      } else {
        setError(data.message || 'Failed to update employee. Please try again. ❌');
        setTimeout(() => setError(''), 4000);
      }
    } catch (error) {
      console.error('Update employee error:', error);
      setError('Network error occurred while updating employee. Please check your connection. ❌');
      setTimeout(() => setError(''), 4000);
    }
  };
  const AddEmployee = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const body = { username, user_password, full_name, email };
      const response = await fetch('http://localhost:5000/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`✅ Employee "${full_name}" added successfully! Welcome to the team.`);
        setTimeout(() => setSuccess(''), 4000);
        // Reset form
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        // Refresh employee list
        GetEmployees(false);
      } else {
        setError(`❌ ${data.message || 'Failed to add employee. Please check all fields and try again.'}`);
        setTimeout(() => setError(''), 4000);
      }
    } catch (error) {
      console.error('Add employee error:', error);
      setError('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };
  const GetEmployees = async(showLoading = false)=> {
    try {
      if (showLoading) {
        setRefreshing(true);
        setSuccess('🔄 Refreshing employee data...');
        setTimeout(() => setSuccess(''), 2000);
      }
      
      const query = await fetch('http://localhost:5000/employee');
      const data =await query.json();
      setEmployees(data);
      setFilteredEmployees(data);
      
      if (showLoading) {
        setSuccess(`✅ Successfully loaded ${data.length} employees!`);
        setTimeout(() => setSuccess(''), 3000);
      }
      
      console.log(data);
    } catch (error) {
      console.log(error);
      if (showLoading) {
        setError('❌ Failed to load employees. Please try again.');
        setTimeout(() => setError(''), 4000);
      }
    } finally {
      if (showLoading) {
        setRefreshing(false);
      }
    }
  };
  
  // Refresh handler for the refresh button
  const handleRefresh = () => {
    GetEmployees(true); // Show loading state
  };

  useEffect(()=>{
    GetEmployees();
},[]);
    return (
        <div>
            <BackButton 
                to={() => {
                    const params = new URLSearchParams(window.location.search);
                    const username = params.get('username') || 'unknown';
                    const role = params.get('role') || 'employee';
                    return `/employee?username=${username}&role=${role}`;
                }}
                label="Back" 
                toastMessage="Returning to employee dashboard..."
                variant="warning"
            />
            
            {/* Header Section */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-5 pb-3">
                            <h1 className="mb-3 mb-sm-0 text-center text-sm-left" style={{fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'}}>Employee Management</h1>
                            <button 
                                className="btn btn-lg btn-outline-info" 
                                type="button" 
                                data-toggle="collapse" 
                                data-target="#addEmployeeForm" 
                                aria-expanded="false" 
                                aria-controls="addEmployeeForm"
                                style={{minWidth: '160px'}}
                            >
                                ➕ Add Employee
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='container'>
            
            {/* Collapsible Add Employee Form */}
            <div className='collapse' id='addEmployeeForm'>
                <form className='container border p-5 mt-3' onSubmit={AddEmployee}>
                    <h1>Add Employee</h1>
                    <hr/>
                    
                    {/* Error and Success Messages */}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="close" onClick={() => setError('')}>
                                <span>&times;</span>
                            </button>
                        </div>
                    )}
                    
                    {success && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {success}
                            <button type="button" className="close" onClick={() => setSuccess('')}>
                                <span>&times;</span>
                            </button>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                        
                        <label className="mt-3">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={full_name}
                            onChange={e => setFullName(e.target.value)}
                            required
                            disabled={loading}
                        />
                        
                        <label className="mt-3">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        
                        <label className="mt-3">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={user_password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-lg btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Employee'}
                    </button>
                </form>
            </div>
            
            <hr/>
            
            {/* All Employees Table */}
            <div className='p-3'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>All Employees ({filteredEmployees.length} of {AllEmployee.length})</h1>
                    <button 
                        className="btn btn-outline-secondary" 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        title={refreshing ? 'Refreshing...' : 'Refresh employee data'}
                        style={{minWidth: '120px'}}
                    >
                        {refreshing ? (
                            <>
                                <div className="spinner-border spinner-border-sm mr-2" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                🔄 Refresh
                            </>
                        )}
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, username, email, or ID..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchTerm && (
                                <div className="input-group-append">
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => handleSearch('')}
                                    >
                                        ❌
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    {AllEmployee.length === 0 ? 'No employees found.' : 'No employees match your search criteria.'}
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map(emp => (
                                <tr key={emp.emp_id}>
                                    <td>{emp.emp_id}</td>
                                    <td>
                                        {editingEmployee === emp.emp_id ? (
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm" 
                                                value={editUsername} 
                                                onChange={(e) => setEditUsername(e.target.value)}
                                            />
                                        ) : (
                                            emp.username
                                        )}
                                    </td>
                                    <td>
                                        {editingEmployee === emp.emp_id ? (
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm" 
                                                value={editFullName} 
                                                onChange={(e) => setEditFullName(e.target.value)}
                                            />
                                        ) : (
                                            emp.full_name
                                        )}
                                    </td>
                                    <td>
                                        {editingEmployee === emp.emp_id ? (
                                            <input 
                                                type="email" 
                                                className="form-control form-control-sm" 
                                                value={editEmail} 
                                                onChange={(e) => setEditEmail(e.target.value)}
                                            />
                                        ) : (
                                            emp.email
                                        )}
                                    </td>
                                    <td>{new Date(emp.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {editingEmployee === emp.emp_id ? (
                                            <div className="btn-group-vertical btn-group-sm">
                                                <button 
                                                    className="btn btn-sm btn-success mb-1" 
                                                    onClick={saveEdit}
                                                    title="Save changes"
                                                >
                                                    ✓ Save
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-secondary" 
                                                    onClick={cancelEdit}
                                                    title="Cancel editing"
                                                >
                                                    ✗ Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="btn-group btn-group-sm">
                                                <button 
                                                    className='btn btn-sm btn-outline-primary' 
                                                    onClick={() => startEdit(emp)}
                                                    title="Edit employee"
                                                >
                                                    📝 Edit
                                                </button>
                                                <button 
                                                    className='btn btn-sm btn-danger' 
                                                    onClick={() => DeleteEmp(emp.username)}
                                                    title="Delete employee"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};

export default PostEmployee;
