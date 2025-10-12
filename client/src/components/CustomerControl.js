import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import avatar from '../images/avatar.png';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import BackButton from './BackButton';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';


const CustomerControl = () => {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [house_no, setHouse] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipCode] = useState('');
    const [username, setUsername] = useState('');
    const [MyAccounts, setAccounts] = useState([]);
    const [current_balance, setBalance] = useState('');
    const [Alltransaction, SetTransaction] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();
    const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

    // Authentication check and logout functionality
    const checkAuthentication = () => {
        const customerData = sessionStorage.getItem('customerData');
        const userRole = sessionStorage.getItem('userRole');
        
        if (!customerData || userRole !== 'customer') {
            history.push('/customer/login');
            return false;
        }
        
        return JSON.parse(customerData);
    };

    const handleLogout = () => {
        showInfo('Logging out...', 1500);
        sessionStorage.removeItem('customerData');
        sessionStorage.removeItem('userRole');
        
        setTimeout(() => {
            showSuccess('Logged out successfully! Redirecting...', 1500);
            setTimeout(() => {
                history.push('/customer/login');
            }, 1500);
        }, 1500);
    };

    const DeleteAccount = async(account_id) => {
        if (!window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            return;
        }
        
        showInfo('Deleting account...', 2000);
        
        try {
            const response = await fetch(getApiUrl(`accounts/${account_id}`), {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Refresh account data instead of full page reload
                GetAccountDetails(false);
                showSuccess('Account deleted successfully!');
            } else {
                const errorMessage = 'Failed to delete account. Please try again.';
                setError(errorMessage);
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Delete error:', error);
            const errorMessage = 'Network error occurred while deleting account.';
            setError(errorMessage);
            showError(errorMessage);
        }
    };
    const AddAccount = async() => {
        if (!current_balance || parseFloat(current_balance) < 0) {
            showError('Please enter a valid initial balance.');
            return;
        }
        
        showInfo('Creating new account...', 2000);
        
        try {
            const body = { customer_id: id, current_balance };
            const response = await fetch(getApiUrl(API_ENDPOINTS.ACCOUNTS), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Refresh account data instead of full page reload
                await GetAccountDetails(false);
                setBalance(''); // Clear balance input
                showSuccess(`Account created successfully with initial balance of $${current_balance}!`);
                
                // Auto-expand the account details section
                setTimeout(() => {
                    const accountDetailsButton = document.querySelector('[data-target="#AccountDetails"]');
                    const accountDetailsDiv = document.querySelector('#AccountDetails');
                    if (accountDetailsButton && accountDetailsDiv && !accountDetailsDiv.classList.contains('show')) {
                        accountDetailsButton.click();
                    }
                }, 1500);
            } else {
                const errorMessage = data.message || 'Failed to create account';
                setError(errorMessage);
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Add account error:', error);
            const errorMessage = 'Network error occurred while creating account.';
            setError(errorMessage);
            showError(errorMessage);
        }
    };
    const GetAccountDetails = async(showToastMessage = true) => {
        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.ACCOUNTS_BY_CUSTOMER(id)));
            const responseData = await response.json();
            
            // Handle new API response format
            const accounts = responseData.success ? responseData.accounts : responseData;
            setAccounts(accounts);
            
            console.log('Accounts API Response:', responseData);
            console.log('Accounts:', accounts);
            
            if (showToastMessage) {
                if (accounts.length > 0) {
                    showSuccess(`Loaded ${accounts.length} account(s) successfully!`, 2000);
                } else {
                    showInfo('No accounts found. Create your first account!', 2000);
                }
            }
        } catch (error) {
            console.error('Get accounts error:', error);
            const errorMessage = 'Failed to load account details';
            setError(errorMessage);
            if (showToastMessage) {
                showError(errorMessage);
            }
        }
    };
    const GetTransactions = async(showToastMessage = true) => {
        try {
            if (showToastMessage) {
                showInfo('Loading transaction history...', 1000);
            }
            const response = await fetch(getApiUrl(API_ENDPOINTS.TRANSACTIONS_BY_CUSTOMER(id)));
            const responseData = await response.json();
            
            // Handle new API response format
            const transactions = responseData.success ? responseData.transactions : responseData;
            SetTransaction(transactions);
            
            console.log('Transactions API Response:', responseData);
            console.log('Transactions:', transactions);
            
            if (showToastMessage) {
                showSuccess(`Loaded ${transactions.length} transaction(s) successfully!`);
            }
        } catch (error) {
            console.error('Get transactions error:', error);
            const errorMessage = 'Failed to load transaction history';
            setError(errorMessage);
            if (showToastMessage) {
                showError(errorMessage);
            }
        }
    };
    const LoadCustomerData = () => {
        try {
            const customerData = checkAuthentication();
            
            if (customerData) {
                setID(customerData.customer_id);
                setName(customerData.name);
                setPhone(customerData.phone);
                setEmail(customerData.email);
                setHouse(customerData.house_no);
                setCity(customerData.city);
                setZipCode(customerData.zipcode);
                setUsername(customerData.username);
                setLoading(false);
            }
        } catch (error) {
            console.error('Load customer data error:', error);
            setError('Failed to load customer data');
            setLoading(false);
        }
    };
    useEffect(() => {
        LoadCustomerData();
        // eslint-disable-next-line
    }, []);
    
    // Load accounts when customer ID is set
    useEffect(() => {
        if (id) {
            GetAccountDetails(false); // Don't show toast on initial load
        }
        // eslint-disable-next-line
    }, [id]);
    
    // Smart handler for account details button
    const handleAccountDetailsClick = () => {
        const accountDetailsDiv = document.querySelector('#AccountDetails');
        const isCurrentlyClosed = !accountDetailsDiv.classList.contains('show');
        
        if (isCurrentlyClosed) {
            // Only fetch and show toast when opening
            GetAccountDetails(true);
        }
    };
    
    // Smart handler for transactions button  
    const handleTransactionsClick = () => {
        const transactionDiv = document.querySelector('#alltransaction');
        const isCurrentlyClosed = !transactionDiv.classList.contains('show');
        
        if (isCurrentlyClosed) {
            // Only fetch and show toast when opening
            GetTransactions(true);
        }
    };
    
    // Comprehensive refresh function
    const handleRefreshAll = async () => {
        if (refreshing) return; // Prevent multiple simultaneous refreshes
        
        setRefreshing(true);
        showInfo('Refreshing all data...', 2000);
        
        try {
            // Refresh customer data first
            LoadCustomerData();
            
            // If customer ID is available, refresh accounts and transactions
            if (id) {
                await Promise.all([
                    GetAccountDetails(false), // Refresh accounts without toast
                    GetTransactions(false)    // Refresh transactions without toast
                ]);
            }
            
            showSuccess('All data refreshed successfully!', 2000);
        } catch (error) {
            console.error('Refresh error:', error);
            showError('Failed to refresh data. Please try again.', 3000);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
<div>
    <BackButton 
        to="/customer/login" 
        label="Back" 
        toastMessage="Returning to customer login..."
        clearSession={true}
        sessionKeys={['customerData', 'userRole']}
        variant="danger"
    />
    <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
    />
    <div className='border p-3 p-md-5' style={{backgroundColor : '#006d77'}}>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <h1 className='mt-3 mt-md-5 mb-3 mb-sm-0' style={{textAlign : 'center', color : '#e5e5e5', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'}}>Customer Details</h1>
            <button 
                className="btn btn-outline-light" 
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
        <hr style={{color : '#FFFFFF'}}></hr>
        <img src={avatar} alt='missing avatar' className='rounded mx-auto d-block'></img>
        <h3 className='mt-5' style={{textAlign : 'center', color : '#e5e5e5'}}>username@{username}</h3>
    </div>
<div className='container border mt-5 p-5' >
    {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
                type="button" 
                className="close" 
                onClick={() => setError('')}
            >
                <span>&times;</span>
            </button>
        </div>
    )}
    <h2>Personal Details</h2>
<div className="input-group mb-3 mt-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">customerid@</span>
  </div>
  <input type="text" value={id} className="form-control" placeholder="id" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">name@</span>
  </div>
  <input type="text" value={name} className="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">phone@</span>
  </div>
  <input type="text" value={phone} className="form-control" placeholder="id" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">email@</span>
  </div>
  <input type="text" value={email} className="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">house@</span>
  </div>
  <input type="text" value={house_no} className="form-control" placeholder="id" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">city@</span>
  </div>
  <input type="text" value={city} className="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">zipcode@</span>
  </div>
  <input type="text" value={zipcode} className="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
</div>
<hr></hr>
<div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-3 gap-3">
  <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">
    <button 
        className='btn btn-outline-info' 
        data-toggle="collapse" 
        data-target="#collapseExample" 
        aria-expanded="false" 
        aria-controls="collapseExample"
        style={{minWidth: '150px'}}
    >
        💰 Create Account
    </button>

    <button 
        className="btn btn-outline-primary" 
        type="button" 
        data-toggle="collapse" 
        data-target="#AccountDetails" 
        aria-expanded="false" 
        aria-controls="AccountDetails" 
        onClick={handleAccountDetailsClick}
        style={{minWidth: '150px'}}
    >
        📊 Accounts ({MyAccounts.length})
    </button>

    <button 
        className="btn btn-success" 
        onClick={handleTransactionsClick} 
        type="button" 
        data-toggle="collapse" 
        data-target="#alltransaction" 
        aria-expanded="false" 
        aria-controls="alltransaction"
        style={{minWidth: '150px'}}
    >
        📄 Transactions
    </button>
  </div>
  
  <button 
    className="btn btn-outline-secondary btn-responsive" 
    onClick={handleRefreshAll}
    disabled={refreshing}
    title="Refresh all data"
    style={{minWidth: "120px"}}
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
        🔄 Refresh All
      </>
    )}
  </button>
</div>

<div className="collapse" id="collapseExample">

<div className="form-group shadow p-3 mb-5 bg-white rounded mt-3">
  <label>Customer Id</label>
  <input type="text" value={id} className="form-control mb-3" disabled required/>
  <label>Initial Balance</label>
  <input 
    type="number" 
    className="form-control" 
    value={current_balance}
    onChange={e => setBalance(e.target.value)}
    min="0"
    step="0.01"
    required
  />
  <button className="btn btn-primary btn-lg mt-3" onClick={AddAccount}>Add Account</button>
</div>
</div>

<div className="collapse" id="alltransaction">
  <div className="card card-body">
    Your Transactions
    <table className="table">
  <thead className="thead-light">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Account ID</th>
      <th scope="col">Action</th>
      <th scope="col">Amount</th>
      <th scope="col">Branch ID</th>
      <th scope="col">Date of Transaction</th>
    </tr>
  </thead>
  <tbody>
    {Alltransaction.map (t=>(
      <tr key={t.transaction_id}>
      <td>{t.transaction_id}</td>
      <td>{t.account_id}</td>
      <td>{t.action}</td>
      <td>{t.amount}</td>
      <td>{t.branch_id}</td>
      <td>{t.date_of_transaction}</td></tr>
    ))}
  </tbody>
</table>
  </div>
</div>
  

<div className="collapse" id="AccountDetails">
  <div className="card card-body">
    <h3>Your Account Details ({MyAccounts.length} accounts)</h3>
    {MyAccounts.length === 0 ? (
      <div className="alert alert-info">
        <strong>No accounts found.</strong> Create your first account using the "Create Account" button above.
      </div>
    ) : (
      MyAccounts.map((account, index) => (
        <div className="card shadow-lg p-3 mb-4 bg-white rounded account-card" key={account.account_id}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Savings Account #{index + 1}</h5>
            <small className="text-muted">Account ID: {account.account_id}</small>
          </div>
          <div className="card-body">
    <div className="input-group mb-3">
     <div className="input-group-prepend">
      <span className="input-group-text" id="basic-addon3">@account no</span>
     </div>
     <input type="text" value={account.account_id} name='account_no' className="form-control" aria-describedby="basic-addon3" readOnly/>
    </div>

  <div className="input-group mb-3">
    <div className="input-group-prepend">
      <span className="input-group-text">₹</span>
    </div>
    <input type="text" value={account.current_balance} className="form-control" aria-label="Amount (to the nearest dollar)" readOnly/>
    <div className="input-group-append">
    </div>
  </div>

  <div className="input-group mb-3">
    <div className="input-group-prepend">
      <span className="input-group-text">Date Opened</span>
    </div>
    <input type="text" value={account.date_opened.substring(0,10) + ' '+ account.date_opened.substring(11,16)} className="form-control" aria-label="Amount (to the nearest dollar)" readOnly/>
    <div className="input-group-append">
    </div>
  </div>
            <div className="account-actions d-flex flex-column flex-sm-row">
              <form action='http://localhost:3000/customer/transaction' method='GET' className="mb-2 mb-sm-0 mr-sm-3">
                <input type="hidden" name="account_no" value={account.account_id} />
                <button className='btn btn-info' type='submit'>Transaction</button>
              </form>
              <button className='btn btn-danger' onClick={()=>DeleteAccount(account.account_id)}>Delete</button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>

</div>

</div>
    
)};

export default CustomerControl;