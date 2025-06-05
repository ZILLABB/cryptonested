// This file is a workaround for ESM compatibility
// It re-exports the CryptoPricesProvider and useCryptoPrices from the TypeScript file

// @ts-ignore - Ignore TypeScript errors in this file
import { CryptoPricesProvider, useCryptoPrices } from './CryptoPricesContext';

export { CryptoPricesProvider, useCryptoPrices };
