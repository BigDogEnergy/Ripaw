import React, { useState } from "react";
import { createAccount, fetchAllAccounts } from "../../store/accounts";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./AccountForm.css";

function AccountForm() {
  const dispatch = useDispatch();
  const [ accountName, setAccountName ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAcct = { accountName: accountName }
    const data = await dispatch(createAccount(newAcct));
    if (data && data.error) {
      console.error('this is error Data', data)
      setErrors(data);
    } else {
        dispatch(fetchAllAccounts()).then(() => {
          closeModal()
        })
    }
  };

  return (
    <>
      <form className="account-form" onSubmit={handleSubmit}>
        
        <div className="account-form__title">
          Please name your new account
        </div>

        <ul className="account-form__error-list">
          {errors.map((error, index) => (
            <li className="account-form__error-item" key={index}>{error}</li>
          ))}
        </ul>
        <label>
          Account Name
          <input
            className="account-form__input"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </label>
        <button className="account-form__button" type="submit">Submit</button>
      </form>
    </>
  );
}

export default AccountForm;
