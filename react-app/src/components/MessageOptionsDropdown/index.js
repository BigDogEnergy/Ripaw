import './MessageOptionsDropdown.css';
import React from 'react';

function MessageOptionsDropdownMenu ({deleteMessage, lastMessageId}) {

  return (
    <div className='messenger-options__dropdown'>
      <button onClick={() => {deleteMessage(lastMessageId)}}>Undo Last Message</button>
    </div>
  );

}

export default MessageOptionsDropdownMenu;