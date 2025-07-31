"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import type { InventoryItem } from "../lib/types"
import { Bot, User, Loader2, CornerDownLeft, Frown, MessageSquare, X } from "lucide-react"

interface AIAssistantProps {
  inventory: InventoryItem[]
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ inventory }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    // This component calls our secure backend, not OpenAI directly.
    api: "http://localhost:3001/api/ai",
    body: {
      task: "chat",
      inventory: inventory,
    },
    onFinish: () => {},
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[440px] h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ease-in-out">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Inventory Assistant</h3>
              <p className="text-sm text-gray-500">Ask me anything about your inventory!</p>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 p-8">
                  <p className="mb-4">Examples:</p>
                  <ul className="text-sm space-y-2">
                    <li>"How many laptops are in stock?"</li>
                    <li>"What is the total value of my inventory?"</li>
                    <li>"Show me items with less than 10 units."</li>
                  </ul>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  {m.role === "user" ? (
                    <User className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Bot className="h-6 w-6 text-green-500 flex-shrink-0" />
                  )}
                  <div
                    className={`prose prose-sm max-w-none rounded-lg p-3 ${
                      m.role === "user" ? "bg-blue-50 text-blue-900" : "bg-green-50 text-green-900"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <Bot className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="p-4 border-t border-red-200 bg-red-50 text-red-700 flex items-center gap-2">
              <Frown className="h-5 w-5" />
              <p className="text-sm">Sorry, there was an error. Please check your API key and server connection.</p>
            </div>
          )}

          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <form onSubmit={handleSubmit} className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading || !input}
                aria-label="Send message"
              >
                <CornerDownLeft size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageSquare size={32} />
        </button>
      )}
    </div>
  )
}
