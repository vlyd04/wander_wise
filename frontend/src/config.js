const config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 
        (import.meta.env.PROD 
            ? 'https://wander-wise-backend.onrender.com'
            : 'http://127.0.0.1:5000'),
    API_TIMEOUT: 30000, // 30 seconds
    ENABLE_DEBUG_LOGS: import.meta.env.DEV
};

export default config;