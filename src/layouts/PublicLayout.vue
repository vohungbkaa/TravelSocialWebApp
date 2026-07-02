<template>
  <div class="app-container">
    <!-- Header -->
    <header class="glass-header">
      <div class="nav-container">
        <div class="header-left">
          <!-- Mobile Menu Drawer Toggle Button -->
          <button 
            v-if="hasDrawer" 
            class="mobile-menu-btn" 
            @click="toggleDrawer" 
            aria-label="Mở danh sách địa điểm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <router-link to="/" class="logo-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{{ tenantName }}</span>
          </router-link>
        </div>

        <nav class="nav-links">
          <!-- Back to Admin Dashboard Button -->
          <router-link v-if="showBackToAdmin" to="/admin" class="btn-back-admin" aria-label="Quay lại trang quản trị">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Quay lại Quản trị</span>
          </router-link>
          
          <!-- Admin Avatar Icon Button -->
          <button @click="handleAdminClick" class="btn-avatar" aria-label="Mở trang quản trị">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../config/api';

const route = useRoute();
const router = useRouter();

const tenantName = ref('Travel Social');

const showBackToAdmin = computed(() => {
  const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
  if (!loggedIn) return false;
  try {
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
    return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
  } catch {
    return false;
  }
});

// Provide mobile drawer open state to children (specifically PublicArea.vue)
const isMobileDrawerOpen = ref(false);
provide('isMobileDrawerOpen', isMobileDrawerOpen);

const hasDrawer = computed(() => route.name === 'PublicArea' || route.name === 'PublicProvince' || route.name === 'Landing');

const toggleDrawer = () => {
  isMobileDrawerOpen.value = !isMobileDrawerOpen.value;
};

// Guard/check admin authentication state on click
const handleAdminClick = () => {
  const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
  const search = window.location.search; // Preserves raw query string like ?da-nang
  if (isAdminLoggedIn) {
    router.push(`/admin${search}`);
  } else {
    router.push(`/admin/login${search}`);
  }
};

onMounted(async () => {
  try {
    const config = await api.tenant.config();
    tenantName.value = config.name;
  } catch (error) {
    console.error('Failed to load tenant config in PublicLayout:', error);
  }
});
</script>

<style scoped>
.nav-container {
  max-width: none;
  padding: 0 12px;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-btn {
  display: none;
}

.nav-links {
  display: flex;
  align-items: center;
}

.btn-back-admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  background-color: var(--primary-light);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  text-decoration: none;
  transition: all var(--transition-fast, 0.15s);
  margin-right: 12px;
}

.btn-back-admin:hover {
  background-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-0.5px);
}

.btn-avatar {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-avatar:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.footer {
  background-color: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 24px 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.footer-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  gap: 10px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.footer-links a {
  color: var(--text-secondary);
}

.footer-links a:hover {
  color: var(--primary);
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

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 6px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .mobile-menu-btn:hover {
    background-color: var(--primary-light);
    color: var(--primary);
  }
}
</style>
