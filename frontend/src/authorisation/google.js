import loadScript from '../utils/loadScript';
import { client_id, script_url } from '../config/google.json';

const initialised = loadScript(script_url)
  .then(
    () =>
      new Promise((resolve, reject) => {
        window.gapi.load('auth2', {
          callback: resolve,
          onerror: reject,
          timeout: 5000, // 5 seconds.
          ontimeout: reject
        });
      })
  )
  .then(() => window.gapi.auth2)
  .then(mod => {
    return new Promise((resolve, reject) => {
      mod.init({ client_id, scope: 'email' }).then(
        () => {
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  });

export function postLoginActions({
  userLogin,
  userLoginFailure,
  userLoginSuccess,
  getUserData,
  getUserDataSuccess,
  getUserDataFailure
}) {
  return getUser().then(user => {
    const { access_token } = user;

    userLogin(access_token).then(_response => {
      const { data, status, response } = _response.payload;

      if (status !== 200) {
        response
          ? userLoginFailure('Unauthorized Google account')
          : userLoginFailure("Can't reach Google API.");
      } else {
        userLoginSuccess(data);

        getUserData(data.access_token).then(usermeta => {
          if (usermeta.payload.status !== 200) {
            getUserDataFailure(response);
          } else {
            getUserDataSuccess(usermeta.payload.data[0]);
          }
        });
      }
    });
  });
}

export function setupLogin(handlers) {
  return initialised.then(() => {
    return new Promise((resolve, reject) => {
      window.gapi.auth2.getAuthInstance().then(auth2 => {
        auth2.attachClickHandler('google-plus-signin-button', {}, () => {
          postLoginActions(handlers);
        });
        resolve();
      });
    });
  });
}

export function login() {}

export function logOut() {
  return initialised.then(() => {
    return new Promise((resolve, reject) => {
      window.gapi.auth2.getAuthInstance().then(auth2 => {
        auth2.signOut();
        resolve();
      });
    });
  });
}

export function getUser() {
  return initialised.then(() => {
    return new Promise((resolve, reject) => {
      window.gapi.auth2.getAuthInstance().then(auth2 => {
        const user = auth2.currentUser.get();

        if (user) {
          resolve(user.getAuthResponse());
        } else {
          reject('user not found');
        }
      });
    });
  });
}

export function isLoggedIn() {
  return initialised.then(
    () =>
      new Promise((resolve, reject) => {
        window.gapi.auth2.getAuthInstance().then(auth2 => {
          if (auth2.isSignedIn.get()) {
            resolve();
          } else {
            reject(new Error('unauthorised'));
          }
        });
      })
  );
}
