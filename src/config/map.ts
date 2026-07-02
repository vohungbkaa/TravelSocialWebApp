// Map Configuration for MapLibre GL JS

import type { AreaMapConfig, TenantConfig } from './api';

export interface AreaScope {
  slug: string;
  name: string;
  provinceCode?: string;
  level: 'province' | 'ward';
  parentSlug?: string;
  center: [number, number]; // [lng, lat] for MapLibre
  zoom: number;
  bounds: [[number, number], [number, number]]; // [[west, south], [east, north]]
  boundaryGeoJson?: any;
  boundaryGeoJsonUrl?: string;
  description: string;
}

export const MAP_CONFIG = {
  defaultAreaSlug: 'tien-thang',
  
  // Center of our demo area (Xã Tiến Thắng, Mê Linh, Hà Nội)
  defaultCenter: [105.6775, 21.195] as [number, number], // [lng, lat] for MapLibre
  defaultZoom: 13.2,
  minZoom: 12.0, // Constrain to prevent zooming out too far
  maxZoom: 18,

  // Selected basemap style
  styleUrl: 'https://tiles.openfreemap.org/styles/positron',

  // Other available styles for easy switching
  availableStyles: {
    positron: 'https://tiles.openfreemap.org/styles/positron', // Light, clean, low contrast (Google-light)
    liberty: 'https://tiles.openfreemap.org/styles/liberty',   // Standard OSM vector style
    bright: 'https://tiles.openfreemap.org/styles/bright',     // High contrast colorful style
    dark: 'https://tiles.openfreemap.org/styles/dark'          // Dark mode
  },

  // Map areas scope configs
  areas: {
    'tien-thang': {
      slug: 'tien-thang',
      name: 'Xã Tiến Thắng',
      provinceCode: 'hanoi',
      level: 'ward',
      center: [105.6775, 21.195],
      zoom: 13.2,
      bounds: [[105.61, 21.145], [105.745, 21.245]],
      description: 'Tiến Thắng là vùng đất có bề dày lịch sử, lưu giữ nhiều nét văn hóa làng quê truyền thống của vùng đồng bằng Bắc Bộ với hệ thống đình, chùa, miếu cổ kính. Đời sống tinh thần của người dân gắn liền với các lễ hội làng truyền thống được tổ chức hàng năm.',
      boundaryGeoJson: undefined,
      boundaryGeoJsonUrl: '/data/tien-thang.geojson'
    }
  } as Record<string, AreaScope>,

  // Configuration options for self-hosting transition
  selfHosted: {}
};

export const applyTenantConfig = (tenantConfig: TenantConfig) => {
  if (tenantConfig.map.defaultAreaSlug) {
    MAP_CONFIG.defaultAreaSlug = tenantConfig.map.defaultAreaSlug;
  }
  if (tenantConfig.map.center) {
    MAP_CONFIG.defaultCenter = tenantConfig.map.center;
  }
  if (tenantConfig.map.zoom) {
    MAP_CONFIG.defaultZoom = tenantConfig.map.zoom;
  }
  if (tenantConfig.map.minZoom) {
    MAP_CONFIG.minZoom = tenantConfig.map.minZoom;
  }
  if (tenantConfig.map.maxZoom) {
    MAP_CONFIG.maxZoom = tenantConfig.map.maxZoom;
  }
};

export const applyAreaMapConfig = (areaConfig: AreaMapConfig): AreaScope => {
  const scope: AreaScope = {
    slug: areaConfig.slug,
    name: areaConfig.name,
    provinceCode: areaConfig.provinceCode,
    level: areaConfig.level,
    center: areaConfig.center,
    zoom: areaConfig.zoom,
    bounds: areaConfig.bounds || [
      [areaConfig.center[0] - 0.06, areaConfig.center[1] - 0.06],
      [areaConfig.center[0] + 0.06, areaConfig.center[1] + 0.06],
    ],
    description: areaConfig.description || '',
    boundaryGeoJson: areaConfig.boundaryGeoJson,
    boundaryGeoJsonUrl: areaConfig.boundaryGeoJsonUrl,
  };

  MAP_CONFIG.areas[scope.slug] = scope;
  return scope;
};
