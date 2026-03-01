"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";

// prevent static prerender to avoid useSearchParams warning
export const dynamic = "force-dynamic";

import  { Suspense } from "react";

// the logic formerly in this file now lives in a client-only component
import SearchPageClient from "./SearchPageClient";

const Page = () => (
  <Suspense fallback={<div className="h-full flex items-center justify-center">Loading…</div>}>
    <SearchPageClient />
  </Suspense>
);

export default Page;