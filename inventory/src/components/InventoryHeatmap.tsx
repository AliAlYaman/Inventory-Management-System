"use client"

import type React from "react"
import { useMemo } from "react"
import type { InventoryItem } from "../lib/types"
import { formatCurrency } from "../lib/utils"

interface InventoryHeatmapProps {
  items: InventoryItem[]
}

export const InventoryHeatmap: React.FC<InventoryHeatmapProps> = ({ items }) => {
  const categoryData = useMemo(() => {
    const data = items.reduce((acc: Record<string, { totalValue: number; totalQuantity: number; itemCount: number }>, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { totalValue: 0, totalQuantity: 0, itemCount: 0 }
      }
      acc[item.category].totalValue += item.price * item.quantity
      acc[item.category].totalQuantity += item.quantity
      acc[item.category].itemCount += 1
      return acc
    }, {} as Record<string, { totalValue: number; totalQuantity: number; itemCount: number }>)

    return Object.entries(data)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.totalValue - a.totalValue)
  }, [items])

  if (categoryData.length === 0) {
    return null
  }

  const maxVal = Math.max(...categoryData.map((d) => d.totalValue))

  const getColor = (value: number) => {
    if (maxVal === 0) return "bg-teal-500 text-white"
    const percentage = value / maxVal
    if (percentage > 0.8) return "bg-teal-700 text-white"
    if (percentage > 0.6) return "bg-teal-600 text-white"
    if (percentage > 0.4) return "bg-teal-500 text-white"
    if (percentage > 0.2) return "bg-teal-300 text-teal-900"
    return "bg-teal-100 text-teal-800"
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Value Heatmap</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryData.map((cat) => (
          <div
            key={cat.name}
            className={`p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${getColor(cat.totalValue)}`}
            title={`Total Value: ${formatCurrency(cat.totalValue)}`}
          >
            <div className="font-bold text-lg truncate">{cat.name}</div>
            <div className="text-sm opacity-90">{formatCurrency(cat.totalValue)}</div>
            <div className="text-xs opacity-80 mt-1">
              {cat.totalQuantity} units across {cat.itemCount} items
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
