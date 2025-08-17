"use client";

import { Separator } from "@/components/common/ui/separator";

import ButtonDemo from "./lib/components/ButtonDemo";
import InputDemo from "./lib/components/InputDemo";
import TypographyDemo from "./lib/components/TextDemo";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 py-10">
      <TypographyDemo />
      <Separator />

      <ButtonDemo />
      <Separator />

      <InputDemo />
    </div>
  );
}
