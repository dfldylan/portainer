import { describe, it, expect } from 'vitest';

import { intervalValidation } from './IntervalField';

describe('intervalValidation', () => {
  it('rejects empty value with required message', async () => {
    const schema = intervalValidation();
    await expect(schema.validate('')).rejects.toThrow(
      'This field is required.'
    );
  });

  it('accepts simple minute values', async () => {
    const schema = intervalValidation();
    await expect(schema.validate('1m')).resolves.toBe('1m');
    await expect(schema.validate('5m')).resolves.toBe('5m');
  });

  it('accepts complex duration values', async () => {
    const schema = intervalValidation();
    await expect(schema.validate('6h40m')).resolves.toBe('6h40m');
  });

  it('accepts seconds >= 60s (treated as >= 1 minute)', async () => {
    const schema = intervalValidation();
    await expect(schema.validate('90s')).resolves.toBe('90s');
  });

  it('rejects sub-minute durations and invalid formats with minimum-interval message', async () => {
    const schema = intervalValidation();
    await expect(schema.validate('30s')).rejects.toThrow(
      'Minimum interval is 1m'
    );
    await expect(schema.validate('abc')).rejects.toThrow(
      'Minimum interval is 1m'
    );
  });
});
