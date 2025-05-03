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

# Use an official Python image
# FROM python:alpine
FROM python:3.13-alpine

# Install useradd and create a user
RUN apk add --no-cache shadow && \
    useradd -m appuser

# # Install useradd and create user
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     passwd \
#  && rm -rf /var/lib/apt/lists/*

# # Use a non-root user to run the application
# RUN useradd -m appuser
# USER appuser

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for torchaudio and FFmpeg
RUN apt update && apt install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install dependencies
COPY requirements.txt .

# Install Python dependencies, including SeamlessM4T-related libraries
RUN pip install --no-cache-dir -r requirements.txt

# Install additional tools for live-reloading (for development)
RUN pip install watchgod

# Install SeamlessM4T v2 model dependencies
RUN pip install torch torchaudio transformers

# Download and cache SeamlessM4T v2 model during build time
RUN python -c "from transformers import AutoProcessor, SeamlessM4TModel; \
    SeamlessM4TModel.from_pretrained('facebook/seamless-m4t-v2-large'); \
    AutoProcessor.from_pretrained('facebook/seamless-m4t-v2-large')"

# Copy the application code
COPY . .

# Expose FastAPI's default port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

