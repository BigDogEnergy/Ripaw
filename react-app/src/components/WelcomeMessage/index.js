import React from 'react';
import OpenModalButton from '../OpenModalButton';
import './WelcomeMessage.css'; 
import LoginFormModal from "../LoginFormModal"
import SignupFormModal from "../SignupFormModal"
import { useSelector } from 'react-redux';

function WelcomeMessage() {

    const user = useSelector(state=> state.session.user)

    const messageContent = (
        <div className="homepage-message__container">
            <div className="homepage-message__title"> 
                Welcome to Ripaw! 
            </div>
            <div className="homepage-message__body-1">
                This banking app was originally designed as a fun way to help track my dog's acorn collection. 
                It should be considered actively in development as I refine and improve my skills. 
            </div>
            <div className="homepage-message__body-2">
                Please: Sign Up to create a test account, or alternatively utilize the Demo User available in the Log In. 
            </div>
            
            <div className="homepage-message__list">
                <div className="homepage-message__list-item">
                    <div className="homepage-message__list-item-title">
                        Accounts 
                    </div>
                    <div className="homepage-message__list-item-body">
                        Users are able to:
                        <ul>
                            <li> Open a new account </li>
                            <li> Edit an account's name </li>
                            <li> Close an account</li>
                        </ul>
                    </div>
                </div>

                <div className="homepage-message__list-item">
                    <div className="homepage-message__list-item-title">
                        Transactions:
                    </div> 
                    <div className="homepage-message__list-item-body">
                        Users are able to: 
                        <ul>
                            <li>Create a transaction request</li>
                            <li>Update a transaction</li>
                            <li>Cancel a pending transaction</li>
                            <li>Edit a pending transaction</li>
                        </ul>
                        An Admin can:
                        <ul>
                            <li>Delete a transaction</li>
                        </ul>
                    </div>
                </div>

                <div className="homepage-message__list-item">
                    <div className="homepage-message__list-item-title">
                        Messaging: 
                    </div>
                    <div className="homepage-message__list-item-body">
                        Users are able to:
                        <ul>
                            <li>Send Messages</li>
                            <li>Delete Messages</li>
                        </ul>
                    </div>
                    
                </div>

            </div>
        </div>
    );

    return (
        user ? messageContent : 
            <>
                {messageContent}
                <div className="homepage-buttons__container">
                    <OpenModalButton 
                    buttonText="Log In" 
                    modalComponent={<LoginFormModal />} 
                    />
                    <OpenModalButton 
                    buttonText="Sign Up" 
                    modalComponent={<SignupFormModal />} 
                    />
                </div>
            </>
            
    );
}

export default WelcomeMessage;
