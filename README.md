# Awesome Zero-Server SaaS Alternatives 😎

[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)
> A curated list of zero-server, high-performance, privacy-first open source alternatives to expensive proprietary cloud APIs (Algolia, Auth0, Firebase, OpenAI API, AWS Lambda, Cloudflare Stream, etc.).

---

## ⚡ High-Performance Zero-Server Alternatives

### 👻 Search & Indexing
- **[GhostSearch](https://itsoumya-d.github.io/ghostsearch/)** — Sub-millisecond client-side full-text search engine running 100% in the browser. Powered by FlexSearch and Web Workers. Replaces Algolia ($50K+/yr) and Elasticsearch.
  - [VS Algolia Comparison](https://itsoumya-d.github.io/ghostsearch/vs-algolia.html) · [GitHub Repo](https://github.com/itsoumya-d/ghostsearch)

### 🔑 Authentication & Identity
- **[MeshAuth](https://itsoumya-d.github.io/meshauth/)** — Passwordless WebAuthn and Passkey biometric authentication. Phishing-proof by design, storing zero passwords. Replaces Auth0 ($18K/yr), Okta ($5/user/mo), and Clerk.
  - [VS Auth0 Comparison](https://itsoumya-d.github.io/meshauth/vs-auth0.html) · [GitHub Repo](https://github.com/itsoumya-d/meshauth)

### 🔄 Local-First Databases
- **[SyncForge](https://itsoumya-d.github.io/syncforge/)** — CRDT local-first real-time database with automatic conflict resolution. Stores data in IndexedDB and syncs P2P over WebRTC. Replaces Firebase ($15K/mo) and Supabase ($599/mo).
  - [VS Firebase Comparison](https://itsoumya-d.github.io/syncforge/vs-firebase.html) · [GitHub Repo](https://github.com/itsoumya-d/syncforge)

### 🧠 On-Device AI & Machine Learning
- **[EdgeInfer](https://itsoumya-d.github.io/edgeinfer/)** — On-device AI inference engine executing ONNX models directly in browser tabs via WebGPU and WASM SIMD. Replaces OpenAI API ($200K+/yr) and AWS SageMaker.
  - [VS OpenAI API Comparison](https://itsoumya-d.github.io/edgeinfer/vs-openai-api.html) · [GitHub Repo](https://github.com/itsoumya-d/edgeinfer)

### ⚡ Serverless Compute
- **[SwarmCompute](https://itsoumya-d.github.io/swarmcompute/)** — Distributed browser WebAssembly compute mesh converting connected desktop browser tabs into a parallel worker pool. Replaces AWS Lambda ($96K/yr) and Cloudflare Workers.
  - [VS AWS Lambda Comparison](https://itsoumya-d.github.io/swarmcompute/vs-aws-lambda.html) · [GitHub Repo](https://github.com/itsoumya-d/swarmcompute)

### 📹 Live Streaming & Video
- **[AllRTC](https://itsoumya-d.github.io/allrtc/)** — Decentralized P2P live video streaming protocol using WebRTC DataChannels. Viewers relay video micro-chunks to each other, eliminating 99% of CDN bandwidth fees. Replaces Cloudflare Stream ($25K/mo) and AWS IVS.
  - [VS Cloudflare Stream Comparison](https://itsoumya-d.github.io/allrtc/vs-cloudflare-stream.html) · [GitHub Repo](https://github.com/itsoumya-d/allrtc)

### 🔐 File Transfer & Encrypted Storage
- **[PeerVault](https://itsoumya-d.github.io/peervault/)** — Browser-to-browser E2E encrypted file transfer with WebCrypto AES-256-GCM. Replaces WeTransfer ($120/user/yr) and AWS S3 Transfer ($0.09/GB).
  - [VS WeTransfer Comparison](https://itsoumya-d.github.io/peervault/vs-wetransfer.html) · [GitHub Repo](https://github.com/itsoumya-d/peervault)

### 📊 Analytics & Privacy
- **[PulseNet](https://itsoumya-d.github.io/pulsenet/)** — Zero-cookie analytics engine processing events on-device with Laplace noise differential privacy. 100% GDPR compliant. Replaces Google Analytics 360 ($150K/yr) and Mixpanel ($2.2K/mo).
  - [VS Google Analytics Comparison](https://itsoumya-d.github.io/pulsenet/vs-google-analytics-360.html) · [GitHub Repo](https://github.com/itsoumya-d/pulsenet)

### 🎮 Multiplayer Game Engines
- **[SyncPlay](https://itsoumya-d.github.io/syncplay/)** — Real-time P2P multiplayer game engine with host-authority model and JSON Patch state deltas over WebRTC. Replaces Photon Engine ($36K/yr) and AWS GameLift.
  - [VS Photon Engine Comparison](https://itsoumya-d.github.io/syncplay/vs-photon-engine.html) · [GitHub Repo](https://github.com/itsoumya-d/syncplay)

### 📨 Messaging & Queues
- **[ZeroQ](https://itsoumya-d.github.io/zeroq/)** — Serverless P2P message queue and pub/sub broker with browser IndexedDB persistence. Replaces Apache Kafka ($120K/yr) and AWS SQS.
  - [VS Apache Kafka Comparison](https://itsoumya-d.github.io/zeroq/vs-apache-kafka.html) · [GitHub Repo](https://github.com/itsoumya-d/zeroq)

---

© 2024-2026 Soumya Debnath. Business Source License 1.1 (BSL 1.1).

## 🛡️ Architecture & DX Guardrails Engine

This repository includes an automated TypeScript/Node.js validation engine for serverless estates (`src/guardrails.ts`) enforcing:
- **OIDC Least-Privilege Trust Policies**: Restricts GitHub Actions identity assumptions to explicit repository subjects (`sub` claim), eliminating long-lived credentials and wildcard trust risks.
- **Serverless Compute Boundaries**: Enforces AWS Graviton (`arm64`) runtimes, strict synchronous invocation thresholds (<= 30s), and standard memory bounds.
- **Estate Compliance & Security**: Verifies mandatory organizational resource tagging (`Environment`, `CostCenter`) and encryption at rest across serverless storage (S3/SQS/DynamoDB).

### Running Tests
```bash
npm test
```
