<template>
  <div class="admin-dashboard animate-fade-in">
    <!-- Header -->
    <div class="dashboard-header animate-slide-down">
      <div>
        <h1 class="gradient-text">Bảng điều khiển</h1>
        <p class="subtitle">Chào mừng quay trở lại! Quản lý các phân vùng bản đồ và các địa danh của bạn.</p>
      </div>
      <div class="header-actions">
        <button v-if="activeTab === 'areas'" class="btn btn-primary btn-premium" @click="openAreaModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Thêm Vùng mới
        </button>
        <button v-if="activeTab === 'places' || activeTab === 'categories'" class="btn btn-secondary btn-premium-secondary" @click="openCategoryModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Thêm Danh mục
        </button>
        <button v-if="activeTab === 'places'" class="btn btn-primary btn-premium" @click="openPlaceModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Thêm Địa danh mới
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="card stat-card glow-card" @click="switchTab('areas')" title="Xem Danh sách vùng bản đồ">
        <div class="stat-icon icon-areas">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div>
          <span class="stat-label">Tổng số khu vực</span>
          <h3 class="stat-value">{{ areas.length }}</h3>
        </div>
      </div>

      <div class="card stat-card glow-card" @click="switchTab('places')" title="Xem Danh sách địa danh">
        <div class="stat-icon icon-places">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
        </div>
        <div>
          <span class="stat-label">Tổng số địa danh</span>
          <h3 class="stat-value">{{ places.length }}</h3>
        </div>
      </div>

      <div class="card stat-card glow-card" @click="switchTab('places')" title="Xem Danh sách địa danh đã công bố">
        <div class="stat-icon icon-routes">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div>
          <span class="stat-label">Địa danh đã công bố</span>
          <h3 class="stat-value">{{ publishedCount }}</h3>
        </div>
      </div>

      <div class="card stat-card glow-card" @click="switchTab('categories')" title="Xem Danh mục địa danh">
        <div class="stat-icon icon-categories">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </div>
        <div>
          <span class="stat-label">Tổng số danh mục</span>
          <h3 class="stat-value">{{ categories.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Tabs Bar -->
    <div class="tabs-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'places' }" @click="switchTab('places')">
        Danh sách địa danh
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'areas' }" @click="switchTab('areas')">
        Vùng bản đồ
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'categories' }" @click="switchTab('categories')">
        Danh mục địa danh
      </button>
    </div>

    <!-- Table of Places -->
    <div v-if="activeTab === 'places'" class="card table-card animate-fade-in">
      <div class="table-header">
        <h2>Quản lý các địa danh du lịch</h2>
        <div class="search-filters">
          <CustomSelect
            v-model="categoryFilter"
            :options="categoryFilterOptions"
            placeholder="Tất cả danh mục"
            size="sm"
            style="min-width: 170px;"
          />
          <div class="search-box">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm địa danh..." />
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên địa danh</th>
              <th class="col-category">Danh mục</th>
              <th class="col-area">Khu vực</th>
              <th class="col-coords">Tọa độ GPS</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-actions actions-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPlaces.length === 0">
              <td colspan="6" class="empty-cell">Không tìm thấy địa danh nào. Nhấp vào "Thêm Địa danh mới" để tạo.</td>
            </tr>
            <tr v-for="place in filteredPlaces" :key="place.id">
              <td>
                <div class="area-name-cell">
                  <span v-if="place.coverUrl" class="place-thumb" :style="{ backgroundImage: `url(${place.coverUrl})` }"></span>
                  <span v-else class="area-icon">📍</span>
                  <div>
                    <strong>{{ place.name }}</strong>
                    <p class="area-desc-short" :title="place.summary">{{ place.summary || 'Không có mô tả ngắn.' }}</p>
                  </div>
                </div>
              </td>
              <td class="col-category">
                <span class="category-badge">{{ place.category?.name || 'Chưa phân loại' }}</span>
              </td>
              <td class="col-area"><span class="area-text-badge">{{ place.area?.name || 'Không có vùng' }}</span></td>
              <td class="col-coords">
                <code v-if="place.latitude && place.longitude" class="coordinate-text">
                  {{ parseFloat(place.latitude.toString()).toFixed(4) }}, {{ parseFloat(place.longitude.toString()).toFixed(4) }}
                </code>
                <span v-else class="text-muted">Không có</span>
              </td>
              <td class="col-status">
                <span class="badge-status" :class="place.status.toLowerCase()">
                  {{ place.status === 'PUBLISHED' ? 'CÔNG BỐ' : (place.status === 'DRAFT' ? 'BẢN NHÁP' : 'ẨN') }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <button 
                    v-if="place.status === 'DRAFT'" 
                    class="btn btn-success btn-xs btn-action" 
                    @click="publishPlace(place)"
                    title="Công bố địa danh lên bản đồ công cộng"
                  >
                    Công bố
                  </button>
                  <button 
                    v-if="place.status === 'PUBLISHED'" 
                    class="btn btn-secondary btn-xs btn-action" 
                    @click="unpublishPlace(place)"
                    title="Hạ xuống dạng bản nháp"
                  >
                    Bản nháp
                  </button>
                  <button class="btn btn-secondary btn-xs btn-edit" @click="openPlaceModal(place)">
                    Sửa
                  </button>
                  <button class="btn btn-danger btn-xs btn-delete" @click="deletePlace(place)">
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table of Areas -->
    <div v-if="activeTab === 'areas'" class="card table-card animate-fade-in">
      <div class="table-header">
        <h2>Các phân vùng bản đồ câu chuyện</h2>
        <div class="search-box">
          <input type="text" v-model="areaSearchQuery" class="form-control" placeholder="Tìm kiếm khu vực..." />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên khu vực</th>
              <th class="col-slug">Đường dẫn thân thiện (Slug)</th>
              <th class="col-coords">Tọa độ tâm</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-actions actions-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAreas.length === 0">
              <td colspan="5" class="empty-cell">Không tìm thấy khu vực nào.</td>
            </tr>
            <tr v-for="area in filteredAreas" :key="area.id">
              <td>
                <div class="area-name-cell">
                  <span class="area-icon">🗺️</span>
                  <div>
                    <strong>{{ area.name }}</strong>
                    <p class="area-desc-short" :title="area.description">{{ area.description || 'Không có mô tả' }}</p>
                  </div>
                </div>
              </td>
              <td class="col-slug"><code class="slug-text">/{{ area.provinceCode || 'hn' }}/{{ area.slug }}</code></td>
              <td class="col-coords">
                <code class="coordinate-text">{{ parseFloat(area.centerLat.toString()).toFixed(4) }}, {{ parseFloat(area.centerLng.toString()).toFixed(4) }}</code>
              </td>
              <td class="col-status">
                <span class="badge-status" :class="area.published ? 'published' : 'draft'">
                  {{ area.published ? 'ĐÃ CÔNG BỐ' : 'BẢN NHÁP' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <router-link :to="`/${area.provinceCode || 'hn'}/${area.slug}`" class="btn btn-secondary btn-xs btn-action" target="_blank">
                    Xem bản đồ
                  </router-link>
                  <button class="btn btn-secondary btn-xs btn-edit" @click="openAreaModal(area)">
                    Sửa
                  </button>
                  <button class="btn btn-danger btn-xs btn-delete" @click="deleteArea(area)">
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table of Categories -->
    <div v-if="activeTab === 'categories'" class="card table-card animate-fade-in">
      <div class="table-header">
        <h2>Quản lý danh mục địa danh</h2>
        <div class="search-box">
          <input type="text" v-model="categorySearchQuery" class="form-control" placeholder="Tìm kiếm danh mục..." />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-stt">STT</th>
              <th>Tên danh mục</th>
              <th class="col-slug">Mã danh mục (Code)</th>
              <th>Mô tả</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-actions actions-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="6" class="empty-cell">Không tìm thấy danh mục nào.</td>
            </tr>
            <tr v-for="(cat, index) in filteredCategories" :key="cat.id">
              <td class="col-stt text-secondary" style="font-weight: 600;">{{ index + 1 }}</td>
              <td>
                <strong>{{ cat.name }}</strong>
              </td>
              <td class="col-slug"><code>{{ cat.code || '-' }}</code></td>
              <td>
                <span class="text-secondary">{{ cat.description || 'Không có mô tả' }}</span>
              </td>
              <td class="col-status">
                <span class="badge-status" :class="cat.active !== false ? 'published' : 'hidden'">
                  {{ cat.active !== false ? 'HOẠT ĐỘNG' : 'ẨN' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <button 
                    v-if="cat.active !== false" 
                    class="btn btn-secondary btn-xs btn-action" 
                    @click="toggleCategoryStatus(cat, false)"
                    title="Ẩn danh mục khỏi bộ lọc bản đồ công cộng"
                  >
                    Ẩn đi
                  </button>
                  <button 
                    v-else 
                    class="btn btn-success btn-xs btn-action" 
                    @click="toggleCategoryStatus(cat, true)"
                    title="Kích hoạt lại danh mục"
                  >
                    Kích hoạt
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Area Dialog/Modal (Teleported to body to avoid stacking context overlapping) -->
    <Teleport to="body">
      <div v-if="showAreaModal" class="modal-overlay" @click.self="showAreaModal = false">
        <div class="modal-card modal-premium-card animate-scale-up">
          <div class="modal-header">
            <h2>{{ editingArea ? 'Chỉnh sửa vùng câu chuyện' : 'Tạo mới vùng câu chuyện' }}</h2>
            <button class="close-btn" @click="showAreaModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveArea" novalidate>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="area-name">Tên khu vực *</label>
                  <input type="text" id="area-name" class="form-control" :class="{ 'has-error': formErrors.areaName }" v-model="areaForm.name" placeholder="Ví dụ: Xã Tiến Thắng" @input="clearError('areaName')" />
                  <span v-if="formErrors.areaName" class="form-error-msg">{{ formErrors.areaName }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="area-slug">Đường dẫn thân thiện (Slug)</label>
                  <input type="text" id="area-slug" class="form-control" v-model="areaForm.slug" placeholder="Ví dụ: tien-thang (để trống tự sinh)" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="area-province">Mã Tỉnh/Thành phố *</label>
                  <input type="text" id="area-province" class="form-control" :class="{ 'has-error': formErrors.areaProvince }" v-model="areaForm.provinceCode" placeholder="Ví dụ: hn" @input="clearError('areaProvince')" />
                  <span v-if="formErrors.areaProvince" class="form-error-msg">{{ formErrors.areaProvince }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="area-radius">Bán kính quét mặc định (km)</label>
                  <input type="number" step="0.1" id="area-radius" class="form-control" v-model.number="areaForm.defaultRadiusKm" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="area-lat">Vĩ độ tâm (Latitude) *</label>
                  <input type="number" step="0.000001" id="area-lat" class="form-control" :class="{ 'has-error': formErrors.areaLat }" v-model.number="areaForm.centerLat" @input="clearError('areaLat')" />
                  <span v-if="formErrors.areaLat" class="form-error-msg">{{ formErrors.areaLat }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="area-lng">Kinh độ tâm (Longitude) *</label>
                  <input type="number" step="0.000001" id="area-lng" class="form-control" :class="{ 'has-error': formErrors.areaLng }" v-model.number="areaForm.centerLng" @input="clearError('areaLng')" />
                  <span v-if="formErrors.areaLng" class="form-error-msg">{{ formErrors.areaLng }}</span>
                </div>
                <div class="form-group form-grid-full">
                  <label class="form-label" for="area-cover">Đường dẫn hình ảnh bìa</label>
                  <input type="text" id="area-cover" class="form-control" v-model="areaForm.coverUrl" placeholder="https://example.com/image.jpg" />
                </div>
                <div class="form-group form-grid-full">
                  <label class="form-label" for="area-desc">Mô tả giới thiệu</label>
                  <textarea id="area-desc" class="form-control" rows="3" v-model="areaForm.description" placeholder="Giới thiệu chung về khu vực lịch sử/nông nghiệp này..."></textarea>
                </div>
                <div class="form-group form-grid-full checkbox-group">
                  <label>
                    <input type="checkbox" v-model="areaForm.published" />
                    <span>Xuất bản khu vực này lên trang công cộng</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAreaModal = false">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="modalLoading">
                {{ modalLoading ? 'Đang lưu...' : 'Lưu khu vực' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Place Dialog/Modal (Teleported to body to avoid stacking context overlapping) -->
    <Teleport to="body">
      <div v-if="showPlaceModal" class="modal-overlay" @click.self="showPlaceModal = false">
        <div id="place-modal-card" class="modal-card modal-premium-card animate-scale-up">
          <div class="modal-header">
            <h2>{{ editingPlace ? 'Chỉnh sửa địa danh du lịch' : 'Tạo địa danh mới' }}</h2>
            <button class="close-btn" @click="showPlaceModal = false">&times;</button>
          </div>
          <form @submit.prevent="savePlace" @click="showCategoryTooltip = false" novalidate>
            <div class="modal-body" @scroll="updateTooltipPosition">
              <div class="form-grid">
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-name">Tên địa danh *</label>
                  <input type="text" id="place-name" class="form-control" :class="{ 'has-error': formErrors.placeName }" v-model="placeForm.name" placeholder="Ví dụ: Đình Bạch Trữ" @input="clearError('placeName')" />
                  <span v-if="formErrors.placeName" class="form-error-msg">{{ formErrors.placeName }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label label-with-info" for="place-category">
                    Danh mục
                    <span class="info-tooltip-wrapper" @click.prevent.stop>
                      <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" @click.stop.prevent="showCategoryTooltip = !showCategoryTooltip">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <Teleport to="body">
                        <Transition name="tooltip-fade">
                          <span v-if="showCategoryTooltip && !placeForm.categoryId" class="info-tooltip" :style="tooltipStyle">
                            💡 Chọn danh mục giúp địa danh dễ tìm kiếm và lọc hơn.
                          </span>
                        </Transition>
                      </Teleport>
                    </span>
                  </label>
                  <CustomSelect
                    v-model="placeForm.categoryId"
                    :options="placeCategoryOptions"
                    placeholder="-- Không phân loại / Chọn sau --"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label" for="place-area">Khu vực bản đồ *</label>
                  <CustomSelect
                    v-model="placeForm.areaId"
                    :options="placeAreaOptions"
                    placeholder="Chọn khu vực"
                    :has-error="!!formErrors.placeArea"
                    @change="clearError('placeArea')"
                  />
                  <span v-if="formErrors.placeArea" class="form-error-msg">{{ formErrors.placeArea }}</span>
                </div>
                <!-- Temporarily Hidden Price Level -->
                <!--
                <div class="form-group">
                  <label class="form-label" for="place-price-level">Mức chi phí</label>
                  <CustomSelect
                    v-model="placeForm.priceLevel"
                    :options="priceLevelOptions"
                  />
                </div>
                -->
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-address">Địa chỉ</label>
                  <input type="text" id="place-address" class="form-control" v-model="placeForm.address" placeholder="Ví dụ: Thôn Bạch Trữ, Xã Tiến Thắng, Mê Linh" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="place-lat">Vĩ độ (Latitude) *</label>
                  <input type="number" step="0.000001" id="place-lat" class="form-control" :class="{ 'has-error': formErrors.placeLat }" v-model.number="placeForm.latitude" @input="clearError('placeLat')" />
                  <span v-if="formErrors.placeLat" class="form-error-msg">{{ formErrors.placeLat }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="place-lng">Kinh độ (Longitude) *</label>
                  <input type="number" step="0.000001" id="place-lng" class="form-control" :class="{ 'has-error': formErrors.placeLng }" v-model.number="placeForm.longitude" @input="clearError('placeLng')" />
                  <span v-if="formErrors.placeLng" class="form-error-msg">{{ formErrors.placeLng }}</span>
                </div>
                <!-- Temporarily Hidden Min/Max Costs and Duration -->
                <!--
                <div class="form-group">
                  <label class="form-label" for="place-min-cost">Chi phí tối thiểu (đ)</label>
                  <input type="number" id="place-min-cost" class="form-control" v-model.number="placeForm.estimatedMinCost" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="place-max-cost">Chi phí tối đa (đ)</label>
                  <input type="number" id="place-max-cost" class="form-control" v-model.number="placeForm.estimatedMaxCost" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="place-duration">Thời gian tham quan ước tính (phút)</label>
                  <input type="number" id="place-duration" class="form-control" v-model.number="placeForm.averageVisitDurationMinutes" />
                </div>
                -->
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-cover">Đường dẫn ảnh bìa</label>
                  <div class="input-upload-group">
                    <input type="text" id="place-cover" class="form-control" v-model="placeForm.coverUrl" placeholder="https://example.com/image.jpg" />
                    <button type="button" class="btn btn-secondary btn-upload" @click="coverFileInput?.click()">
                      📁 Tải ảnh lên
                    </button>
                    <input type="file" ref="coverFileInput" style="display: none" accept="image/*" @change="e => uploadMediaFile(e, 'coverUrl')" />
                  </div>
                </div>
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-video">Đường dẫn Video giới thiệu (YouTube/Vimeo)</label>
                  <div class="input-upload-group">
                    <input type="text" id="place-video" class="form-control" v-model="placeForm.videoUrl" placeholder="Ví dụ: https://www.youtube.com/watch?v=..." />
                    <button type="button" class="btn btn-secondary btn-upload" @click="videoFileInput?.click()">
                      📁 Tải video lên
                    </button>
                    <input type="file" ref="videoFileInput" style="display: none" accept="video/*" @change="e => uploadMediaFile(e, 'videoUrl')" />
                  </div>
                </div>
                <!-- Temporarily Hidden Audio URL -->
                <!--
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-audio">Đường dẫn Audio thuyết minh (TTS)</label>
                  <input type="text" id="place-audio" class="form-control" v-model="placeForm.audioUrl" placeholder="https://example.com/audio.mp3" />
                </div>
                -->
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-summary">Tóm tắt ngắn gọn (Tối đa 500 ký tự) *</label>
                  <input type="text" id="place-summary" class="form-control" v-model="placeForm.summary" required placeholder="Một câu giới thiệu ngắn gọn hấp dẫn về địa danh" />
                </div>
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-desc">Mô tả đầy đủ / Nội dung câu chuyện</label>
                  <textarea id="place-desc" class="form-control" rows="4" v-model="placeForm.description" placeholder="Chi tiết về lịch sử, sự tích, nghệ thuật kiến trúc hoặc hướng dẫn tham quan..."></textarea>
                </div>
                <!-- Temporarily Hidden Local Tips and Best Time to Visit -->
                <!--
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-tip">Mẹo địa phương khi tham quan</label>
                  <input type="text" id="place-tip" class="form-control" v-model="placeForm.localTip" placeholder="Ví dụ: Điểm check-in đẹp, trang phục nghiêm chỉnh khi vào viếng..." />
                </div>
                <div class="form-group form-grid-full">
                  <label class="form-label" for="place-besttime">Thời gian lý tưởng để ghé thăm</label>
                  <input type="text" id="place-besttime" class="form-control" v-model="placeForm.bestTime" placeholder="Ví dụ: Sáng sớm hoặc Dịp lễ hội truyền thống đầu xuân" />
                </div>
                -->
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPlaceModal = false">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="modalLoading">
                {{ modalLoading ? 'Đang lưu...' : 'Lưu địa danh' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Category Dialog/Modal (Teleported to body to avoid stacking context overlapping) -->
    <Teleport to="body">
      <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
        <div class="modal-card modal-premium-card modal-sm animate-scale-up">
          <div class="modal-header">
            <h2>Thêm danh mục mới</h2>
            <button class="close-btn" @click="showCategoryModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveCategory" novalidate>
            <div class="modal-body">
              <div class="form-grid-single">
                <div class="form-group">
                  <label class="form-label" for="cat-name">Tên danh mục *</label>
                  <input type="text" id="cat-name" class="form-control" :class="{ 'has-error': formErrors.categoryName }" v-model="categoryForm.name" placeholder="Ví dụ: Di tích Lịch sử" @input="clearError('categoryName'); autoFillCategoryCode(); autoSuggestIcon()" />
                  <span v-if="formErrors.categoryName" class="form-error-msg">{{ formErrors.categoryName }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Chọn biểu tượng hiển thị (Icon) *</label>
                  
                  <!-- Search box -->
                  <div class="icon-search-wrapper">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Tìm biểu tượng (ví dụ: chùa, phở, lá, xe, camping...)" 
                      v-model="iconSearchQuery"
                      @keydown.enter.prevent
                    />
                  </div>

                  <!-- Scrollable Grid -->
                  <div class="icon-selector-scroll-container">
                    <div class="icon-selector-grid">
                      <div 
                        v-for="item in filteredIcons" 
                        :key="item.value"
                        class="icon-select-card"
                        :class="{ active: categoryForm.icon === item.value }"
                        @click="categoryForm.icon = item.value"
                      >
                        <i class="fa-solid" :class="'fa-' + item.value" style="font-size: 1.2rem; width: 24px; text-align: center; color: var(--primary);"></i>
                        <div class="icon-info">
                          <span class="icon-title" style="font-size: 0.85rem; font-weight: 500;">{{ item.label.split(' / ')[0] }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cat-desc">Mô tả danh mục</label>
                  <textarea id="cat-desc" class="form-control" rows="3" v-model="categoryForm.description" placeholder="Thông tin mô tả danh mục..."></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCategoryModal = false">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="modalLoading">
                {{ modalLoading ? 'Đang tạo...' : 'Tạo danh mục' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, type Area, type Place, type PlaceCategory } from '../../config/api';
import CustomSelect from '../../components/CustomSelect.vue';

const route = useRoute();
const router = useRouter();
const activeTab = ref('places');
const areas = ref<Area[]>([]);
const places = ref<Place[]>([]);
const categories = ref<PlaceCategory[]>([]);
const loading = ref(false);
const modalLoading = ref(false);

// Validation States
const formErrors = ref<Record<string, string>>({});
const showCategoryTooltip = ref(false);
const tooltipStyle = ref<Record<string, any>>({});

const updateTooltipPosition = () => {
  const iconEl = document.querySelector('.info-icon');
  if (iconEl) {
    const iconRect = iconEl.getBoundingClientRect();
    
    const top = iconRect.bottom + 8;
    const left = iconRect.left + (iconRect.width / 2);
    
    tooltipStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 100000
    };
  }
};

watch(showCategoryTooltip, async (newVal) => {
  if (newVal) {
    await nextTick();
    updateTooltipPosition();
    // Reposition dynamically as the modal scale-up transition completes
    setTimeout(updateTooltipPosition, 100);
    setTimeout(updateTooltipPosition, 300);
  }
});

const clearError = (field: string) => {
  if (formErrors.value[field]) {
    delete formErrors.value[field];
  }
};

// Watch for route changes to switch tabs automatically
watch(() => route.path, (newPath) => {
  if (newPath.endsWith('/areas')) {
    activeTab.value = 'areas';
  } else if (newPath.endsWith('/categories')) {
    activeTab.value = 'categories';
  } else {
    activeTab.value = 'places';
  }
}, { immediate: true });

const switchTab = (tabName: string) => {
  activeTab.value = tabName;
  if (tabName === 'areas') {
    router.push('/admin/areas');
  } else if (tabName === 'categories') {
    router.push('/admin/categories');
  } else {
    router.push('/admin');
  }
};

// Filters
const searchQuery = ref('');
const categoryFilter = ref('');
const areaSearchQuery = ref('');
const categorySearchQuery = ref('');

// Area Form States
const showAreaModal = ref(false);
const editingArea = ref<Area | null>(null);
const areaForm = ref({
  name: '',
  slug: '',
  provinceCode: 'hn',
  description: '',
  coverUrl: '',
  centerLat: 21.195,
  centerLng: 105.6775,
  defaultRadiusKm: 3,
  published: true
});

// Place Form States
const showPlaceModal = ref(false);
const editingPlace = ref<Place | null>(null);
const placeForm = ref({
  name: '',
  summary: '',
  description: '',
  categoryId: '' as string | number,
  areaId: '',
  address: '',
  latitude: 21.195,
  longitude: 105.6775,
  priceLevel: 'FREE' as 'FREE' | 'LOW' | 'MEDIUM' | 'HIGH',
  estimatedMinCost: 0,
  estimatedMaxCost: 0,
  averageVisitDurationMinutes: 60,
  coverUrl: '',
  videoUrl: '',
  audioUrl: '',
  localTip: '',
  bestTime: '',
});

// Category Modal States
const showCategoryModal = ref(false);
const categoryForm = ref({
  name: '',
  code: '',
  description: '',
  icon: 'landmark'
});

// Computed values
const publishedCount = computed(() => {
  return places.value.filter(p => p.status === 'PUBLISHED').length;
});

const activeCategories = computed(() => {
  return categories.value.filter(c => c.active !== false);
});

// CustomSelect Options mapping
const categoryFilterOptions = computed(() => {
  return [
    { value: '', label: 'Tất cả danh mục' },
    ...activeCategories.value.map(c => ({ value: c.id, label: c.name }))
  ];
});

const placeCategoryOptions = computed(() => {
  return [
    { value: '', label: '-- Không phân loại / Chọn sau --' },
    ...activeCategories.value.map(c => ({ value: c.id, label: c.name }))
  ];
});

const placeAreaOptions = computed(() => {
  return areas.value.map(a => ({ value: a.id, label: a.name }));
});

// const priceLevelOptions = [
//   { value: 'FREE', label: 'Miễn phí (FREE)' },
//   { value: 'LOW', label: 'Thấp (LOW)' },
//   { value: 'MEDIUM', label: 'Trung bình (MEDIUM)' },
//   { value: 'HIGH', label: 'Cao (HIGH)' }
// ];

const filteredPlaces = computed(() => {
  return places.value.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (place.summary && place.summary.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesCategory = !categoryFilter.value || place.categoryId === Number(categoryFilter.value);
    return matchesSearch && matchesCategory;
  });
});

const filteredAreas = computed(() => {
  return areas.value.filter(area => {
    return area.name.toLowerCase().includes(areaSearchQuery.value.toLowerCase()) ||
      (area.description && area.description.toLowerCase().includes(areaSearchQuery.value.toLowerCase()));
  });
});

const filteredCategories = computed(() => {
  return categories.value.filter(cat => {
    return cat.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase()) ||
      (cat.code && cat.code.toLowerCase().includes(categorySearchQuery.value.toLowerCase()));
  });
});

// Lifecycle
onMounted(() => {
  loadAllData();
});

const loadAllData = async () => {
  loading.value = true;
  try {
    areas.value = await api.areas.listAdmin();
    places.value = await api.places.listAdmin();
    categories.value = await api.categories.listAdmin();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

// Operations: Areas
const openAreaModal = (area?: Area) => {
  formErrors.value = {};
  if (area) {
    editingArea.value = area;
    areaForm.value = {
      name: area.name,
      slug: area.slug,
      provinceCode: area.provinceCode || 'hn',
      description: area.description || '',
      coverUrl: area.coverUrl || '',
      centerLat: Number(area.centerLat),
      centerLng: Number(area.centerLng),
      defaultRadiusKm: Number(area.defaultRadiusKm),
      published: area.published
    };
  } else {
    editingArea.value = null;
    areaForm.value = {
      name: '',
      slug: '',
      provinceCode: 'hn',
      description: '',
      coverUrl: '',
      centerLat: 21.195,
      centerLng: 105.6775,
      defaultRadiusKm: 3,
      published: true
    };
  }
  showAreaModal.value = true;
};

const saveArea = async () => {
  formErrors.value = {};
  if (!areaForm.value.name.trim()) {
    formErrors.value.areaName = 'Vui lòng nhập tên khu vực';
  }
  if (!areaForm.value.provinceCode.trim()) {
    formErrors.value.areaProvince = 'Vui lòng nhập mã Tỉnh/Thành phố';
  }
  if (areaForm.value.centerLat === undefined || areaForm.value.centerLat === null || isNaN(areaForm.value.centerLat)) {
    formErrors.value.areaLat = 'Vui lòng nhập vĩ độ tâm';
  }
  if (areaForm.value.centerLng === undefined || areaForm.value.centerLng === null || isNaN(areaForm.value.centerLng)) {
    formErrors.value.areaLng = 'Vui lòng nhập kinh độ tâm';
  }
  if (Object.keys(formErrors.value).length > 0) {
    return;
  }

  modalLoading.value = true;
  try {
    if (editingArea.value) {
      await api.request(`/admin/areas/${editingArea.value.id}`, {
        method: 'PUT',
        body: areaForm.value
      });
      alert('Cập nhật khu vực thành công!');
    } else {
      await api.request('/admin/areas', {
        method: 'POST',
        body: areaForm.value
      });
      alert('Tạo khu vực thành công!');
    }
    showAreaModal.value = false;
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi lưu khu vực.');
  } finally {
    modalLoading.value = false;
  }
};

const deleteArea = async (area: Area) => {
  if (confirm(`Bạn có chắc chắn muốn xóa khu vực "${area.name}"? Khu vực này phải không được chứa địa danh nào.`)) {
    try {
      await api.request(`/admin/areas/${area.id}`, {
        method: 'DELETE'
      });
      alert('Đã xóa khu vực!');
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Lỗi khi xóa khu vực.');
    }
  }
};

// Operations: Places
const openPlaceModal = (place?: Place) => {
  formErrors.value = {};
  if (place) {
    editingPlace.value = place;
    placeForm.value = {
      name: place.name,
      summary: place.summary || '',
      description: place.description || '',
      categoryId: place.categoryId || '',
      areaId: place.areaId || '',
      address: place.address || '',
      latitude: place.latitude ? Number(place.latitude) : 21.195,
      longitude: place.longitude ? Number(place.longitude) : 105.6775,
      priceLevel: place.priceLevel || 'FREE',
      estimatedMinCost: place.estimatedMinCost || 0,
      estimatedMaxCost: place.estimatedMaxCost || 0,
      averageVisitDurationMinutes: place.averageVisitDurationMinutes || 60,
      coverUrl: place.coverUrl || '',
      videoUrl: place.videoUrl || '',
      audioUrl: place.audioUrl || '',
      localTip: place.localTip || '',
      bestTime: place.bestTime || '',
    };
    showCategoryTooltip.value = false;
  } else {
    editingPlace.value = null;
    placeForm.value = {
      name: '',
      summary: '',
      description: '',
      categoryId: '',
      areaId: areas.value.find(a => a.slug === 'tien-thang')?.id || areas.value[0]?.id || '',
      address: '',
      latitude: 21.195,
      longitude: 105.6775,
      priceLevel: 'FREE',
      estimatedMinCost: 0,
      estimatedMaxCost: 0,
      averageVisitDurationMinutes: 60,
      coverUrl: '',
      videoUrl: '',
      audioUrl: '',
      localTip: '',
      bestTime: '',
    };
    showCategoryTooltip.value = false;
  }
  showPlaceModal.value = true;
};

const savePlace = async () => {
  formErrors.value = {};
  if (!placeForm.value.name.trim()) {
    formErrors.value.placeName = 'Vui lòng nhập tên địa danh';
  }
  if (!placeForm.value.areaId) {
    formErrors.value.placeArea = 'Vui lòng chọn khu vực bản đồ';
  }
  if (placeForm.value.latitude === undefined || placeForm.value.latitude === null || isNaN(placeForm.value.latitude)) {
    formErrors.value.placeLat = 'Vui lòng nhập vĩ độ';
  }
  if (placeForm.value.longitude === undefined || placeForm.value.longitude === null || isNaN(placeForm.value.longitude)) {
    formErrors.value.placeLng = 'Vui lòng nhập kinh độ';
  }
  if (Object.keys(formErrors.value).length > 0) {
    return;
  }

  modalLoading.value = true;
  try {
    const payload = {
      ...placeForm.value,
      categoryId: placeForm.value.categoryId ? Number(placeForm.value.categoryId) : undefined,
      latitude: placeForm.value.latitude ? Number(placeForm.value.latitude) : undefined,
      longitude: placeForm.value.longitude ? Number(placeForm.value.longitude) : undefined,
      estimatedMinCost: placeForm.value.estimatedMinCost ? Number(placeForm.value.estimatedMinCost) : undefined,
      estimatedMaxCost: placeForm.value.estimatedMaxCost ? Number(placeForm.value.estimatedMaxCost) : undefined,
      averageVisitDurationMinutes: placeForm.value.averageVisitDurationMinutes ? Number(placeForm.value.averageVisitDurationMinutes) : undefined,
    };
    
    if (editingPlace.value) {
      await api.places.update(editingPlace.value.id, payload);
      alert('Cập nhật thông tin địa danh thành công!');
    } else {
      await api.places.create(payload);
      alert('Tạo địa danh mới thành công ở dạng BẢN NHÁP!');
    }
    showPlaceModal.value = false;
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi lưu địa danh.');
  } finally {
    modalLoading.value = false;
  }
};

const allAvailableIcons = [
  // Kiến trúc / Di tích
  { value: 'landmark', label: 'Đền chùa / Đình miếu / Di tích cổ kính', cat: 'Kiến trúc / Tâm linh' },
  { value: 'archway', label: 'Cổng chào / Cổng làng / Di tích lịch sử', cat: 'Kiến trúc' },
  { value: 'monument', label: 'Tượng đài / Bia đá / Lịch sử danh nhân', cat: 'Lịch sử' },
  { value: 'museum', label: 'Bảo tàng / Nhà triển lãm / Trưng bày', cat: 'Lịch sử / Văn hóa' },
  
  // Ẩm thực
  { value: 'utensils', label: 'Nhà hàng / Quán ăn / Đặc sản ẩm thực / Ăn uống', cat: 'Ẩm thực' },
  { value: 'mug-hot', label: 'Quán cà phê / Trà sữa / Tiệm đồ uống', cat: 'Ẩm thực' },
  
  // Văn hóa / Lễ hội
  { value: 'masks-theater', label: 'Làng nghề / Văn hóa truyền thống / Nghệ thuật', cat: 'Văn hóa' },
  { value: 'calendar-days', label: 'Lễ hội / Sự kiện / Hội làng', cat: 'Văn hóa' },
  
  // Thiên nhiên / Sinh thái
  { value: 'seedling', label: 'Vườn tược / Trang trại / Nông nghiệp sinh thái', cat: 'Sinh thái' },
  { value: 'mountain', label: 'Núi non / Hang động / Thác nước / Phong cảnh tự nhiên', cat: 'Sinh thái' },
  { value: 'water', label: 'Sông ngòi / Ao hồ / Suối nguồn / Phong cảnh nước', cat: 'Sinh thái' },
  { value: 'campground', label: 'Điểm cắm trại / Camping / Dã ngoại ngoài trời', cat: 'Sinh thái' },
  
  // Lưu trú / Tiện ích du lịch
  { value: 'hotel', label: 'Khách sạn / Homestay / Nhà nghỉ / Cơ sở lưu trú', cat: 'Tiện ích' },
  { value: 'store', label: 'Cửa hàng / Mua sắm lưu niệm / Chợ địa phương', cat: 'Tiện ích' },
  { value: 'camera', label: 'Điểm check-in / Phong cảnh đẹp / Chụp ảnh lưu niệm', cat: 'Địa danh' }
];

const iconSearchQuery = ref('');

const filteredIcons = computed(() => {
  const q = iconSearchQuery.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!q) return allAvailableIcons;
  return allAvailableIcons.filter(item => {
    const labelClean = item.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const valClean = item.value.toLowerCase();
    const catClean = item.cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return labelClean.includes(q) || valClean.includes(q) || catClean.includes(q);
  });
});

const autoSuggestIcon = () => {
  const name = categoryForm.value.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (name.includes('kien truc') || name.includes('chua') || name.includes('dinh') || name.includes('nha co') || name.includes('mieu') || name.includes('den')) {
    categoryForm.value.icon = 'landmark';
  } else if (name.includes('am thuc') || name.includes('an uong') || name.includes('dac san') || name.includes('quan') || name.includes('dua')) {
    categoryForm.value.icon = 'utensils';
  } else if (name.includes('lich su') || name.includes('di tich') || name.includes('bao tang') || name.includes('tuong dai') || name.includes('co kinh') || name.includes('xua') || name.includes('ngoai xam')) {
    categoryForm.value.icon = 'book';
  } else if (name.includes('van hoa') || name.includes('lang nghe') || name.includes('phong tuc') || name.includes('dan gian') || name.includes('truyen thong')) {
    categoryForm.value.icon = 'masks-theater';
  } else if (name.includes('le hoi') || name.includes('su kien') || name.includes('hoi lang') || name.includes('trung thu')) {
    categoryForm.value.icon = 'calendar-days';
  } else if (name.includes('thien nhien') || name.includes('sinh thai') || name.includes('nong nghiep') || name.includes('dua luoi') || name.includes('vuon') || name.includes('cay') || name.includes('trang trai')) {
    categoryForm.value.icon = 'leaf';
  } else if (name.includes('giai tri') || name.includes('trai nghiem') || name.includes('hoat dong') || name.includes('choi') || name.includes('dap xe')) {
    categoryForm.value.icon = 'bicycle';
  }
};

// Operations: Categories
const openCategoryModal = () => {
  formErrors.value = {};
  iconSearchQuery.value = '';
  categoryForm.value = {
    name: '',
    code: '',
    description: '',
    icon: 'landmark'
  };
  showCategoryModal.value = true;
};

const autoFillCategoryCode = () => {
  categoryForm.value.code = categoryForm.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
};

const coverFileInput = ref<HTMLInputElement | null>(null);
const videoFileInput = ref<HTMLInputElement | null>(null);

const uploadMediaFile = async (event: Event, field: 'coverUrl' | 'videoUrl') => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  modalLoading.value = true;
  try {
    const result = await api.upload.file(file);
    if (field === 'coverUrl') {
      placeForm.value.coverUrl = result.url;
    } else if (field === 'videoUrl') {
      placeForm.value.videoUrl = result.url;
    }
    alert('Tải file lên thành công!');
  } catch (error: any) {
    alert(error.message || 'Lỗi khi tải file lên.');
  } finally {
    modalLoading.value = false;
    target.value = '';
  }
};

const saveCategory = async () => {
  formErrors.value = {};
  if (!categoryForm.value.name.trim()) {
    formErrors.value.categoryName = 'Vui lòng nhập tên danh mục';
  }
  if (Object.keys(formErrors.value).length > 0) {
    return;
  }

  modalLoading.value = true;
  try {
    const code = categoryForm.value.code.trim() || undefined;
    await api.categories.create(
      categoryForm.value.name,
      code,
      categoryForm.value.description,
      categoryForm.value.icon
    );
    alert('Tạo danh mục mới thành công!');
    showCategoryModal.value = false;
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi tạo danh mục.');
  } finally {
    modalLoading.value = false;
  }
};

const toggleCategoryStatus = async (cat: PlaceCategory, active: boolean) => {
  try {
    await api.categories.updateStatus(cat.id, active);
    alert(`Đã ${active ? 'hoạt động lại' : 'ẩn'} danh mục "${cat.name}" thành công!`);
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi cập nhật trạng thái danh mục.');
  }
};

const deletePlace = async (place: Place) => {
  if (confirm(`Bạn có chắc muốn xóa địa danh "${place.name}"?`)) {
    try {
      await api.places.delete(place.id);
      alert('Xóa địa danh thành công!');
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Lỗi khi xóa địa danh.');
    }
  }
};

const publishPlace = async (place: Place) => {
  try {
    await api.places.publish(place.id);
    alert(`Công bố "${place.name}" thành công!`);
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi công bố địa danh. Đảm bảo đã thiết lập Danh mục, Vùng bản đồ, và Tọa độ GPS đầy đủ.');
  }
};

const unpublishPlace = async (place: Place) => {
  try {
    await api.places.unpublish(place.id);
    alert(`Đã hạ địa danh "${place.name}" (chuyển lại về BẢN NHÁP).`);
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi hạ trạng thái địa danh.');
  }
};
</script>

<style scoped>
/* Premium High-Density Design */
.admin-dashboard {
  max-width: 1240px;
  margin: 0 auto;
  padding: 4px 0;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Premium micro buttons */
.btn-premium {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #ffffff;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  border: none;
}
.btn-premium:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
}

.btn-premium-secondary {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: var(--radius-md);
}
.btn-premium-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: rgba(99, 102, 241, 0.04);
}

.btn-xs {
  padding: 4px 8px;
  font-size: 0.775rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
}

/* Stats Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent 50%);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px -12px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.stat-icon.icon-areas {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary);
}

.stat-icon.icon-places {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.icon-routes {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.icon-categories {
  background-color: rgba(168, 85, 247, 0.1);
  color: var(--secondary);
}

.stat-label {
  font-size: 0.725rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  margin-top: 2px;
  color: var(--text-primary);
  line-height: 1.2;
}

/* Tabs Bar */
.tabs-bar {
  display: inline-flex;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 4px;
  border-radius: var(--radius-xl);
  margin-bottom: 24px;
  gap: 4px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 8px 18px;
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-size: 0.85rem;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
}

/* Table card UI */
.table-card {
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.04);
  background-color: var(--bg-card);
}

.table-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.01);
}

.table-header h2 {
  font-size: 1.15rem;
  font-weight: 800;
}

.search-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.select-filter {
  padding: 8px 12px;
  font-size: 0.825rem;
  min-width: 150px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 500;
}

.search-box input {
  padding: 8px 12px;
  font-size: 0.825rem;
  min-width: 200px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.search-box input:focus,
.select-filter:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 12px 20px;
  border-bottom: 2px solid var(--border-color);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.725rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  background-color: rgba(99, 102, 241, 0.02);
  vertical-align: middle;
}

.data-table td {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--text-primary);
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background-color var(--transition-fast);
}

.data-table tbody tr:hover {
  background-color: rgba(99, 102, 241, 0.012);
}

.empty-cell {
  text-align: center;
  padding: 40px !important;
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.85rem;
}

/* Explicit Width columns to prevent wrapping & align grid lines */
.col-stt, .col-slug, .col-category, .col-area, .col-coords, .col-status, .col-actions {
  width: 1%;
  white-space: nowrap;
}

.area-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.place-thumb {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.area-icon {
  font-size: 1.1rem;
  width: 36px;
  height: 36px;
  background-color: var(--primary-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.area-desc-short {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
  font-weight: 400;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-badge {
  display: inline-block;
  padding: 3px 10px;
  background-color: rgba(99, 102, 241, 0.06);
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.area-text-badge {
  font-weight: 600;
  color: var(--text-secondary);
}

.coordinate-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  background-color: rgba(0,0,0,0.03);
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  white-space: nowrap;
}

.slug-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  color: var(--secondary);
  white-space: nowrap;
}

/* Status Badges with glowing dots */
.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.badge-status.published {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-status.published::before {
  content: '';
  width: 5px;
  height: 5px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
}

.badge-status.draft {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.badge-status.draft::before {
  content: '';
  width: 5px;
  height: 5px;
  background-color: #f59e0b;
  border-radius: 50%;
  box-shadow: 0 0 6px #f59e0b;
}

.badge-status.hidden {
  background-color: var(--border-color);
  color: var(--text-secondary);
}

.badge-status.hidden::before {
  content: '';
  width: 5px;
  height: 5px;
  background-color: var(--text-muted);
  border-radius: 50%;
}

.actions-header {
  text-align: right;
}

.actions-cell {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
}

.btn-action {
  font-weight: 700;
}

.btn-edit {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}
.btn-edit:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-color: var(--border-hover);
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.06);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.12);
}
.btn-delete:hover {
  background-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 3px 8px rgba(239, 68, 68, 0.15);
}

/* Modals & Premium Glass Overlays */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(9, 13, 22, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
}

.modal-card.modal-premium-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 780px;
  max-height: 85vh;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-card.modal-premium-card form {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  max-height: 100%;
}

.modal-card.modal-sm {
  max-width: 720px;
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.01);
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 24px; /* Reverted to standard padding */
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.01);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* Animations */
.animate-slide-down {
  animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-up {
  animation: scale-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Form Styles inside Modal */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}

.form-grid-full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-control {
  padding: 8px 12px;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-family: var(--font-body);
  transition: all var(--transition-fast);
}

.form-control:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
}

.checkbox-group {
  margin-top: 4px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.checkbox-group input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

.category-warning {
  font-size: 0.75rem;
  color: #d97706; /* warm yellow */
  font-weight: 500;
  margin-top: 2px;
  line-height: 1.4;
}

.form-grid-single {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .table-header {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
  }
  .search-filters {
    flex-direction: column;
  }
  .data-table th, 
  .data-table td {
    padding: 10px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-grid-full {
    grid-column: span 1;
  }
  .actions-cell {
    flex-direction: column;
    align-items: stretch;
  }
}

.input-upload-group {
  display: flex;
  gap: 8px;
}
.input-upload-group .form-control {
  flex: 1;
}
.btn-upload {
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-search-wrapper {
  margin-bottom: 8px;
}
.icon-selector-scroll-container {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.05);
}
.icon-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
}
.icon-select-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-fast);
  background-color: var(--bg-card);
}
.icon-select-card:hover {
  border-color: var(--primary);
  background-color: var(--primary-light);
}
.icon-select-card.active {
  border-color: var(--primary);
  background-color: var(--primary-light);
  box-shadow: 0 0 0 2px var(--primary);
}
.icon-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.icon-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
