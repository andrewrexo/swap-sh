export enum SwapErrorType {
  ExodusApiFailure = "exodus_api_failure",
  ProviderApiFailure = "provider_api_failure",
  InvalidQuote = "invalid_quote",
  AssetPricingFailure = "asset_pricing_failure",
}

export class ErrorBase<T extends string> extends Error {
  type: T;
  message: string;
  error: any;

  constructor({
    type,
    message,
    error,
  }: {
    type: T;
    message: string;
    error: any;
  }) {
    super();
    this.type = type;
    this.message = message;
    this.error = error;
  }
}

export class SwapError extends ErrorBase<SwapErrorType> {}
