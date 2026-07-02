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

// --- Custom Soft Google-Like Style Helpers ---
const localizedLabelExpression = [
  'let',
  'nameVal',
  [
    'coalesce',
    ['get', 'name:vi'],
    ['get', 'name'],
    ['get', 'name:nonlatin'],
    ['get', 'name:latin'],
    ['get', 'name_en'],
    ['get', 'name:en']
  ],
  [
    'case',
    ['==', ['var', 'nameVal'], 'Phú My'],
    'Phú Mỹ',
    ['var', 'nameVal']
  ]
];

const usesNameField = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.includes('name');
  }
  if (!Array.isArray(value)) {
    return false;
  }
  return value.some(usesNameField);
};

const mergePaint = (layer: any, paint: Record<string, unknown>) => ({
  ...layer,
  paint: {
    ...layer.paint,
    ...paint
  }
});

const applySoftGoogleLikePalette = (layer: any) => {
  switch (layer.id) {
    case 'background':
      return mergePaint(layer, { 'background-color': '#f8f7f2' });
    case 'park':
    case 'landcover_wood':
      return mergePaint(layer, { 'fill-color': '#dcefd8', 'fill-opacity': 0.72 });
    case 'landuse_residential':
      return mergePaint(layer, { 'fill-color': '#f4f1ea', 'fill-opacity': 0.55 });
    case 'water':
      return mergePaint(layer, { 'fill-color': '#c8e6f5' });
    case 'waterway':
      return mergePaint(layer, { 'line-color': '#b7dff0' });
    case 'building':
      return mergePaint(layer, {
        'fill-color': '#ebe8df',
        'fill-outline-color': '#ddd8cd'
      });
    case 'highway_minor':
    case 'highway_major_inner':
    case 'highway_motorway_inner':
    case 'highway_motorway_bridge_inner':
    case 'tunnel_motorway_inner':
      return mergePaint(layer, { 'line-color': '#ffffff' });
    case 'highway_path':
      return mergePaint(layer, { 'line-color': '#f2f0ea', 'line-opacity': 0.95 });
    case 'highway_major_casing':
    case 'highway_motorway_casing':
    case 'highway_motorway_bridge_casing':
    case 'tunnel_motorway_casing':
      return mergePaint(layer, { 'line-color': '#ded9ce' });
    case 'highway_major_subtle':
    case 'highway_motorway_subtle':
      return mergePaint(layer, { 'line-color': '#eee9df' });
    case 'boundary_2':
    case 'boundary_3':
    case 'boundary_disputed':
      return mergePaint(layer, { 'line-color': '#c7c0b4', 'line-opacity': 0.65 });
    case 'waterway_line_label':
    case 'water_name_point_label':
    case 'water_name_line_label':
      return mergePaint(layer, {
        'text-color': '#4f84a3',
        'text-halo-color': 'rgba(255,255,255,0.85)'
      });
    case 'highway-name-path':
    case 'highway-name-minor':
    case 'highway-name-major':
    case 'label_other':
    case 'label_village':
    case 'label_town':
    case 'label_state':
    case 'label_city':
    case 'label_city_capital':
    case 'label_country_1':
    case 'label_country_2':
    case 'label_country_3':
      return mergePaint(layer, {
        'text-color': '#5f5b53',
        'text-halo-color': 'rgba(255,255,255,0.9)'
      });
    default:
      return layer;
  }
};

export const loadLocalizedMapStyle = async () => {
  const response = await fetch(MAP_CONFIG.styleUrl);
  if (!response.ok) {
    throw new Error(`Failed to load map style: ${response.status}`);
  }

  const style = await response.json();

  style.layers = style.layers.map((rawLayer: any) => {
    const layer = applySoftGoogleLikePalette(rawLayer);

    if (
      layer.type !== 'symbol' ||
      !layer.layout?.['text-field'] ||
      !usesNameField(layer.layout['text-field'])
    ) {
      return layer;
    }

    return {
      ...layer,
      layout: {
        ...layer.layout,
        'text-field': localizedLabelExpression
      }
    };
  });

  return style;
};
