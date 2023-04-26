export async function getAllResorts(): Promise<string[]> {
  const pulledResorts = ["Big Bear", "Mammoth Mountain"];
  return pulledResorts;
}

export async function getResortMap(resort: string): Promise<void> {
  return Promise.resolve();
}
