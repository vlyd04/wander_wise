const config = {
    API_BASE_URL: import.meta.env.PROD 
        ? 'https://wander-wise-backend.onrender.com/api'
        : 'http://127.0.0.1:5000/api'
};

export default config;