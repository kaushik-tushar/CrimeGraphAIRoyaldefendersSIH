# CrimeGraph AI - Tactical Law Enforcement Backend API

High-performance intelligence mesh backend for law enforcement analytics, syndicate tracking, and automated evidence ingestion. Built with **FastAPI**, **PostgreSQL / SQLite**, **Neo4j Graph Database**, **Celery**, and **Redis**.

---

## Architecture Overview

- **REST API Framework**: FastAPI with OpenAPI 3.0 docs (`/docs` and `/redoc`).
- **Relational Storage**: PostgreSQL (with automatic SQLite local fallback for zero-dependency local development).
- **Knowledge Graph**: Neo4j Graph DB with Cypher graph queries and Cytoscape.js mesh payload generation.
- **Asynchronous Task Queue**: Celery distributed task queue backed by Redis.
- **AI Ingestion Engine**: Automated OCR simulation and NLP entity extraction (`PERSON`, `PHONE`, `LOCATION`) linked to case dossiers.

---

## Prerequisites

- **Python 3.10+** (tested on Python 3.14)
- **Redis server** (optional for local mock testing, required for asynchronous worker queue)
- **Neo4j 5.x** (optional, fallback graph queries available)

---

## Installation & Setup

1. **Activate Virtual Environment & Install Requirements**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Configuration is defined in `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/crimegraph
   DATABASE_FALLBACK_URL=sqlite:///./crimegraph.db
   REDIS_URL=redis://127.0.0.1:6379/0
   CELERY_BROKER_URL=redis://127.0.0.1:6379/0
   NEO4J_URI=neo4j://127.0.0.1:7687
   ```

3. **Start Redis Server**:
   Using Docker:
   ```bash
   docker run -d --name crimegraph-redis -p 6379:6379 redis:7-alpine
   ```
   Or via local Redis service / Memurai on Windows.

---

## Running the Application

### 1. Start the FastAPI Application
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Run the Celery Background Worker
To process evidence ingestion, OCR simulation, and NLP entity extraction tasks asynchronously:

- **Linux / macOS**:
  ```bash
  celery -A app.worker.celery_app worker --loglevel=info
  ```

- **Windows** (uses the `solo` pool to avoid Windows multiprocessing fork issues):
  ```bash
  celery -A app.worker.celery_app worker --loglevel=info -P solo
  ```

> **Note**: In offline or local development environments where Redis is not running, Celery automatically falls back to eager execution mode (`task_always_eager = True`) so that file uploads and entity extraction succeed without blocking or failing.

---

## Background Processing & AI Ingestion Pipeline

1. **Evidence Upload**:
   - `POST /api/v1/evidence/upload` ingests digital evidence artifacts (FIR PDFs, CDR CSVs, surveillance images).
   - Computes an immutable SHA-256 checksum and saves to `/uploads`.
   - Anchors chain-of-custody metadata to the database.

2. **Asynchronous Ingestion Task**:
   - Immediately dispatches `process_evidence_task.delay(evidence.id)` to Celery.
   - Celery worker executes OCR simulation on the uploaded artifact.
   - NLP processor extracts tactical entities (`PERSON`, `PHONE`, `LOCATION`).
   - Automatically generates `Entity` records linked to the parent case in the relational and graph databases.

---

## Running Automated Tests

Run the full automated test suite covering authentication, cases, evidence chain of custody, entities, network intelligence, and AI background processing:

```bash
python -m pytest
```
