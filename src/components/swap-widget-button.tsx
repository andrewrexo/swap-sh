"use client";
import { Button } from "@/components/ui/button";
import { PlayIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function SwapWidgetButton({
  buttonCallback,
}: {
  buttonCallback: () => void;
}) {
  const [pending, setPending] = useState(false);

  const onButtonClick = () => {
    setTimeout(() => {
      setPending(false);
      buttonCallback();
    }, 1000);

    setPending(!pending);
  };

  return (
    <Button
      variant="default"
      className="w-full"
      onClick={onButtonClick}
      disabled={pending}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Initiating swap
        </>
      ) : (
        <>
          <PlayIcon className="mr-2 h-4 w-4" /> Initiate Swap
        </>
      )}
    </Button>
  );
}
