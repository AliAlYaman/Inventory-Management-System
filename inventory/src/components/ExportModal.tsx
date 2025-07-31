"use client"

import type React from "react"
import { useState } from "react"
import type { InventoryItem } from "../lib/types"
import Papa from "papaparse"
import { X, Download } from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  items: InventoryItem[]
}

const ALL_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "quantity", label: "Quantity" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "price", label: "Price" },
  { key: "supplier", label: "Supplier" },
  { key: "status", label: "Status" },
  { key: "dateAdded", label: "Date Added" },
  { key: "lastUpdated", label: "Last Updated" },
]

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, items }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(ALL_COLUMNS.map((c) => c.key))

  if (!isOpen) return null

  const handleToggleColumn = (key: string) => {
    setSelectedColumns((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]))
  }

  const handleExport = () => {
    const headers = ALL_COLUMNS.filter((c) => selectedColumns.includes(c.key)).map((c) => c.label)
    const data = items.map((item) => {
      const row: Record<string, unknown> = {}
      selectedColumns.forEach((key) => {
        const col = ALL_COLUMNS.find((c) => c.key === key)
        if (col) {
          row[col.label] = item[key as keyof InventoryItem]
        }
      })
      return row
    })

    const csv = Papa.unparse({
      fields: headers,
      data: data,
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Export Inventory Data</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full">
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-6">Select the columns you want to include in the CSV export.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-lg">
            {ALL_COLUMNS.map((col) => (
              <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.key)}
                  onChange={() => handleToggleColumn(col.key)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{col.label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={selectedColumns.length === 0}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
