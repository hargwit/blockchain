import crypto from 'crypto'

/**
 * Produces a SH256 hash of the string.
 */
export const hash = (message: string): string => crypto.createHash('sha256').update(message).digest('hex')
