import { prepareRequest } from "@/lib/fetch";

export async function GET(req: Request, { params }: { params: { pair: Array<string> } }) {
  const { pair } = params;
  const response = await fetch(prepareRequest(`pairs/${pair[0]}_${pair[1]}/rates`, "GET"));

  if (!response.ok) {
    console.error("Request to Exodus Exchange rates API has failed", response.status);
  }

  const rates = await response.json();
  return Response.json(JSON.parse(JSON.stringify(rates)));
}
