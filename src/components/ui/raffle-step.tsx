import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RaffleStep({ step }: { step: number }) {
  return (
    <div className="flex justify-center pb-12">
      <div className="relative flex justify-between gap-12">
        <div className="absolute top-[27px] left-[71px] z-0">
          <Image
            src={"/images/step-rec.png"}
            width={200}
            height={2}
            alt="rectangle"
          />
        </div>
        <div className="z-10 flex flex-col gap-3 w-[82px] justify-center items-center">
          <div
            className={cn(
              "h-[60px] w-[60px] flex items-center justify-center rounded-xl text-step",
              step == 1 ? "bg-neutral500" : "",
            )}
          >
            1
          </div>
          <div>Inscription</div>
        </div>
        <div className="z-10 flex flex-col gap-3 w-[82px] justify-center items-center">
          <div
            className={cn(
              "h-[60px] w-[60px] flex items-center justify-center rounded-xl text-step",
              step == 2 ? "bg-neutral500" : "",
            )}
          >
            2
          </div>
          <div>Featured</div>
        </div>
        <div className="z-10 flex flex-col gap-3 w-[82px] justify-center items-center">
          <div
            className={cn(
              "h-[60px] w-[60px] flex items-center justify-center rounded-xl text-step",
              step == 3 ? "bg-neutral500" : "",
            )}
          >
            3
          </div>
          <div>Result</div>
        </div>
      </div>
    </div>
  );
}
