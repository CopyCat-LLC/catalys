// src/globals.d.ts

// This is required for importing CSS files directly (if you do that)
declare module '*.css';

// This declares all packages from @fontsource as valid modules
declare module '@fontsource/*';

// If you ever use a variable font (like Inter Variable), include this too
declare module '@fontsource-variable/*';