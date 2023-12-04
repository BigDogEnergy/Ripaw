import React, { useState, useEffect, useRef } from "react";
import OpenModalButton from "../OpenModalButton";
import AccountForm from "../AccountForm";
import EditAccountForm from "../EditAccountForm"
import CloseAccountForm from "../CloseAccountForm"
import './AccountOptions.css';

function AccountOptions({reloadAccounts}) {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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


  const ulClassName = "account-dropdown" + (showMenu ? "" : "-hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button className='account-options__button' type="button" onClick={openMenu}>
        Account Options
      </button>

      <ul className={ulClassName} ref={ulRef}>
        {(
          <>
            <OpenModalButton 
            buttonText="Open new Account"
            onItemClick={closeMenu}
            modalComponent={<AccountForm reloadAccounts={reloadAccounts} />}
            />
            <OpenModalButton 
            buttonText="Edit an Account"
            onItemClick={closeMenu}
            modalComponent={<EditAccountForm reloadAccounts={reloadAccounts} />}
            />
            <OpenModalButton 
            buttonText="Close an Account"
            onItemClick={closeMenu}
            modalComponent={<CloseAccountForm reloadAccounts={reloadAccounts} />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default AccountOptions;
