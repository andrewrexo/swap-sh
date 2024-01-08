"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardPasteIcon } from "lucide-react";
import React, { useState } from "react";
import { LabeledInput } from "./ui/labeled-input";

export function SwapWidgetDepositDialog({
  children,
  submitCallback,
}: {
  children: React.ReactNode;
  submitCallback: (deposit: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Validate Deposit Transaction</DialogTitle>
          <DialogDescription>
            Please submit your deposit transaction hash to notify the exchange API provider.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input id="deposit" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={async () => {
              const clipboard = await navigator.clipboard.readText();
              setInputValue(clipboard);
            }}
          >
            <span className="sr-only">Paste</span>
            <ClipboardPasteIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => submitCallback(inputValue)}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
