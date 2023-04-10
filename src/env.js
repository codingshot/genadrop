export function getEnv(key) {
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config();
    }
    return process.env[key];
  }