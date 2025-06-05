// This file is a workaround for ESM compatibility
// It re-exports the InactivityProvider and useInactivity from the TypeScript file

// @ts-ignore - Ignore TypeScript errors in this file
import { InactivityProvider, useInactivity } from './InactivityContext';

export { InactivityProvider, useInactivity };
