/* 
helpers.ts

These contain helper functions that are useful in other parts
of the application*/

import { Alert } from "react-native";

/* 
formatError

This function takes in a title and a message and converts it into
an error object. This is typically used in the services folder in
promise functions where you may need to throw an error on purpose.
Common usage is `throw formatError("title", "description")*/
export function formatError(name: string, message: string): Error {
  const thrownError: Error = new Error(message);
  thrownError.name = name;
  return thrownError;
}

/* 
displayError

This function displays an error message to the user with the parameter
of error*/
export function displayError(error: Error): boolean {
  Alert.alert(error.name, error.message);
  return true;
}
