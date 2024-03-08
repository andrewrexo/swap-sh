const config = {
  //appName: process.env.NODE_ENV === "development" ? "swapsh-test" : "swapsh",
  appName: process.env.NODE_ENV === "development" ? "test" : "test",
  appVersion: "1.0.0",
};

export const exodusV3Url = "https://exchange.exodus.io/v3";
export const exodusPricingServerUrl = "https://pricing.a.exodus.io";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000/api"
    : "https://swap-iota-nine.vercel.app/api";

export default config;
