import './App.css'
"use client"

import { useState, useMemo } from "react"
import { useInventory } from "./hooks/useInventory"
import { useModal } from "./hooks/useModal"
import { useAuth } from "./lib/auth"
import { InventoryStats } from "./components/InventoryStats"
import { SearchAndFilter } from "./components/SearchAndFilter"
import { InventoryTable } from "./components/InventoryTable"
import { InventoryForm } from "./components/InventoryForm"
import { DeleteConfirmModal } from "./components/DeleteConfirmModal"
import { AIAssistant } from "./components/AIAssistant"
import { AIAuditModal } from "./components/AIAuditModal"
import { InventoryHeatmap } from "./components/InventoryHeatmap"
import { ExportModal } from "./components/ExportModal"
import type { InventoryItem, InventoryFormData, InventoryStatus } from "./lib/types"
import { Plus, Loader2, BrainCircuit, Users, Download } from "lucide-react"
import { getStatusLabel } from "./lib/utils"

function App() {
  const { items, addItem, updateItem, deleteItem, isLoaded } = useInventory()
  const { currentUser, users, login, permissions } = useAuth()
  const addModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()
  const auditModal = useModal()
  const exportModal = useModal()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState("")

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category))).sort()
  }, [items])

  const statuses: InventoryStatus[] = ["in-stock", "low-stock", "ordered", "discontinued"]

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)

      const matchesCategory = !selectedCategory || item.category === selectedCategory
      const matchesStatus = !selectedStatus || item.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, searchTerm, selectedCategory, selectedStatus])

  const handleAddItem = (formData: InventoryFormData) => {
    if (!permissions.canCreate) return alert("Permission Denied")
    addItem(formData)
    addModal.closeModal()
  }

  const handleEditItem = (item: InventoryItem) => {
    if (!permissions.canEdit) return alert("Permission Denied")
    setEditingItem(item)
    editModal.openModal()
  }

  const handleUpdateItem = (formData: InventoryFormData) => {
    if (!permissions.canEdit || !editingItem) return alert("Permission Denied")
    updateItem(editingItem.id, formData)
    editModal.closeModal()
    setEditingItem(null)
  }

  const handleDeleteClick = (item: InventoryItem) => {
    if (!permissions.canDelete) return alert("Permission Denied")
    setDeletingItem(item)
    deleteModal.openModal()
  }

  const handleConfirmDelete = () => {
    if (!permissions.canDelete || !deletingItem) return alert("Permission Denied")
    deleteItem(deletingItem.id)
    deleteModal.closeModal()
    setDeletingItem(null)
  }

  const handleCancelDelete = () => {
    deleteModal.closeModal()
    setDeletingItem(null)
  }

  const handleCancelEdit = () => {
    editModal.closeModal()
    setEditingItem(null)
  }

  const handleRunAudit = async () => {
    if (!permissions.canRunAudit) return alert("Permission Denied")
    setAuditResult("")
    setIsAuditing(true)
    auditModal.openModal()

    try {
      const response = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "audit-inventory", inventory: items }),
      })

      // --- IMPROVED ERROR HANDLING ---
      if (!response.ok) {
        // Read the error message from the server's response body
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const resultText = await response.text()
      setAuditResult(resultText)
    } catch (error) {
      console.error("Audit error:", error)
      setAuditResult(
        `An error occurred during the audit:\n${
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : String(error)
        }`
      )
    } finally {
      setIsAuditing(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading inventory...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-2">Manage your inventory items efficiently</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <select
                    value={currentUser.id}
                    onChange={(e) => login(e.target.value)}
                    className="pl-2 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunAudit}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  disabled={!permissions.canRunAudit}
                  title={!permissions.canRunAudit ? "Permission Denied" : "Run AI Audit"}
                >
                  <BrainCircuit size={20} />
                  AI Audit
                </button>
                <button
                  onClick={exportModal.openModal}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  disabled={!permissions.canExport}
                  title={!permissions.canExport ? "Permission Denied" : "Export Data"}
                >
                  <Download size={20} />
                  Export
                </button>
                <button
                  onClick={addModal.openModal}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  disabled={!permissions.canCreate}
                  title={!permissions.canCreate ? "Permission Denied" : "Add New Item"}
                >
                  <Plus size={20} />
                  Add Item
                </button>
              </div>
            </div>
          </div>

          <InventoryHeatmap items={items} />
          <InventoryStats items={items} />

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            categories={categories}
            statuses={statuses}
          />

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredItems.length} of {items.length} items
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
              {selectedStatus && ` with ${getStatusLabel(selectedStatus as InventoryStatus)} status`}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <InventoryTable
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteClick}
              permissions={permissions}
            />
          </div>

          {addModal.isOpen && <InventoryForm onSubmit={handleAddItem} onCancel={addModal.closeModal} />}

          {editModal.isOpen && editingItem && (
            <InventoryForm
              onSubmit={handleUpdateItem}
              onCancel={handleCancelEdit}
              initialData={editingItem}
              isEditing={true}
            />
          )}

          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            itemName={deletingItem?.name || ""}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />

          <AIAuditModal
            isOpen={auditModal.isOpen}
            isLoading={isAuditing}
            auditResult={auditResult}
            onClose={auditModal.closeModal}
          />

          <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.closeModal} items={items} />
        </div>
      </div>
      <AIAssistant inventory={items} />
    </>
  )
}

export default App
