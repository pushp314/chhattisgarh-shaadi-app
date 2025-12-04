/**
 * Retry Request Utility
 * Automatically retries failed API requests with exponential backoff
 */

interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: any) => void;
}

export async function retryRequest<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        onRetry
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt < maxRetries) {
                const delay = Math.min(
                    baseDelay * Math.pow(2, attempt),
                    maxDelay
                );

                onRetry?.(attempt + 1, error);

                // Wait before retrying
                await new Promise<void>(resolve => setTimeout(() => resolve(), delay));
            }
        }
    }

    throw lastError;
}

export default retryRequest;
