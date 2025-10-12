import React, { useState, useEffect} from 'react';
import useToast from '../hooks/useToast';
import Toast from './Toast';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

const DisplayBranch = () =>{
    const [AllBranches,setBranches] = useState([]);
    const { toast, showToast } = useToast();
    const GetBranches = async() =>{
        try {
            const query = await fetch(getApiUrl(API_ENDPOINTS.BRANCHES),{
                method : 'GET'
            });
            const data = await query.json();
            setBranches(data);
        } catch (error) {
            showToast('Failed to load branches', 'error');
            console.log(error.message);
        }
    };
    useEffect(()=>{
        GetBranches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
      <div className='mt-5'>
          <Toast toast={toast} />
          <h1 style = {{textAlign : 'center'}}>All Branches</h1>
      <div className="table-responsive">
           <table className="table container mt-5">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Branch Name</th>
            <th scope="col">House number</th>
            <th scope="col">City</th>
            <th scope="col">Zip code</th>
          </tr>
        </thead>
        <tbody>
          {AllBranches.map (branch=>(
            <tr key = {branch.branch_id}>
                <td data-label="ID">{branch.branch_id}</td>
                <td data-label="Branch Name">{branch.name}</td>
                <td data-label="House No">{branch.house_no}</td>
                <td data-label="City">{branch.city}</td>
                <td data-label="Zip Code">{branch.zip_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    );
};

export default DisplayBranch;