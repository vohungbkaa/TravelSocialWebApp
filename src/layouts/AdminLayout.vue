<template>
  <div class="admin-container">
    <!-- Admin Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="logo-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Trang Quản trị</span>
        </router-link>
        <button class="mobile-close-btn" @click="isSidebarOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="sidebar-menu">
        <template v-if="isSuperAdmin && !activeAdminTenant">
          <router-link to="/admin/system/tenants" class="menu-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Quản lý phân vùng (Tenants)
          </router-link>
        </template>
        
        <template v-else>
          <router-link to="/admin/areas" class="menu-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Khu vực bản đồ
          </router-link>

          <router-link to="/admin/places" class="menu-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            Danh sách địa danh
          </router-link>

          <router-link to="/admin/categories" class="menu-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Danh mục địa danh
          </router-link>
        </template>

        <template v-if="!isSuperAdmin || activeAdminTenant">
          <a :href="publicSiteUrl" class="menu-item exit-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Xem trang bản đồ
          </a>
        </template>
        
        <a href="#" @click.prevent="handleLogout" class="menu-item logout-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Đăng xuất
        </a>
      </nav>
    </aside>

    <!-- Admin Content Area -->
    <div class="main-body">
      <!-- Admin Topbar -->
      <header class="admin-topbar">
        <button class="menu-toggle-btn" @click="isSidebarOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div v-if="isSuperAdmin && activeAdminTenant" class="tenant-context-banner">
          <span class="tenant-badge">👑 Quản trị phân vùng</span>
          <strong>{{ activeAdminTenantName || activeAdminTenant }}</strong>
          <button class="btn btn-sm btn-outline-danger ml-3" @click="exitTenantContext">Đổi Tenant</button>
        </div>
        <div v-else></div>

        <div class="topbar-user">
          <div class="avatar">{{ userInitial }}</div>
          <span>{{ displayName }}</span>
        </div>
      </header>

      <!-- Sub Page Content -->
      <main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../config/api';

const router = useRouter();
const isSidebarOpen = ref(false);

const user = computed(() => api.auth.getUser());
const isSuperAdmin = computed(() => user.value?.role === 'SUPER_ADMIN');
const activeAdminTenant = ref(localStorage.getItem('admin_active_tenant'));
const activeAdminTenantName = ref(localStorage.getItem('admin_active_tenant_name'));

const displayName = computed(() => user.value?.displayName || 'Administrator');
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase());

const publicSiteUrl = computed(() => {
  if (activeAdminTenant.value) {
    return `/?tenant=${activeAdminTenant.value}`;
  }
  return '/';
});

const handleLogout = () => {
  const currentTenant = localStorage.getItem('admin_active_tenant') || sessionStorage.getItem('tenant_code_override');
  api.auth.logout();
  localStorage.removeItem('admin_active_tenant');
  localStorage.removeItem('admin_active_tenant_name');
  if (currentTenant) {
    router.push(`/admin/login?tenant=${currentTenant}`);
  } else {
    router.push('/admin/login');
  }
};

const exitTenantContext = () => {
  localStorage.removeItem('admin_active_tenant');
  localStorage.removeItem('admin_active_tenant_name');
  activeAdminTenant.value = null;
  activeAdminTenantName.value = null;
  window.location.href = '/admin/system/tenants';
};

</script>


<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-app);
}

.sidebar {
  width: 260px;
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  transition: transform var(--transition-normal);
}

.sidebar-header {
  height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.mobile-close-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.sidebar-menu {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all var(--transition-fast);
}

.menu-item:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.menu-item.active {
  color: #ffffff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 16px 0;
}

.exit-item:hover {
  color: var(--secondary);
  background-color: rgba(168, 85, 247, 0.1);
}

.logout-item:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.main-body {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  height: 70px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-toggle-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.topbar-user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 1px solid var(--primary);
}

.admin-main {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}

.tenant-context-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tenant-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-outline-danger {
  border: 1px solid #ef4444;
  color: #ef4444;
  background: transparent;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-danger:hover {
  background: #ef4444;
  color: white;
}

.ml-3 {
  margin-left: 12px;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  .mobile-close-btn {
    display: block;
  }
  
  .main-body {
    margin-left: 0;
  }
  
  .menu-toggle-btn {
    display: block;
  }
  
  .admin-topbar {
    padding: 0 20px;
  }
  
  .admin-main {
    padding: 20px;
  }
}
</style>
