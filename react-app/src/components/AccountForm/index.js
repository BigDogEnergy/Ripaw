import React, { useState } from "react";
import { createAccount } from "../../store/accounts";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./AccountForm.css";

function AccountForm( {reloadAccounts} ) {
  const dispatch = useDispatch();
  const [ accountName, setAccountName ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('handleSubmit accountForm accountName', accountName)
    const newAcct = { accountName: accountName }
    const data = await dispatch(createAccount(newAcct));
    if (data && data.error) {
      console.log('this is error Data', data)
      setErrors([data.error]);
    } else {
        reloadAccounts()
        closeModal()
    }
  };

  return (
    <>
      <h1>Create New Account</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Account Name
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default AccountForm;
