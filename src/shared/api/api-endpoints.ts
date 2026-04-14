/**
 * Centralized API endpoints for the BPTPIA Admin Panel.
 */
export const API_ENDPOINTS = {
  MASTER: {
    STATES: "/locations/states",
    CITIES: "/locations/districts",
  },
  // Add other modules here as the app grows
  COLLEGES: "/colleges",
  GALLERY: "/gallery",
  CONTACT: "/contact",
  NEWS: "/news",
  GOV_LETTER: "/letters",
  PHOTOS: "/photos",
  VIDEOS: "/videos",
} as const;
