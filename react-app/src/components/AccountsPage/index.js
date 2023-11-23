import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAccounts } from "../../store/accounts";
import './AccountsPage.css'
import AccountDetails from "../AccountCards";
import AccountOptions from "../AccountOptions";

function AccountsPage() {
    const dispatch = useDispatch();
    const accounts = useSelector(state => state.accounts.accounts)

    //Field-Selector States
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ reloadNeeded, setReloadNeeded ] = useState(false);

    useEffect(() => {
        Promise.all([dispatch(fetchAllAccounts())])
        .then(() => {
            setIsLoaded(true);
            setReloadNeeded(false);}
        )
        .catch(error => {
            console.log(error)
            setIsLoaded(false);
        });
        
    }, [dispatch, reloadNeeded]);

    if(!isLoaded) {
        return <div>Loading...</div>
    }

    let accountsList;
    if (accounts.length > 0) {
        accountsList = (
            accounts.map(account => (<AccountDetails key={account.id} account={account}/>))
        )
    } else {
        accountsList = (
            <div className="no-accounts-container">
                <div className="no-accounts-text">No Open Accounts</div>
            </div>
        )
    };

    const reloadAccounts = () => {
        setReloadNeeded(true);
    };

    return (
        <>
            <div className='account-card__container'>
                {accountsList}
            </div>
            <div>
                <AccountOptions reloadAccounts={reloadAccounts}/>
            </div>
        </>
    )
}

export default AccountsPage;
