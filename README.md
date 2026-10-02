# DischargeVoice

**From hospital discharge to safe recovery at home.**

DischargeVoice is an AI-assisted patient education and discharge support prototype. It helps patients review clinician-provided discharge information through simple text and voice-ready workflows.

## Safety Positioning

DischargeVoice is **not** a diagnostic or prescribing system.

- It does not diagnose disease.
- It does not prescribe or change medications.
- It does not replace clinicians or emergency services.
- When information is missing or unsafe to infer, it directs users to healthcare professionals.

## Current Foundation (Phase 1)

This repository now includes a runnable initial architecture:

- **Frontend**: React + TypeScript + Vite landing experience (`/frontend`)
- **Backend**: FastAPI modular app (`/backend/app`)
- **Security foundation**: password hashing + token-based auth + role field
- **Safety foundation**: deterministic assistant safety checks before responses
- **Config**: environment-variable based settings with `.env.example`

## Repository Structure

```text
frontend/                 # Patient-facing web app foundation
backend/
  app/
    api/routers/          # Auth, patients, discharge, assistant endpoints
    ai/                   # Safety checks for unsafe clinical requests
    core/                 # Settings/configuration
    database/             # SQLAlchemy session setup
    models/               # ORM models
    schemas/              # API request/response models
    security/             # Auth and token utilities
    services/             # Business logic
  tests/                  # Focused backend tests
```

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend OpenAPI docs: `http://127.0.0.1:8000/docs`

## API Endpoints (Initial)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/patients/me`
- `GET /api/discharge-plan`
- `POST /api/assistant/message`
- `GET /health`

## Testing

```bash
cd backend
pytest
```

Current tests verify assistant safety behavior and context-grounded responses.

## Security & Privacy Notes

- Use environment variables for secrets.
- `.env` is ignored; do not commit real credentials.
- Keep patient data to minimum necessary.
- Avoid logging sensitive patient information.
- Enforce authentication and authorization before data access.

## Roadmap (Phased)

1. Expand structured discharge-plan schema and PostgreSQL migrations
2. Build patient and healthcare-professional dashboards
3. Add teach-back workflows
4. Add provider-based LLM and voice implementations
5. Add audit logging, notifications, and comprehensive RBAC
6. Add MCP/Alexa+ integration layer with strict authorization controls

