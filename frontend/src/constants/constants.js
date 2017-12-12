const LOCALHOST = 'http://localhost:8005';
let apiUrl;

if (window.location && window.location.hostname === 'localhost') {
  apiUrl = LOCALHOST;
} else {
  apiUrl = 'https://api.' + window.location.hostname;
}

export const API_URL = apiUrl;
