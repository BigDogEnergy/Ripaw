import React, { useState } from "react";
import { fetchAllTransactions, updateTransactionRequest } from "../../store/transactions";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./UpdateTransactionForm.css";

function UpdateTransactionForm() {
  const dispatch = useDispatch();
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('Processing');
  const [errors, setErrors] = useState([]);
  const user = useSelector(state => state.session.user.id)
  const userAccounts = useSelector(state => state.accounts.accounts.filter(account => account.userId === user))
  const userAcctIds = userAccounts.map(account => account.id)
  const { closeModal } = useModal();
  const transactions = useSelector(state => state.transactions.transactions);
  const availableForEdit = transactions.filter(transaction => transaction.status === 'Pending' && userAcctIds.includes(transaction.senderId));
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTransactionId) {
        setErrors(['Please select a transaction to update.']);
        return;
      }

    const updates = { status };
    if (message) updates.message = message;
    
    console.log('updates to transaction', updates)

    const data = await dispatch(updateTransactionRequest(selectedTransactionId, updates));

    //Fix this later. Error objects are potentially inconsistent
    if (data && data.error) {
      setErrors(data.error.error);
    } else {
      dispatch(fetchAllTransactions()).then(() =>{
        closeModal()
      })
    }
  };

  return (
    <>
      <div className="transaction-form__title">Update a Pending Transaction:</div>
      <form className="account-form" onSubmit={handleSubmit}>
        <ul className="account-form__error-list">
        {errors.map((error, idx) => (
            <li className="account-form__error-item" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Select Transaction
          <select 
            className="account-form__input"
            value={selectedTransactionId} 
            onChange={(e) => setSelectedTransactionId(e.target.value)} 
            required
          >
            <option value="">Select a transaction</option>
            {availableForEdit.map(transaction => (
              <option key={transaction.id} value={transaction.id}>
                Transaction #{transaction.id} - ${transaction.amount}
              </option>
            ))}
          </select>
        </label>
        <label>
          Message
          <input
            className="account-form__input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <label>
          Status
          <select 
            className="account-form__input"
            value={status} 
            onChange={(e) => 
            setStatus(e.target.value)} required>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <button className="account-form__button" type="submit">Submit</button>
      </form>
    </>
  );
}

export default UpdateTransactionForm;
