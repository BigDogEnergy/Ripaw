import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAccounts } from "../../store/accounts";
import './AccountsPage.css'
import AccountDetails from "../AccountCards";
import AccountOptionsModal from "../AccountOptions";

function AccountsPage() {
    const dispatch = useDispatch();
    const accounts = useSelector(state => state.accounts.accounts)

    console.log(accounts)

    useEffect(() => {
        dispatch(fetchAllAccounts());
    }, [dispatch]);

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

    return (
        <>
            <div className='account-card__container'>
                {accountsList}
            </div>
            <div>
                <AccountOptionsModal />
            </div>
        </>
    )
}

export default AccountsPage;
