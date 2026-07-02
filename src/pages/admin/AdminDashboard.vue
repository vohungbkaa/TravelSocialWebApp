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
      <button class="tab-btn" :class="{ active: activeTab === 'areas' }" @click="switchTab('areas')">
        Khu vực bản đồ
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'places' }" @click="switchTab('places')">
        Danh sách địa danh
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
              <th class="col-status">Trạng thái</th>
              <th class="col-actions actions-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAreas.length === 0">
              <td colspan="3" class="empty-cell">Không tìm thấy khu vực nào.</td>
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
              <td class="col-status">
                <span class="badge-status" :class="area.published ? 'published' : 'draft'">
                  {{ area.published ? 'ĐÃ CÔNG BỐ' : 'BẢN NHÁP' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <router-link :to="`/${area.provinceCode || 'hanoi'}/${area.slug}`" class="btn btn-secondary btn-xs btn-action" target="_blank">
                    Xem bản đồ
                  </router-link>
                  <button class="btn btn-secondary btn-xs btn-edit" @click="openAreaModal(area)">
                    Sửa
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
                  <input type="text" id="area-province" class="form-control" :class="{ 'has-error': formErrors.areaProvince }" v-model="areaForm.provinceCode" placeholder="Ví dụ: hanoi" @input="clearError('areaProvince')" />
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
        <div id="place-modal-card" class="modal-card modal-premium-card modal-max-split animate-scale-up">
          <div class="modal-header">
            <h2>{{ editingPlace ? 'Chỉnh sửa địa danh du lịch' : 'Tạo địa danh mới' }}</h2>
            <button class="close-btn" @click="showPlaceModal = false">&times;</button>
          </div>
          <form @submit.prevent="savePlace" @click="showCategoryTooltip = false" novalidate>
            <div class="modal-body split-modal-body" @scroll="updateTooltipPosition">
              <!-- Left side: Form Inputs (Scrollable) -->
              <div class="modal-form-column">
                <div class="form-grid">
                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-name">Tên địa danh <span class="required-star">*</span></label>
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
                    <label class="form-label" for="place-area">Khu vực bản đồ <span class="required-star">*</span></label>
                    <CustomSelect
                      v-model="placeForm.areaId"
                      :options="placeAreaOptions"
                      placeholder="Chọn khu vực"
                      :has-error="!!formErrors.placeArea"
                      @change="clearError('placeArea')"
                    />
                    <span v-if="formErrors.placeArea" class="form-error-msg">{{ formErrors.placeArea }}</span>
                  </div>
                  <div class="form-group form-grid-full marker-override-section">
                    <label class="form-label" for="place-marker-icon">Icon hiển thị trên bản đồ</label>
                    <div class="marker-preview-row place-marker-preview">
                      <div class="marker-preview" :style="{ backgroundColor: effectivePlaceMarkerIcon?.markerColor || '#6366f1' }">
                        <img
                          :src="effectivePlaceMarkerIcon?.iconUrl || defaultMarkerIconUrl"
                          :class="{ 'uploaded-marker-image': isUploadedMarkerImage(effectivePlaceMarkerIcon?.iconUrl || defaultMarkerIconUrl) }"
                          alt=""
                        />
                      </div>
                      <div class="marker-preview-copy">
                        <strong>{{ effectivePlaceMarkerIcon?.name || 'Theo danh mục' }}</strong>
                        <span>{{ placeForm.markerIconId ? 'Icon riêng cho địa danh này.' : 'Để trống để dùng icon mặc định của danh mục.' }}</span>
                      </div>
                    </div>
                    <div class="place-marker-picker">
                      <button
                        type="button"
                        class="place-marker-option"
                        :class="{ active: !placeForm.markerIconId }"
                        @click="placeForm.markerIconId = ''"
                      >
                        Theo danh mục
                      </button>
                      <button
                        v-for="icon in markerIcons"
                        :key="icon.id"
                        type="button"
                        class="place-marker-icon-card"
                        :class="{ active: Number(placeForm.markerIconId) === icon.id }"
                        @click="placeForm.markerIconId = icon.id"
                        :title="icon.name"
                      >
                        <span class="icon-color-dot" :style="{ backgroundColor: icon.markerColor }"></span>
                        <img :src="icon.iconUrl" :class="{ 'uploaded-marker-image': isUploadedMarkerImage(icon.iconUrl) }" alt="" />
                        <span>{{ icon.name }}</span>
                      </button>
                    </div>
                    <div class="place-marker-upload-row">
                      <button type="button" class="btn btn-secondary btn-upload" :disabled="modalLoading" @click="markerIconFileInput?.click()">
                        Tải ảnh marker
                      </button>
                      <input type="file" ref="markerIconFileInput" style="display: none" accept="image/*,.svg" @change="uploadPlaceMarkerIcon" />
                      <span>Ảnh upload sẽ được lưu thành icon riêng và chọn cho địa danh này.</span>
                    </div>
                  </div>
                  
                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-address">Địa chỉ <span class="required-star">*</span></label>
                    <div class="input-upload-group">
                      <input 
                        type="text" 
                        id="place-address" 
                        class="form-control" 
                        :class="{ 'has-error': formErrors.placeAddress }"
                        v-model="placeForm.address" 
                        placeholder="Ví dụ: Thôn Bạch Trữ, Xã Tiến Thắng, Mê Linh" 
                        @input="clearError('placeAddress')"
                      />
                      <button 
                        type="button" 
                        class="btn-geocode-search" 
                        @click="triggerGeocode" 
                        :disabled="isGeocoding"
                      >
                        <i class="fa-solid" :class="isGeocoding ? 'fa-spinner fa-spin' : 'fa-magnifying-glass-location'"></i>
                        {{ isGeocoding ? 'Đang tìm...' : 'Tìm tọa độ' }}
                      </button>
                    </div>
                    <span v-if="formErrors.placeAddress" class="form-error-msg">
                      {{ formErrors.placeAddress }}
                    </span>
                    <span v-if="geocodeMessage" :class="geocodeMessageType === 'error' ? 'form-error-msg' : 'form-success-msg'">
                      {{ geocodeMessage }}
                    </span>
                  </div>



                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-cover">Đường dẫn ảnh bìa</label>
                    <div class="input-upload-group">
                      <input type="text" id="place-cover" class="form-control" v-model="placeForm.coverUrl" placeholder="https://example.com/image.jpg" />
                      <button type="button" class="btn btn-secondary btn-upload" @click="coverFileInput?.click()">
                        📁 Tải ảnh
                      </button>
                      <input type="file" ref="coverFileInput" style="display: none" accept="image/*" @change="e => uploadMediaFile(e, 'coverUrl')" />
                    </div>
                  </div>
                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-video">Đường dẫn Video giới thiệu (YouTube/Vimeo)</label>
                    <div class="input-upload-group">
                      <input type="text" id="place-video" class="form-control" v-model="placeForm.videoUrl" placeholder="Ví dụ: https://www.youtube.com/watch?v=..." />
                      <button type="button" class="btn btn-secondary btn-upload" @click="videoFileInput?.click()">
                        📁 Tải video
                      </button>
                      <input type="file" ref="videoFileInput" style="display: none" accept="video/*" @change="e => uploadMediaFile(e, 'videoUrl')" />
                    </div>
                  </div>

                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-summary">Tóm tắt ngắn gọn (Tối đa 500 ký tự) <span class="required-star">*</span></label>
                    <input type="text" id="place-summary" class="form-control" v-model="placeForm.summary" required placeholder="Một câu giới thiệu ngắn gọn hấp dẫn về địa danh" />
                  </div>
                  <div class="form-group form-grid-full">
                    <label class="form-label" for="place-desc">Mô tả đầy đủ / Nội dung câu chuyện</label>
                    <textarea id="place-desc" class="form-control" rows="12" v-model="placeForm.description" placeholder="Chi tiết về lịch sử, sự tích, nghệ thuật kiến trúc hoặc hướng dẫn tham quan..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Right side: Sticky interactive map -->
              <div class="modal-map-column">
                <label class="form-label">Chọn vị trí trực tiếp trên bản đồ <span class="required-star">*</span></label>
                <div class="modal-map-wrapper-split" :class="{ 'map-has-error': formErrors.placeCoords }">
                  <div ref="modalMapEl" class="modal-map-frame-split"></div>
                  <span class="modal-map-tip">
                    💡 Click chuột hoặc kéo thả ghim xanh trên bản đồ để xác định vị trí của địa danh.
                  </span>
                </div>
                <span v-if="formErrors.placeCoords" class="form-error-msg" style="margin-top: 8px; font-weight: 600; display: block;">
                  ⚠️ {{ formErrors.placeCoords }}
                </span>
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
                  <input type="text" id="cat-name" class="form-control" :class="{ 'has-error': formErrors.categoryName }" v-model="categoryForm.name" placeholder="Ví dụ: Di tích Lịch sử" @input="clearError('categoryName'); autoFillCategoryCode()" />
                  <span v-if="formErrors.categoryName" class="form-error-msg">{{ formErrors.categoryName }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Biểu tượng marker *</label>
                  <div class="marker-preview-row">
                    <div class="marker-preview" :style="{ backgroundColor: selectedMarkerIcon?.markerColor || '#6366f1' }">
                      <img :src="selectedMarkerIcon?.iconUrl || defaultMarkerIconUrl" alt="" />
                    </div>
                    <div class="marker-preview-copy">
                      <strong>{{ selectedMarkerIcon?.name || 'Chưa chọn biểu tượng' }}</strong>
                      <span>Chọn một biểu tượng bên dưới. Màu marker lấy theo cấu hình trong hệ thống.</span>
                    </div>
                  </div>

                  <button type="button" class="btn btn-secondary btn-inline-action" @click="showMarkerIconForm = !showMarkerIconForm">
                    {{ showMarkerIconForm ? 'Ẩn form thêm biểu tượng' : 'Thêm biểu tượng marker' }}
                  </button>

                  <div v-if="showMarkerIconForm" class="marker-icon-form">
                    <div class="form-grid-2">
                      <div class="form-group">
                        <label class="form-label" for="marker-icon-name">Tên biểu tượng *</label>
                        <input id="marker-icon-name" type="text" class="form-control" v-model="markerIconForm.name" placeholder="Ví dụ: Làng nghề" />
                      </div>
                      <div class="form-group">
                        <label class="form-label" for="marker-icon-key">Mã biểu tượng *</label>
                        <input id="marker-icon-key" type="text" class="form-control" v-model="markerIconForm.key" placeholder="Ví dụ: workshop" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="marker-icon-url">Đường dẫn SVG/icon *</label>
                      <input id="marker-icon-url" type="text" class="form-control" v-model="markerIconForm.iconUrl" placeholder="https://api.iconify.design/lucide:hammer.svg?color=%23ffffff" />
                    </div>
                    <div class="marker-icon-form-footer">
                      <input type="color" class="marker-color-input" v-model="markerIconForm.markerColor" aria-label="Chọn màu marker" />
                      <button type="button" class="btn btn-primary" :disabled="modalLoading" @click="saveMarkerIcon">
                        Lưu biểu tượng
                      </button>
                    </div>
                    <span v-if="formErrors.markerIcon" class="form-error-msg">{{ formErrors.markerIcon }}</span>
                  </div>
                  
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
                        :key="item.id"
                        class="icon-select-card"
                        :class="{ active: categoryForm.markerIconId === item.id }"
                        @click="setCategoryIcon(item)"
                      >
                        <span class="icon-color-dot" :style="{ backgroundColor: item.markerColor }"></span>
                        <img :src="item.iconUrl" class="icon-select-img" alt="" />
                        <div class="icon-info">
                          <span class="icon-title" style="font-size: 0.85rem; font-weight: 500;">{{ item.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span v-if="formErrors.categoryIcon" class="form-error-msg">{{ formErrors.categoryIcon }}</span>
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
import { ref, shallowRef, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, type Area, type Place, type PlaceCategory, type MarkerIcon } from '../../config/api';
import CustomSelect from '../../components/CustomSelect.vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG } from '../../config/map';

const route = useRoute();
const router = useRouter();
const activeTab = ref('places');
const areas = ref<Area[]>([]);
const places = ref<Place[]>([]);
const categories = ref<PlaceCategory[]>([]);
const markerIcons = ref<MarkerIcon[]>([]);
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
  provinceCode: 'hanoi',
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
  markerIconId: '' as string | number,
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
const showMarkerIconForm = ref(false);
const categoryForm = ref({
  name: '',
  code: '',
  description: '',
  icon: '',
  iconUrl: '',
  markerColor: '',
  markerIconId: '' as number | ''
});
const markerIconForm = ref({
  key: '',
  name: '',
  iconUrl: '',
  markerColor: '#6366f1'
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

const selectedPlaceCategory = computed(() => {
  if (!placeForm.value.categoryId) {
    return null;
  }
  return categories.value.find(category => category.id === Number(placeForm.value.categoryId)) || null;
});

const effectivePlaceMarkerIcon = computed(() => {
  if (placeForm.value.markerIconId) {
    return markerIcons.value.find(icon => icon.id === Number(placeForm.value.markerIconId)) || null;
  }

  return selectedPlaceCategory.value?.markerIcon || null;
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
    markerIcons.value = await api.markerIcons.list();
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
      provinceCode: area.provinceCode || 'hanoi',
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
      provinceCode: 'hanoi',
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
      markerIconId: place.markerIconId || '',
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
      markerIconId: '',
      areaId: areas.value[0]?.id || '',
      address: '',
      latitude: null as any,
      longitude: null as any,
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
  geocodeMessage.value = '';
  isGeocoding.value = false;
  showPlaceModal.value = true;
};

const isGeocoding = ref(false);
const geocodeMessage = ref('');
const geocodeMessageType = ref<'success' | 'error'>('success');

const modalMap = shallowRef<maplibregl.Map | null>(null);
const modalMarker = shallowRef<maplibregl.Marker | null>(null);
const modalMapEl = ref<HTMLElement | null>(null);

const isUploadedMarkerImage = (iconUrl?: string | null) => {
  if (!iconUrl) return false;
  return iconUrl.startsWith('/media/') || iconUrl.startsWith('/uploads/') || /\/media\/|\/uploads\//i.test(iconUrl);
};

const createPlaceMarkerElement = () => {
  const markerIcon = effectivePlaceMarkerIcon.value;
  const markerColor = markerIcon?.markerColor || '#6366f1';
  const iconUrl = markerIcon?.iconUrl || defaultMarkerIconUrl;
  const iconClass = isUploadedMarkerImage(iconUrl) ? 'uploaded-marker-image' : '';
  const el = document.createElement('div');
  el.className = 'admin-map-marker-wrapper';
  el.innerHTML = `
    <div class="admin-map-pin" style="--marker-color: ${markerColor}">
      <span class="admin-map-pin-inner">
        <img class="${iconClass}" src="${iconUrl}" alt="" aria-hidden="true" />
      </span>
    </div>
  `;
  return el;
};

const attachModalMarkerDragHandler = () => {
  modalMarker.value?.on('dragend', () => {
    const lngLat = modalMarker.value?.getLngLat();
    if (lngLat) {
      const roundedLat = parseFloat(lngLat.lat.toFixed(6));
      const roundedLng = parseFloat(lngLat.lng.toFixed(6));

      placeForm.value.latitude = roundedLat;
      placeForm.value.longitude = roundedLng;

      clearError('placeCoords');
      geocodeMessage.value = '';
    }
  });
};

const setModalMarker = (markerLng: number, markerLat: number) => {
  if (!modalMap.value) return;

  if (modalMarker.value) {
    modalMarker.value.setLngLat([markerLng, markerLat]);
    return;
  }

  modalMarker.value = new maplibregl.Marker({
    element: createPlaceMarkerElement(),
    draggable: true,
    anchor: 'bottom',
  })
    .setLngLat([markerLng, markerLat])
    .addTo(modalMap.value);

  attachModalMarkerDragHandler();
};

const refreshModalMarkerIcon = () => {
  if (!modalMap.value || !modalMarker.value) return;

  const lngLat = modalMarker.value.getLngLat();
  modalMarker.value.remove();
  modalMarker.value = new maplibregl.Marker({
    element: createPlaceMarkerElement(),
    draggable: true,
    anchor: 'bottom',
  })
    .setLngLat(lngLat)
    .addTo(modalMap.value);

  attachModalMarkerDragHandler();
};

const getPaddedBounds = (bounds: [[number, number], [number, number]], padding: number = 0.05) => {
  const [[west, south], [east, north]] = bounds;
  const latPadding = (north - south) * padding;
  const lngPadding = (east - west) * padding;
  return [
    [west - lngPadding, south - latPadding],
    [east + lngPadding, north + latPadding]
  ] as [[number, number], [number, number]];
};

const getSelectedPlaceArea = () => {
  return areas.value.find(area => area.id === placeForm.value.areaId) || areas.value[0];
};

const getAreaFallbackBounds = (area: Area): [[number, number], [number, number]] => {
  const lat = Number(area.centerLat);
  const lng = Number(area.centerLng);
  const radius = Number(area.defaultRadiusKm) || 3;
  const latDiff = radius / 111.0;
  const lngDiff = radius / (111.0 * Math.cos(lat * Math.PI / 180.0));
  return [
    [lng - lngDiff, lat - latDiff],
    [lng + lngDiff, lat + latDiff],
  ];
};

const initModalMap = async () => {
  await nextTick();
  if (!modalMapEl.value) return;

  const selectedArea = getSelectedPlaceArea();
  let areaBoundary: any | undefined;
  let areaBounds: [[number, number], [number, number]] | undefined;
  let areaCenter: [number, number] | undefined;
  let areaZoom = 13;

  if (selectedArea) {
    areaCenter = [Number(selectedArea.centerLng), Number(selectedArea.centerLat)];
    areaBounds = getAreaFallbackBounds(selectedArea);
    try {
      const mapConfig = await api.areas.getMapConfig(selectedArea.slug);
      areaBoundary = mapConfig.boundaryGeoJson;
      areaBounds = mapConfig.bounds || areaBounds;
      areaCenter = mapConfig.center || areaCenter;
      areaZoom = mapConfig.zoom || areaZoom;
    } catch (error) {
      console.error('Failed to load modal map config from backend:', error);
    }
  }

  const hasCoords = placeForm.value.latitude && placeForm.value.longitude;
  const lat = hasCoords ? placeForm.value.latitude : (areaCenter?.[1] || 21.195);
  const lng = hasCoords ? placeForm.value.longitude : (areaCenter?.[0] || 105.6775);

  const bounds = areaBounds ? getPaddedBounds(areaBounds) : undefined;

  try {
    modalMap.value = new maplibregl.Map({
      container: modalMapEl.value,
      style: MAP_CONFIG.styleUrl,
      center: [lng, lat],
      zoom: areaZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      maxBounds: bounds,
      attributionControl: false
    });

    modalMap.value.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    modalMap.value.on('load', async () => {
      if (!modalMap.value) return;

      // 1. Add boundary GeoJSON from tenant-aware backend config.
      try {
        const boundaryData = areaBoundary;
        if (boundaryData) {

          modalMap.value.addSource('area-boundary', {
            type: 'geojson',
            data: boundaryData
          });
          
          modalMap.value.addLayer({
            id: 'area-boundary-fill',
            type: 'fill',
            source: 'area-boundary',
            paint: {
              'fill-color': '#10b981',
              'fill-opacity': 0.01
            }
          });
          
          modalMap.value.addLayer({
            id: 'area-boundary-line',
            type: 'line',
            source: 'area-boundary',
            paint: {
              'line-color': '#10b981',
              'line-width': 2.5,
              'line-opacity': 0.9,
              'line-dasharray': [2, 2]
            }
          });

          // Inverted mask to fade out surrounding areas
          const outerRing = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
          let maskCoordinates: any[] = [outerRing];
          
          if (boundaryData.geometry.type === 'Polygon') {
            boundaryData.geometry.coordinates.forEach((ring: any) => {
              maskCoordinates.push(ring);
            });
          } else if (boundaryData.geometry.type === 'MultiPolygon') {
            boundaryData.geometry.coordinates.forEach((polygon: any) => {
              polygon.forEach((ring: any) => {
                maskCoordinates.push(ring);
              });
            });
          }

          const maskGeoJson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: maskCoordinates
            }
          };

          modalMap.value.addSource('area-boundary-mask', {
            type: 'geojson',
            data: maskGeoJson
          });

          modalMap.value.addLayer({
            id: 'area-boundary-mask-fill',
            type: 'fill',
            source: 'area-boundary-mask',
            paint: {
              'fill-color': '#f8f7f2',
              'fill-opacity': 1.0
            }
          });
        }
      } catch (err) {
        console.error('Failed to load boundary geojson in modal map:', err);
      }

      // Helper function to create or update the marker
      const updateMarkerPosition = (markerLng: number, markerLat: number) => {
        setModalMarker(markerLng, markerLat);
      };

      // 2. Add marker initially only if coordinates are already set
      if (hasCoords) {
        updateMarkerPosition(lng, lat);
      }

      // On click map: move/add marker and update coordinates
      modalMap.value.on('click', (e: any) => {
        const { lng: clickLng, lat: clickLat } = e.lngLat;
        const roundedLat = parseFloat(clickLat.toFixed(6));
        const roundedLng = parseFloat(clickLng.toFixed(6));

        placeForm.value.latitude = roundedLat;
        placeForm.value.longitude = roundedLng;
        
        updateMarkerPosition(roundedLng, roundedLat);
        clearError('placeCoords');
        geocodeMessage.value = '';
      });
    });

  } catch (error) {
    console.error('Failed to initialize modal map:', error);
  }
};

const destroyModalMap = () => {
  if (modalMarker.value) {
    modalMarker.value.remove();
    modalMarker.value = null;
  }
  if (modalMap.value) {
    modalMap.value.remove();
    modalMap.value = null;
  }
};

watch(showPlaceModal, (newVal) => {
  if (newVal) {
    initModalMap();
  } else {
    destroyModalMap();
  }
});

watch([() => placeForm.value.latitude, () => placeForm.value.longitude], ([newLat, newLng]) => {
  if (modalMap.value && typeof newLat === 'number' && typeof newLng === 'number' && !isNaN(newLat) && !isNaN(newLng)) {
    if (!modalMarker.value) {
      setModalMarker(newLng, newLat);
    } else {
      const currentLngLat = modalMarker.value.getLngLat();
      if (Math.abs(currentLngLat.lat - newLat) > 0.000001 || Math.abs(currentLngLat.lng - newLng) > 0.000001) {
        modalMarker.value.setLngLat([newLng, newLat]);
      }
    }
    modalMap.value.setCenter([newLng, newLat]);
  }
});

watch(() => placeForm.value.areaId, () => {
  if (!showPlaceModal.value) return;
  if (!editingPlace.value) {
    placeForm.value.latitude = null as any;
    placeForm.value.longitude = null as any;
  }
  destroyModalMap();
  initModalMap();
});

watch(effectivePlaceMarkerIcon, () => {
  refreshModalMarkerIcon();
});

const triggerGeocode = async () => {
  const address = placeForm.value.address.trim();
  if (!address) {
    geocodeMessageType.value = 'error';
    geocodeMessage.value = 'Vui lòng nhập địa chỉ trước khi tìm tọa độ.';
    return;
  }

  isGeocoding.value = true;
  geocodeMessage.value = '';
  try {
    let searchQuery = address;
    if (!searchQuery.toLowerCase().includes('tien thang')) {
      searchQuery += ', Tiến Thắng';
    }
    if (!searchQuery.toLowerCase().includes('me linh')) {
      searchQuery += ', Mê Linh';
    }
    if (!searchQuery.toLowerCase().includes('ha noi')) {
      searchQuery += ', Hà Nội';
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
      headers: {
        'Accept-Language': 'vi,en'
      }
    });
    
    if (!response.ok) {
      throw new Error('Không thể kết nối đến dịch vụ bản đồ.');
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      placeForm.value.latitude = parseFloat(parseFloat(result.lat).toFixed(6));
      placeForm.value.longitude = parseFloat(parseFloat(result.lon).toFixed(6));
      
      clearError('placeLat');
      clearError('placeLng');
      
      geocodeMessageType.value = 'success';
      geocodeMessage.value = `Đã tìm thấy tọa độ: Vĩ độ ${placeForm.value.latitude}, Kinh độ ${placeForm.value.longitude}`;
    } else {
      const rawResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const rawData = await rawResponse.json();
      if (rawData && rawData.length > 0) {
        const result = rawData[0];
        placeForm.value.latitude = parseFloat(parseFloat(result.lat).toFixed(6));
        placeForm.value.longitude = parseFloat(parseFloat(result.lon).toFixed(6));
        
        clearError('placeLat');
        clearError('placeLng');
        
        geocodeMessageType.value = 'success';
        geocodeMessage.value = `Đã tìm thấy tọa độ: Vĩ độ ${placeForm.value.latitude}, Kinh độ ${placeForm.value.longitude}`;
      } else {
        geocodeMessageType.value = 'error';
        geocodeMessage.value = 'Không tìm thấy tọa độ tự động. Vui lòng kiểm tra lại địa chỉ hoặc nhập tay.';
      }
    }
  } catch (error: any) {
    geocodeMessageType.value = 'error';
    geocodeMessage.value = error.message || 'Lỗi xảy ra khi lấy tọa độ.';
  } finally {
    isGeocoding.value = false;
  }
};



const savePlace = async () => {
  formErrors.value = {};
  if (!placeForm.value.name.trim()) {
    formErrors.value.placeName = 'Vui lòng nhập tên địa danh';
  }
  if (!placeForm.value.areaId) {
    formErrors.value.placeArea = 'Vui lòng chọn khu vực bản đồ';
  }
  if (!placeForm.value.address.trim()) {
    formErrors.value.placeAddress = 'Vui lòng nhập địa chỉ địa danh';
  }
  if (!placeForm.value.latitude || !placeForm.value.longitude || isNaN(placeForm.value.latitude) || isNaN(placeForm.value.longitude)) {
    formErrors.value.placeCoords = 'Vui lòng cắm mốc định vị địa danh trên bản đồ (click chọn vị trí hoặc tìm tọa độ tự động từ địa chỉ).';
  }
  if (Object.keys(formErrors.value).length > 0) {
    return;
  }

  modalLoading.value = true;
  try {
    const payload = {
      ...placeForm.value,
      categoryId: placeForm.value.categoryId ? Number(placeForm.value.categoryId) : undefined,
      markerIconId: placeForm.value.markerIconId ? Number(placeForm.value.markerIconId) : null,
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

const iconSearchQuery = ref('');
const defaultMarkerIconUrl = 'https://api.iconify.design/lucide:map-pin.svg?color=%23ffffff';

const selectedMarkerIcon = computed(() => {
  return markerIcons.value.find(item => item.id === categoryForm.value.markerIconId) || null;
});

const normalizeSearchText = (value: string) => {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const setCategoryIcon = (markerIcon: MarkerIcon) => {
  clearError('categoryIcon');
  categoryForm.value.markerIconId = markerIcon.id;
  categoryForm.value.icon = markerIcon.key;
  categoryForm.value.iconUrl = markerIcon.iconUrl;
  categoryForm.value.markerColor = markerIcon.markerColor;
};

const filteredIcons = computed(() => {
  const q = normalizeSearchText(iconSearchQuery.value.trim());
  if (!q) return markerIcons.value;
  return markerIcons.value.filter(item => {
    return normalizeSearchText(item.name).includes(q) || normalizeSearchText(item.key).includes(q);
  });
});

const resetMarkerIconForm = () => {
  markerIconForm.value = {
    key: '',
    name: '',
    iconUrl: '',
    markerColor: '#6366f1'
  };
};

const saveMarkerIcon = async () => {
  clearError('markerIcon');
  const key = markerIconForm.value.key.trim();
  const name = markerIconForm.value.name.trim();
  const iconUrl = markerIconForm.value.iconUrl.trim();

  if (!key || !name || !iconUrl) {
    formErrors.value.markerIcon = 'Vui lòng nhập đủ tên, mã và đường dẫn biểu tượng';
    return;
  }

  if (!/^#[0-9a-f]{6}$/i.test(markerIconForm.value.markerColor)) {
    formErrors.value.markerIcon = 'Màu marker không hợp lệ';
    return;
  }

  modalLoading.value = true;
  try {
    const markerIcon = await api.markerIcons.create({
      key,
      name,
      iconUrl,
      markerColor: markerIconForm.value.markerColor,
      active: true,
    });
    markerIcons.value = [...markerIcons.value.filter(item => item.id !== markerIcon.id), markerIcon]
      .sort((a, b) => a.name.localeCompare(b.name));
    setCategoryIcon(markerIcon);
    resetMarkerIconForm();
    showMarkerIconForm.value = false;
  } catch (error: any) {
    formErrors.value.markerIcon = error.message || 'Lỗi khi lưu biểu tượng marker';
  } finally {
    modalLoading.value = false;
  }
};

// Operations: Categories
const openCategoryModal = () => {
  formErrors.value = {};
  iconSearchQuery.value = '';
  showMarkerIconForm.value = false;
  resetMarkerIconForm();
  categoryForm.value = {
    name: '',
    code: '',
    description: '',
    icon: markerIcons.value[0]?.key || '',
    iconUrl: markerIcons.value[0]?.iconUrl || '',
    markerColor: markerIcons.value[0]?.markerColor || '',
    markerIconId: markerIcons.value[0]?.id || ''
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
const markerIconFileInput = ref<HTMLInputElement | null>(null);

const createMarkerIconKey = (file: File) => {
  const baseName = placeForm.value.name.trim() || file.name.replace(/\.[^.]+$/, '') || 'marker';
  const safeBaseName = normalizeSearchText(baseName)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'marker';
  return `${safeBaseName}-${Date.now()}`;
};

const uploadPlaceMarkerIcon = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  modalLoading.value = true;
  try {
    const uploadResult = await api.upload.file(file);
    const markerIcon = await api.markerIcons.create({
      key: createMarkerIconKey(file),
      name: placeForm.value.name.trim() ? `${placeForm.value.name.trim()} marker` : file.name.replace(/\.[^.]+$/, ''),
      iconUrl: uploadResult.url,
      markerColor: effectivePlaceMarkerIcon.value?.markerColor || '#6366f1',
      active: true,
    });
    markerIcons.value = [...markerIcons.value.filter(item => item.id !== markerIcon.id), markerIcon]
      .sort((a, b) => a.name.localeCompare(b.name));
    placeForm.value.markerIconId = markerIcon.id;
    refreshModalMarkerIcon();
  } catch (error: any) {
    alert(error.message || 'Lỗi khi tải ảnh marker.');
  } finally {
    modalLoading.value = false;
    target.value = '';
  }
};

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
  if (!categoryForm.value.markerIconId) {
    formErrors.value.categoryIcon = 'Vui lòng chọn biểu tượng marker';
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
      categoryForm.value.icon,
      categoryForm.value.iconUrl,
      categoryForm.value.markerColor,
      categoryForm.value.markerIconId || undefined
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
  max-width: 480px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

.marker-preview-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.marker-preview {
  width: 44px;
  height: 44px;
  border-radius: 50% 50% 50% 8px;
  transform: rotate(-45deg);
  display: grid;
  place-items: center;
  flex: 0 0 44px;
  box-shadow: var(--shadow-md);
}

.marker-preview img {
  width: 22px;
  height: 22px;
  transform: rotate(45deg);
  object-fit: contain;
}

.marker-preview img.uploaded-marker-image {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.18);
}

.marker-preview-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.marker-preview-copy strong {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.marker-preview-copy span {
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.35;
}

.place-marker-preview {
  margin-top: 10px;
  margin-bottom: 0;
}

.marker-override-section {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.place-marker-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 8px;
  margin-top: 10px;
  max-height: 144px;
  overflow-y: auto;
  padding-right: 4px;
}

.place-marker-option,
.place-marker-icon-card {
  min-height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 9px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.place-marker-option:hover,
.place-marker-icon-card:hover,
.place-marker-option.active,
.place-marker-icon-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

.place-marker-icon-card img {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  object-fit: contain;
}

.place-marker-icon-card img.uploaded-marker-image {
  width: 24px;
  height: 24px;
  flex-basis: 24px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.18);
}

.place-marker-icon-card span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.place-marker-upload-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.35;
}

.place-marker-upload-row .btn {
  flex: 0 0 auto;
}

:deep(.admin-map-marker-wrapper) {
  width: 42px;
  height: 54px;
  cursor: grab;
}

:deep(.admin-map-marker-wrapper:active) {
  cursor: grabbing;
}

:deep(.admin-map-pin) {
  width: 42px;
  height: 42px;
  background: var(--marker-color, #6366f1);
  border: 2px solid #ffffff;
  border-radius: 50% 50% 50% 8px;
  transform: rotate(-45deg);
  display: grid;
  place-items: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.34);
}

:deep(.admin-map-pin-inner) {
  transform: rotate(45deg);
  display: grid;
  place-items: center;
}

:deep(.admin-map-pin-inner img) {
  width: 22px;
  height: 22px;
  display: block;
  object-fit: contain;
}

:deep(.admin-map-pin-inner img.uploaded-marker-image) {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.18);
}

.btn-inline-action {
  width: 100%;
  justify-content: center;
  margin-bottom: 12px;
}

.marker-icon-form {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 12px;
  background: var(--bg-card);
}

.marker-icon-form-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.marker-color-input {
  width: 44px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: transparent;
  padding: 3px;
  flex: 0 0 44px;
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
  position: relative;
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
.icon-select-img {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
}
.icon-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  flex: 0 0 10px;
}

/* Maximized Split Screen Place Modal styling */
.modal-card.modal-max-split {
  width: 95vw;
  max-width: 1400px;
  height: 90vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.split-modal-body {
  display: flex;
  flex: 1;
  padding: 0 !important;
  overflow: hidden !important;
  height: calc(90vh - 130px); /* Subtract header and footer */
}
.modal-form-column {
  flex: 0.9;
  overflow-y: auto;
  padding: 24px;
  max-height: 100%;
}
.modal-map-column {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-left: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.02);
  max-height: 100%;
}
.modal-map-wrapper-split {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.modal-map-frame-split {
  flex: 1;
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.modal-map-wrapper-split.map-has-error .modal-map-frame-split {
  border-color: var(--danger);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

@media (max-width: 992px) {
  .modal-card.modal-max-split {
    height: auto;
    max-height: 90vh;
  }
  .split-modal-body {
    flex-direction: column;
    height: auto;
    max-height: 70vh;
    overflow-y: auto !important;
  }
  .modal-form-column {
    flex: none;
    overflow-y: visible;
    padding: 16px;
  }
  .modal-map-column {
    flex: none;
    border-left: none;
    border-top: 1px solid var(--border-color);
    padding: 16px;
    height: 350px;
  }
}
.required-star {
  color: #ef4444;
  margin-left: 3px;
  font-weight: bold;
}
.btn-geocode-search {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}
.btn-geocode-search:hover:not(:disabled) {
  background-color: #e0f2fe;
  border-color: #7dd3fc;
  color: #0284c7;
}
.btn-geocode-search:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  border-color: var(--border-color);
  cursor: not-allowed;
}
.btn-geocode-search i {
  color: #0284c7;
}
.btn-geocode-search:hover:not(:disabled) i {
  color: #0369a1;
}
</style>
