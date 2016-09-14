const LOCALHOST = 'http://192.168.99.100:8005';
const PRODUCTION = 'https://api.feedbag.wearespindle.com/';
let apiUrl;

if (location && location.hostname === 'localhost') {
    apiUrl = LOCALHOST;
} else {
    apiUrl = PRODUCTION;
}

export const API_URL = apiUrl;
export const GOOGLE_CLIENT_ID = '197265624471-f8cb8sdb8dr1uevsscev16191ksr3ln6.apps.googleusercontent.com';
