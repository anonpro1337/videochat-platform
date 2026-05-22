export function generateId(prefix = 'vc'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked = local[0] + '***' + local[local.length - 1];
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  const uaLower = ua.toLowerCase();
  const browser = uaLower.includes('firefox')
    ? 'Firefox'
    : uaLower.includes('edg')
      ? 'Edge'
      : uaLower.includes('chrome')
        ? 'Chrome'
        : uaLower.includes('safari')
          ? 'Safari'
          : 'Unknown';
  const os = uaLower.includes('windows')
    ? 'Windows'
    : uaLower.includes('mac')
      ? 'macOS'
      : uaLower.includes('linux')
        ? 'Linux'
        : uaLower.includes('android')
          ? 'Android'
          : uaLower.includes('iphone') || uaLower.includes('ipad')
            ? 'iOS'
            : 'Unknown';
  const device = uaLower.includes('mobile') ? 'Mobile' : 'Desktop';
  return { browser, os, device };
}

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}

export function buildApiResponse<T>(
  data: T,
  meta?: { page?: number; limit?: number; total?: number; hasMore?: boolean },
) {
  return {
    success: true,
    data,
    meta,
  };
}

export function buildApiError(code: string, message: string, details?: unknown) {
  return {
    success: false,
    error: { code, message, details },
  };
}
