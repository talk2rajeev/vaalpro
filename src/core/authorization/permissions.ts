export const PERMISSIONS = {
  VAALPRO: {
    // PLATFORM ADMIN

    IAM_USER_VIEW: 'vaalpro.iam.user.view',
    IAM_USER_CREATE: 'vaalpro.iam.user.create',
    IAM_USER_UPDATE: 'vaalpro.iam.user.update',
    IAM_USER_DELETE: 'vaalpro.iam.user.delete',
    IAM_USER_BULK_CREATE: 'vaalpro.iam.user.bulk.create',

    DASHBOARD_VIEW: 'vaalpro.dashboard.view',
    VENDOR_VIEW: 'vaalpro.vendor.view',
    VENDOR_CREATE: 'vaalpro.vendor.create',
    VENDOR_UPDATE: 'vaalpro.vendor.update',
    VENDOR_DELETE: 'vaalpro.vendor.delete',
    
    VENDOR_EMPLOYEE_VIEW: 'vaalpro.vendor.employee.view',
    VENDOR_EMPLOYEE_CREATE: 'vaalpro.vendor.employee.create',
    VENDOR_EMPLOYEE_UPDATE: 'vaalpro.vendor.employee.update',
    VENDOR_EMPLOYEE_DELETE: 'vaalpro.vendor.employee.delete',
    VENDOR_EMPLOYEE_BULK_CREATE: 'vaalpro.vendor.employee.bulk.create',

    IAM_ROLE_VIEW: 'vaalpro.iam.role.view',
    IAM_ROLE_CREATE: 'vaalpro.iam.role.create',
    IAM_ROLE_UPDATE: 'vaalpro.iam.role.update',
    IAM_ROLE_DELETE: 'vaalpro.iam.role.delete',
    
    IAM_PERMISSION_VIEW: 'vaalpro.iam.permission.view',
    IAM_PERMISSION_CREATE: 'vaalpro.iam.permission.create',
    IAM_PERMISSION_UPDATE: 'vaalpro.iam.permission.update',
    IAM_PERMISSION_DELETE: 'vaalpro.iam.permission.delete',
    IAM_PERMISSION_BULK_CREATE: 'vaalpro.iam.permission.bulk.create',

    CAALDOC_MASTERDATA_VIEW: 'vaalpro.caaldoc.masterdata.view',
    CAALDOC_MASTERDATA_UPDATE: 'vaalpro.caaldoc.masterdata.update',
    CAALDOC_MASTERDATA_CREATE: 'vaalpro.caaldoc.masterdata.create',
    CAALDOC_MASTERDATA_DELETE: 'vaalpro.caaldoc.masterdata.delete',
  },
  CAALDOC: {
    DASHBOARD_VIEW: 'caaldoc.dashboard.view',
    PLANT_VIEW: 'caaldoc.plant.view',
    LOG_VIEW: 'caaldoc.log.view',

    EMPLOYEE_VIEW: 'caaldoc.employee.view',
    EMPLOYEE_UPDATE: 'caaldoc.employee.update',
    EMPLOYEE_CREATE: 'caaldoc.employee.create',
    EMPLOYEE_DELETE: 'caaldoc.employee.delete',

    SETTING_VIEW: 'caaldoc.setting.view',
    SETTING_UPDATE: 'caaldoc.setting.update',

    CREATE_SOP: 'caaldoc.sop.create',
    UPDATE_SOP: 'caaldoc.sop.update',
    DELETE_SOP: 'caaldoc.sop.delete',

    CREATE_SERVICEORDER: 'caaldoc.serviceorder.create',
    UPDATE_SERVICEORDER: 'caaldoc.serviceorder.update',
    DELETE_SERVICEORDER: 'caaldoc.serviceorder.delete',

    CREATE_SHEDULE: 'caaldoc.schedule.create',
    UPDATE_SHEDULE: 'caaldoc.schedule.update',
    DELETE_SHEDULE: 'caaldoc.schedule.delete',

    CALIBRATION_EXECUTE: 'caaldoc.calibration.execute',

  },
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
