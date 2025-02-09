export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  ERROR_MESSAGES: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email format",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_LENGTH: "Password must be at least 6 characters",
    LOGIN_FAILED: "Login failed. Please check your credentials.",
  }
} as const; 