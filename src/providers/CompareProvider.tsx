"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CompareItem } from "@/types";
import { useToast } from "./ToastProvider";

interface CompareContextType {
  compareItems: CompareItem[];
  compareCount: number;
  addToCompare: (item: CompareItem) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (item: CompareItem) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "hizu_compare_items";
const MAX_COMPARE_ITEMS = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { success, warning, info } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } catch {
      // Ignore storage errors
    }
  }, [compareItems, isHydrated]);

  const isInCompare = useCallback(
    (productId: string) => {
      return compareItems.some((item) => item.id === productId);
    },
    [compareItems]
  );

  const addToCompare = useCallback(
    (item: CompareItem): boolean => {
      if (isInCompare(item.id)) {
        info(`«${item.name}» قبلاً به لیست مقایسه افزوده شده است.`);
        return false;
      }

      if (compareItems.length >= MAX_COMPARE_ITEMS) {
        warning(`حداکثر ${MAX_COMPARE_ITEMS} محصول را می‌توانید همزمان با یکدیگر مقایسه کنید.`);
        return false;
      }

      setCompareItems((prev) => [...prev, item]);
      success(`«${item.name}» به بخش مقایسه افزوده شد.`);
      return true;
    },
    [compareItems, isInCompare, success, warning, info]
  );

  const removeFromCompare = useCallback(
    (productId: string) => {
      setCompareItems((prev) => {
        const removedItem = prev.find((i) => i.id === productId);
        if (removedItem) {
          info(`«${removedItem.name}» از لیست مقایسه حذف شد.`);
        }
        return prev.filter((i) => i.id !== productId);
      });
    },
    [info]
  );

  const toggleCompare = useCallback(
    (item: CompareItem) => {
      if (isInCompare(item.id)) {
        removeFromCompare(item.id);
      } else {
        addToCompare(item);
      }
    },
    [isInCompare, removeFromCompare, addToCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    info("لیست مقایسه خالی شد.");
  }, [info]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
