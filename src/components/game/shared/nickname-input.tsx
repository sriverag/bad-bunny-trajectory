"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

const STORAGE_KEY = "bb-player-nickname";
const NICKNAME_REGEX = /^[a-zA-Z0-9 ]*$/;

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NicknameInput({ value, onChange, disabled }: NicknameInputProps) {
  const { t } = useLanguage();
  const [touched, setTouched] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !value) {
      onChange(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (newValue: string) => {
    if (!NICKNAME_REGEX.test(newValue)) return;
    if (newValue.length > 20) return;
    onChange(newValue);
    localStorage.setItem(STORAGE_KEY, newValue);
  };

  const trimmed = value.trim();
  const isValid = trimmed.length >= 3 && trimmed.length <= 20;
  const showError = touched && !isValid;

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor="nickname"
        className="block text-sm font-medium text-muted-foreground"
      >
        {t("Tu nombre", "Your nickname")}
      </label>
      <input
        id="nickname"
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
        placeholder={t("Ej: ConejitoPR", "e.g. ConejitoPR")}
        className={cn(
          "w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "disabled:opacity-50",
          showError ? "border-red-500" : "border-border/50",
        )}
      />
      {showError && (
        <p className="text-xs text-red-500">
          {t("3-20 caracteres alfanumericos", "3-20 alphanumeric characters")}
        </p>
      )}
    </div>
  );
}
