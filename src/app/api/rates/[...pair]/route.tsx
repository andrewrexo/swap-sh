import { prepareRequest } from "@/lib/fetch";
import type { NextRequest } from "next/server";
import { ipAddress } from "@vercel/edge";
export const config = {
  runtime: "edge",
};

export async function GET(req: NextRequest, { params }: { params: { pair: Array<string> } }) {
  const { pair } = params;

  console.log({ headers: req.headers });
  console.log(req.headers.get("X-Forwarded-For"));
  console.log({ ipEdge: ipAddress(req) });
  const response = await fetch(prepareRequest(`pairs/${pair[0]}_${pair[1]}/rates`, "GET", [], req.ip));

  const ip = req.ip;
  console.log({ ip, req });

  if (!response.ok) {
    console.error("Request to Exodus Exchange rates API has failed", response.status);
  }

  const rates = await response.json();
  return Response.json(JSON.parse(JSON.stringify(rates)));
}
