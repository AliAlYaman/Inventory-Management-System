"use client"

import type React from "react"
import { BrainCircuit, Loader2, X } from "lucide-react"

interface AIAuditModalProps {
  isOpen: boolean
  isLoading: boolean
  auditResult: string
  onClose: () => void
}

export const AIAuditModal: React.FC<AIAuditModalProps> = ({ isOpen, isLoading, auditResult, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-7 w-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">AI Inventory Audit</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="font-semibold">Analyzing your inventory...</p>
                <p className="text-sm">The AI is looking for insights and suggestions.</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">{auditResult}</div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
