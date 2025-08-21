import { describe, it, expect } from 'vitest';
import { RATE_LIMIT_DELAY } from '../services/adviceApi';

describe('Advice API Performance Optimizations', () => {
  it('should have optimized rate limit delay for better UX', () => {
    // Rate limit should be reduced from 1000ms to 200ms for faster interactions
    expect(RATE_LIMIT_DELAY).toBe(200);
    expect(RATE_LIMIT_DELAY).toBeLessThan(500); // Should be under 500ms for good UX
  });
});