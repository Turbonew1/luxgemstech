"use client";

import { useParams } from "next/navigation";
import zh from "@/i18n/messages/zh.json";
import en from "@/i18n/messages/en.json";

const messages: Record<string, Record<string, unknown>> = { zh, en };

type DeepKeyOf<T> = T extends Record<string, infer V>
  ? {
      [K in keyof T & string]: V extends Record<string, unknown>
        ? `${K}.${DeepKeyOf<V>}`
        : K;
    }[keyof T & string]
  : never;

export function useTranslations() {
  const params = useParams();
  const lang = (params?.lang as string) || "zh";
  const t = messages[lang] || messages.zh;

  function translate(key: string): string {
    const keys = key.split(".");
    let result: unknown = t;
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof result === "string" ? result : key;
  }

  return { t: translate, lang };
}
