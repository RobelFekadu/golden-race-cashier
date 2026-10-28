import api from "./base-api";
import retry from "retry";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

function createRetryOperation() {
  return retry.operation({
    retries: 5,
    minTimeout: 5 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  });
}

function withRetry(apiCall) {
  return new Promise((resolve, reject) => {
    const operation = createRetryOperation();
    operation.attempt(async () => {
      try {
        const response = await apiCall();
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          throw new Error(JSON.stringify(response));
        }
      } catch (error) {
        if (operation.retry(error)) {
          return;
        }
        reject(error);
      }
    });
  });
}

export default {
  async getUpComingGames(gameType) {
    return withRetry(async () => {
      return api.get(`${baseUrl}/game/upcomming?gameType=${gameType}`, {
        timeout: 5000,
      });
    });
  },

  async getOdd(obj) {
    return withRetry(async () => {
      return api.post(`${baseUrl}/game/odd`, obj, {
        timeout: 5000,
      });
    });
  },

  async getRacingDisplay(gameType) {
    return withRetry(async () => {
      const types = Array.isArray(gameType) ? gameType : [gameType];
      const query = types
        .map((type) => `gameType=${encodeURIComponent(type)}`)
        .join("&");
      return api.get(`${baseUrl}/game/racing/display?${query}`, {
        timeout: 5000,
      });
    });
  },

  async getGameResult(gameNumber, date) {
    return withRetry(async () => {
      return api.get(
        `${baseUrl}/game/result?gameNumber=${gameNumber}&date=${date}`,
        {
          timeout: 5000,
        },
      );
    });
  },

  async getResults(gameType) {
    return withRetry(async () => {
      return api.get(`${baseUrl}/game/display?gameType=${gameType}`, {
        timeout: 5000,
      });
    });
  },
};
