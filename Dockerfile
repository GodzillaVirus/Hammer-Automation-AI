# 🔨 Hammer Automation AI - Dockerfile
FROM node:22-bookworm-slim

# 📦 Install system dependencies including Playwright dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

# 📁 Set working directory
WORKDIR /app

# 📋 Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# 🔧 Install pnpm
RUN npm install -g pnpm@10.4.1

# 📦 Install dependencies
RUN pnpm install --frozen-lockfile

# 🎭 Install Playwright browsers with dependencies
RUN pnpm exec playwright install --with-deps chromium

# 📂 Copy application code
COPY . .

# 🏗️ Build the application
RUN pnpm run build

# 🌐 Expose port
EXPOSE 8000

# 🚀 Set environment to production
ENV NODE_ENV=production

# ▶️ Start the application
CMD ["pnpm", "start"]
