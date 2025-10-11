import React, { Fragment } from 'react';
import DisplayBranch from './DisplayBranch';
import FormTransaction from './FormTransaction';
import BackButton from './BackButton';

const Transaction = ()=>{
    return(
        <Fragment>
        <BackButton 
            to="/customer" 
            label="Back" 
            toastMessage="Returning to customer dashboard..."
            variant="info"
        />
        <FormTransaction/>
        <DisplayBranch/>
        </Fragment>
    );
};

export default Transaction;