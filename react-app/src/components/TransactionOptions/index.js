import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import TransactionForm from "../TransactionForm";
import UpdateTransactionForm from "../UpdateTransactionForm";
import DeleteTransactionForm from "../DeleteTransactionForm";

function TransactionOptions() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const userType = useSelector( state => state.session.user.type);

  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "transaction-dropdown" + (showMenu ? "" : "-hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <div className="transaction-options__container">
        <ul className={ulClassName} ref={ulRef}>
          {(
            <>
              <OpenModalButton 
              buttonText="Send $"
              onItemClick={closeMenu}
              modalComponent={<TransactionForm />}
              />
              <OpenModalButton 
              buttonText="Update a Pending transaction"
              onItemClick={closeMenu}
              modalComponent={<UpdateTransactionForm />}
              />
              {userType === 'Admin' && (
                <OpenModalButton
                buttonText="Delete a Transaction"
                onItemClick={closeMenu}
                modalComponent={<DeleteTransactionForm />}
                />
              )}
            </>
          )}
        </ul>
      </div>
      
    </>
  );
}

export default TransactionOptions;
