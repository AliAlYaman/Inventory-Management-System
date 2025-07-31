import type React from "react"

import type { InventoryItem } from "../lib/types"
import { formatCurrency } from "../lib/utils"
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

interface InventoryStatsProps {
  items: InventoryItem[]
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ items }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const inStockItems = items.filter((item) => item.status === "in-stock").length
  const lowStockItems = items.filter((item) => item.status === "low-stock").length

  const stats = [
    {
      name: "Total Items",
      value: totalItems.toLocaleString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      name: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "In Stock",
      value: inStockItems.toString(),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Low Stock",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
