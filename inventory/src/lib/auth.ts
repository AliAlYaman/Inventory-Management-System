"use client"

import { useState, useMemo } from "react"
import type { User, Role, Permissions } from "./types"

export const USERS: User[] = [
  { id: "1", name: "Alice (Admin)", role: "admin" },
  { id: "2", name: "Bob (Manager)", role: "manager" },
  { id: "3", name: "Charlie (Staff)", role: "staff" },
]

const PERMISSIONS_MAP: Record<Role, Permissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewPrice: true,
    canRunAudit: true,
    canExport: true, // Admins can export
  },
  manager: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewPrice: true,
    canRunAudit: true,
    canExport: true, // Managers can export
  },
  staff: {
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canViewPrice: false,
    canRunAudit: false,
    canExport: false, // Staff cannot export
  },
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0])

  const login = (userId: string) => {
    const user = USERS.find((u) => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const permissions = useMemo(() => {
    return PERMISSIONS_MAP[currentUser.role]
  }, [currentUser])

  return {
    currentUser,
    users: USERS,
    login,
    permissions,
  }
}
