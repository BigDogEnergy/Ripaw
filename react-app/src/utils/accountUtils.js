export function getAccountName(accountId, accounts, userId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account || account.userId !== userId) {
        return 'External Account';
    }
    return account.accountName;
};