export function isJSON(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch (e) {
    return false;
  }
}

export const post = async (url: string, body: any): Promise<any> => {
  const fetchData = {
    method: "POST",
    body,
  };
  try {
    const response = await fetch(url, fetchData);
    return response.json();
  } catch (e) {
    console.log(e);
    return e;
  }
};
