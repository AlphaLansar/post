import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from './types'

// ============================================================================
// POSTE AI — Authentification (SIMULÉE pour le prototype)
// ----------------------------------------------------------------------------
// Contrôle d'accès de démonstration : un mot de passe unique déverrouille la
// plateforme. En Phase 2, cet écran est remplacé par une authentification
// réelle (annuaire d'entreprise / SSO), MFA, RBAC serveur et journal d'audit.
// ============================================================================

export const DEMO_PASSWORD = '1234'

const STORE_KEY = 'posteai.session'

export interface SessionUser {
  name: string
  role: Role
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrateur',
  DIRECTION_GENERALE: 'Direction Générale',
  DIRECTION_FINANCIERE: 'Direction Financière',
  DIRECTION_OPERATIONS: 'Direction des Opérations',
  RESPONSABLE_REGIONAL: 'Responsable Régional',
  ANALYSTE: 'Analyste',
}

const DEFAULT_NAME: Record<Role, string> = {
  ADMIN: 'Administrateur système',
  DIRECTION_GENERALE: 'P. Haidara',
  DIRECTION_FINANCIERE: 'M. Diallo',
  DIRECTION_OPERATIONS: 'S. Coulibaly',
  RESPONSABLE_REGIONAL: 'F. Keïta',
  ANALYSTE: 'B. Sangaré',
}

/** Profil connecté par défaut : Direction Générale. Le modèle de rôles reste
 *  en place (extensible) même si l'écran de connexion ne demande que le mot de passe. */
export const DEFAULT_ROLE: Role = 'DIRECTION_GENERALE'
export const DG_NAME = DEFAULT_NAME.DIRECTION_GENERALE

interface AuthCtx {
  user: SessionUser | null
  login: (password: string, role?: Role) => boolean
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

function readSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession())

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      login: (password, role = DEFAULT_ROLE) => {
        if (password !== DEMO_PASSWORD) return false
        const u: SessionUser = { name: DEFAULT_NAME[role], role }
        try {
          sessionStorage.setItem(STORE_KEY, JSON.stringify(u))
        } catch {
          /* mode navigation privée : session en mémoire uniquement */
        }
        setUser(u)
        return true
      },
      logout: () => {
        try {
          sessionStorage.removeItem(STORE_KEY)
        } catch {
          /* noop */
        }
        setUser(null)
      },
    }),
    [user],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}
