"use server"


export const createOrganization = async (values: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-organization/`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data
};