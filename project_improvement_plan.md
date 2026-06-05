# WeatherPulse - Project Improvement Plan

This document outlines the recommended architectural, performance, SEO, UX, and testing enhancements to take WeatherPulse to a production-grade, highly optimized, and scalable weather application.

---

## 1. Architectural & API Enhancements

### ⚡ Caching & Edge Middleware
* **Issue:** Currently, every client request to `/api/weather/*` triggers an upstream HTTP call to OpenWeatherMap. Under high traffic, this will exhaust free-tier API quotas and result in higher response latencies.
* **Solution:** 
  * Implement **Vercel Edge Caching** or **Cloudflare KV/Redis Cache** inside the Nitro serverless API handlers.
  * Cache current conditions for 5 minutes, AQI for 15 minutes, and forecasts for 30 minutes.
  * Add HTTP stale-while-revalidate headers (`Cache-Control: public, s-maxage=300, stale-while-revalidate=600`).

### 🛡️ Rate Limiting & Error Resiliency
* **Issue:** There is no protection against API abuse or denial-of-service (DoS) attempts on geocoding and weather proxy routes.
* **Solution:**
  * Integrate rate-limiting middleware (e.g., Upstash Redis or Vercel Rate Limiter) to restrict users to a maximum of 60 requests per minute.
  * Improve upstream API error handling: return elegant fallback responses when the OpenWeather API returns a 429 (Too Many Requests) or experiences downtime.

---

## 2. SEO & Performance Optimization

### 📈 Cumulative Layout Shift (CLS) Reduction
* **Issue:** When navigating to the Maps page, the Leaflet radar map loads asynchronously, causing a temporary container layout shift before the map mounts.
* **Solution:**
  * Set explicit height and width styles for the map placeholder containers (`h-[380px] sm:h-[460px] md:h-[560px]`) that match the map dimensions exactly.
  * Use a skeleton loader that mimics the Leaflet circular controls and base layers.

### 🖼️ Modern Image Formats & Lazy Loading
* **Issue:** Blog dashboard uses standard Unsplash JPG thumbnails which can be heavy.
* **Solution:**
  * Add `w=600&auto=format&fit=crop&q=80&fm=webp` or `fm=avif` URL parameters to dynamic Unsplash images to fetch lightweight, compressed WebP/AVIF formats.

### 🔍 Rich Schema Structured Data
* **Issue:** Legal and blog pages have basic metadata, but lack structured schemas for search engine indexers.
* **Solution:**
  * Implement **JSON-LD BreadcrumbList** schemas in the main layout.
  * Add **NewsArticle / BlogPosting** schema markup to dynamic article pages (`src/routes/blog/$slug.tsx`) containing author details, datePublished, dateModified, and publisher info.
  * Add **FAQPage** schema markup on the Settings page to capture search snippet widgets.

---

## 3. UX & Functional Features

### 📶 Offline Mode & Progressive Web App (PWA)
* **Issue:** If a user loses internet connectivity, the application fails to display cached weather forecasts.
* **Solution:**
  * Configure `@vite-pwa/assets-generator` and register a **Service Worker** to cache assets.
  * Cache the weather forecasts of bookmarked/favorite cities inside **IndexedDB** using Redux Persist or local databases, allowing users to view their last-fetched forecasts offline.

### 🔔 Severe Weather Web Push Notifications
* **Issue:** Users only see warnings if they have the dashboard open.
* **Solution:**
  * Integrate Web Push Notifications (using Service Workers and the Push API) to notify users of incoming storm alerts, heatwaves, or high pollution indices.

### 📑 Drag-and-Drop Favorite Locations
* **Issue:** The list of saved favorite cities cannot be sorted or re-arranged by the user.
* **Solution:**
  * Integrate a lightweight utility like `@hello-pangea/dnd` or `dnd-kit` to allow users to drag, drop, and re-order their favorited cities.

---

## 4. Quality Assurance & Testing

### 🧪 Unit & Integration Tests
* **Issue:** The project currently relies solely on manual browser verification.
* **Solution:**
  * Setup **Vitest** and **React Testing Library** to test core meteorological calculations and format utilities:
    * Test weather aggregation logic (`aggregateDaily`, `deriveAdvisories`).
    * Test user toggles (Metric vs. Imperial) and city bookmarking Redux actions.

### 🎭 End-to-End (E2E) Testing
* **Issue:** Regression bugs could break form submissions or map controls during production releases.
* **Solution:**
  * Add **Playwright** integration testing:
    * Automate checking the search popup (triggering Ctrl+K, typing a city, and confirming navigation).
    * Test contact form validation and submission.
