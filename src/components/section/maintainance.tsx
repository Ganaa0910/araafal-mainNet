import React from "react";
import Image from "next/image";

export default function MaintainanceScreen() {
  return (
    <div className="w-full h-screen bg-brandBlack">
      <div className="flex flex-col items-center justify-center w-full h-full">
        We are currenly under maintainance. Check our twitter for more info
        <a
          href="https://x.com/SatoshiPunksNFT/status/1720803877887627703?s=20/"
          className="text-blue-400"
        >
          tweet link
        </a>
      </div>
    </div>
  );
}
