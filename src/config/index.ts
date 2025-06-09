const { VITE_API_URL, VITE_API_BASE_PATH } = import.meta.env;

const URL = `${VITE_API_URL}`;
const BASE_URL = `${VITE_API_URL}${VITE_API_BASE_PATH}`;

export { URL, BASE_URL };
