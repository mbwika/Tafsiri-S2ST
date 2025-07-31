# # Use an official lightweight Python image
# FROM python:3.11.7

# # Set the working directory inside the container
# WORKDIR /app

# # Install system dependencies for torchaudio
# RUN apt update && apt install -y \
#     ffmpeg \
#     && rm -rf /var/lib/apt/lists/*

# # Copy the requirements file and install dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the application code
# COPY . .

# # Expose the FastAPI port
# EXPOSE 8000

# Use an official Python Alpine image
FROM python:3.13.5-slim

# Install system dependencies: ffmpeg, shadow (for useradd), and build dependencies
RUN apk add --no-cache \
    ffmpeg \
    shadow \
    build-base \
    libffi-dev \
    musl-dev \
    python3-dev \
    git

# Create a non-root user
RUN useradd -m appuser

# Set the working directory
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install watchgod torch torchaudio transformers

# Preload SeamlessM4T model (optional: speeds up first run)
RUN python -c "from transformers import AutoProcessor, SeamlessM4TModel; \
    SeamlessM4TModel.from_pretrained('facebook/seamless-m4t-v2-large'); \
    AutoProcessor.from_pretrained('facebook/seamless-m4t-v2-large')"

# Copy the application code
COPY . .

# Expose FastAPI's default port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

