import React from 'react';
import customer from '../images/customer.png';
import employee from '../images/employee.png';
import {useHistory} from 'react-router-dom';
const LoginPage = ()=>{
    const history = useHistory();

    return(
<div className="container p-3 p-md-5 mt-2 mt-md-4" style={{ justifyContent:'center', alignItems:'center', minHeight: '100vh', textAlign : 'center', backgroundColor : '#edf2f4' }}>
<h1 className="mb-3" style={{textAlign : "center", fontSize: "clamp(1.5rem, 4vw, 2.5rem)"}}>Welcome to Bank Management System!!</h1>
<p className="role-selection" style={{textAlign: "center", fontSize: "clamp(1rem, 3vw, 1.125rem)", marginBottom: "30px"}}>Role-Based Access Control: Customer • Employee/Manager</p>
<div className="row justify-content-center">
  <div className="col-12 col-md-6 col-lg-5 mb-4">
    <div className="card text-black bg-white shadow-lg rounded h-100">
      <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-center">
        <h3 className="mb-2 mb-sm-0">Customer</h3>
        <button className="btn btn-outline-primary btn-lg" onClick={() => history.push('/customer/login')}>Login</button>
      </div>
      <div className="card-body text-center">
        <img src={customer} alt="customer" className="img-fluid mx-auto d-block" style={{maxHeight: "250px", objectFit: "contain"}} />
      </div>
    </div>
  </div>
  <div className="col-12 col-md-6 col-lg-5 mb-4">
    <div className="card text-black bg-white shadow-lg rounded h-100">
      <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-center">
        <h3 className="mb-2 mb-sm-0">Employee / Manager</h3>
        <button className="btn btn-outline-success btn-lg" onClick={() => history.push('/employee/login')}>Login</button>
      </div>
      <div className="card-body text-center">
        <img src={employee} alt="employee" className="img-fluid mx-auto d-block" style={{maxHeight: "250px", objectFit: "contain"}} />
        <small className="text-center d-block text-muted mt-2">Managers & Employees use same login</small>
      </div>
    </div>
  </div>
</div>
</div>
    );
};

export default LoginPage;