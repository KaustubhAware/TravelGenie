export const env = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api",

  RAZORPAY_KEY_ID:
    import.meta.env.VITE_RAZORPAY_KEY_ID || "",
};

export const validateFrontendConfig = () => {
  const required = [
    "API_BASE_URL",
  ];

  return required.filter((key) => !env[key]);
};
