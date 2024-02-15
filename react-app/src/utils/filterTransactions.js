export const filterTransactions = (transactions, selectedAccountId, selectedStatus, transType, userId, accounts) => {
    let filtered = [...transactions];

    // Filter by Account ID if one is selected
    if (selectedAccountId) {
        filtered = filtered.filter(transaction =>
            transaction.senderId == selectedAccountId || transaction.receiverId == selectedAccountId
        );
    };

    // Filter by Status if one is selected
    if (selectedStatus) {
        filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    };

    // Adjust Filter by Transaction Type based on user's involvement
    if (transType) {
        if (transType === 'Withdrawal') {
            filtered = filtered.filter(transaction => transaction.senderId == selectedAccountId && accounts.some(account => account.id == selectedAccountId && account.userId == userId));
        } else if (transType === 'Deposit') {
            filtered = filtered.filter(transaction => transaction.receiverId == selectedAccountId && accounts.some(account => account.id == selectedAccountId && account.userId == userId));
        }
    };
    
    // Sort the filtered transactions
    filtered.sort((a, b) => b.id - a.id);

    return filtered;
};
