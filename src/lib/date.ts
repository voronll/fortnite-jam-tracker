export function todayUTC(): string {
    // YYYY-MM-DD em UTC
    return new Date().toISOString().slice(0, 10);
  }