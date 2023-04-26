import { Resort, ResortMap } from "../constants/constants";

export async function getAllResorts(): Promise<Resort[]> {
  const pulledResorts: Resort[] = [{Name: "Big Bear"}, {Name: "Mammoth Mountain"}];
  return pulledResorts;
}

export async function getResortMap(resort: Resort): Promise<ResortMap> {
  const pulledResortMap: ResortMap = {}
  return pulledResortMap;
}
