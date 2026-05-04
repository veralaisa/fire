# 🔥 Burned Area Products Comparison — Cerrado (Brazil)

This repository contains the scripts and workflows used to generate, process, and analyze burned area datasets for the study:

**"Assessing Global and Regional Remote Sensing Products for Burned Area Mapping in the Brazilian Cerrado"**

---

## 📌 Overview

This project compares three major burned area datasets:

* **MODIS MCD64A1 (500 m)**
* **GABAM (30 m, Landsat-based)**
* **MapBiomas Fire Collection 4 (30 m)**

The workflow includes:

1. Data extraction and preprocessing using **Google Earth Engine (GEE)**
2. Spatial aggregation using a **hexagonal grid**
3. Agreement and concordance analysis
4. Visualization and statistical analysis using **Google Colab (Python)**

## 📊 Data Sources

All datasets are accessed via Google Earth Engine:

* `MODIS/061/MCD64A1`
* `projects/sat-io/open-datasets/GABAM`
* `projects/mapbiomas-public/assets/brazil/fire/collection4/...`

Land cover:

* MapBiomas Collection 10

⚠️ Raw data is **not stored in this repository**.

---
## 📄 Citation

If you use this repository, please cite:

> Arruda et al. (2025) — Assessing Global and Regional Remote Sensing Products for Burned Area Mapping: A Comparative Study in the Brazilian Cerrado

---

## 🤝 Acknowledgments

* MapBiomas Initiative
* IPAM (Amazon Environmental Research Institute)
* University of Brasília

---

## 📬 Contact

Vera Arruda
University of Brasília (UnB)
Email: vera.laisa@gmail.com

---
