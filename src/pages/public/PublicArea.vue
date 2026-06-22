<template>
  <div class="public-area animate-fade-in">
    <!-- Main Workspace -->
    <div class="workspace-grid">
      <!-- Sidebar List -->
      <aside class="places-sidebar">
        <!-- Area Sidebar Header -->
        <div class="area-sidebar-header">
          <div class="banner-overlay"></div>
          <div class="header-content">
            <span class="badge">Destination</span>
            <h2>{{ areaName }}</h2>
            <p class="area-description">{{ areaDescription }}</p>
          </div>
        </div>
        <!-- Search & Filter Controls -->
        <div class="search-filter-box">
          <div class="form-group search-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search local places..." 
              v-model="searchQuery"
            />
          </div>

          <div class="category-filters">
            <button 
              class="filter-chip" 
              :class="{ active: activeCategory === 'all' }"
              @click="activeCategory = 'all'"
            >
              All
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              class="filter-chip"
              :class="{ active: activeCategory === cat }"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Radius Filter -->
          <div class="radius-filter-box">
            <label for="radius-select" class="radius-label">Radius from center:</label>
            <select id="radius-select" v-model="activeRadius" class="form-control-select">
              <option :value="null">Show All</option>
              <option :value="1">Within 1 km</option>
              <option :value="2">Within 2 km</option>
              <option :value="5">Within 5 km</option>
            </select>
          </div>
        </div>

        <!-- Places List -->
        <div class="places-list">
          <div class="list-header">
            <h3>Key Landmarks ({{ filteredPlaces.length }})</h3>
          </div>
          
          <div v-if="filteredPlaces.length === 0" class="empty-state">
            <p>No places match your search or filters.</p>
          </div>
          
          <div 
            v-for="(place, index) in filteredPlaces" 
            :key="place.id"
            class="place-item"
            :class="{ active: selectedPlace?.id === place.id }"
            @click="selectPlace(place)"
          >
            <div class="place-meta">
              <span class="place-index">{{ index + 1 }}</span>
              <span class="place-category-badge">{{ place.category }}</span>
              <span class="place-distance">~{{ place.distance.toFixed(2) }} km</span>
            </div>
            <h4>{{ place.name }}</h4>
            <p class="place-summary">{{ place.summary }}</p>
            
            <div class="place-detail-info" v-if="selectedPlace?.id === place.id">
              <img :src="place.coverUrl" alt="Place Cover" class="place-cover-img" />
              <p class="place-desc">{{ place.description }}</p>
              <div class="place-meta-item">
                <strong>Best time: </strong>{{ place.bestTime }}
              </div>
              <div class="place-meta-item">
                <strong>Local tip: </strong>{{ place.localTip }}
              </div>
            </div>

            <div class="place-actions" v-if="selectedPlace?.id === place.id">
              <a 
                :href="`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`" 
                target="_blank" 
                class="btn btn-secondary btn-xs"
                @click.stop
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                Directions (Google Maps)
              </a>
              <a 
                :href="`https://www.openstreetmap.org/directions?to=${place.lat},${place.lng}`" 
                target="_blank" 
                class="btn btn-outline btn-xs"
                @click.stop
              >
                OSM Nav
              </a>
            </div>
          </div>
        </div>
      </aside>

      <!-- Map Display Container -->
      <section class="map-section">
        <PublicMap 
          :places="filteredPlaces"
          :selectedPlace="selectedPlace"
          @select-place="selectPlace"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PublicMap from '../../components/map/PublicMap.vue';
import { mockPlaces } from '../../data/mockPlaces';
import type { Place } from '../../data/mockPlaces';

// Area metadata
const route = useRoute();
const areaSlug = computed(() => route.params.areaSlug as string || 'ha-noi');

const areaName = computed(() => {
  return areaSlug.value === 'ha-noi' ? 'Hà Nội' : `Area: ${areaSlug.value}`;
});

const areaDescription = ref(
  'Khám phá các di tích lịch sử, không gian văn hóa nghệ thuật tiêu biểu và những ngóc ngách ẩm thực mang đậm nét cổ kính của thủ đô nghìn năm văn hiến.'
);

// Map & Search States
const places = ref<Place[]>(mockPlaces);
const searchQuery = ref('');
const activeCategory = ref('all');
const activeRadius = ref<number | null>(null);
const selectedPlace = ref<Place | null>(null);

// Hanoi center for distance calculation (Ho Guom center)
const centerCoords = { lat: 21.0285, lng: 105.8521 };

// Haversine formula to compute distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate distances from center for all places
const placesWithDistance = computed(() => {
  return places.value.map(place => {
    const distance = calculateDistance(centerCoords.lat, centerCoords.lng, place.lat, place.lng);
    return {
      ...place,
      distance
    };
  });
});

const categories = computed(() => {
  return Array.from(new Set(places.value.map(p => p.category)));
});

// Apply filters (search, category, and radius)
const filteredPlaces = computed(() => {
  return placesWithDistance.value.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          place.summary.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = activeCategory.value === 'all' || place.category === activeCategory.value;
    const matchesRadius = activeRadius.value === null || place.distance <= activeRadius.value;
    
    return matchesSearch && matchesCategory && matchesRadius;
  });
});

// Selection handler
const selectPlace = (place: Place) => {
  // Map back from filtered places objects
  const foundPlace = places.value.find(p => p.id === place.id);
  if (foundPlace) {
    selectedPlace.value = foundPlace;
  }
};
</script>

<style scoped>
.public-area {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
}

.area-sidebar-header {
  position: relative;
  background: linear-gradient(135deg, #1e1b4b, #311042);
  color: #ffffff;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15), transparent 50%);
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
}

.area-sidebar-header h2 {
  color: #ffffff;
  font-size: 1.3rem;
  margin: 4px 0 6px;
  font-weight: 700;
}

.badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--primary);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  display: inline-block;
}

.area-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.825rem;
  line-height: 1.4;
}

.workspace-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 380px 1fr;
  overflow: hidden;
}

.places-sidebar {
  border-right: 1px solid var(--border-color);
  background-color: var(--bg-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-filter-box {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-group {
  position: relative;
  margin-bottom: 0;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-group .form-control {
  padding-left: 44px;
  font-size: 0.9rem;
}

.category-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-chip {
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background-color: var(--bg-app);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.filter-chip:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.filter-chip.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.radius-filter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
}

.radius-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-control-select {
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.form-control-select:focus {
  border-color: var(--primary);
}

.places-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.list-header {
  margin-bottom: 12px;
}

.list-header h3 {
  font-size: 1rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.place-item {
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.place-item:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.place-item.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
  background-color: var(--primary-light);
}

.place-meta {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.place-index {
  font-size: 0.75rem;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.place-category-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
  background-color: rgba(99, 102, 241, 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.place-distance {
  font-size: 0.725rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-left: auto;
}

.place-item h4 {
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.place-summary {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.place-detail-info {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  padding-top: 12px;
}

.place-cover-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background-color: var(--border-color);
}

.place-desc {
  font-size: 0.825rem;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 4px 0;
}

.place-meta-item {
  font-size: 0.775rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.place-meta-item strong {
  color: var(--text-primary);
}

.place-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.btn-xs {
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background: var(--bg-app);
  border-color: var(--border-hover);
}

.map-section {
  position: relative;
  height: 100%;
}

@media (max-width: 768px) {
  .public-area {
    height: auto;
  }
  
  .workspace-grid {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }
  
  .places-sidebar {
    height: 500px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .map-section {
    height: 450px;
  }
}
</style>
