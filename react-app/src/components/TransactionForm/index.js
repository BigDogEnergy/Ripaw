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

    console.log(receiverId, 'receiverId')

    const transaction = {
        amount: parseFloat(amount),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        message: message,
        status: status
    };
    
    const data = await dispatch(transactionRequest(transaction));

    if (data && data.error) {
      console.log('this is error Data', data)
      setErrors([data.error]);
    } else {
        closeModal()
        dispatch(fetchAllTransactions())
    }
  };

  return (
    <>
      <h1>Create a transaction request:</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Outbound Account
          <select value={senderId} onChange={(e) => setSenderId(e.target.value)} required>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.accountName}</option>
            ))}
          </select>
        </label>
        <label>
          Receiver Account
          <input
            type="number"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />
        </label>
        <label>
          Message
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <label>
          Status
          <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}>
            <option value="Processing">Immediate Processing</option>
            <option value="Pending">Prepare without Processing</option>
          </select>
            
          
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default TransactionForm;
