import React, { useState, useEffect, useCallback} from 'react';
import useToast from '../hooks/useToast';
import Toast from './Toast';
import BackButton from './BackButton';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

const PostBranch = ()=>{
    const [AllBranch,setBranch] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [name,setName] = useState('');
    const [house_no,setHouse] = useState('');
    const [city,setCity] = useState('');
    const [zip_code,setZipCode] = useState('');
    
    // Edit functionality states
    const [editingBranch, setEditingBranch] = useState(null);
    const [editName, setEditName] = useState('');
    const [editHouse, setEditHouse] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editZipCode, setEditZipCode] = useState('');
    
    // States
    const [refreshing, setRefreshing] = useState(false);
    
    // Toast integration
    const { toast, showToast, showInfo, showSuccess, showError } = useToast();
    const DeleteBranch = async(branch_id) =>{
        try {
          const response = await fetch(getApiUrl(`branch/${branch_id}`),{
              method : 'DELETE'
          });
          
          if (response.ok) {
              showToast('Branch deleted successfully', 'success');
              GetBranches(false);
          } else {
              showToast('Failed to delete branch', 'error');
          }
        } catch (error) {
          showToast('Network error occurred', 'error');
          console.log(error.message);
        }
    };
    const AddBranch = async(e)=> {
      e.preventDefault();
      try {
        const body = {name,house_no,city,zip_code};
        const response = await fetch(getApiUrl(API_ENDPOINTS.BRANCHES),{
          method : 'POST',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify(body)
        });
        
        if (response.ok) {
            showToast('Branch added successfully', 'success');
            setName('');
            setHouse('');
            setCity('');
            setZipCode('');
            GetBranches(false);
        } else {
            showToast('Failed to add branch', 'error');
        }
      } catch (error) {
        showToast('Network error occurred', 'error');
        console.log(error);
      }
    };
    // Search functionality
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredBranches(AllBranch);
        } else {
            const filtered = AllBranch.filter(branch => 
                branch.name.toLowerCase().includes(term.toLowerCase()) ||
                branch.city.toLowerCase().includes(term.toLowerCase()) ||
                branch.house_no.includes(term) ||
                branch.branch_id.toString().includes(term)
            );
            setFilteredBranches(filtered);
        }
    };
    
    // Edit functionality
    const startEdit = (branch) => {
        setEditingBranch(branch.branch_id);
        setEditName(branch.name);
        setEditHouse(branch.house_no);
        setEditCity(branch.city);
        setEditZipCode(branch.zip_code);
    };
    
    const cancelEdit = () => {
        setEditingBranch(null);
        setEditName('');
        setEditHouse('');
        setEditCity('');
        setEditZipCode('');
    };
    
    const saveEdit = async () => {
        try {
            const body = {
                name: editName,
                house_no: editHouse,
                city: editCity,
                zip_code: editZipCode
            };
            
            const response = await fetch(getApiUrl(`branch/${editingBranch}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Branch updated successfully', 'success');
                cancelEdit();
                GetBranches(false);
            } else {
                showToast(data.message || 'Failed to update branch', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    };

    const GetBranches = useCallback(async(showLoading = false)=> {
      try {
        if (showLoading) {
          setRefreshing(true);
          showInfo('🔄 Refreshing branch data...');
        }
        
        const query = await fetch(getApiUrl(API_ENDPOINTS.BRANCHES));
        const data =await query.json();
        setBranch(data);
        setFilteredBranches(data);
        
        if (showLoading) {
          showSuccess(`✅ Successfully loaded ${data.length} branches!`);
        }
        
        console.log(data);
    } catch (error) {
        console.log(error);
        if (showLoading) {
          showError('❌ Failed to load branches. Please try again.');
        }
    } finally {
        if (showLoading) {
          setRefreshing(false);
        }
    }
    }, [showInfo, showSuccess, showError]);
    
    // Refresh handler for the refresh button
    const handleRefresh = () => {
        GetBranches(true); // Show loading state
    };

    useEffect(()=>{
      GetBranches();
  },[GetBranches]);

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
                variant="primary"
            />
            <Toast toast={toast} />
            
            {/* Header Section */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-5 pb-3">
                            <h1 className="mb-3 mb-sm-0 text-center text-sm-left" style={{fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'}}>Branch Management</h1>
                            <button 
                                className="btn btn-lg btn-outline-info" 
                                type="button" 
                                data-toggle="collapse" 
                                data-target="#collapseExample" 
                                aria-expanded="false" 
                                aria-controls="collapseExample"
                                style={{minWidth: '140px'}}
                            >
                                ➕ Add Branch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Add Branch Form */}
            <div className='collapse' id='collapseExample'>
                <div className="container">
                    <form className='border p-4 mt-3 bg-light rounded' onSubmit={AddBranch}>
                        <h3 className="text-center text-md-left">Add New Branch</h3>
                        <hr />
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Branch Name *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={name} 
                                        onChange={e=> setName(e.target.value)} 
                                        required 
                                        placeholder="Enter branch name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>House No.</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={house_no} 
                                        onChange={e=> setHouse(e.target.value)} 
                                        placeholder="Enter house number"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={city} 
                                        onChange={e=> setCity(e.target.value)} 
                                        required 
                                        placeholder="Enter city name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Zip Code</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={zip_code} 
                                        onChange={e=> setZipCode(e.target.value)} 
                                        placeholder="Enter zip code"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-md-left">
                            <button type="submit" className="btn btn-primary btn-lg" style={{minWidth: '120px'}}>
                                Add Branch
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Branch List Section */}
            <div className='container-fluid px-3 px-md-5 py-4'>
<div className="d-flex justify-content-between align-items-center mb-3">
    <h1>All Branches ({filteredBranches.length} of {AllBranch.length})</h1>
    <button 
        className="btn btn-outline-secondary" 
        onClick={handleRefresh}
        disabled={refreshing}
        title={refreshing ? 'Refreshing...' : 'Refresh branch data'}
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
                placeholder="Search by name, city, address, or ID..."
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
<table className="table">
  <thead className="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Branch Name</th>
      <th scope="col">House No</th>
      <th scope="col">City</th>
      <th scope="col">Zip Code</th>
      <th scope="col"></th>

    </tr>
  </thead>
  <tbody>
{filteredBranches.length === 0 ? (
  <tr>
    <td colSpan="6" className="text-center text-muted">
      {AllBranch.length === 0 ? 'No branches found.' : 'No branches match your search criteria.'}
    </td>
  </tr>
) : (
  filteredBranches.map(branch => (
  <tr key={branch.branch_id}>
    <td data-label="ID">{branch.branch_id}</td>
    <td data-label="Branch Name">
      {editingBranch === branch.branch_id ? (
        <input 
          type="text" 
          className="form-control form-control-sm" 
          value={editName} 
          onChange={(e) => setEditName(e.target.value)}
        />
      ) : (
        branch.name
      )}
    </td>
    <td data-label="House No">
      {editingBranch === branch.branch_id ? (
        <input 
          type="text" 
          className="form-control form-control-sm" 
          value={editHouse} 
          onChange={(e) => setEditHouse(e.target.value)}
        />
      ) : (
        branch.house_no
      )}
    </td>
    <td data-label="City">
      {editingBranch === branch.branch_id ? (
        <input 
          type="text" 
          className="form-control form-control-sm" 
          value={editCity} 
          onChange={(e) => setEditCity(e.target.value)}
        />
      ) : (
        branch.city
      )}
    </td>
    <td data-label="Zip Code">
      {editingBranch === branch.branch_id ? (
        <input 
          type="text" 
          className="form-control form-control-sm" 
          value={editZipCode} 
          onChange={(e) => setEditZipCode(e.target.value)}
        />
      ) : (
        branch.zip_code
      )}
    </td>
    <td data-label="Actions">
      {editingBranch === branch.branch_id ? (
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
            onClick={() => startEdit(branch)}
            title="Edit branch"
          >
            📝 Edit
          </button>
          <button 
            className = 'btn btn-sm btn-danger' 
            onClick={()=> DeleteBranch(branch.branch_id)}
            title="Delete branch"
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
<hr></hr>
 
</div>
    );
};

export default PostBranch;