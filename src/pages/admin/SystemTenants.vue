<template>
  <div class="system-tenants-container animate-fade-in">
    <!-- Top Dashboard Header -->
    <div class="dashboard-header animate-slide-down">
      <div class="header-main">
        <div class="header-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          <span>QUẢN TRỊ HỆ THỐNG</span>
        </div>
        <h1 class="gradient-text">Danh sách phân vùng (Tenants)</h1>
        <p class="subtitle">Xem danh sách, quản lý cấu hình và chuyển đổi không gian làm việc giữa các phân vùng đô thị.</p>
      </div>
      <div class="system-stats shadow-glow">
        <div class="stat-item">
          <span class="stat-number">{{ tenants.length }}</span>
          <span class="stat-label">Tổng phân vùng</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ activeCount }}</span>
          <span class="stat-label">Đang chạy</span>
        </div>
      </div>
    </div>

    <!-- Main Grid of Tenants -->
    <div v-if="loading" class="loading-grid">
      <div v-for="n in 3" :key="n" class="skeleton-card">
        <div class="skeleton-header"></div>
        <div class="skeleton-body"></div>
      </div>
    </div>

    <div v-else-if="tenants.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <h3>Không có dữ liệu phân vùng</h3>
      <p>Hệ thống hiện tại chưa có phân vùng hoạt động nào được cấu hình.</p>
    </div>

    <div v-else class="tenant-grid">
      <div 
        v-for="tenant in tenants" 
        :key="tenant.id" 
        class="tenant-card hover-lift"
        :style="{ '--tenant-theme': tenant.theme?.primaryColor || '#6366f1' }"
      >
        <div class="tenant-card-header">
          <div class="status-indicator" :class="{ 'status-active': tenant.enabled }">
            <span class="dot"></span>
            {{ tenant.enabled ? 'Hoạt động' : 'Tạm khóa' }}
          </div>
          <div class="tenant-title">
            <h2>{{ tenant.name }}</h2>
            <span class="code-badge">{{ tenant.code }}</span>
          </div>
        </div>

        <div class="tenant-card-body">
          <div class="meta-info">
            <div class="info-group">
              <label>Tên miền truy cập</label>
              <a :href="'http://' + tenant.domain" target="_blank" class="domain-link">
                {{ tenant.domain }}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
          </div>

          <div class="stats-mini-grid">
            <div class="mini-stat">
              <div class="stat-val">{{ tenant._count?.areas || 0 }}</div>
              <div class="stat-lbl">Khu vực</div>
            </div>
            <div class="mini-stat">
              <div class="stat-val">{{ tenant._count?.places || 0 }}</div>
              <div class="stat-lbl">Địa danh</div>
            </div>
            <div class="mini-stat">
              <div class="stat-val">{{ tenant._count?.users || 0 }}</div>
              <div class="stat-lbl">Admin</div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-premium w-full" @click="manageTenant(tenant)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Quản lý phân vùng này
            </button>
            <a 
              :href="'/travel?tenant=' + tenant.code" 
              target="_blank" 
              class="btn btn-outline w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"></path></svg>
              Xem trang bản đồ
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../config/api';

const router = useRouter();
const tenants = ref<any[]>([]);
const loading = ref(true);

const activeCount = computed(() => {
  return tenants.value.filter(t => t.enabled).length;
});

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
  localStorage.setItem('admin_active_tenant', tenant.code);
  localStorage.setItem('admin_active_tenant_name', tenant.name);
  window.location.href = '/admin/areas';
};

onMounted(() => {
  localStorage.removeItem('admin_active_tenant');
  localStorage.removeItem('admin_active_tenant_name');
  fetchTenants();
});
</script>

<style scoped>
.system-tenants-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header design */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: var(--bg-card);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.gradient-text {
  font-size: 2.25rem;
  font-weight: 850;
  letter-spacing: -1px;
  background: linear-gradient(135deg, var(--text-primary), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.system-stats {
  display: flex;
  background: var(--bg-app);
  border: 1px solid var(--border-color);
  padding: 16px 28px;
  border-radius: var(--radius-md);
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background-color: var(--border-color);
}

/* Tenant cards layout */
.tenant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px;
}

.tenant-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tenant-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--tenant-theme);
}

.tenant-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px -8px rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.3);
}

.tenant-card-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-app);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.status-indicator.status-active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.2);
}

.status-indicator .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
}

.status-indicator.status-active .dot {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.tenant-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tenant-title h2 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
}

.code-badge {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--tenant-theme);
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.tenant-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.meta-info .info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-info label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.domain-link {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
  word-break: break-all;
}

.domain-link:hover {
  color: var(--primary);
}

.stats-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: var(--bg-app);
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mini-stat:not(:last-child) {
  border-right: 1px solid var(--border-color);
}

.stat-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-lbl {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.action-buttons {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  box-sizing: border-box;
}

.btn-premium {
  background: linear-gradient(135deg, var(--tenant-theme) 0%, rgba(99, 102, 241, 0.8) 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.2);
}

.btn-premium:hover {
  filter: brightness(1.1);
  box-shadow: 0 6px 16px -2px rgba(99, 102, 241, 0.35);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-app);
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

/* Skeleton Loading states */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px;
}

.skeleton-card {
  height: 320px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.skeleton-header {
  height: 80px;
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-app) 50%, var(--bg-card) 75%);
  background-size: 200% 100%;
  animation: wave 1.5s infinite;
}

.skeleton-body {
  height: calc(100% - 80px);
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-app) 50%, var(--bg-card) 75%);
  background-size: 200% 100%;
  animation: wave 1.5s infinite;
  animation-delay: 0.15s;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  max-width: 500px;
  margin: 40px auto;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

@keyframes wave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }
  .system-stats {
    width: 100%;
    justify-content: space-around;
  }
}
</style>
