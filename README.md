# 🌍 SeismoPulse Studio — Global Seismic Intelligence & Predictive Disaster Analytics Platform

An industry-grade seismic telemetry streaming, geospatial analysis, and disaster risk reduction (DRR) platform. SeismoPulse integrates continuous real-time feeds from the **United States Geological Survey (USGS)** and the **National Center of Seismology (NCS, Government of India)** with a multi-layered Leaflet GIS engine, a **Power BI-style Business Intelligence suite**, an **embedded MongoDB Aggregation Pipeline Studio**, and empirical **AI/Physics predictive hazard models**.

Developed as an enterprise Big Data Management (BDM) project at **ABV-Indian Institute of Information Technology and Management (ABV-IIITM) Gwalior**.

---

## 📑 Table of Contents
- [Key Features](#-key-features)
  - [1. Real-Time Telemetry & Geospatial GIS](#1-real-time-telemetry--geospatial-gis)
  - [2. Power BI Business Intelligence Suite](#2-power-bi-business-intelligence-suite)
  - [3. Embedded MongoDB Workbench & Aggregation Studio](#3-embedded-mongodb-workbench--aggregation-studio)
  - [4. Predictive Physics & Hazard Modeling](#4-predictive-physics--hazard-modeling)
  - [5. Public Disaster Safety & Indian City Vulnerability](#5-public-disaster-safety--indian-city-vulnerability)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Official Data Sources & API Endpoints](#-official-data-sources--api-endpoints)
- [Directory Structure](#-directory-structure)
- [Quickstart & Installation](#-quickstart--installation)
- [Connecting & Pushing to GitHub](#-connecting--pushing-to-github)
- [Academic Credits & Research Attribution](#-academic-credits--research-attribution)
- [License](#-license)

---

## 🚀 Key Features

### 1. Real-Time Telemetry & Geospatial GIS
* **Multi-Feed Streaming:** Live ingestion from USGS (All-Time, 30-Day M2.5+, 30-Day M4.5+, Significant, 7-Day, and 24-Hour feeds) alongside the Government of India's **National Center of Seismology (NCS)** live earthquake bulletin.
* **Tectonic Fault Overlays:** Full spatial visualization of global plate boundaries (Convergent, Divergent, Transform) based on Peter Bird’s digital tectonic model.
* **Ring of Fire Active Volcanic Centers:** Mapping of major stratovolcanoes and calderas (Mount Fuji, Krakatoa, Popocatépetl, Merapi, etc.).
* **Dynamic Cartography:** Interactive epicentral depth-coloring (shallow $<70\text{ km}$, intermediate $70\text{–}300\text{ km}$, deep $>300\text{ km}$), pulse ring animations for high-magnitude events, and instant seismic energy calculations.

### 2. Power BI Business Intelligence Suite
* **Gutenberg-Richter Recurrence Law:** Empirical frequency-magnitude logarithmic validation ($\log_{10} N = a - bM$) with real-time crustal $b$-value estimation.
* **Seismic Moment Energy Release:** Energy trajectory visualization calculating Joules ($E = 10^{4.8 + 1.5M}$) and TNT equivalent explosive tonnage.
* **Regional Activity Hotspots:** Dynamically ranked frequency leaderboards highlighting active subduction corridors.
* **Global Catastrophe Benchmarks:** Dual-metric comparative analysis evaluating historical events by human fatalities vs. direct economic loss (USD billions).
* **Publication-Grade PNG Export:** One-click image generation for academic project reports and emergency briefings.

### 3. Embedded MongoDB Workbench & Aggregation Studio
* **Dimensional Star Schema:** Fact-dimension architecture optimized for high-throughput spatial telemetry.
* **5 Enterprise NoSQL Patterns:** Document Versioning, Bucket Pattern (time-series sensor batches), GeoJSON 2dsphere indexing, Attribute Pattern, and Pre-aggregated Computed Pattern.
* **Interactive Aggregation Pipeline Runner:** Run multi-stage `$match`, `$group`, `$sort`, and `$project` queries in-memory with sub-15ms execution metrics and JSON export.

### 4. Predictive Physics & Hazard Modeling
* **Modified Omori's Law for Aftershocks:** Temporal decay frequency simulation following major ruptures:
  $$n(t) = \frac{K}{(t + c)^p}$$
* **Esteva-Campbell Peak Ground Acceleration (PGA):** Attenuation modeling estimating ground shaking intensity and Modified Mercalli Intensity (MMI) as a function of hypocentral distance.
* **Hydrodynamic Tsunami Probability:** Multi-parameter classifier assessing bathymetric vertical slip, magnitude threshold ($M_w \ge 7.0$), and focal depth ($<35\text{ km}$).

### 5. Public Disaster Safety & Indian City Vulnerability
* **Indian City Risk Directory:** Instant lookup for Tier-1, Tier-2, and Tier-3 cities across BIS Seismic Zones II, III, IV, and V, displaying zone factors, tectonic fault proximities, and historical impacts.
* **Interactive 10-Question Safety Quiz:** Gamified life-safety assessment on Drop-Cover-Hold protocols, post-quake gas line hazards, and tsunami evacuation procedures.
* **72-Hour Survival Go-Bag Checklist:** Itemized checklist with progress tracking for emergency preparedness.
* **24/7 Global Emergency Directory:** Verified emergency hotlines including NDMA India (1078, 112), USA FEMA (911), Japan FDMA (119), and Turkey AFAD (112).

---

## 🛠 Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Motion |
| **Geospatial & Mapping** | Leaflet 1.9, OpenStreetMap / CARTO Basemaps |
| **Backend & Dev Engine** | Node.js, Express 4, TSX |
| **Data Ingestion** | USGS REST GeoJSON API, NCS India Seismological Bulletin |
| **Data Modeling** | MongoDB Aggregation Framework (Star Schema BSON) |

---

## 📡 Official Data Sources & API Endpoints

| Dataset Name | Source Organization | Format / Endpoint |
| :--- | :--- | :--- |
| **USGS Real-Time Earthquakes (Month M2.5+)** | United States Geological Survey | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson` |
| **USGS Real-Time Earthquakes (Month M4.5+)** | United States Geological Survey | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson` |
| **USGS Significant Earthquakes** | United States Geological Survey | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson` |
| **USGS Past 24h All Events** | United States Geological Survey | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` |
| **Official NCS Live Bulletin** | National Center of Seismology (MoES, India) | `https://seismo.gov.in/` / `https://riseq.seismo.gov.in/` |
| **Global Significant Earthquakes Archive** | NOAA / NGDC World Data Service | `https://www.ngdc.noaa.gov/hazard/earthqk.shtml` |
| **Global Tectonic Plate Boundaries** | Peter Bird (2003) / Hugo Ahlenius (Nordpil) | GeoJSON MultiLineString Layer |
| **Indian Seismic Zonation Map** | Bureau of Indian Standards (IS 1893: 2016) | BIS Seismic Zones II, III, IV, V |

---

## 📁 Directory Structure

```text
seismopulse-studio/
├── public/
│   ├── assets/aistudio/                  # NCS official bulletin text, report PDFs & assets
│   └── BDM_Project_Report_Earthquake_Intelligence.md
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx                # System guide & feature breakdown
│   │   ├── EmergencyModal.tsx            # One-click emergency contact dispatch
│   │   ├── Header.tsx                    # Top navigation, status indicator & tab switcher
│   │   ├── HistoricalArchive.tsx         # Major catastrophe case studies & building code reviews
│   │   ├── MongoStudio.tsx               # MongoDB schema builder & aggregation query runner
│   │   ├── PowerBIDashboard.tsx          # Business Intelligence charts with PNG export
│   │   ├── PredictiveTools.tsx           # Omori aftershock decay & PGA attenuation modeling
│   │   ├── ReportModal.tsx               # Academic project report viewer & download modal
│   │   ├── SafetyAndQuiz.tsx             # Interactive 10-question quiz & 72h go-bag checklist
│   │   ├── SeismicMap.tsx                # Leaflet 2.5D map with tectonic fault overlays
│   │   └── VercelModal.tsx               # Cloud deployment guide
│   ├── data/
│   │   ├── historicalData.ts             # Global catastrophe benchmark catalog (1960–Present)
│   │   ├── indianSeismicData.ts          # Comprehensive Indian historical catalog & city profiles
│   │   ├── ncsLiveCatalog.ts             # 150 verified live records from NCS MoES India
│   │   ├── quizData.ts                   # Disaster preparedness questions & explanations
│   │   ├── safetyHelplines.ts            # National & international emergency hotline registry
│   │   └── tectonicPlates.ts             # Plate boundaries & Ring of Fire volcanic centers
│   ├── services/
│   │   └── usgsService.ts                # Real-time USGS fetcher, cache & fallback normalizer
│   ├── types/
│   │   └── seismic.ts                    # TypeScript domain models & interfaces
│   ├── utils/
│   │   ├── exportChart.ts                # Canvas PNG chart exporter
│   │   └── seismicCalculations.ts        # Energy (Joules/TNT), MMI & depth classification
│   ├── App.tsx                           # Main app shell & state management
│   ├── index.css                         # Tailwind CSS styling & typography
│   └── main.tsx                          # React 19 entry point
├── BDM_Project_Report_Earthquake_Intelligence.md # Full 10,000+ word academic project report
├── package.json                          # Dependencies & NPM scripts
├── tsconfig.json                         # TypeScript configuration
└── vite.config.ts                        # Vite build & bundler configuration
```

---

## 💻 Quickstart & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher (or `pnpm` / `yarn` / `bun`)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/seismopulse-studio.git
cd seismopulse-studio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch local development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🐙 Connecting & Pushing to GitHub

If you have created a new empty repository on [GitHub](https://github.com/new), push this codebase using:

```bash
# 1. Add your GitHub repository as origin
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 2. Stage all files including README.md
git add .

# 3. Commit your changes
git commit -m "feat: initial commit of SeismoPulse Studio seismic intelligence platform"

# 4. Push to main branch
git branch -M main
git push -u origin main
```

*(If using SSH: `git remote add origin git@github.com:<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git`)*

---

## 🎓 Academic Credits & Research Attribution

This platform was developed as part of the **Big Data Management (BDM)** curriculum for Semester VII:

* **Institution:** ABV-Indian Institute of Information Technology and Management (ABV-IIITM), Gwalior
* **Department:** Faculty of Information Technology & Management
* **Project Team:**
  * **Aditya Pratap** (Roll No: 2023IMG-003) — *Integrated B.Tech (IT) + MBA*
  * **Aryan Thakur** (Roll No: 2023IMG-010) — *Integrated B.Tech (IT) + MBA*
  * **Nishant Harkut** (Roll No: 2023IMG-040) — *Integrated B.Tech (IT) + MBA*
  * **Aditya Varshney** (Roll No: 2023IMG-060) — *Integrated B.Tech (IT) + MBA*

### Key Academic References
1. **Gutenberg, B., & Richter, C. F. (1944).** *Frequency of earthquakes in California.* Bulletin of the Seismological Society of America, 34(4), 185-188.
2. **Utsu, T. (1961).** *A statistical study on the occurrence of aftershocks.* Geophysical Magazine, 30, 521-605.
3. **Bird, P. (2003).** *An updated digital model of plate boundaries.* Geochemistry, Geophysics, Geosystems, 4(3), 1027.
4. **Kanamori, H. (1977).** *The energy release in great earthquakes.* Journal of Geophysical Research, 82(20), 2981-2987.
5. **Campbell, K. W. (1981).** *Near-source attenuation of peak horizontal acceleration.* Bulletin of the Seismological Society of America, 71(6), 2039-2070.

---

## 📄 License
This project is licensed under the **Apache-2.0 License** — see the source headers for details.
