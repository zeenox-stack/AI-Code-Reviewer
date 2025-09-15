import { useContext, type Context } from "react";
import type React from "react";

export const getModifiedDate = (s: string) =>
  new Date(s).toDateString().slice(3);

export const getEventBasedStyle = (s: string) =>
  ({
    push: "text-green-600 bg-green-100",
    pull: "text-indigo-600 bg-indigo-100",
  }[s] || "");

export const isEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((e) => b.includes(e));
};

export const tabFocus = (e: React.KeyboardEvent<HTMLElement>, cb?: () => any) =>
  e.key === "Enter" && document.activeElement === e.currentTarget && cb?.();

export const useLoaderContext = (
  context: Context<any>
) => {
  try {
    const usable = useContext(context);

    if (!usable) throw new Error("Cannot use context");
    
    return usable;
  } catch (error) {
    console.error(error);
  }
};
