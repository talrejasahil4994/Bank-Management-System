import React, { useState, useEffect } from 'react';
import customer from '../images/customer.png';
import employee from '../images/employee.png';
import branch from '../images/branch.png';
import avatar from '../images/avatar.png';
import { useHistory } from 'react-router-dom';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import BackButton from './BackButton';

const EmployeeControl = () => {
    const history = useHistory();
    const [userRole, setUserRole] = useState('employee');
    const [username, setUsername] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const { toast: newToast, showSuccess, showInfo, hideToast } = useToast();

    useEffect(() => {
        // Get role and username from URL parameters
        const params = new URLSearchParams(window.location.search);
        const role = params.get('role') || 'employee';
        const user = params.get('username') || 'unknown';
        setUserRole(role);
        setUsername(user);
    }, []);

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const handleLogout = () => {
        const role = userRole.charAt(0).toUpperCase() + userRole.slice(1);
        showInfo(`Logging out ${username}...`, 1500);
        showToast('Logged out successfully!', 'success');
        
        setTimeout(() => {
            showSuccess(`${role} ${username} logged out successfully! Redirecting...`, 1500);
            setTimeout(() => {
                history.push('/');
            }, 1500);
        }, 1500);
    };

    return (
        <div>
            <BackButton 
                to="/employee/login" 
                label="Back" 
                toastMessage="Returning to employee login..."
                variant="warning"
            />
            {/* Toast Notification */}
            <Toast 
                show={newToast.show} 
                message={newToast.message} 
                type={newToast.type} 
                onClose={hideToast} 
            />
            {toast.show && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}>
                    <div className={`alert ${toast.type === 'error' ? 'alert-danger' : 'alert-success'} alert-dismissible`}>
                        {toast.message}
                        <button type="button" className="close" onClick={() => setToast({ show: false, message: '', type: '' })}>
                            <span>&times;</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="border p-5" style={{ backgroundColor: userRole === 'manager' ? '#d4a574' : '#006d77' }}>
                <h1 className="mt-5" style={{ textAlign: 'center', color: '#e5e5e5' }}>
                    {userRole === 'manager' ? 'Manager Dashboard' : 'Employee Dashboard'}
                </h1>
                <hr style={{ color: '#FFFFFF' }} />
                <img src={avatar} alt="missing avatar" className="rounded mx-auto d-block" />
                <h3 className="mt-5" style={{ textAlign: 'center', color: '#e5e5e5' }}>
                    {userRole}@{username}
                </h3>
                <p className="text-center text-light">
                    {userRole === 'manager' ? 'Full Administrative Access' : 'Limited Access - Customer Management Only'}
                </p>
                <div className="text-center">
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-5 mt-4" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    {userRole === 'manager' ? 'Administrative Control Panel' : 'Employee Operations'}
                </h2>
                
                <table className="table">
                    <tbody>
                        <tr>
                            {/* Customer Management - Available to both employees and managers */}
                            <td>
                                <div className="card text-black bg-white mt-3 shadow-lg p-3 mb-5 bg-white rounded">
                                    <div className="">
                                        <h3 className="float-left">Customer</h3>
                                        <button 
                                            className="btn btn-outline-primary float-right" 
                                            height="100px" 
                                            onClick={() => history.push(`/admin/customer?username=${username}&role=${userRole}`)}
                                        >
                                            Manage
                                        </button>
                                    </div>
                                    <div className="card-body pd-5">
                                        <img src={customer} alt="customer management" height="300px" className="rounded mx-auto d-block mt-4" />
                                        <p className="text-muted mt-2">
                                            {userRole === 'manager' ? 'Add, Edit, Delete Customers' : 'Add, View, Delete Customers & Create Accounts'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Employee Management - Only for managers */}
                            {userRole === 'manager' && (
                                <td>
                                    <div className="card text-black bg-white mt-3 shadow-lg p-3 mb-5 bg-white rounded">
                                        <div className="">
                                            <h3 className="float-left">Employee</h3>
                                            <button 
                                                className="btn btn-outline-warning float-right" 
                                                height="100px" 
                                                onClick={() => history.push(`/admin/employee?username=${username}&role=${userRole}`)}
                                            >
                                                Manage
                                            </button>
                                        </div>
                                        <div className="card-body pd-5">
                                            <img src={employee} alt="employee management" height="300px" className="rounded mx-auto d-block mt-4" />
                                            <p className="text-muted mt-2">Add, Edit, Delete Employees</p>
                                        </div>
                                    </div>
                                </td>
                            )}

                            {/* Branch Management - Only for managers */}
                            {userRole === 'manager' && (
                                <td>
                                    <div className="card text-black bg-white mt-3 shadow-lg p-3 mb-5 bg-white rounded">
                                        <div className="">
                                            <h3 className="float-left">Branch</h3>
                                            <button 
                                                className="btn btn-outline-success float-right" 
                                                height="100px" 
                                                onClick={() => history.push(`/admin/branch?username=${username}&role=${userRole}`)}
                                            >
                                                Manage
                                            </button>
                                        </div>
                                        <div className="card-body pd-5">
                                            <img src={branch} alt="branch management" height="300px" className="rounded mx-auto d-block mt-4" />
                                            <p className="text-muted mt-2">Add, Edit, Delete Branches</p>
                                        </div>
                                    </div>
                                </td>
                            )}

                            {/* Message for employees about limited access */}
                            {userRole === 'employee' && (
                                <td>
                                    <div className="card text-muted bg-light mt-3 shadow p-3 mb-5 bg-white rounded" style={{ border: '2px dashed #ccc' }}>
                                        <div className="card-body pd-5 text-center">
                                            <h4 className="text-muted">Limited Access</h4>
                                            <p className="text-muted">As an employee, you have access to:</p>
                                            <ul className="list-unstyled text-muted">
                                                <li>✅ Customer Management</li>
                                                <li>✅ Account Creation</li>
                                                <li>❌ Employee Management</li>
                                                <li>❌ Branch Management</li>
                                                <li>❌ Transaction Processing</li>
                                            </ul>
                                            <small className="text-muted">Contact your manager for additional access.</small>
                                        </div>
                                    </div>
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeControl;
