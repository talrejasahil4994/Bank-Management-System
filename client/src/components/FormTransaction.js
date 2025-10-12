import React, { useEffect, useState } from "react";
import useToast from '../hooks/useToast';
import Toast from './Toast';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

const FormTransaction = () => {
  const [account_id, SetAccid] = useState("");
  const [branch_id, SetBrid] = useState("");
  const [amount, SetAmt] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Toast integration
  const { toast, showToast } = useToast();
  
  const GetAccountID = () => {
    const parameters = window.location.search.substring(1).split("&");
    const temp = parameters[0].split("=");
    console.log(parameters);
    console.log(temp);
    SetAccid(temp[1]);
    
  };
  
  useEffect(() => {
    GetAccountID();
  }, []);
  
  const DoTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const action = document.getElementById("inputState").value;
    
    // Validate inputs
    if (!branch_id || !amount || !action) {
      showToast("Please fill all fields", "error");
      setLoading(false);
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      showToast("Amount must be greater than 0", "error");
      setLoading(false);
      return;
    }
    
    try {
      const body = { account_id, branch_id, amount, action };
      const res = await fetch(getApiUrl(API_ENDPOINTS.TRANSACTIONS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast(`Success! ${data.message}`, "success");
        // Clear form on success
        SetBrid("");
        SetAmt("");
        document.getElementById("inputState").value = "";
      } else {
        showToast(`Error: ${data.message || 'Transaction failed'}`, "error");
      }
    } catch (error) {
      console.error('Transaction error:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Toast toast={toast} />
      <form className="mt-3 mt-md-5 jumbotron transaction-form" onSubmit={DoTransaction}>
        <h1>Transaction</h1>
        <hr></hr>
      
      <div className="form-group">
        <label>Account ID</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          value={account_id}
          disabled
          required
        />
        <label>Branch ID</label>
        <input
          type="number"
          className="form-control"
          id="branchInput"
          value={branch_id}
          onChange={(e) => SetBrid(e.target.value)}
          placeholder="Enter branch ID (e.g., 101)"
          disabled={loading}
          required
        />
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          className="form-control"
          id="amountInput"
          value={amount}
          onChange={(e) => SetAmt(e.target.value)}
          placeholder="Enter amount"
          disabled={loading}
          required
        />
        <label>Action</label>
        <select id="inputState" className="form-control" disabled={loading} required>
          <option value="">Select Action</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdraw">Withdraw</option>
        </select>
      </div>

      <div className="transaction-buttons d-flex flex-column flex-sm-row">
        <button type="submit" className="btn btn-primary mb-2 mb-sm-0 mr-sm-3" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Transaction'}
        </button>
        
        <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
          Back to Account
        </button>
      </div>
    </form>
    </div>
  );
};

export default FormTransaction;
