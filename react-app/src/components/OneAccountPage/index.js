import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector hook from react-redux

function AccountSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const accounts = useSelector(state => state.accounts.accounts); 

    const filteredAccounts = accounts.filter(account =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search Accounts" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div>
                {filteredAccounts.map(account => (
                    <div key={account.id}>
                        <h3>{account.accountName}</h3>
                        <p>Balance: {account.accountBalance}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AccountSearch;
