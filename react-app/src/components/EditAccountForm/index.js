import React, { useState } from "react";
import { updateAccount } from "../../store/accounts";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./EditAccountForm.css";

function EditAccountForm( {reloadAccounts} ) {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts)
  const [ chosenId, setChosenId ] = useState(accounts.length > 0 ? accounts[0].id : "");
  const [ accountName, setAccountName ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('this is our accounts data', accounts)

    const targetAccount = accounts.find(account => account.id === parseInt(chosenId));
    if (!targetAccount) {
      setErrors(['Account not found']);
      return;
    };


    const newName = { accountName: accountName }

    const data = await dispatch(updateAccount(newName, chosenId));

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
      <div className="account-form__title">Update Account Name</div>
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
        <label>
          New Name
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

export default EditAccountForm;
