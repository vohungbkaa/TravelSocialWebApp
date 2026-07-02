<template>
  <div class="login-container flex-center animate-fade-in">
    <div class="login-bg-decor shadow-glow"></div>
    <div class="card login-card">
      <div class="login-header">
        <router-link to="/" class="logo-text">
          <svg v-if="!isSystemAdmin" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="system-icon">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
          <span :class="{ 'system-text': isSystemAdmin }">{{ tenantName }}</span>
        </router-link>
        <h2 v-if="isSystemAdmin">Đăng nhập Super Admin</h2>
        <h2 v-else>Đăng nhập quản trị</h2>
        <p v-if="isSystemAdmin">Quản lý toàn bộ hệ thống phân vùng</p>
        <p v-else>Quản lý bản đồ và nội dung giới thiệu địa phương</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-control" 
            v-model="email" 
            required 
            placeholder="admin@travelsocial.xyz"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Mật khẩu</label>
          <input 
            type="password" 
            id="password" 
            class="form-control" 
            v-model="password" 
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <div class="login-footer">
        <a v-if="!isSystemAdmin" :href="backToMapUrl" class="back-link">
          &larr; Quay lại trang bản đồ
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api } from '../../config/api';
import { readTenantCodeFromUrl } from '../../config/tenant';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const tenantName = ref('Đang tải...');
const isSystemAdmin = ref(false);

const backToMapUrl = computed(() => {
  const urlTenant = readTenantCodeFromUrl();
  if (urlTenant) {
    return `/travel?tenant=${urlTenant}`;
  }
  return '/';
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    await api.auth.login(email.value, password.value);
    
    // Clear any active context if logging into system
    if (isSystemAdmin.value) {
      localStorage.removeItem('admin_active_tenant');
      localStorage.removeItem('admin_active_tenant_name');
    }
    
    router.push('/admin' + window.location.search);
  } catch (error: any) {
    errorMessage.value = error.message || 'Thông tin đăng nhập không chính xác hoặc lỗi kết nối.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const urlTenant = readTenantCodeFromUrl();
  
  // If no tenant is present in the URL, default to System Admin mode
  if (!urlTenant) {
    isSystemAdmin.value = true;
    tenantName.value = 'Hệ thống Quản trị';
    sessionStorage.removeItem('tenant_code_override');
  } else {
    try {
      const config = await api.tenant.config();
      tenantName.value = config.name;
    } catch (error) {
      console.error('Failed to load tenant config', error);
      tenantName.value = 'Không tìm thấy phân vùng';
    }
  }
});
</script>


<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  background-color: var(--bg-app);
  padding: 20px;
}

.login-bg-decor {
  position: absolute;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.05) 60%, transparent 100%);
  filter: blur(50px);
  z-index: 0;
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 10;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.login-header {
  text-align: center;
}

.login-header .logo-text {
  justify-content: center;
  margin-bottom: 24px;
}

.system-icon {
  color: #f59e0b;
}

.system-text {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.login-header h2 {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-banner {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
}

.w-full {
  width: 100%;
}

.login-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}

.back-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.back-link:hover {
  color: var(--primary);
}
</style>
