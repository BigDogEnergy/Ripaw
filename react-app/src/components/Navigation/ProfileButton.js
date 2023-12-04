import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";



function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

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

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button type="button" onClick={openMenu}>
        <FontAwesomeIcon icon={showMenu ? faArrowUp : faArrowDown} />
      </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <div className="profile-dropdown__container">
                <div className="profile-dropdown__username">{user.username}</div>
                <div className="profile-dropdown__email">{user.email}</div>
                <div className="profile-dropdown__logout">
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              </div>
            </>
          ) : (
            <>
             <div className='dropdown-content__container'>
              <div className='dropdown-content__buttons'>
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />

              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
              </div>

              
            </div>

            </>
          )}
        </ul>
      
    </>
  );
}

export default ProfileButton;
