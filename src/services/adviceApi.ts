import type { AdviceSlipResponse, Advice } from "../types";

const BASE_URL = "https://api.adviceslip.com";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 200; // 200ms between requests for better UX
let lastRequestTime = 0;

class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

const enforceRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
};

const fetchWithTimeout = async (
  url: string,
  timeout = 5000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getAdviceById = async (id: number): Promise<Advice> => {
  await enforceRateLimit();

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/advice/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Advice with ID ${id} not found`);
      }
      if (response.status === 429) {
        throw new RateLimitError("Too many requests. Please wait a moment.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AdviceSlipResponse = await response.json();

    return {
      id: data.slip.id,
      text: data.slip.advice,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw new Error(`Failed to fetch advice: ${error.message}`);
    }

    throw new Error("An unexpected error occurred while fetching advice");
  }
};

export const getRandomAdvice = async (): Promise<Advice> => {
  await enforceRateLimit();

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/advice`);

    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError("Too many requests. Please wait a moment.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AdviceSlipResponse = await response.json();

    return {
      id: data.slip.id,
      text: data.slip.advice,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw new Error(`Failed to fetch advice: ${error.message}`);
    }

    throw new Error("An unexpected error occurred while fetching advice");
  }
};

// Export for testing
export { RATE_LIMIT_DELAY, RateLimitError };
