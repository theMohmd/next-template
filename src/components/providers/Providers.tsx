"use client";

import { JSX, PropsWithChildren } from "react";

import { providersList } from "./providersList";

export type TProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => JSX.Element;

export default function Providers({ children }: PropsWithChildren) {
  return providersList.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
}
