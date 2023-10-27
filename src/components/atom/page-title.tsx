import React from "react";

export default function PageTitle({ name }: { name: string }) {
  return (
    <div className="flex flex-col mb-12 mb -12">
      <h1 className="text-4xl text-featuredRaffles">{name}</h1>
      <span className="inline-block w-24 h-2 bg-gradient-to-r from-orange-300 to-orange-600"></span>
    </div>
  );
}
