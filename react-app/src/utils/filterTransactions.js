export const filterTransactions = (transactions, selectedAccountId, selectedStatus, transType, userId, accounts) => {
    

    let filtered = [...transactions];

    // Filter by Account ID if one is selected
    if (selectedAccountId) {
        filtered = filtered.filter(transaction => 
            transaction.senderId === selectedAccountId || transaction.receiverId === selectedAccountId
        );
    };

    // // Filter by Status if one is selected
    if (selectedStatus) {
        filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    };

    // // Filter by Transaction Type if one is selected
    if (transType) {
        if (transType === 'Withdrawal') {
            filtered = filtered.filter(transaction => transaction.senderId === userId);
        } else if (transType === 'Deposit') {
            filtered = filtered.filter(transaction => transaction.receiverId === userId);
        }
    };
    
    // Sort the filtered transactions
    filtered.sort((a, b) => b.id - a.id);

    return filtered;
};