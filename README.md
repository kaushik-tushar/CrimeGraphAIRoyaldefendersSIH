🚔 CrimeGraph AI

AI-Powered Criminal Network Analysis System

Smart India Hackathon (SIH) 2026 | Problem Statement ID: 26189

CrimeGraph AI is an AI-powered criminal network analysis and investigation support platform designed to assist law enforcement agencies in analyzing criminal relationships, identifying hidden connections, and transforming fragmented investigative data into actionable intelligence.

The platform combines Artificial Intelligence, Natural Language Processing (NLP), Graph Analytics, and secure digital evidence management to provide investigators with a unified environment for criminal network analysis.

⸻

📌 Table of Contents

* Overview
* Problem Statement
* Objectives
* Key Features
* Technology Stack
* System Architecture
* Project Structure
* Installation and Setup
* API Documentation
* Security and Evidence Integrity
* Future Enhancements
* Team
* Disclaimer
* License

⸻

🔍 Overview

CrimeGraph AI aims to modernize criminal network analysis through intelligent data processing and graph-based investigation workflows.

Traditional investigations often involve analyzing large volumes of disconnected information, including:

* Criminal records
* Suspect profiles
* Communication records
* Financial transaction data
* Case documents
* Digital evidence
* Interconnected criminal activities

CrimeGraph AI provides a unified platform to organize, analyze, and visualize these relationships.

By combining graph databases with AI-powered analysis, the system helps investigators explore criminal networks, discover relationships between entities, and identify potentially significant connections.

🎯 Problem Statement

SIH 2026 — Problem Statement ID: 26189

The increasing complexity of criminal networks and the growing volume of digital information make criminal investigations increasingly challenging.

Investigators often need to manually correlate information from multiple sources to identify relationships between individuals, organizations, locations, and criminal activities.

CrimeGraph AI addresses this challenge by providing an intelligent criminal network analysis system that enables investigators to:

* Explore interconnected criminal entities.
* Analyze relationships across multiple cases.
* Identify patterns and potential associations.
* Extract information from unstructured documents.
* Generate investigation-supporting insights.
* Maintain traceable evidence records.

⸻

🎯 Objectives

The primary objectives of CrimeGraph AI are:

1. Analyze complex criminal networks using graph-based intelligence.
2. Identify relationships between suspects, organizations, locations, and criminal activities.
3. Extract relevant information from investigative documents using OCR and NLP.
4. Provide an AI-powered conversational interface for investigation-related queries.
5. Support secure and traceable digital evidence management.
6. Assist investigators through data-driven investigative insights.

⸻

🚀 Key Features

1. Criminal Network Visualization

Visualize criminal networks through interactive graph representations.

The graph can represent:

* Individuals
* Criminal organizations
* Locations
* Communication records
* Financial transactions
* Cases
* Evidence records

Investigators can explore relationships between entities and understand how different elements of an investigation may be connected.

2. AI-Powered Criminal Network Analysis

Leverage AI and graph analytics to assist with criminal network investigations.

Analytical capabilities include:

* Relationship discovery
* Network structure analysis
* Entity association analysis
* Identification of highly connected entities
* Cross-case relationship exploration
* Pattern detection

Analytical results are intended to support investigations and require human verification.

3. NLP-Powered Investigation Chatbot

The integrated NLP/LLM-based chatbot allows investigators to interact with investigation data using natural language.

Example queries:

* “Show the connections between these two suspects.”
* “Which entities are connected to this criminal organization?”
* “Summarize the available information for this case.”
* “Identify shared entities between these investigations.”

The chatbot is designed to retrieve and summarize authorized investigation data rather than independently establish guilt or criminal intent.

4. OCR-Based Document Intelligence

Extract relevant information from investigative documents using Optical Character Recognition (OCR).

Document processing workflows may include:

* Document upload
* Text extraction
* Entity identification
* Relationship extraction
* Structured data generation
* Investigator review

Extracted information should be verified before being added to an investigation graph.

5. Graph Database Integration

Neo4j is used to represent and explore relationships between entities.

Graph-based analysis enables investigators to examine:

* Direct relationships
* Indirect connections
* Shared entities
* Network structures
* Multi-hop relationships

6. Secure Digital Evidence Management

CrimeGraph AI includes an evidence management workflow designed to support the integrity and traceability of digital evidence.

Capabilities include:

* Evidence metadata management
* Cryptographic hash generation
* Evidence integrity verification
* Evidence access tracking
* Tamper-evident audit records
* Blockchain-based evidence ledger integration

7. Legal Evidence Documentation

The system is designed with Indian digital evidence requirements in mind, including the Bharatiya Sakshya Adhiniyam, 2023.

Evidence documentation and verification workflows are intended to support investigators in maintaining appropriate records.

The platform does not independently certify that evidence is legally admissible.

⸻

🛠️ Technology Stack

Component	Technology
Frontend Framework	React 18
Programming Language	TypeScript
Build Tool	Vite
State Management	Zustand
Data Fetching	TanStack Query
Backend Framework	FastAPI
Backend Runtime	Uvicorn
Backend Language	Python
Relational Database	PostgreSQL
Graph Database	Neo4j
Caching	Redis
AI/ML	Machine Learning, NLP, LLMs
Document Processing	OCR
Evidence Integrity	Cryptographic Hashing
Evidence Ledger	Blockchain
API Communication	REST API

⸻

🏗️ System Architecture

CrimeGraph AI follows a modular architecture consisting of the frontend, backend API, data storage, AI processing, and evidence management components.

                    CRIMEGRAPH AI
                         |
          +--------------+--------------+
          |                             |
       FRONTEND                      BACKEND
          |                             |
   React + TypeScript                FastAPI
          |                             |
          |                    +--------+--------+
          |                    |        |        |
          |                PostgreSQL  Neo4j   Redis
          |                    |        |        |
          |                    |        |        |
          |                Case Data Graph Data Cache
          |                             |
          |                     AI / ML Processing
          |                             |
          |                      NLP / LLM / OCR
          |                             |
          |                    Evidence Management
          |                             |
          |                     Blockchain Ledger
          |                             |
          +-----------------------------+

Architecture Components

Frontend Layer

Provides the investigator dashboard, criminal network visualization, case management interface, and AI chatbot.

Backend Layer

Handles API requests, authentication, business logic, database operations, and AI service integration.

Data Layer

PostgreSQL stores structured investigation data, while Neo4j stores relationships between criminal entities.

Redis supports caching and temporary data operations.

AI Layer

Processes documents, extracts entities, supports natural-language queries, and assists with graph analysis.

Evidence Layer

Maintains evidence metadata, integrity verification, and tamper-evident audit records.

⸻

📂 Project Structure

The following represents the general project structure.

CrimeGraph-AI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database/
│   │   ├── ai/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── tests/
│
├── docs/
│   ├── architecture.md
│   └── api-documentation.md
│
├── .gitignore
└── README.md

⸻

💻 Installation and Setup

Follow these steps to run CrimeGraph AI locally.

Prerequisites

Make sure the following are installed on your system:

Software	Purpose
Git	Version Control
Node.js	Frontend Runtime
npm	Package Manager
Python 3.10+	Backend Runtime

Verify the installations:

git --version
node --version
npm --version
python --version

1. Clone the Repository

git clone <YOUR_REPOSITORY_URL>

Navigate to the project directory:

cd CrimeGraph-AI

2. Run the Backend

Navigate to the backend directory:

cd backend

Create a Python virtual environment:

python -m venv venv

Activate the virtual environment.

Windows:

venv\Scripts\activate

Linux/macOS:

source venv/bin/activate

Install the required dependencies:

pip install -r requirements.txt

Start the Uvicorn server:

uvicorn app.main:app --reload

The backend will be available at:

http://localhost:8000

API documentation:

http://localhost:8000/docs

If your FastAPI application entry point is different, replace app.main:app with the appropriate module path.

3. Run the Frontend

Open a new terminal and navigate to the frontend directory:

cd frontend

Install the required dependencies:

npm install

Start the React development server:

npm run dev

The frontend will be available at:

http://localhost:5173

🎉 Access CrimeGraph AI

Once both servers are running, open the frontend URL in your browser.

Service	URL
Frontend	http://localhost:5173
Backend	http://localhost:8000
API Documentation	http://localhost:8000/docs

⸻

📡 API Documentation

CrimeGraph AI uses REST APIs to communicate between the frontend and backend.

The FastAPI backend provides interactive API documentation through Swagger UI.

Swagger Documentation:

http://localhost:8000/docs

ReDoc Documentation:

http://localhost:8000/redoc

Example API endpoints:

Method	Endpoint	Description
GET	/	Backend status
GET	/health	Health check
GET	/docs	Swagger API documentation
GET	/api/cases	Retrieve investigation cases
POST	/api/cases	Create an investigation case
GET	/api/entities	Retrieve criminal entities
GET	/api/graph	Retrieve graph data
POST	/api/analysis	Perform network analysis
POST	/api/chat	AI chatbot interaction
POST	/api/documents/upload	Upload a document for processing
POST	/api/evidence/verify	Verify evidence integrity

The API endpoints listed above are illustrative. Refer to the actual FastAPI implementation for available routes.

⸻

🔐 Security and Evidence Integrity

CrimeGraph AI is designed with security and evidence integrity as important considerations.

Security-related considerations include:

* Secure API communication.
* Authentication and authorization.
* Role-based access control.
* Secure database configuration.
* Input validation.
* Protection against unauthorized evidence access.
* Cryptographic hashing for evidence integrity.
* Audit logging.
* Secure storage of sensitive information.

Evidence Integrity

A cryptographic hash, such as SHA-256, can be generated when evidence is uploaded.

The hash can subsequently be recalculated to verify whether the evidence has changed.

A blockchain-based evidence ledger may be used to maintain tamper-evident records of evidence-related events.

Note: A blockchain record alone does not establish the authenticity, accuracy, or legal admissibility of evidence. Appropriate acquisition, custody, access control, and documentation procedures remain necessary.

⸻

🔮 Future Enhancements

Potential future enhancements for CrimeGraph AI include:

* Advanced graph analytics.
* AI-assisted criminal network investigation.
* Cross-case relationship discovery.
* Advanced NLP-based document analysis.
* Improved OCR accuracy.
* Explainable AI for investigative insights.
* Real-time network updates.
* Advanced evidence integrity verification.
* Blockchain-based evidence audit trails.
* Integration with authorized law enforcement data sources.
* Advanced role-based access control.
* Secure deployment for institutional environments.

⸻

👥 Team

CrimeGraph AI — SIH 2026

Team Member	Role
Tushar Kaushik	Team Lead, Frontend Development & System Architecture
Vishwajeet Rathore	Backend & API Development
Aditya Malviya	AI/ML & LLM Integration
Nikita Kakde	Graph Technology, Data Processing & NLP
Kirten	Security & Research
Sumit Yadav	Backend Development & Blockchain

⸻

⚠️ Disclaimer

CrimeGraph AI is an investigative support platform developed as part of the Smart India Hackathon 2026 initiative.

The system is intended to assist authorized investigators in analyzing information and exploring potential relationships.

The platform does not independently determine criminal guilt, establish criminal intent, or replace professional investigation and judicial processes.

Any analytical output must be independently verified using reliable evidence and appropriate investigative procedures.

All demonstrations and testing should use synthetic, anonymized, or otherwise lawfully authorized data.

⸻

📄 License

This project is developed for the Smart India Hackathon 2026 initiative.

The licensing terms will be determined by the project maintainers.

⸻

<div align="center">

Built with ❤️ by Team CrimeGraph AI

Transforming Criminal Network Analysis Through Artificial Intelligence.

</div>
