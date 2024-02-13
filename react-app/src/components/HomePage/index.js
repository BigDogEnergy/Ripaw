import React from 'react';
import OpenModalButton from '../OpenModalButton';
import './Homepage.css'; 
import LoginFormModal from "../LoginFormModal"
import SignupFormModal from "../SignupFormModal"
import { useSelector } from 'react-redux';

function HomepageBoard() {

    const user = useSelector(state=> state.session.user)


    return (
        <>
            <div className="homepage-message__container">
                <h1>Hello, welcome to Ripaw!</h1>
                <p>This banking app was originally designed to help track my dog's acorn collection. 
                    Now I am using it to demonstrate my skills!</p>
                <ul>
                    <li>Transactions: A user is able to Create/Update/Delete/Edit a transaction.</li>
                    <li>Accounts: A user is able to Create/Update/Delete/Edit an account.</li>
                    <li>Messages(using websockets): A user can send and delete messages.</li>
                </ul>
            </div>
            
            {!user && (
                <div className='homepage-buttons__container'>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                    <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                    />
                </div>
            )}
        </>
    );
}

export default HomepageBoard;
