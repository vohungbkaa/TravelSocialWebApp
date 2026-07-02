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
  const keys = Array.from(params.keys());
  if (keys.length > 0) {
    return normalizeTenantCode(keys[0]);
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
  const codeOverride = getTenantCodeOverride();
  if (codeOverride) {
    headers['X-Tenant-Code'] = codeOverride;
  }
  return headers;
};
