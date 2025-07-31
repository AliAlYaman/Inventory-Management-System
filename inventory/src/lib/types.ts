export type InventoryStatus = "in-stock" | "low-stock" | "ordered" | "discontinued"

// To simulate sales history for forecasting
export interface SalesData {
  date: string
  quantitySold: number
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  description: string
  price: number
  supplier: string
  status: InventoryStatus
  dateAdded: string
  lastUpdated: string
  salesHistory?: SalesData[] // Optional sales history
}

export interface InventoryFormData {
  name: string
  quantity: number
  category: string
  description: string
  price: number
  supplier: string
  status: InventoryStatus
}

export type Role = "admin" | "manager" | "staff"

export interface User {
  id: string
  name: string
  role: Role
}

export interface Permissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canViewPrice: boolean
  canRunAudit: boolean
  canExport: boolean // New permission for exporting
}
