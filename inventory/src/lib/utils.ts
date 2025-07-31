import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { InventoryItem, InventoryFormData, InventoryStatus } from "./types"

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const createInventoryItem = (formData: InventoryFormData): InventoryItem => {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    ...formData,
    dateAdded: now,
    lastUpdated: now,
  }
}

export const updateInventoryItem = (existingItem: InventoryItem, formData: InventoryFormData): InventoryItem => {
  return {
    ...existingItem,
    ...formData,
    lastUpdated: new Date().toISOString(),
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getStatusColor = (status: InventoryStatus): string => {
  switch (status) {
    case "in-stock":
      return "bg-green-100 text-green-800"
    case "low-stock":
      return "bg-yellow-100 text-yellow-800"
    case "ordered":
      return "bg-blue-100 text-blue-800"
    case "discontinued":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusIcon = (status: InventoryStatus): string => {
  switch (status) {
    case "in-stock":
      return "✅"
    case "low-stock":
      return "⚠️"
    case "ordered":
      return "📦"
    case "discontinued":
      return "🚫"
    default:
      return "❓"
  }
}

export const getStatusLabel = (status: InventoryStatus): string => {
  switch (status) {
    case "in-stock":
      return "In Stock"
    case "low-stock":
      return "Low Stock"
    case "ordered":
      return "Ordered"
    case "discontinued":
      return "Discontinued"
    default:
      return "Unknown"
  }
}

export const autoDetectStatus = (quantity: number): InventoryStatus => {
  if (quantity === 0) return "discontinued"
  if (quantity < 10) return "low-stock"
  return "in-stock"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
