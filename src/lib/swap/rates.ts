import { baseUrl, exodusV3Url } from "../config";
import { SwapError, SwapErrorType } from "../errors";
import { prepareRequest } from "../fetch";

export const getRateForPair = async (
  fromAssetId: string,
  toAssetId: string
): Promise<any> => {
  try {
    const request = `${baseUrl}/rates/${fromAssetId}/${toAssetId}`;
    const response = await fetch(request);

    if (!response.ok) {
      console.error(
        "Request to Exodus Exchange rates API has failed",
        response.status
      );
    }

    const rates = await response.json();
    return rates;
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.AssetPricingFailure,
      message: "Pricing failed to fetch.",
      error: error,
    });
  }
};
