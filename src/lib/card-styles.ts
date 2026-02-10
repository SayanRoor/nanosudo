/**
 * Unified card styles across the application
 * Based on header/footer glass-card design system
 */

/**
 * Primary card style - used for main content cards
 * Uses glass-card aesthetic matching header/footer
 */
export const CARD_PRIMARY = 'glass-card rounded-2xl p-6 shadow-soft';

/**
 * Secondary card style - used for nested or supporting cards
 * Lighter glass effect for nested elements
 */
export const CARD_SECONDARY = 'rounded-xl border border-border/50 bg-muted/20 p-4 backdrop-blur-sm';

/**
 * Accent card style - used for highlighted or important cards
 */
export const CARD_ACCENT = 'glass-card rounded-2xl border-accent/20 p-6';

/**
 * Error card style - used for error messages
 */
export const CARD_ERROR = 'rounded-xl border border-destructive/40 bg-destructive/10 p-4';

/**
 * Success card style - used for success messages
 */
export const CARD_SUCCESS = 'glass-card rounded-2xl border-accent/50 p-8 shadow-lg';

/**
 * Input field style - unified across forms
 */
export const INPUT_FIELD = 'w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors';

/**
 * Button primary style
 */
export const BUTTON_PRIMARY = 'inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Button secondary style
 */
export const BUTTON_SECONDARY = 'inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border/80 font-semibold text-foreground hover:border-accent hover:text-accent transition-all';
