import React, { useState } from "react";
import { fetchAllAccounts, updateAccount } from "../../store/accounts";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CloseAccountForm.css";

function CloseAccountForm() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts)
  const [ chosenId, setChosenId ] = useState(accounts.length > 0 ? accounts[0].id : "");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const targetAccount = accounts.find(account => account.id === parseInt(chosenId));
    if (!targetAccount) {
      setErrors(['Account not found']);
      return;
    };

    const newStatus = { status: "Closed" }

    const data = await dispatch(updateAccount(newStatus, chosenId));

    if (data && data.error) {
      console.error('this is error Data', data)
      setErrors([data.error]);
    } else {
      dispatch(fetchAllAccounts()).then(() => {
        closeModal()
      })
    }
  };

  return (
    <>
      <div className="account-form__title">Select an Account to close:</div>
      <form className="account-form" onSubmit={handleSubmit}>
        <ul className="account-form__error-list">
         {errors.map((error, idx) => (
            <li className="account-form__error-item" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Account
          <select
            className="account-form__input"
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
        <button className="account-form__button" type="submit">Submit</button>
      </form>
    </>
  );
}

export default CloseAccountForm;
