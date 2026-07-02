<template>
  <div class="landing-page animate-fade-in">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg-gradient"></div>
      <div class="container">
        <h1 class="hero-title">
          Khám phá các điểm văn hóa và trải nghiệm địa phương
        </h1>
        <p class="hero-subtitle">
          Xem các địa điểm nổi bật, câu chuyện địa phương, hình ảnh và bản đồ tương tác theo từng tenant.
        </p>
        <div class="hero-actions">
          <router-link to="/" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Xem bản đồ
          </router-link>
          <router-link to="/admin" class="btn btn-secondary">
            Quản trị nội dung
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Tính năng nổi bật</h2>
        <div class="features-grid">
          <div class="card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
            </div>
            <h3>Bản đồ dễ sử dụng</h3>
            <p>Xem nhanh vị trí các điểm tham quan, lọc theo danh mục và mở chỉ đường khi cần di chuyển.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <h3>Nội dung sinh động</h3>
            <p>Xem ảnh, video và nghe phần giới thiệu tự động để hiểu thêm câu chuyện của từng địa điểm.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Nông nghiệp công nghệ cao</h3>
            <p>Tìm hiểu mô hình nhà màng, hệ thống tưới dưa lưới và các hoạt động sản xuất nổi bật tại địa phương.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../../config/api';
import { MAP_CONFIG, applyAreaMapConfig, applyTenantConfig } from '../../config/map';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const tenantConfig = await api.tenant.config();
    applyTenantConfig(tenantConfig);
    const defaultSlug = tenantConfig.map.defaultAreaSlug || MAP_CONFIG.defaultAreaSlug;
    const areaConfig = await api.areas.getMapConfig(defaultSlug);
    const areaScope = applyAreaMapConfig(areaConfig);
    await router.replace({
      path: `/${areaScope.provinceCode || 'local'}/${areaScope.slug}`,
      query: route.query,
    });
  } catch (error) {
    console.error('Failed to load tenant config from backend API:', error);
  }
});
</script>

<style scoped>
.landing-page {
  padding-bottom: 80px;
}

.hero-section {
  position: relative;
  padding: 120px 20px 100px;
  text-align: center;
  overflow: hidden;
}

.hero-bg-gradient {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 100%);
  filter: blur(80px);
  z-index: -1;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  max-width: 800px;
  margin: 0 auto 24px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 650px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.features-section {
  padding: 60px 0;
}

.section-title {
  font-size: 2.25rem;
  text-align: center;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  height: 100%;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.975rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
}
</style>
