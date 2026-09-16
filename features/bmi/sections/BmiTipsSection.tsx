"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useI18n } from "@/lib/i18n/provider";
import BmiThemeIcon from "../components/BmiThemeIcon";

const BmiTipsSection = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState("what");

  return (
    <section className="flex flex-col gap-8 rounded-xl border border-border-muted bg-surface p-6">
      <h2 className="text-xl font-semibold leading-[30px] text-ink">
        {t.bmi.facts}
      </h2>
      <AccordionPrimitive.Root
        type="single"
        collapsible
        value={open}
        onValueChange={setOpen}
        className="flex flex-col gap-5"
      >
        {t.bmi.infoItems.map((item) => (
          <AccordionPrimitive.Item
            key={item.id}
            value={item.id}
            className="overflow-hidden rounded-2xl border border-border-muted bg-surface"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left outline-none">
                <span className="text-base font-bold leading-6 text-ink">
                  {item.title}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[rgba(0,219,219,0.15)]">
                  <span className="group-data-[state=open]:hidden">
                    <BmiThemeIcon name="add" className="size-4" />
                  </span>
                  <span className="hidden group-data-[state=open]:block">
                    <BmiThemeIcon name="minus" className="size-4" />
                  </span>
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <p className="px-6 pb-[22px] text-sm leading-5 text-title">
                {item.description}
              </p>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </section>
  );
};

export default BmiTipsSection;
