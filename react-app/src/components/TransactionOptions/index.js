import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import TransactionForm from "../TransactionForm";
import UpdateTransactionForm from "../UpdateTransactionForm";
import DeleteTransactionForm from "../DeleteTransactionForm";
import './TransactionOptions.css'

function TransactionOptions() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const userType = useSelector( state => state.session.user.type);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

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
      <button className="transaction-options__button" type="button" onClick={openMenu}>
        Options
      </button>

        <ul className={ulClassName} ref={ulRef}>
          {(
            <>
              <OpenModalButton 
              buttonText="Send $"
              onItemClick={closeMenu}
              modalComponent={<TransactionForm />}
              />
              <OpenModalButton 
              buttonText="Update transaction"
              onItemClick={closeMenu}
              modalComponent={<UpdateTransactionForm />}
              />
              {userType === 'Admin' && (
                <OpenModalButton
                buttonText="Delete transaction"
                onItemClick={closeMenu}
                modalComponent={<DeleteTransactionForm />}
                />
              )}
            </>
          )}
        </ul>
      
    </>
  );
}

export default TransactionOptions;
