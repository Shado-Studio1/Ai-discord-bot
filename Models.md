# 🌌 Project Ai / API Gateway

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-8E44AD.svg)](https://deepmind.google/technologies/gemini/)
[![Gemma](https://img.shields.io/badge/Open%20Source-Gemma%203-green.svg)](https://ai.google.dev/gemma)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

> **Note:** This project provides unified access to the latest state-of-the-art Google AI models, including the experimental Gemini 2.5 series, 2.0 Flash/Pro variants, and the open-weights Gemma 3 family.

---

## 📋 Table of Contents
- [Features](#-features)
- [Supported Models](#-supported-models)
    - [Gemini 2.5 Series](#gemini-25-series-cutting-edge)
    - [Gemini 2.0 Series](#gemini-20-series-production-ready)
    - [Gemma 3 Family](#gemma-3-family-open-models)
    - [Experimental & Preview](#experimental--preview-builds)
- [Installation](#-installation)
- [Usage](#-usage)

---

## 🚀 Features
* **Multi-Modal Support:** Text, Image, Audio, and Computer Use capabilities.
* **Latest Access:** Direct integration with `preview` and `experimental` endpoints.
* **Optimized Routing:** Smart selection between `Flash`, `Pro`, and `Lite` variants.

---

## 🧠 Supported Models

This library supports a comprehensive list of models, categorized by generation and capability.

### Gemini 2.5 Series (Cutting Edge)
| Model ID | Capability | Description |
| :--- | :--- | :--- |
| `gemini-2.5-pro` | Reasoning | Best for complex tasks and coding. |
| `gemini-2.5-flash` | Speed/Cost | High-speed model for high-volume tasks. |
| `gemini-2.5-flash-lite` | Lightweight | Optimized for lower latency and cost. |
| `gemini-2.5-flash-image` | Vision | Enhanced image understanding and generation. |
| `gemini-2.5-flash-preview-tts` | Audio | Text-to-Speech preview capabilities. |
| `gemini-2.5-pro-preview-tts` | Audio | Pro-level audio synthesis. |

### Gemini 2.0 Series (Production Ready)
| Model ID | Variant | Version Tag |
| :--- | :--- | :--- |
| `gemini-2.0-pro-exp-02-05` | Pro | Experimental snapshot (Feb 05). |
| `gemini-2.0-flash` | Flash | Standard production version. |
| `gemini-2.0-flash-001` | Flash | Stable release 001. |
| `gemini-2.0-flash-lite-preview` | Lite | Preview of the lightweight architecture. |
| `gemini-exp-1206` | Experimental | December snapshot build. |

### Gemma 3 Family (Open Models)
| Model Name | Parameters | Best For |
| :--- | :---: | :--- |
| `gemma-3-1b-it` | 1B | Mobile / Edge devices. |
| `gemma-3-4b-it` | 4B | Balanced consumer hardware usage. |
| `gemma-3-12b-it` | 12B | High performance on standard GPUs. |
| `gemma-3-27b-it` | 27B | Complex reasoning and RAG. |
| `gemma-3n-e4b-it` | 4B (N) | Specialized edge deployment. |

### Experimental & Preview Builds
> ⚠️ **Warning:** These models are unstable and subject to change without notice.

* `gemini-robotics-er-1.5-preview` (Robotics Control)
* `gemini-2.5-computer-use-preview-10-2025` (Agentic Capabilities)
* `nano-banana-pro-preview` (Internal/Sandbox)
* `gemini-3-pro-preview` (Next-Gen Preview)
* `gemini-flash-latest` / `gemini-pro-latest` (Auto-update Aliases)

---

## 📦 Installation

```bash
npm install discord.js @google/generative-ai
