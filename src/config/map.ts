// Map Configuration for MapLibre GL JS
export const MAP_CONFIG = {
  // Center of our demo area (Hanoi, Vietnam)
  defaultCenter: [105.8521, 21.0285] as [number, number], // [lng, lat] for MapLibre
  defaultZoom: 14,
  minZoom: 11,
  maxZoom: 18,

  // Selected basemap style
  // OpenFreeMap Positron is an open-source vector tile style that mimics CartoDB Positron:
  // clean, light grey theme, muted park green and water blue, minimal clutter.
  // This serves as our "Google-light" style for the prototype.
  styleUrl: 'https://tiles.openfreemap.org/styles/positron',

  // Other available styles for easy switching
  availableStyles: {
    positron: 'https://tiles.openfreemap.org/styles/positron', // Light, clean, low contrast (Google-light)
    liberty: 'https://tiles.openfreemap.org/styles/liberty',   // Standard OSM vector style
    bright: 'https://tiles.openfreemap.org/styles/bright',     // High contrast colorful style
    dark: 'https://tiles.openfreemap.org/styles/dark'          // Dark mode
  },

  // Configuration options for self-hosting transition
  selfHosted: {
    // To self-host using OpenMapTiles:
    // styleUrl: 'http://localhost:8080/styles/osm-bright/style.json'
    // To self-host using Protomaps PMTiles:
    // Need to initialize maplibre-gl-pmtiles plugin in useMap.ts / PublicMap.vue
    // styleUrl: {
    //   version: 8,
    //   sources: {
    //     protomaps: {
    //       type: 'vector',
    //       url: 'pmtiles://path/to/hanoi.pmtiles'
    //     }
    //   },
    //   layers: [...]
    // }
  }
};
