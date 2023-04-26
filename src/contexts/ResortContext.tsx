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
import { Resort } from "../constants/constants";

type ResortContextType = {
  currentResort: Resort;
  setCurrentResort: React.Dispatch<React.SetStateAction<Resort>>;
};

export const UserContext = createContext<ResortContextType>({
  currentResort: undefined,
  setCurrentResort: undefined,
});

export const UserProvider = ({ children }) => {
  const [currentResort, setCurrentResort] = useState<Resort>();

  return (
    <UserContext.Provider
      value={{ currentResort, setCurrentResort }}
    >
      {children}
    </UserContext.Provider>
  );
};
