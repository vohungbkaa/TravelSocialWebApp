const TENANT_CODE_STORAGE_KEY = 'tenant_code_override';

const normalizeTenantCode = (value: string | null): string | undefined => {
  const code = value?.trim().toLowerCase();
  return code || undefined;
};

export const readTenantCodeFromUrl = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const params = new URLSearchParams(window.location.search);
  const tenantParam = params.get('tenant');
  if (tenantParam) {
    return normalizeTenantCode(tenantParam);
  }
  return undefined;
};

export const getTenantCodeOverride = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const urlTenant = readTenantCodeFromUrl();
  if (urlTenant) {
    sessionStorage.setItem(TENANT_CODE_STORAGE_KEY, urlTenant);
    return urlTenant;
  }

  return normalizeTenantCode(sessionStorage.getItem(TENANT_CODE_STORAGE_KEY));
};

export const getTenantRequestHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const headers: Record<string, string> = {
    'X-Tenant-Host': window.location.hostname,
  };
  
  // Admin context switching has highest priority
  const adminActiveTenant = localStorage.getItem('admin_active_tenant');
  if (adminActiveTenant) {
    headers['X-Tenant-Code'] = adminActiveTenant;
    return headers;
  }

  const codeOverride = getTenantCodeOverride();
  if (codeOverride) {
    headers['X-Tenant-Code'] = codeOverride;
  }
  return headers;
};
