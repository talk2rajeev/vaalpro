export const ROUTES = {
  root: '/',
  login: '/login',
  vaaldoc: '/vaaldoc',
  caaldoc: {
    dashboard: '/caaldoc/dashboard',
    plantDetailsPattern: '/caaldoc/plants/:id',
    plants: (plantId: string) => `/caaldoc/plants/${plantId}`,
    audit: '/caaldoc/audit',
    settings: '/caaldoc/settings',
    workflows: '/caaldoc/workflows',
    hierarchy: '/caaldoc/hierarchy',
  },
  qdoc: {
    dashboard: '/dashboard',
  },
  systemAdmin: {
    root: '/system-admin',
    vendors: '/system-admin/vendors',
    vendorDetail: (vendorId: string) => `/system-admin/vendors/${vendorId}/detail`,
    vendorEmployees: (vendorId: string) => `/system-admin/vendors/${vendorId}/employee`,
    vendorCustomers: (vendorId: string) => `/system-admin/vendors/${vendorId}/customers`,
    roles: '/system-admin/roles',
    permissions: '/system-admin/permissions',
    permissionGroups: '/system-admin/permission-groups',
    subscriptions: '/system-admin/subscriptions',
  },
} as const;
