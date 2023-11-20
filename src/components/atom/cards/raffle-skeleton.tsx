import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React from "react";

export default function RaffleSkeleton() {
  return (
    <div
      className={`flex flex-col h-[488px] w-full border-2 relative rounded-2xl gap-4 overflow-hidden border-brand bg-neutral600`}
    >
      <div className="absolute z-30 left-4 top-4">
        <div className="px-3 border rounded-lg border-brand">
          <Skeleton className="w-24 h-6 py-2 bg-neutral400 animate-pulse" />
        </div>
      </div>
      <AspectRatio ratio={1}>
        <div className="flex items-center justify-center h-full ">
          <Icons.placeholder
            className="h-11 w-11 opacity-20 object-contain  rounded-xl z-10 max-h-[288px] shadow-shadowBrand "
            aria-hidden="true"
          />
        </div>
      </AspectRatio>

      <div className="w-full px-6 overflow-hidden text-xl font-semibold h-7 bg-neutral400 animate-pulse"></div>
      <div className="flex flex-row gap-3 px-6 text-lg text-white">
        <div className="w-6 h-6 bg-neutral400 animate-pulse"></div>
        <div className="w-24 h-6 bg-neutral400 animate-pulse"></div>
      </div>
      <div className="flex flex-row w-full gap-3 px-6 overflow-hidden h-7">
        <div className="w-6 h-6 bg-neutral400 animate-pulse"></div>
        <div className="w-24 h-6 bg-neutral400 animate-pulse"></div>
      </div>
      <div className="z-10 mx-5 mb-5 bg-neutral400 animate-pulse">
        <Button variant={"ghost"} disabled>
          <div className="w-24 h-6 bg-neutral400 animate-pulse"></div>
        </Button>
      </div>
    </div>
  );
}
