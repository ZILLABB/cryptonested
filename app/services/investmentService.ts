import axios from 'axios';

// Base URL for investment API
const API_BASE_URL = 'https://api.investment.example.com';

// Investment time frame interface
export interface InvestmentTimeFrame {
    id: string;
    name: string;
    duration: number; // in days
}

// Investment return interface
export interface InvestmentReturn {
    timeFrame: InvestmentTimeFrame;
    return: number;
    percentage: number;
}

// Get investment returns for a specific time frame
export const getInvestmentReturns = async (timeFrameId: string): Promise<InvestmentReturn> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/returns`, {
            params: { timeFrameId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching investment returns:', error);
        throw error;
    }
};

// Get all available investment time frames
export const getInvestmentTimeFrames = async (): Promise<InvestmentTimeFrame[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/timeFrames`);
        return response.data;
    } catch (error) {
        console.error('Error fetching investment time frames:', error);
        throw error;
    }
}; 