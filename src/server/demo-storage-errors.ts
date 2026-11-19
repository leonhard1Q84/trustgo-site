/** Retry only concurrency and temporary transport/service failures, with a bounded budget. */
export function demoStorageFailure(error: unknown): 'conflict' | 'transient' | 'permanent' {
  if (error instanceof Error && error.message === 'DEMO_STORAGE_CONFLICT') return 'conflict';
  const code = (error as { code?: string } | null)?.code;
  if (code && ['40001', '40P01', '53300', '57P01', '57P02', '57P03', '08000', '08006'].includes(code)) return 'transient';
  if (error instanceof Error && (['AbortError', 'TimeoutError'].includes(error.name)
    || /fetch failed|network|terminated|Error connecting to database|HTTP (?:status )?(408|429|5\d\d)\b/i.test(error.message))) return 'transient';
  return 'permanent';
}
