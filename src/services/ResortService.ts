import { API_URL } from "./../constants/constants";
import { formatError } from "../helpers/helpers";

export async function getAllResorts(): Promise<[string]> {
  const response = await fetch(API_URL + "maps/");
  if (!response.ok) {
    throw formatError("Error " + response.status, response.statusText);
  }
  const responseJSON = response.json();
  return responseJSON;
}
