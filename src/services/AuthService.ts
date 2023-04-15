/* 
Services are files that contain functions which typically interact
with a backend. In this case since we will not be interacting with
any backend, this will simply provide offline functionality, filled
with functions that return a promise that would typically be
representative of fetching and pulling data from an API.

You typically divide services based on their functionality. In this
case since we are dealing with authentication, this service is called
AuthService. It logs in, signs out, and even does storage management
for authentication tokens.
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE, Token, User } from "../constants/constants";
import { formatError } from "../helpers/helpers";

/* 
login()

This function attempts to log in a user. It returns a token based on the
credentials.
*/
export async function login(name: string, email: string): Promise<Token> {
  // Dummy boolean if you ever wanted to check when a login fails
  const isFailure: boolean = false;

  if (isFailure) {
    // Because function is in a promise, the promise will fail and will go into the
    // catch block that this function got called in. Formaterror is just a helper
    // function to create an Error object.
    throw formatError("Login error", "Login failed. Please try again later.");
  }

  // Create a user object based on the parameters
  const createdUser: User = {
    Name: name,
    Email: email
  }

  // Write both the user and the logins in the token.
  // I made these functions separate instead of one
  // function that bundles a token because we may want
  // to write a user login when the user starts up the
  // app again and already has a user token. We would
  // then call writeLoginsToken and not write the user
  // again. This is just to keep the future in mind.
  const user: User = await writeUserToken(createdUser)
  const logins: [Date] = await writeLoginsToken(new Date());

  // Create a token object based on the written parameteres
  const newToken: Token = {
    User: user,
    Logins: logins,
  };

  // Return the token
  return newToken
}

/* 
logout()

This function logs out the user by removing the token from
the phone's storage
*/
export async function logout(): Promise<void> {
  // We delete the user token. Keep in mind that
  // logout() is a public function and deleteUserToken()
  // is a private function. This is in case we want to
  // change logout()'s functionality without having to
  // refactor much
  await deleteUserToken();
  return Promise.resolve()
}

/* 
getToken()

This function gets the token from the user's device
*/
export async function getToken(): Promise<Token> {

  // Get the user from the async storage in the phone
  const pulledUser: User = JSON.parse(
    await AsyncStorage.getItem(STORAGE.TokenUser)
  );

  // Get the number of logins
  const pulledLogins: [Date] = JSON.parse(
    await AsyncStorage.getItem(STORAGE.TokenLogins)
  );

  // Wrap the parameters into a token
  const pulledToken: Token = {
    User: pulledUser,
    Logins: pulledLogins,
  };

  // Return the token
  return pulledToken;
}

/* 
deleteUserToken()

This function removes the stored user on the phone's token
*/
async function deleteUserToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE.TokenUser);
}

/* 
deleteUserToken()

This function removes the stored logins on the phone's token
*/
async function deleteLoginsToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE.TokenLogins);
}

/* 
writeUserToken

This function writes a new user to the phone's storage
*/
async function writeUserToken(user: User): Promise<User> {
  await AsyncStorage.setItem(STORAGE.TokenUser, JSON.stringify(user));
  return user;
}


/* 
writeLoginsToken

This function writes a new login session to the phone's storage
*/
async function writeLoginsToken(date: Date): Promise<[Date]> {
  var pulledLogins: [Date] = JSON.parse(
    await AsyncStorage.getItem(STORAGE.TokenLogins)
  );
  if (!pulledLogins) {
    pulledLogins = [date];
  } else {
    pulledLogins.push(date);
  }
  await AsyncStorage.setItem(STORAGE.TokenLogins, JSON.stringify(pulledLogins));

  return pulledLogins;
}
