const LOCALHOST = 'http://localhost:8005';
let apiUrl;

if (location && location.hostname === 'localhost') {
    apiUrl = LOCALHOST;
} else {
    apiUrl = 'https://api.' + location.hostname;
}

export const API_URL = apiUrl;
export const GOOGLE_CLIENT_ID = '197265624471-f8cb8sdb8dr1uevsscev16191ksr3ln6.apps.googleusercontent.com';
