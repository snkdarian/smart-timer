import { formatDuration, parseDurationInput } from './time-utils';

describe('time utils', () => {
  it('formats seconds as hh:mm:ss', () => {
    expect(formatDuration(3661)).toBe('01:01:01');
  });

  it('parses hh:mm:ss and mm:ss inputs', () => {
    expect(parseDurationInput('01:02:03')).toBe(3723);
    expect(parseDurationInput('10:30')).toBe(630);
  });

  it('rejects empty, zero, and invalid inputs', () => {
    expect(parseDurationInput('')).toBeNull();
    expect(parseDurationInput('00:00:00')).toBeNull();
    expect(parseDurationInput('00:99')).toBeNull();
  });
});
