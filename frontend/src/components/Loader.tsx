"use client";
import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-2xl">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full border-4 border-emerald-200 animate-ping"></div>
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin drop-shadow-md" />
      </div>
      <p className="mt-4 text-emerald-700 font-medium tracking-wide">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loader;
