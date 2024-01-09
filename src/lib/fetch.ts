import { ExodusOrderUpdate } from "@/app/api/order/update/route";
import config, { exodusV3Url } from "./config";
import { ExodusOrder } from "./swap/order";

export interface ExodusRequestParams {
  key: string;
  value: any;
}

export const dynamic = 'force-dynamic'

export const prepareRequest = (
  endpoint: string,
  method: "GET" | "POST" | "PATCH",
  params?: ExodusRequestParams[],
  ip?: string,
) => {
  const url = new URL(`${exodusV3Url}/${endpoint}`);

  if (params) {
    params.forEach(({ key, value }) => {
      url.searchParams.append(key, value);
    });
  }

  const headers = new Headers({
    "Forwarded": `for=${ip}`,
    "Content-Type": "application/json",
    "App-Name": `${config.appName}`,
    "App-Version": `${config.appVersion}`,
  });

  return new Request(url, {
    headers,
    method,
    cache: 'no-store',
  });
};

export const preparePostRequest = (
  endpoint: string,
  method: "POST" | "PATCH",
  body?: ExodusOrder | ExodusOrderUpdate
) => {
  const url = new URL(`${exodusV3Url}/${endpoint}`);

  const headers = new Headers({
    "Content-Type": "application/json",
    "App-Name": `${config.appName}`,
    "App-Version": `${config.appVersion}`,
  });

  return new Request(url, {
    headers,
    method,
    body: JSON.stringify(JSON.parse(JSON.stringify(body))),
  });
};
