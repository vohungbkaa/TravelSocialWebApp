import { getTenantRequestHeaders } from './tenant';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PlaceCategory {
  id: number;
  code?: string;
  name: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  markerColor?: string;
  markerIconId?: number;
  markerIcon?: MarkerIcon;
  active?: boolean;
}

export interface MarkerIcon {
  id: number;
  key: string;
  name: string;
  iconUrl: string;
  markerColor: string;
  active: boolean;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  provinceCode?: string;
  description?: string;
  coverUrl?: string;
  centerLat: number;
  centerLng: number;
  defaultRadiusKm: number;
  published: boolean;
}

export interface TenantConfig {
  code: string;
  name: string;
  domain: string;
  theme?: Record<string, unknown>;
  features: Record<string, boolean>;
  map: {
    defaultAreaSlug?: string;
    center?: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
  };
}

export interface AreaMapConfig {
  slug: string;
  name: string;
  provinceCode?: string;
  level: 'province' | 'ward';
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  boundaryGeoJson?: any;
  boundaryGeoJsonUrl?: string;
  description?: string;
  layers: Array<{
    key: string;
    type: string;
    name: string;
    geoJson?: any;
    geoJsonUrl?: string;
    style?: Record<string, unknown>;
  }>;
}

export interface PlaceImage {
  id: string;
  placeId: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

export interface Place {
  id: string;
  areaId?: string;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  localTip?: string;
  bestTime?: string;
  priceRange?: string;
  categoryId: number;
  markerIconId?: number | null;
  markerIcon?: MarkerIcon | null;
  address?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  ratingAvg: number;
  ratingCount: number;
  postCount: number;
  priceLevel?: 'FREE' | 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedMinCost?: number;
  estimatedMaxCost?: number;
  averageVisitDurationMinutes?: number;
  openingHours?: any;
  coverUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  sortOrder: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  category?: PlaceCategory;
  area?: Area;
  images?: PlaceImage[];
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

export const api = {
  // Helper for requests
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    Object.entries(getTenantRequestHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Add bearer token if logged in
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let requestBody: BodyInit | null | undefined = undefined;

    // Default to JSON body if object passed
    if (options.body !== undefined) {
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
        requestBody = JSON.stringify(options.body);
      } else {
        requestBody = options.body;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      body: requestBody,
      headers,
    });


    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback to text
        try {
          errorMessage = await response.text();
        } catch (_) {}
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    const resJson = await response.json();
    return resJson.data as T;
  },

  // Upload APIs
  upload: {
    async file(file: File): Promise<{ url: string }> {
      const formData = new FormData();
      formData.append('file', file);
      return api.request<{ url: string }>('/upload', {
        method: 'POST',
        body: formData,
      });
    }
  },

  // Tenant APIs
  tenant: {
    async config(): Promise<TenantConfig> {
      return api.request<TenantConfig>('/tenant/config');
    },
    
    async listAdmin(): Promise<any[]> {
      return api.request<any[]>('/tenant/admin/list');
    }
  },

  // Auth APIs
  auth: {
    async login(identifier: string, password: string): Promise<AuthResponse> {
      const data = await api.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { identifier, password },
      });
      
      localStorage.setItem('admin_access_token', data.accessToken);
      localStorage.setItem('admin_refresh_token', data.refreshToken);
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      return data;
    },

    logout() {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_user');
    },

    getUser(): User | null {
      const userStr = localStorage.getItem('admin_user');
      if (!userStr) return null;
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  },

  // Place Categories API
  categories: {
    async list(): Promise<PlaceCategory[]> {
      return api.request<PlaceCategory[]>('/place-categories');
    },

    async listAdmin(): Promise<PlaceCategory[]> {
      return api.request<PlaceCategory[]>('/place-categories/admin');
    },

    async create(
      name: string,
      code?: string,
      description?: string,
      icon?: string,
      iconUrl?: string,
      markerColor?: string,
      markerIconId?: number
    ): Promise<PlaceCategory> {
      return api.request<PlaceCategory>('/place-categories', {
        method: 'POST',
        body: { name, code, description, icon, iconUrl, markerColor, markerIconId },
      });
    },

    async updateStatus(id: number, active: boolean): Promise<PlaceCategory> {
      return api.request<PlaceCategory>(`/place-categories/${id}`, {
        method: 'PATCH',
        body: { active },
      });
    }
  },

  markerIcons: {
    async list(): Promise<MarkerIcon[]> {
      return api.request<MarkerIcon[]>('/marker-icons');
    },

    async create(payload: {
      key: string;
      name: string;
      iconUrl: string;
      markerColor: string;
      active?: boolean;
    }): Promise<MarkerIcon> {
      return api.request<MarkerIcon>('/marker-icons', {
        method: 'POST',
        body: payload,
      });
    },
  },

  // Areas API
  areas: {
    async listPublic(): Promise<Area[]> {
      return api.request<Area[]>('/areas');
    },

    async listAdmin(): Promise<Area[]> {
      return api.request<Area[]>('/admin/areas');
    },

    async get(slug: string): Promise<Area> {
      return api.request<Area>(`/areas/${slug}`);
    },

    async getPlaces(slug: string): Promise<Place[]> {
      return api.request<Place[]>(`/areas/${slug}/places`);
    },

    async getMapConfig(slug: string): Promise<AreaMapConfig> {
      return api.request<AreaMapConfig>(`/areas/${slug}/map-config`);
    }
  },

  // Places API
  places: {
    async list(params?: {
      q?: string;
      areaSlug?: string;
      areaId?: string;
      category?: string;
      provinceCode?: string;
      limit?: number;
      cursor?: string;
      sort?: 'newest' | 'rating';
    }): Promise<{ places: Place[]; nextCursor: string | null }> {
      const qParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            qParams.append(key, String(val));
          }
        });
      }
      const queryString = qParams.toString();
      return api.request<{ places: Place[]; nextCursor: string | null }>(
        `/places${queryString ? `?${queryString}` : ''}`
      );
    },

    async getPublic(id: string): Promise<Place> {
      return api.request<Place>(`/places/${id}`);
    },

    async getPublicBySlug(slug: string): Promise<Place> {
      return api.request<Place>(`/places/slug/${slug}`);
    },

    async getImagesPublic(id: string): Promise<PlaceImage[]> {
      return api.request<PlaceImage[]>(`/places/${id}/images`);
    },

    async listAdmin(): Promise<Place[]> {
      return api.request<Place[]>('/admin/places');
    },

    async get(id: string): Promise<Place> {
      return api.request<Place>(`/admin/places/${id}`);
    },

    async create(place: Partial<Place>): Promise<Place> {
      return api.request<Place>('/admin/places', {
        method: 'POST',
        body: place,
      });
    },

    async update(id: string, place: Partial<Place>): Promise<Place> {
      return api.request<Place>(`/admin/places/${id}`, {
        method: 'PATCH',
        body: place,
      });
    },

    async delete(id: string): Promise<void> {
      return api.request<void>(`/admin/places/${id}`, {
        method: 'DELETE',
      });
    },

    async publish(id: string): Promise<Place> {
      return api.request<Place>(`/admin/places/${id}/publish`, {
        method: 'PATCH',
      });
    },

    async unpublish(id: string): Promise<Place> {
      return api.request<Place>(`/admin/places/${id}/unpublish`, {
        method: 'PATCH',
      });
    },

    async addImage(id: string, imageUrl: string, caption?: string, sortOrder = 0): Promise<PlaceImage> {
      return api.request<PlaceImage>(`/admin/places/${id}/images`, {
        method: 'POST',
        body: { imageUrl, caption, sortOrder },
      });
    },

    async deleteImage(id: string, imageId: string): Promise<void> {
      return api.request<void>(`/admin/places/${id}/images/${imageId}`, {
        method: 'DELETE',
      });
    }
  }
};
