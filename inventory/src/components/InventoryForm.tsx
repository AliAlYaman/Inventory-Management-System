"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { InventoryFormData, InventoryItem, InventoryStatus } from "../lib/types"
import { getStatusLabel, autoDetectStatus } from "../lib/utils"
import { Sparkles, Loader2 } from "lucide-react"

interface InventoryFormProps {
  onSubmit: (data: InventoryFormData) => void
  onCancel: () => void
  initialData?: InventoryItem
  isEditing?: boolean
}

const CATEGORIES = ["Electronics", "Furniture", "Office Supplies", "Equipment", "Software", "Other"]
const STATUSES: InventoryStatus[] = ["in-stock", "low-stock", "ordered", "discontinued"]

export const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: "",
    quantity: 0,
    category: "",
    description: "",
    price: 0,
    supplier: "",
    status: "in-stock",
  })
  const [isGenerating, setIsGenerating] = useState({ description: false, category: false })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
        category: initialData.category,
        description: initialData.description,
        price: initialData.price,
        supplier: initialData.supplier,
        status: initialData.status,
      })
    }
  }, [initialData])

  const callAIApi = async (
    task: "generate-description" | "suggest-category",
    itemInfo: { name: string; category: string },
  ) => {
    try {
      // This component calls our secure backend, not OpenAI directly.
      const response = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, itemInfo }),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${errorText}`)
      }
      const text = await response.text()
      return text.trim().replace(/"/g, "")
    } catch (error) {
      console.error(`Error with AI task ${task}:`, error)
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
      alert(`An AI error occurred: ${errorMessage}`)
      return null
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert("Please enter an item name first.")
      return
    }
    setIsGenerating((prev) => ({ ...prev, description: true }))
    const generatedDesc = await callAIApi("generate-description", { name: formData.name, category: formData.category })
    if (generatedDesc) {
      setFormData((prev) => ({ ...prev, description: generatedDesc }))
    }
    setIsGenerating((prev) => ({ ...prev, description: false }))
  }

  const handleSuggestCategory = async () => {
    if (!formData.name) {
      alert("Please enter an item name first.")
      return
    }
    setIsGenerating((prev) => ({ ...prev, category: true }))
    const suggestedCategory = await callAIApi("suggest-category", { name: formData.name, category: "" })
    if (suggestedCategory && CATEGORIES.includes(suggestedCategory)) {
      setFormData((prev) => ({ ...prev, category: suggestedCategory }))
    }
    setIsGenerating((prev) => ({ ...prev, category: false }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "number" ? Number.parseFloat(value) || 0 : value

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      }

      if (name === "quantity" && !isEditing) {
        updated.status = autoDetectStatus(Number(newValue))
      }

      return updated
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? "Edit Item" : "Add New Item"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter item name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={handleSuggestCategory}
                  disabled={isGenerating.category || !formData.name}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
                >
                  {isGenerating.category ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Suggest
                </button>
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating.description || !formData.name}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
                >
                  {isGenerating.description ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Generate
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter item description or generate one"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supplier name"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isEditing ? "Update Item" : "Add Item"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
