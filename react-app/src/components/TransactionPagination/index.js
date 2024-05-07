import React from 'react';
import './TransactionPagination.css';

function TransactionPagination({ totalPages, currentPage, paginate }) {

    return (
        <>
            <div className='transaction-pagination__main'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => paginate(index + 1)} 
                        className={currentPage === index + 1 ? 'transaction-pagination__active-page' : 'transaction-pagination__inactive-page'}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    )
    
}

export default TransactionPagination;

