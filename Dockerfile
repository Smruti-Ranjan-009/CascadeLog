FROM python:3.11-slim

WORKDIR /app

# System deps needed to build some Python wheels (e.g. sentencepiece/tokenizers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only torch first — the default PyPI wheel bundles CUDA and is
# 2GB+, which is unnecessary for CPU inference and will blow past free-tier
# deploy size limits. requirements.txt also pins torch==2.13.0, so pip will
# see it's already satisfied and skip re-downloading the CUDA build.
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.13.0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# resources/ is where output.csv gets written by server.py
RUN mkdir -p resources

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
