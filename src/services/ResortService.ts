import { Resort, ResortMap } from "../constants/constants";
import { formatError } from "../helpers/helpers";

export async function getAllResorts(): Promise<Resort[]> {
  const pulledResorts: Resort[] = [{Name: "Big Bear"}, {Name: "Mammoth Mountain"}];
  return pulledResorts;
}

export async function getResortMap(resort: Resort): Promise<ResortMap> {
  if(!resort){
    return undefined
  }
  const pulledResortMap: ResortMap = {}
  return pulledResortMap;
}
