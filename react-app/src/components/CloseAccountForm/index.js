import React, { useState } from "react";
import { updateAccount } from "../../store/accounts";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CloseAccountForm.css";

function CloseAccountForm({ reloadAccounts }) {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts)
  const [ chosenId, setChosenId ] = useState(accounts.length > 0 ? accounts[0].id : "");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log('this is our accounts data', accounts)

    const targetAccount = accounts.find(account => account.id === parseInt(chosenId));
    if (!targetAccount) {
      setErrors(['Account not found']);
      return;
    };

    const newStatus = { status: "Closed" }

    const data = await dispatch(updateAccount(newStatus, chosenId));

    if (data && data.error) {
      console.log('this is error Data', data)
      setErrors([data.error]);
    } else {
        reloadAccounts();
        closeModal()
    }
  };

  return (
    <>
      <h1>Select an Account to close:</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Account
          <select
            value={chosenId}
            onChange={(e) => setChosenId(e.target.value)}
            required
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.accountName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default CloseAccountForm;
