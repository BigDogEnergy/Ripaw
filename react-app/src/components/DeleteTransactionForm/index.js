import React, { useState } from "react";
import { deleteTransactionRequest } from "../../store/transactions";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteTransactionForm.css";
import { fetchAllTransactions } from "../../store/transactions";

function DeleteTransactionForm() {
  const dispatch = useDispatch();
  const [ selectedTransactionId, setSelectedTransactionId ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTransactionId) {
        setErrors(['Please select a transaction to delete.']);
        return;
    }

    const data = await dispatch(deleteTransactionRequest(selectedTransactionId));

    if (data && data.error) {
      console.log('this is error Data', data)
      setErrors([data.error]);
    } else {
        await dispatch(fetchAllTransactions())
        .then(() => {
            closeModal()
        })
        
    }
  };

  return (
    <>
      <h1>Delete a Transaction:</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Input Transaction #
          <input
            type="text"
            value={selectedTransactionId}
            onChange={(e) => setSelectedTransactionId(+e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default DeleteTransactionForm;
