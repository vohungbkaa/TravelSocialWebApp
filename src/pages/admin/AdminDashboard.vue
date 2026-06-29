<template>
  <div class="admin-dashboard animate-fade-in">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p class="subtitle">Welcome back! Manage your story map areas and locations.</p>
      </div>
      <div class="header-actions">
        <button v-if="activeTab === 'areas'" class="btn btn-primary" @click="openAreaModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Area
        </button>
        <button v-if="activeTab === 'places'" class="btn btn-primary" @click="openPlaceModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Place (Đại danh)
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="card stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div>
          <span class="stat-label">Total Areas</span>
          <h3 class="stat-value">{{ areas.length }}</h3>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon icon-places">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
        </div>
        <div>
          <span class="stat-label">Total Places</span>
          <h3 class="stat-value">{{ places.length }}</h3>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon icon-routes">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div>
          <span class="stat-label">Published Places</span>
          <h3 class="stat-value">{{ publishedCount }}</h3>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon icon-media">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </div>
        <div>
          <span class="stat-label">Categories</span>
          <h3 class="stat-value">{{ categories.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Tabs Bar -->
    <div class="tabs-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'places' }" @click="activeTab = 'places'">
        Places (Đại Danh)
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'areas' }" @click="activeTab = 'areas'">
        Story Areas
      </button>
    </div>

    <!-- Table of Places -->
    <div v-if="activeTab === 'places'" class="card table-card">
      <div class="table-header">
        <h2>Manage Tourist Places</h2>
        <div class="search-filters">
          <select v-model="categoryFilter" class="form-control form-control-sm select-filter">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <div class="search-box">
            <input type="text" v-model="searchQuery" class="form-control form-control-sm" placeholder="Search places..." />
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Place Name</th>
              <th>Category</th>
              <th>Area</th>
              <th>Coordinates</th>
              <th>Status</th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPlaces.length === 0">
              <td colspan="6" class="empty-cell">No places found. Click "New Place" to create one.</td>
            </tr>
            <tr v-for="place in filteredPlaces" :key="place.id">
              <td class="area-name-cell">
                <span v-if="place.coverUrl" class="place-thumb" :style="{ backgroundImage: `url(${place.coverUrl})` }"></span>
                <span v-else class="area-icon">📍</span>
                <div>
                  <strong>{{ place.name }}</strong>
                  <p class="area-desc-short">{{ place.summary || 'No summary provided.' }}</p>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ place.category?.name || 'Uncategorized' }}</span>
              </td>
              <td>{{ place.area?.name || 'No Area' }}</td>
              <td>
                <code v-if="place.latitude && place.longitude">
                  {{ parseFloat(place.latitude.toString()).toFixed(4) }}, {{ parseFloat(place.longitude.toString()).toFixed(4) }}
                </code>
                <span v-else class="text-muted">None</span>
              </td>
              <td>
                <span class="badge-status" :class="place.status.toLowerCase()">
                  {{ place.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  v-if="place.status === 'DRAFT'" 
                  class="btn btn-success btn-sm btn-action" 
                  @click="publishPlace(place)"
                  title="Publish place to public map"
                >
                  Publish
                </button>
                <button 
                  v-if="place.status === 'PUBLISHED'" 
                  class="btn btn-secondary btn-sm btn-action" 
                  @click="unpublishPlace(place)"
                  title="Revert to draft"
                >
                  Draft
                </button>
                <button class="btn btn-secondary btn-sm" @click="openPlaceModal(place)">
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" @click="deletePlace(place)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table of Areas -->
    <div v-if="activeTab === 'areas'" class="card table-card">
      <div class="table-header">
        <h2>Your Story Areas</h2>
        <div class="search-box">
          <input type="text" v-model="areaSearchQuery" class="form-control form-control-sm" placeholder="Search areas..." />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Slug</th>
              <th>Coordinates</th>
              <th>Status</th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAreas.length === 0">
              <td colspan="5" class="empty-cell">No areas found.</td>
            </tr>
            <tr v-for="area in filteredAreas" :key="area.id">
              <td class="area-name-cell">
                <span class="area-icon">🗺️</span>
                <div>
                  <strong>{{ area.name }}</strong>
                  <p class="area-desc-short">{{ area.description || 'No description' }}</p>
                </div>
              </td>
              <td><code>/{{ area.provinceCode || 'hn' }}/{{ area.slug }}</code></td>
              <td>
                <code>{{ parseFloat(area.centerLat.toString()).toFixed(4) }}, {{ parseFloat(area.centerLng.toString()).toFixed(4) }}</code>
              </td>
              <td>
                <span class="badge-status" :class="area.published ? 'published' : 'draft'">
                  {{ area.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="actions-cell">
                <router-link :to="`/${area.provinceCode || 'hn'}/${area.slug}`" class="btn btn-secondary btn-sm" target="_blank">
                  View
                </router-link>
                <button class="btn btn-secondary btn-sm" @click="openAreaModal(area)">
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteArea(area)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Area Dialog/Modal -->
    <div v-if="showAreaModal" class="modal-overlay" @click.self="showAreaModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ editingArea ? 'Edit Story Area' : 'Create New Area' }}</h2>
          <button class="close-btn" @click="showAreaModal = false">&times;</button>
        </div>
        <form @submit.prevent="saveArea">
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="area-name">Area Name *</label>
                <input type="text" id="area-name" class="form-control" v-model="areaForm.name" required placeholder="e.g. Xã Tiến Thắng" />
              </div>
              <div class="form-group">
                <label class="form-label" for="area-slug">Slug (URL name)</label>
                <input type="text" id="area-slug" class="form-control" v-model="areaForm.slug" placeholder="e.g. tien-thang (leave blank to auto-generate)" />
              </div>
              <div class="form-group">
                <label class="form-label" for="area-province">Province/City Code *</label>
                <input type="text" id="area-province" class="form-control" v-model="areaForm.provinceCode" required placeholder="e.g. hn" />
              </div>
              <div class="form-group">
                <label class="form-label" for="area-radius">Default Radius (km)</label>
                <input type="number" step="0.1" id="area-radius" class="form-control" v-model.number="areaForm.defaultRadiusKm" />
              </div>
              <div class="form-group">
                <label class="form-label" for="area-lat">Center Latitude *</label>
                <input type="number" step="0.000001" id="area-lat" class="form-control" v-model.number="areaForm.centerLat" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="area-lng">Center Longitude *</label>
                <input type="number" step="0.000001" id="area-lng" class="form-control" v-model.number="areaForm.centerLng" required />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="area-cover">Cover Image URL</label>
                <input type="text" id="area-cover" class="form-control" v-model="areaForm.coverUrl" placeholder="https://example.com/image.jpg" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="area-desc">Description</label>
                <textarea id="area-desc" class="form-control" rows="3" v-model="areaForm.description" placeholder="Provide background information about this area..."></textarea>
              </div>
              <div class="form-group form-grid-full checkbox-group">
                <label>
                  <input type="checkbox" v-model="areaForm.published" />
                  <span>Publish this area to public site</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAreaModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="modalLoading">
              {{ modalLoading ? 'Saving...' : 'Save Area' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Place Dialog/Modal -->
    <div v-if="showPlaceModal" class="modal-overlay" @click.self="showPlaceModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ editingPlace ? 'Edit Tourist Place' : 'Create New Place' }}</h2>
          <button class="close-btn" @click="showPlaceModal = false">&times;</button>
        </div>
        <form @submit.prevent="savePlace">
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="place-name">Place Name *</label>
                <input type="text" id="place-name" class="form-control" v-model="placeForm.name" required placeholder="e.g. Đình Bạch Trữ" />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-category">Category *</label>
                <select id="place-category" class="form-control" v-model="placeForm.categoryId" required>
                  <option value="" disabled>Select category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="place-area">Story Area *</label>
                <select id="place-area" class="form-control" v-model="placeForm.areaId" required>
                  <option value="" disabled>Select area</option>
                  <option v-for="a in areas" :key="a.id" :value="a.id">
                    {{ a.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="place-price-level">Price Level</label>
                <select id="place-price-level" class="form-control" v-model="placeForm.priceLevel">
                  <option value="FREE">FREE</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="place-lat">Latitude *</label>
                <input type="number" step="0.000001" id="place-lat" class="form-control" v-model.number="placeForm.latitude" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-lng">Longitude *</label>
                <input type="number" step="0.000001" id="place-lng" class="form-control" v-model.number="placeForm.longitude" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-min-cost">Min Cost Estimate (đ)</label>
                <input type="number" id="place-min-cost" class="form-control" v-model.number="placeForm.estimatedMinCost" />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-max-cost">Max Cost Estimate (đ)</label>
                <input type="number" id="place-max-cost" class="form-control" v-model.number="placeForm.estimatedMaxCost" />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-duration">Visit Duration (minutes)</label>
                <input type="number" id="place-duration" class="form-control" v-model.number="placeForm.averageVisitDurationMinutes" />
              </div>
              <div class="form-group">
                <label class="form-label" for="place-address">Full Address</label>
                <input type="text" id="place-address" class="form-control" v-model="placeForm.address" placeholder="e.g. Bạch Trữ, Tiến Thắng, Mê Linh" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-cover">Cover Image URL</label>
                <input type="text" id="place-cover" class="form-control" v-model="placeForm.coverUrl" placeholder="https://example.com/image.jpg" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-video">Video Link (YouTube/Vimeo)</label>
                <input type="text" id="place-video" class="form-control" v-model="placeForm.videoUrl" placeholder="e.g. https://www.youtube.com/watch?v=..." />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-audio">Audio Guide URL (TTS)</label>
                <input type="text" id="place-audio" class="form-control" v-model="placeForm.audioUrl" placeholder="https://example.com/audio.mp3" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-summary">Brief Summary (Max 500 chars) *</label>
                <input type="text" id="place-summary" class="form-control" v-model="placeForm.summary" required placeholder="A short catchphrase or description summary" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-desc">Full Story/Description</label>
                <textarea id="place-desc" class="form-control" rows="4" v-model="placeForm.description" placeholder="Detail history, mythology, architecture or guides here..."></textarea>
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-tip">Local Tip</label>
                <input type="text" id="place-tip" class="form-control" v-model="placeForm.localTip" placeholder="e.g. Best photo spots or dress codes" />
              </div>
              <div class="form-group form-grid-full">
                <label class="form-label" for="place-besttime">Best Time to Visit</label>
                <input type="text" id="place-besttime" class="form-control" v-model="placeForm.bestTime" placeholder="e.g. Early morning or Spring festival" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showPlaceModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="modalLoading">
              {{ modalLoading ? 'Saving...' : 'Save Place' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api, type Area, type Place, type PlaceCategory } from '../../config/api';

const activeTab = ref('places');
const areas = ref<Area[]>([]);
const places = ref<Place[]>([]);
const categories = ref<PlaceCategory[]>([]);
const loading = ref(false);
const modalLoading = ref(false);

// Filters
const searchQuery = ref('');
const categoryFilter = ref('');
const areaSearchQuery = ref('');

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
  categoryId: '',
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

// Computed values
const publishedCount = computed(() => {
  return places.value.filter(p => p.status === 'PUBLISHED').length;
});

const filteredPlaces = computed(() => {
  return places.value.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (place.summary && place.summary.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesCategory = !categoryFilter.value || place.categoryId === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
});

const filteredAreas = computed(() => {
  return areas.value.filter(area => {
    return area.name.toLowerCase().includes(areaSearchQuery.value.toLowerCase()) ||
      (area.description && area.description.toLowerCase().includes(areaSearchQuery.value.toLowerCase()));
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
    categories.value = await api.categories.list();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

// Operations: Areas
const openAreaModal = (area?: Area) => {
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
  modalLoading.value = true;
  try {
    if (editingArea.value) {
      await api.request(`/admin/areas/${editingArea.value.id}`, {
        method: 'PUT',
        body: areaForm.value
      });
      alert('Area updated successfully!');
    } else {
      await api.request('/admin/areas', {
        method: 'POST',
        body: areaForm.value
      });
      alert('Area created successfully!');
    }
    showAreaModal.value = false;
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Failed to save area.');
  } finally {
    modalLoading.value = false;
  }
};

const deleteArea = async (area: Area) => {
  if (confirm(`Are you sure you want to delete Area "${area.name}"? It must not have any places attached.`)) {
    try {
      await api.request(`/admin/areas/${area.id}`, {
        method: 'DELETE'
      });
      alert('Area deleted!');
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete area.');
    }
  }
};

// Operations: Places
const openPlaceModal = (place?: Place) => {
  if (place) {
    editingPlace.value = place;
    placeForm.value = {
      name: place.name,
      summary: place.summary || '',
      description: place.description || '',
      categoryId: place.categoryId,
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
  } else {
    editingPlace.value = null;
    placeForm.value = {
      name: '',
      summary: '',
      description: '',
      categoryId: categories.value[0]?.id || '',
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
  }
  showPlaceModal.value = true;
};

const savePlace = async () => {
  modalLoading.value = true;
  try {
    const payload = {
      ...placeForm.value,
      latitude: placeForm.value.latitude ? Number(placeForm.value.latitude) : undefined,
      longitude: placeForm.value.longitude ? Number(placeForm.value.longitude) : undefined,
      estimatedMinCost: placeForm.value.estimatedMinCost ? Number(placeForm.value.estimatedMinCost) : undefined,
      estimatedMaxCost: placeForm.value.estimatedMaxCost ? Number(placeForm.value.estimatedMaxCost) : undefined,
      averageVisitDurationMinutes: placeForm.value.averageVisitDurationMinutes ? Number(placeForm.value.averageVisitDurationMinutes) : undefined,
    };
    
    if (editingPlace.value) {
      await api.places.update(editingPlace.value.id, payload);
      alert('Place details updated successfully!');
    } else {
      await api.places.create(payload);
      alert('New Place created successfully as DRAFT!');
    }
    showPlaceModal.value = false;
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Failed to save place.');
  } finally {
    modalLoading.value = false;
  }
};

const deletePlace = async (place: Place) => {
  if (confirm(`Are you sure you want to delete Place "${place.name}"?`)) {
    try {
      await api.places.delete(place.id);
      alert('Place deleted successfully!');
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete place.');
    }
  }
};

const publishPlace = async (place: Place) => {
  try {
    await api.places.publish(place.id);
    alert(`Published "${place.name}" successfully!`);
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Failed to publish place. Ensure Category, Area, Lat, and Lng are set.');
  }
};

const unpublishPlace = async (place: Place) => {
  try {
    await api.places.unpublish(place.id);
    alert(`Unpublished "${place.name}" (set back to DRAFT).`);
    await loadAllData();
  } catch (error: any) {
    alert(error.message || 'Failed to unpublish place.');
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-header h1 {
  font-size: 2.2rem;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.icon-places {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.icon-routes {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.icon-media {
  background-color: rgba(168, 85, 247, 0.1);
  color: var(--secondary);
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 2px;
}

/* Tabs Bar */
.tabs-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.tab-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

/* Tables */
.table-card {
  padding: 0;
  overflow: hidden;
}

.table-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.select-filter {
  padding: 8px 12px;
  font-size: 0.875rem;
  min-width: 160px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.form-control-sm {
  padding: 8px 12px;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th, 
.data-table td {
  padding: 18px 32px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;
}

.data-table th {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text-secondary);
  background-color: var(--bg-app);
}

.empty-cell {
  text-align: center;
  padding: 40px !important;
  color: var(--text-secondary);
  font-style: italic;
}

.area-name-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.area-icon {
  font-size: 1.5rem;
}

.place-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.area-desc-short {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 400;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-status {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-status.published {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-status.draft {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.badge-status.hidden {
  background-color: var(--border-color);
  color: var(--text-secondary);
}

.actions-header {
  text-align: right;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-action {
  font-weight: 700;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.text-muted {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.85rem;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  animation: modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: var(--bg-card);
  z-index: 10;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background-color: var(--bg-card);
  z-index: 10;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-grid-full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.checkbox-group {
  margin-top: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .table-header {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }
  .search-filters {
    flex-direction: column;
  }
  .data-table th, 
  .data-table td {
    padding: 12px;
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
</style>
