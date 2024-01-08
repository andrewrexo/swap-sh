const config = {
  //appName: process.env.NODE_ENV === "development" ? "swapsh-test" : "swapsh",
  appName: process.env.NODE_ENV === "development" ? "test" : "test",
  appVersion: "1.0.0",
};

export const exodusV3Url = "https://exchange-s.exodus.io/v3";
export const exodusPricingServerUrl = "https://pricing.a.exodus.io";

export default config;
