import os
import pandas as pd
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from classify import classify

app = FastAPI()

# CORS: the frontend will run on a different origin (localhost:5173 in dev,
# a separate deployed domain in prod), so the browser needs explicit
# permission to call this API. Restrict allow_origins to real frontend
# origins before deploying — "*" is fine for local dev only.
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classify/")
async def classify_logs(file: UploadFile):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")

    try:
        # Read the uploaded CSV
        df = pd.read_csv(file.file)
        if "source" not in df.columns or "log_message" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'source' and 'log_message' columns.")

        # Perform classification
        df["target_label"] = classify(list(zip(df["source"], df["log_message"])))

        # Save the modified file
        output_file = "resources/output.csv"
        df.to_csv(output_file, index=False)
        return FileResponse(output_file, media_type='text/csv', filename="classified_logs.csv")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        file.file.close()


@app.get("/health")
async def health_check():
    return {"status": "ok"}
