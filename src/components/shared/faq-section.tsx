"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/use-language";
import type { FAQItem } from "@/lib/faq-data";

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-heading text-foreground">
        {t("Preguntas frecuentes", "Frequently Asked Questions")}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">
              {t(faq.questionEs, faq.question)}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {t(faq.answerEs, faq.answer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
