import { prepareRequest } from "@/lib/fetch";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const response = await fetch(prepareRequest(`orders/${id}`, "GET"));

  if (!response.ok) {
    console.error("Request to Exodus Exchange orders API has failed", response.status);
  }

  const order = await response.json();
  return Response.json(order);
}
