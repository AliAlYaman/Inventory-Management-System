"use client"

import { useState, useCallback, useEffect } from "react"
import type { InventoryItem, InventoryFormData } from "../lib/types"
import { createInventoryItem, updateInventoryItem } from "../lib/utils"

const STORAGE_KEY = "inventory-items"

const SAMPLE_DATA: InventoryItem[] = [
  {
    id: "1",
    name: "Laptop Computer",
    quantity: 25,
    category: "Electronics",
    description: "High-performance business laptop",
    price: 1299.99,
    supplier: "Tech Solutions Inc.",
    status: "in-stock",
    dateAdded: "2024-01-15T10:30:00.000Z",
    lastUpdated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "2",
    name: "Office Chair",
    quantity: 5,
    category: "Furniture",
    description: "Ergonomic office chair with lumbar support",
    price: 299.99,
    supplier: "Office Furniture Co.",
    status: "low-stock",
    dateAdded: "2024-01-10T14:20:00.000Z",
    lastUpdated: "2024-01-10T14:20:00.000Z",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    quantity: 0,
    category: "Electronics",
    description: "Bluetooth wireless mouse",
    price: 49.99,
    supplier: "Tech Accessories Ltd.",
    status: "ordered",
    dateAdded: "2024-01-05T09:15:00.000Z",
    lastUpdated: "2024-01-05T09:15:00.000Z",
  },
]

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY)
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        setItems(parsedItems)
      } else {
        setItems(SAMPLE_DATA)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA))
      }
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error)
      setItems(SAMPLE_DATA)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("Error saving inventory to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  const addItem = useCallback((formData: InventoryFormData) => {
    const newItem = createInventoryItem(formData)
    setItems((prev) => [...prev, newItem])
  }, [])

  const updateItem = useCallback((id: string, formData: InventoryFormData) => {
    setItems((prev) => prev.map((item) => (item.id === id ? updateInventoryItem(item, formData) : item)))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const getItemById = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id)
    },
    [items],
  )

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    isLoaded,
  }
}
