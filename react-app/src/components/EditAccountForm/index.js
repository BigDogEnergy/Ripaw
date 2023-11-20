import React, { useState } from "react";
import { updateAccount } from "../../store/accounts";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./EditAccountForm.css";

function EditAccountForm() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts)
  const [ chosenId, setChosenId ] = useState("");
  const [ accountName, setAccountName ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        closeModal()
    }
  };

  return (
    <>
      <h1>Update Account Name</h1>
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
        <label>
          New Name
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

export default EditAccountForm;
