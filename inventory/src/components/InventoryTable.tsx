"use client"

import type React from "react"
import { useState } from "react"
import type { InventoryItem, Permissions } from "../lib/types"
import { formatCurrency, formatDate, getStatusColor, getStatusIcon, getStatusLabel } from "../lib/utils"
import { Pencil, Trash2, Lock, Clock, Loader2 } from "lucide-react"

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
  permissions: Permissions
}

const ForecastButton: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [forecast, setForecast] = useState("")

  const handleForecast = async () => {
    setIsLoading(true)
    setForecast("")
    try {
      const response = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "forecast-restock",
          itemInfo: {
            name: item.name,
            quantity: item.quantity,
            salesHistory: item.salesHistory,
          },
        }),
      })
      if (!response.ok) throw new Error("Forecast failed")
      const text = await response.text()
      setForecast(text)
    } catch (error) {
      setForecast("Error")
    } finally {
      setIsLoading(false)
    }
  }

  if (forecast) {
    return <span className="text-sm text-gray-800">{forecast}</span>
  }

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
  }

  return (
    <button
      onClick={handleForecast}
      className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
      title="Forecast restock date"
    >
      <Clock size={12} />
      Forecast
    </button>
  )
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete, permissions }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No inventory items found</div>
        <div className="text-gray-400 text-sm mt-2">Add your first item to get started</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            {permissions.canViewPrice && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Est. Restock
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    item.status,
                  )}`}
                >
                  <span>{getStatusIcon(item.status)}</span>
                  {getStatusLabel(item.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.quantity}</div>
              </td>
              {permissions.canViewPrice ? (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(item.price)}</div>
                </td>
              ) : (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Lock size={12} />
                    <span>Hidden</span>
                  </div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.supplier || "N/A"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(item.lastUpdated)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    title={permissions.canEdit ? "Edit item" : "Permission denied"}
                    disabled={!permissions.canEdit}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    title={permissions.canDelete ? "Delete item" : "Permission denied"}
                    disabled={!permissions.canDelete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {["in-stock", "low-stock"].includes(item.status) ? (
                  <ForecastButton item={item} />
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
