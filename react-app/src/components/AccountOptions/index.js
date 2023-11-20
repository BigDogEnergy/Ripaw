import React, { useState, useEffect, useRef } from "react";
import OpenModalButton from "../OpenModalButton";
import AccountForm from "../AccountForm";
import EditAccountForm from "../EditAccountForm"

function AccountOptionsModal() {
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


  const ulClassName = "account-dropdown" + (showMenu ? "" : " hidden");
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
            modalComponent={<AccountForm />}
            />
            <OpenModalButton 
            buttonText="Edit an Account"
            onItemClick={closeMenu}
            modalComponent={<EditAccountForm />}
            />
            <OpenModalButton 
            buttonText="Close an Account"
            onItemClick={closeMenu}
            modalComponent={<AccountForm />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default AccountOptionsModal;
