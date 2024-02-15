import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneAccount } from "../../store/accounts";
import './AccountPageSingle.css'
import AccountCards from "../AccountCards";
import Spinner from "../Spinner";
import { useParams } from "react-router-dom";

function AccountPageSingle() {
    const { accountId } = useParams();
    const dispatch = useDispatch();
    const account = useSelector(state => state.accounts.singleAccount)
    const [ isLoaded, setIsLoaded ] = useState(false);

    useEffect(() => {
        Promise.all([dispatch(fetchOneAccount(accountId))])
        .then(() => {
            setIsLoaded(true);
        })
        .catch(error => {
            console.error(error)
            setIsLoaded(false);
        });
        
    }, [dispatch, accountId]);

    if (isLoaded === false) {
        return <Spinner />;
    };



    return (
        <div className="account-page">
            
            <AccountCards key={account.id} account={account}/>

        </div>
    )
}

export default AccountPageSingle;
