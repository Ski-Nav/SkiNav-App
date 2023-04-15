/* 
UserContext.tsx

This file contains the variables used to determine what user we really
are using a context hook in react. We have 3 parameters in our context
that are exposed to other components. currentToken contains the current
user and the number of logins. setCurrentUser sets that token, which can
be changed in other components for user login and logout. isUserContextLoaded
is set to true when the system finished retrieving the token from the device.
While false, ScreenContext will show a loading state, because we are still
trying to get the token from the device. This is triggered by a one-time
useEffect hook once the context is rendered.
*/
import React, { useState, useEffect, createContext } from "react";
import { Token, User } from "../constants/constants";
import { getToken, login } from "../services/AuthService";
import { displayError } from "../helpers/helpers";

type UserContextType = {
  currentToken: Token;
  setCurrentToken: React.Dispatch<React.SetStateAction<Token>>;
  isUserContextLoaded: boolean;
};

export const UserContext = createContext<UserContextType>({
  currentToken: undefined,
  setCurrentToken: undefined,
  isUserContextLoaded: false,
});

export const UserProvider = ({ children }) => {
  const [currentToken, setCurrentToken] = useState<Token>();
  const [isUserContextLoaded, setIsUserContextLoaded] =
    useState<boolean>(false);

  useEffect(() => {

    // This runs at the start of the application.
    // If a token exists in the async storage,
    // it sets that token to the context variable.
    // This, in turn, also updates the stack in
    // AppNav.tsx. Go there for more info.
    getToken().then((token: Token) => {
      if (token.User) {
        login(token.User.Name, token.User.Email)
          .then((updatedToken: Token) => {
            setCurrentToken(updatedToken);
            setIsUserContextLoaded(true);
          })
          .catch((error: Error) => {
            displayError(error);
            setIsUserContextLoaded(true);
          });
      } else {
        setIsUserContextLoaded(true);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ currentToken, setCurrentToken, isUserContextLoaded }}
    >
      {children}
    </UserContext.Provider>
  );
};
