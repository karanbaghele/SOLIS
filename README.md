# SOLIS (Railway-ready)

This repo contains:
- `backend/`: FastAPI API server
- `frontend/`: React (CRA + CRACO) web app

## Deploy on Railway (single service)

This repo is set up to deploy as **one Railway service**:
- Railway builds the React app
- Copies `frontend/build/` into `backend/static/`
- FastAPI serves the SPA + the API from the same domain

### Required Railway environment variables

- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Mongo database name
- `JWT_SECRET`: secret for JWT signing (recommended)
- `CORS_ORIGINS`: optional, comma-separated (default `*`)

### What to set in Railway

- **Builder**: Nixpacks (auto via `railway.json`)
- **Start command**: handled by `nixpacks.toml`

After deploy:
- App UI: `/`
- API health: `/api/health`
