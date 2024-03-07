import { exodusPricingServerUrl } from "../config";
import { SwapError, SwapErrorType } from "../errors";
import { ExodusRequestParams, prepareRequest } from "../fetch";
import { whitelistedAssets } from "./constants";
import {
  Asset,
  AssetNetworkRecord,
  AssetNetwork,
  AssetPrice,
  AssetWithPrice,
  FiatCurrency,
} from "./types";

export const getAssets = async (
  params?: ExodusRequestParams[]
): Promise<Asset[]> => {
  try {
    const request = prepareRequest("assets", "GET", [
      ...(params ?? []),
      { key: "limit", value: "6000" },
    ]);
    const response = await fetch(request);

    if (!response.ok) {
      console.error(
        "Request to Exodus Exchange API has failed",
        response.status
      );
    }

    return response.json();
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Assets failed to fetch.",
      error: error,
    });
  }
};

export const getAssetPricing = async (
  assets: string[],
  fiatCurrency: FiatCurrency
): Promise<AssetWithPrice[]> => {
  try {
    const request = `
      ${exodusPricingServerUrl}/current-price?to=${fiatCurrency}&from=${assets.join(
      ","
    )}`;
    const response = await fetch(request);

    if (!response.ok) {
      console.error(
        "Request to Exodus Exchange API has failed",
        response.status
      );
    }

    const pricing = await response.json();

    return Object.entries(pricing).map((asset) => {
      let assetPrice = asset[1] as AssetPrice;

      assetPrice[fiatCurrency] = parseFloat(
        assetPrice[fiatCurrency].toFixed(4)
      );

      return {
        id: asset[0],
        ...(asset[1] as AssetPrice),
      };
    });
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.AssetPricingFailure,
      message: "Pricing failed to fetch.",
      error: error,
    });
  }
};

export const getWhitelistedAssets = async (
  params?: ExodusRequestParams[]
): Promise<Asset[]> => {
  const request = prepareRequest("assets", "GET", [...(params ?? [])]);
  const response = await fetch(request);

  if (!response.ok) {
    console.error("Request to Exodus Exchange API has failed", response.status);
  }

  return response.json();
};

export const getAssetsFromExodusByNetwork = async (
  networks: AssetNetwork[]
): Promise<AssetNetworkRecord> => {
  try {
    const assets: Asset[] = await getAssets([
      { key: "networks", value: networks.join(",") },
    ]);

    const assetPricing = await getAssetPricing(
      whitelistedAssets.map((asset) => asset.id),
      FiatCurrency.USD
    );

    return assets
      .filter((asset) =>
        whitelistedAssets.some((wAsset) => wAsset.id === asset.id)
      )
      .reduce((acc, obj) => {
        const key = obj.network;

        if (!acc[key]) {
          acc[key] = [];
        }

        if (acc[key].length <= 200) {
          acc[key].push({
            ...obj,
            pricing: assetPricing.find((aAsset) => aAsset.id === obj.id),
            logo: `https://assets.coincap.io/assets/icons/${obj.symbol.toLowerCase()}@2x.png`
          });
        }
        return acc;
      }, {} as AssetNetworkRecord);
  } catch (error) {
    throw error;
  }
};
