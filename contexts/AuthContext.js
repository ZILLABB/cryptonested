// This file is a workaround for ESM compatibility
// It re-exports the AuthProvider and useAuth from the TypeScript file

// @ts-ignore - Ignore TypeScript errors in this file
import { AuthProvider, useAuth } from './AuthContext';

export { AuthProvider, useAuth };
