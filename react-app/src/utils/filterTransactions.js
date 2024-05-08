export const filterTransactions = (transactions, selectedAccountId, selectedStatus, transType, userId, accounts) => {

    let filtered = [...transactions];
    const parsedUserId = parseInt(userId);

    // Filter by Account ID if one is selected
    if (selectedAccountId) {
        filtered = filtered.filter(transaction =>
            parseInt(transaction.senderId) === parseInt(selectedAccountId) || parseInt(transaction.receiverId) === parseInt(selectedAccountId)
        );
    }

    // Filter by Status if one is selected
    if (selectedStatus) {
        filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    };

    // Adjust Filter by Transaction Type based on user's involvement
    if (transType) {
        if (transType === 'Withdrawal') {
            filtered = filtered.filter(transaction => parseInt(transaction.senderId) === parseInt(selectedAccountId) && accounts.some(account => account.id === parseInt(selectedAccountId) && parseInt(account.userId) === parsedUserId));
        } else if (transType === 'Deposit') {
            filtered = filtered.filter(transaction => parseInt(transaction.receiverId) === parseInt(selectedAccountId) && accounts.some(account => account.id === parseInt(selectedAccountId) && parseInt(account.userId) === parsedUserId));
        }
    };

    // Sort the filtered transactions by Date
    filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return b.id - a.id;
    });

    return filtered;
};
