export function getAccountName(accountId, accounts, userId) {
    if (!Array.isArray(accounts)) {
        console.error('Expected accounts to be an array, received:', accounts);
        return 'Error - Check Console';
    };

    const account = accounts.find(acc => acc.id === accountId);

    if (!account || account.userId !== userId) {
        return 'External Account';
    };

    return account.accountName;
};

export function checkAccountOwner(accountId, accounts, userId) {
    if (!Array.isArray(accounts)) {
        console.error('Expected accounts to be an array, received:', accounts);
        return 'Error - Check Console';
    };

    const account = accounts.find(acc => acc.id === accountId);

    if (!account || account.userId !== userId) {
        return false
    };

    return true
};