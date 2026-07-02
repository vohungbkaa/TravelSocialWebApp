<template>
  <div class="system-tenants animate-fade-in">
    <!-- Header -->
    <div class="dashboard-header animate-slide-down">
      <div>
        <h1 class="gradient-text">Hệ thống phân vùng (Tenants)</h1>
        <p class="subtitle">Tài khoản Super Admin: Quản lý danh sách các thành phố/khu vực trên toàn hệ thống.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="card stat-card glow-card" title="Tổng số Tenant">
        <div class="stat-icon icon-areas">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        </div>
        <div>
          <span class="stat-label">Tổng số khu vực (Tenant)</span>
          <h3 class="stat-value">{{ tenants.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Tenants Grid -->
    <div class="tenant-grid">
      <div v-for="tenant in tenants" :key="tenant.id" class="tenant-card card hover-lift">
        <div class="tenant-card-header" :style="{ backgroundColor: tenant.theme?.primaryColor || '#6366f1' }">
          <div class="tenant-status" :class="{ active: tenant.enabled }">
            {{ tenant.enabled ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG' }}
          </div>
          <h2 class="tenant-name">{{ tenant.name }}</h2>
          <p class="tenant-code"><code>{{ tenant.code }}</code></p>
        </div>
        
        <div class="tenant-card-body">
          <div class="tenant-info-row">
            <span class="info-label">Tên miền (Domain):</span>
            <span class="info-value">
              <a :href="'http://' + tenant.domain" target="_blank">{{ tenant.domain }}</a>
            </span>
          </div>
          
          <div class="tenant-stats">
            <div class="t-stat">
              <span class="t-stat-val">{{ tenant._count?.areas || 0 }}</span>
              <span class="t-stat-lbl">Khu vực con</span>
            </div>
            <div class="t-stat">
              <span class="t-stat-val">{{ tenant._count?.places || 0 }}</span>
              <span class="t-stat-lbl">Địa danh</span>
            </div>
            <div class="t-stat">
              <span class="t-stat-val">{{ tenant._count?.users || 0 }}</span>
              <span class="t-stat-lbl">Quản trị viên</span>
            </div>
          </div>
          
          <div class="tenant-actions">
            <button class="btn btn-primary btn-premium w-100" @click="manageTenant(tenant)">
              Quản lý phân vùng này
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Skeleton Loading or Empty -->
      <div v-if="loading" class="tenant-card skeleton-card"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../config/api';

const router = useRouter();
const tenants = ref<any[]>([]);
const loading = ref(true);

const fetchTenants = async () => {
  loading.value = true;
  try {
    const data = await api.tenant.listAdmin();
    tenants.value = data;
  } catch (err) {
    console.error('Failed to load tenants', err);
  } finally {
    loading.value = false;
  }
};

const manageTenant = (tenant: any) => {
  // Save selected tenant to local storage
  localStorage.setItem('admin_active_tenant', tenant.code);
  localStorage.setItem('admin_active_tenant_name', tenant.name);
  
  // Reload window or push to /admin/areas
  window.location.href = '/admin/areas';
};

onMounted(() => {
  // Clear any existing active tenant when arriving at this page
  localStorage.removeItem('admin_active_tenant');
  localStorage.removeItem('admin_active_tenant_name');
  fetchTenants();
});
</script>

<style scoped>
.system-tenants {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tenant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.tenant-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.tenant-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.4);
}

.tenant-card-header {
  padding: 24px;
  color: white;
  position: relative;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2));
  background-blend-mode: overlay;
}

.tenant-status {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  letter-spacing: 0.5px;
}

.tenant-status.active {
  background: rgba(16, 185, 129, 0.8);
}

.tenant-name {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.tenant-code {
  margin: 0;
  opacity: 0.9;
}

.tenant-code code {
  background: rgba(0,0,0,0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.tenant-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tenant-info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.info-value a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.info-value a:hover {
  text-decoration: underline;
}

.tenant-stats {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-app);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.t-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.t-stat-val {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.t-stat-lbl {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.tenant-actions {
  margin-top: auto;
}

.w-100 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.skeleton-card {
  height: 300px;
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-app) 50%, var(--bg-card) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
