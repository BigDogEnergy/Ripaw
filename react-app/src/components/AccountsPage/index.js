import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAccounts } from "../../store/accounts";
import './AccountsPage.css'
import AccountCards from "../AccountCards";
import AccountOptions from "../AccountOptions";
import Spinner from "../Spinner";

function AccountsPage() {
    const dispatch = useDispatch();
    const accounts = useSelector(state => state.accounts.accounts)
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ reloadNeeded, setReloadNeeded ] = useState(false);

    useEffect(() => {
        Promise.all([dispatch(fetchAllAccounts())])
        .then(() => {
            setIsLoaded(true);
            setReloadNeeded(false);}
        )
        .catch(error => {
            console.error(error)
            setIsLoaded(false);
        });
        
    }, [dispatch, reloadNeeded]);

    let accountsList;
    if (accounts.length > 0) {
        accountsList = (
            accounts.map(account => (<AccountCards key={account.id} account={account}/>))
        )
    } else {
        accountsList = (
            <div className="no-accounts__container">
                <div className="no-accounts__text">No Open Accounts</div>
            </div>
        )
    };

    if (isLoaded === false || !accountsList) {
        <Spinner />
    };

    const reloadAccounts = () => {
        setReloadNeeded(true);
    };

    return (
        <div className="account-page">
            
                {accountsList}
            
                <AccountOptions reloadAccounts={reloadAccounts}/>
        </div>
    )
}

export default AccountsPage;
