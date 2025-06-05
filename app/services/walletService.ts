import axios from 'axios';

// Base URL for wallet API
const API_BASE_URL = 'https://api.wallet.example.com';

// Wallet transaction interface
export interface WalletTransaction {
    id: string;
    type: 'Deposit' | 'Withdraw' | 'Transfer';
    amount: number;
    currency: string;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
    notes?: string;
}

// Get wallet balance
export const getWalletBalance = async (currency: string): Promise<number> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/balance`, {
            params: { currency }
        });
        return response.data.balance;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
    }
};

// Deposit funds into wallet
export const depositFunds = async (amount: number, currency: string): Promise<WalletTransaction> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/deposit`, {
            amount,
            currency
        });
        return response.data;
    } catch (error) {
        console.error('Error depositing funds:', error);
        throw error;
    }
};

// Withdraw funds from wallet
export const withdrawFunds = async (amount: number, currency: string): Promise<WalletTransaction> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/withdraw`, {
            amount,
            currency
        });
        return response.data;
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        throw error;
    }
};

// Transfer funds between wallets
export const transferFunds = async (amount: number, fromCurrency: string, toCurrency: string): Promise<WalletTransaction> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/transfer`, {
            amount,
            fromCurrency,
            toCurrency
        });
        return response.data;
    } catch (error) {
        console.error('Error transferring funds:', error);
        throw error;
    }
}; 