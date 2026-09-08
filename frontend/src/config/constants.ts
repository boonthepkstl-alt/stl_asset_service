export const APP_NAME = 'RAISE';
export const APP_VERSION = '0.1.0';

// Kept in sync with the Page union removed from the legacy ESAPS App.tsx (src/routes/types.ts)
// and the route mapping in FRONTEND-MIGRATION-BOUNDARY.md. Only routes scaffolded in this phase
// have a real page component — the rest resolve to the placeholder page for now.
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ASSETS: '/assets',
  ASSET_DETAIL: '/assets/:assetId',
  ASSET_CREATE: '/assets/create',
  EMPLOYEES: '/employees',
  EMPLOYEE_CREATE: '/employees/create',
  EMPLOYEE_DETAIL: '/employees/:employeeId',
  EMPLOYEE_EDIT: '/employees/:employeeId/edit',
  MAINTENANCE: '/maintenance',
  // Declared before TICKET_DETAIL below, and matched ahead of it, because React Router ranks a
  // static segment above a dynamic one — the same pairing ASSET_CREATE/ASSET_DETAIL already
  // relies on. Kept under /maintenance rather than given its own top-level path because
  // ESAPS-UI-FOUNDATION-BASELINE.md records that "IT Requisition is not its own slice."
  REQUISITION_CREATE: '/maintenance/create',
  TICKET_DETAIL: '/maintenance/:ticketCode',
  HANDOVERS: '/handovers',
  HANDOVER_DETAIL: '/handovers/:handoverCode',
  LICENSES: '/licenses',
  LICENSE_DETAIL: '/licenses/:licenseId',
  RECONCILIATION: '/reconciliation',
  NOTIFICATIONS: '/notifications',
  AI_DECISION: '/ai',
  ADMINISTRATION: '/administration',
  ADMIN_USERS: '/administration/users',
  ADMIN_ROLES: '/administration/roles',
  SETTINGS: '/settings',
  FORBIDDEN: '/forbidden',
  HOME: '/',
} as const;

export function assetDetailRoute(assetId: string) {
  return `/assets/${assetId}`;
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'raise_token',
  USER: 'raise_user',
} as const;
