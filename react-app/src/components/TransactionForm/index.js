import React, { useState } from "react";
import { fetchAllTransactions, transactionRequest } from "../../store/transactions";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./TransactionForm.css";

function TransactionForm() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts)
  const [ amount, setAmount ] = useState("")
  const [ senderId, setSenderId ] = useState(accounts.length > 0 ? accounts[0].id : "");
  const [ receiverId, setReceiverId ] = useState("");
  const [ message, setMessage ] = useState("");
  const [ status, setStatus ] = useState('Processing');
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transaction = {
        amount: parseFloat(amount),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        message: message,
        status: status
    };
    
    const data = await dispatch(transactionRequest(transaction));

    if (data && data.error) {
      setErrors([data.error.error]);
    } else {
        dispatch(fetchAllTransactions()).then(() => {
        closeModal()
        })
    }
  };

  return (
    <>
      <div className="transaction-form__title">Transaction request:</div>
      <form className="account-form" onSubmit={handleSubmit}>
        <ul className="account-form__error-list">
        {errors.map((error, idx) => (
            <li className="account-form__error-item" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Amount
          <input
            className="account-form__input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Outbound Account
          <select 
            value={senderId} 
            className="account-form__input"
            onChange={(e) => setSenderId(e.target.value)} required>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.accountName}</option>
            ))}
          </select>
        </label>
        <label>
          Receiver Account
          <input
            className="account-form__input"
            type="number"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />
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
            onChange={(e) => setStatus(e.target.value)}>
            <option value="Processing">Immediate Processing</option>
            <option value="Pending">Prepare without Processing</option>
          </select>
            
          
        </label>
        <button className="account-form__button" type="submit">Submit</button>
      </form>
    </>
  );
}

export default TransactionForm;
