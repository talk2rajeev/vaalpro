export const MODULES = {
  PORTAL: 'portal',
  CAALDOC: 'caaldoc',
  VAALDOC: 'vaaldoc',
  OVERALL: 'OVERALL',
} as const;

export type ModuleName = typeof MODULES[keyof typeof MODULES];