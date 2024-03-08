"use client";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Asset,
  AssetNetworkRecord,
  FiatCurrency,
  SwapDirection,
} from "@/lib/swap/types";
import { TargetIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { networkToColorMap } from "@/lib/swap/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SwapSelectionDialog({
  assets,
  children,
  disabled = false,
  currency,
  fromAsset,
  toAsset,
  fromAmount,
  toAmount,
  minimum,
  maximum,
  direction,
  assetCallback,
  amountCallback,
}: {
  assets: AssetNetworkRecord;
  children: React.ReactNode;
  disabled?: boolean;
  currency: FiatCurrency;
  toAsset: Asset | undefined;
  fromAsset: Asset | undefined;
  fromAmount: number;
  toAmount: number;
  minimum: number;
  maximum: number;
  direction: SwapDirection;
  assetCallback: (asset: Asset, direction: SwapDirection) => void;
  amountCallback: (amount: number, direction: SwapDirection) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(1.5);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    direction === "from" ? fromAsset : toAsset
  );

  const buttonClick = () => {
    setOpen((open) => !open);
  };

  useEffect(() => {
    if (selectedAsset) {
      assetCallback(selectedAsset, direction);
    }
  }, [selectedAsset]);

  useEffect(() => {
    const asset = direction === "from" ? fromAsset : toAsset;

    if (asset != selectedAsset) {
      setSelectedAsset(asset);
    }
  }, [fromAsset, toAsset]);

  useEffect(() => {
    amountCallback(inputValue, direction);
  }, [inputValue]);

  return (
    <>
      <div className="flex w-full max-w-sm items-end justify-between space-x-2">
        <div className="flex flex-col items-start gap-y-1">
          {selectedAsset && (
            <Label className={`text-xs font-normal text-muted-foreground`}>
              {selectedAsset.network}
            </Label>
          )}
          <Button
            onClick={buttonClick}
            variant="outline"
            className="min-w-32 justify-between"
          >
            {selectedAsset?.symbol || children}
            <ChevronDownIcon />
          </Button>
        </div>
        <div className="flex flex-col items-end gap-y-1">
          {selectedAsset && (
            <Label className={`text-xs font-normal text-muted-foreground`}>
              {selectedAsset.pricing &&
                !Number.isNaN(fromAmount) &&
                !Number.isNaN(toAmount) &&
                `$${(direction === "from"
                  ? fromAmount * selectedAsset.pricing[currency]
                  : toAmount * selectedAsset.pricing[currency]
                ).toFixed(2)}`}
            </Label>
          )}
          <Input
            type="number"
            placeholder="0.00000000"
            className="max-w-44"
            value={direction === "from" ? fromAmount : toAmount}
            required
            disabled={disabled}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "-") {
                e.preventDefault();
              }

              if (e.key === "." && inputValue != 0 && !inputValue) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search by asset or network..."
          tabIndex={-1}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(assets).map((network) => {
            const networkKey = network[0];
            const networkAssets = network[1];

            if (
              networkAssets.length === 1 &&
              (networkAssets[0] === fromAsset || networkAssets[0] === toAsset)
            )
              return null;

            return (
              <CommandGroup heading={networkKey} key={networkKey}>
                {networkAssets.map((asset) => {
                  if (asset === fromAsset || asset === toAsset) return null;

                  return (
                    <CommandItem
                      key={`${asset.id}-${asset.network}`}
                      value={`${asset.id}-${asset.network}`}
                      onSelect={(value) => {
                        setSelectedAsset(asset);
                        setOpen(false);
                      }}
                      className="gap-1"
                    >
                      <TargetIcon
                        className={`${networkToColorMap.get(asset.network)}`}
                      />
                      {`${asset.name} (${asset.symbol})`}
                      <CommandShortcut>
                        ${asset.pricing && asset.pricing[currency]}
                      </CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
