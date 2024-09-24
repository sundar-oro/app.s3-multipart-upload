"use client";
import React from "react";
import { addDays, startOfMonth, addMonths, endOfMonth } from "date-fns";

export const predefinedRanges: any = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "Last 7 Days",
    value: [addDays(new Date(), -7), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 Days",
    value: [addDays(new Date(), -30), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
];
