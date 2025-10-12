import React, { useState, useEffect, useCallback} from 'react';
import BackButton from './BackButton';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

const PostCustomer = ()=>{
    const [AllCustomers,setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [email,setEmail] = useState('');
    const [house_no,setHouse] = useState('');
    const [city,setCity] = useState('');
    const [zipcode,setZipCode] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [refreshing, setRefreshing] = useState(false);
    
    // Edit functionality states
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editHouse, setEditHouse] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editZipcode, setEditZipcode] = useState('');
    
    // Account creation form states
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [initialBalance, setInitialBalance] = useState('');

    // Show toast notification
    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    }, []);
    
    // Search functionality
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredCustomers(AllCustomers);
        } else {
            const filtered = AllCustomers.filter(customer => 
                customer.name.toLowerCase().includes(term.toLowerCase()) ||
                customer.email.toLowerCase().includes(term.toLowerCase()) ||
                customer.username.toLowerCase().includes(term.toLowerCase()) ||
                customer.phone.includes(term) ||
                customer.customer_id.toString().includes(term)
            );
            setFilteredCustomers(filtered);
        }
    };
    
    // Edit functionality
    const startEdit = (customer) => {
        setEditingCustomer(customer.customer_id);
        setEditName(customer.name);
        setEditPhone(customer.phone);
        setEditEmail(customer.email);
        setEditHouse(customer.house_no);
        setEditCity(customer.city);
        setEditZipcode(customer.zipcode);
    };
    
    const cancelEdit = () => {
        setEditingCustomer(null);
        setEditName('');
        setEditPhone('');
        setEditEmail('');
        setEditHouse('');
        setEditCity('');
        setEditZipcode('');
    };
    
    const saveEdit = async () => {
        try {
            const body = {
                name: editName,
                phone: editPhone,
                email: editEmail,
                house_no: editHouse,
                city: editCity,
                zipcode: editZipcode
            };
            
            const response = await fetch(getApiUrl(`customer/${editingCustomer}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Customer updated successfully!');
                cancelEdit();
                GetCustomers(false);
            } else {
                showToast(data.message || 'Failed to update customer', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    };

    const DeleteCustomer = async(customer_id)=>{
      if (window.confirm('Are you sure you want to delete this customer?')) {
        try {
          const response = await fetch(getApiUrl(`customer/${customer_id}`),{
            method : 'DELETE'
          });
          if (response.ok) {
            showToast('Customer deleted successfully!');
            setCustomers(AllCustomers.filter(cust => cust.customer_id!==customer_id));
          } else {
            showToast('Failed to delete customer', 'error');
          }
        } catch (error) {
          showToast('Network error occurred', 'error');
        }
      }
    };
    
    const PostCustomer = async(e)=> {
      e.preventDefault();
      try {
        const body = {name,phone,email,house_no,city,zipcode,username,password};
        const response = await fetch(getApiUrl(API_ENDPOINTS.CUSTOMERS),{
          method : 'POST',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.success) {
          showToast('Customer added successfully!');
          // Clear form
          setName('');
          setPhone('');
          setEmail('');
          setHouse('');
          setCity('');
          setZipCode('');
          setUsername('');
          setPassword('');
          // Refresh customer list
          GetCustomers(false);
        } else {
          showToast(data.message || 'Failed to add customer', 'error');
        }
      } catch (error) {
        showToast('Network error occurred', 'error');
      }
    };
    
    const CreateAccount = async(e) => {
      e.preventDefault();
      try {
        const body = { customer_id: selectedCustomerId, current_balance: initialBalance };
        const response = await fetch(getApiUrl(API_ENDPOINTS.ACCOUNTS), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.success) {
          showToast(`Account created successfully for customer ID ${selectedCustomerId}!`);
          setSelectedCustomerId('');
          setInitialBalance('');
        } else {
          showToast(data.message || 'Failed to create account', 'error');
        }
      } catch (error) {
        showToast('Network error occurred', 'error');
      }
    };
    const GetCustomers = useCallback(async(showLoading = false)=> {
      try {
        if (showLoading) {
            setRefreshing(true);
            showToast('Refreshing customer data...', 'info');
        }
        
        const get_cust = await fetch(getApiUrl(API_ENDPOINTS.CUSTOMERS));
        const response =await get_cust.json();
        
        // Handle new API response format
        const customers = response.success ? response.customers : response;
        setCustomers(customers);
        setFilteredCustomers(customers);
        
        if (showLoading) {
            showToast(`Successfully loaded ${customers.length} customers!`, 'success');
        }
        
        console.log('API Response:', response);
        console.log('Customers:', customers);
    } catch (error) {
        console.error('Get customers error:', error);
        if (showLoading) {
            showToast('Failed to load customers. Please try again.', 'error');
        }
    } finally {
        if (showLoading) {
            setRefreshing(false);
        }
    }
    }, [showToast]);
    
    // Refresh handler for the refresh button
    const handleRefresh = () => {
        GetCustomers(true); // Show loading state
    };

    useEffect(()=>{
      GetCustomers();
  },[GetCustomers]);

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
                variant="success"
            />
            {/* Toast Notification */}
            {toast.show && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}>
                    <div className={`alert ${
                        toast.type === 'error' ? 'alert-danger' : 
                        toast.type === 'info' ? 'alert-info' : 
                        'alert-success'
                    } alert-dismissible`}>
                        {toast.message}
                        <button type="button" className="close" onClick={() => setToast({ show: false, message: '', type: '' })}>
                            <span>&times;</span>
                        </button>
                    </div>
                </div>
            )}
            
            {/* Header Section */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="pt-5 pb-3">
                            <h1 className="text-center mb-4" style={{fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'}}>Customer Management</h1>
                            
                            {/* Action buttons */}
                            <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center mb-3">
                                <button 
                                    className="btn btn-lg btn-outline-primary mb-2 mb-sm-0 mr-sm-3" 
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target="#addCustomerForm" 
                                    aria-expanded="false"
                                    style={{minWidth: '180px'}}
                                >
                                    ➕ Add Customer
                                </button>
                                <button 
                                    className="btn btn-lg btn-outline-success" 
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target="#createAccountForm" 
                                    aria-expanded="false"
                                    style={{minWidth: '180px'}}
                                >
                                    🏦 Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container">
                
                {/* Add Customer Form */}
                <div className='collapse' id='addCustomerForm'>
                    <form className='border p-4 mt-3 bg-light rounded' onSubmit={PostCustomer}>
                        <h3>Add New Customer</h3>
                        <hr />
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" className="form-control" value={name} onChange={e=> setName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone *</label>
                                    <input type="text" className="form-control" value={phone} onChange={e=> setPhone(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input type="email" className="form-control" value={email} onChange={e=> setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Address *</label>
                                    <input type="text" className="form-control" value={house_no} onChange={e=> setHouse(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input type="text" className="form-control" value={city} onChange={e=> setCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Zip Code *</label>
                                    <input type="text" className="form-control" value={zipcode} onChange={e=> setZipCode(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input type="text" className="form-control" value={username} onChange={e=> setUsername(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input type="password" className="form-control" value={password} onChange={e=> setPassword(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Add Customer</button>
                    </form>
                </div>
                
                {/* Create Account Form */}
                <div className='collapse' id='createAccountForm'>
                    <form className='border p-4 mt-3 bg-light rounded' onSubmit={CreateAccount}>
                        <h3>Create Account for Customer</h3>
                        <hr />
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Customer ID *</label>
                                    <select 
                                        className="form-control" 
                                        value={selectedCustomerId} 
                                        onChange={e=> setSelectedCustomerId(e.target.value)} 
                                        required
                                    >
                                        <option value="">Select a customer...</option>
                                        {AllCustomers.map(customer => (
                                            <option key={customer.customer_id} value={customer.customer_id}>
                                                {customer.customer_id} - {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Initial Balance *</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        className="form-control" 
                                        value={initialBalance} 
                                        onChange={e=> setInitialBalance(e.target.value)} 
                                        placeholder="Enter initial balance"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success btn-lg">Create Account</button>
                    </form>
                </div>
                
                {/* Customer List */}
                <div className="mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>All Customers ({filteredCustomers.length} of {AllCustomers.length})</h3>
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={handleRefresh}
                            disabled={refreshing}
                            title={refreshing ? 'Refreshing...' : 'Refresh customer data'}
                            style={{minWidth: '100px'}}
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
                                    placeholder="Search by name, email, username, phone, or ID..."
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
                    
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            {AllCustomers.length === 0 ? 'No customers found. Add some customers to get started.' : 'No customers match your search criteria.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.customer_id}>
                                            <td data-label="ID"><strong>{customer.customer_id}</strong></td>
                                            <td data-label="Name">
                                                {editingCustomer === customer.customer_id ? (
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm" 
                                                        value={editName} 
                                                        onChange={(e) => setEditName(e.target.value)}
                                                    />
                                                ) : (
                                                    customer.name
                                                )}
                                            </td>
                                            <td data-label="Phone">
                                                {editingCustomer === customer.customer_id ? (
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm" 
                                                        value={editPhone} 
                                                        onChange={(e) => setEditPhone(e.target.value)}
                                                    />
                                                ) : (
                                                    customer.phone
                                                )}
                                            </td>
                                            <td data-label="Email">
                                                {editingCustomer === customer.customer_id ? (
                                                    <input 
                                                        type="email" 
                                                        className="form-control form-control-sm" 
                                                        value={editEmail} 
                                                        onChange={(e) => setEditEmail(e.target.value)}
                                                    />
                                                ) : (
                                                    customer.email
                                                )}
                                            </td>
                                            <td data-label="Address">
                                                {editingCustomer === customer.customer_id ? (
                                                    <div>
                                                        <input 
                                                            type="text" 
                                                            className="form-control form-control-sm mb-1" 
                                                            placeholder="Address"
                                                            value={editHouse} 
                                                            onChange={(e) => setEditHouse(e.target.value)}
                                                        />
                                                        <div className="d-flex">
                                                            <input 
                                                                type="text" 
                                                                className="form-control form-control-sm mr-1" 
                                                                placeholder="City"
                                                                value={editCity} 
                                                                onChange={(e) => setEditCity(e.target.value)}
                                                            />
                                                            <input 
                                                                type="text" 
                                                                className="form-control form-control-sm" 
                                                                placeholder="Zip"
                                                                value={editZipcode} 
                                                                onChange={(e) => setEditZipcode(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    `${customer.house_no}, ${customer.city} ${customer.zipcode}`
                                                )}
                                            </td>
                                            <td data-label="Username"><code>{customer.username}</code></td>
                                            <td data-label="Actions">
                                                {editingCustomer === customer.customer_id ? (
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
                                                            onClick={() => startEdit(customer)}
                                                            title="Edit customer"
                                                        >
                                                            📝 Edit
                                                        </button>
                                                        <button 
                                                            className='btn btn-sm btn-danger' 
                                                            onClick={()=>DeleteCustomer(customer.customer_id)}
                                                            title="Delete customer"
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
        </div>
    );
};

export default PostCustomer;