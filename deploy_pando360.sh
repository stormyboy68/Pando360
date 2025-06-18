#!/bin/bash
set -e

# ▪️ Config – فقط متغیرها را تنظیم کن
REPO="https://github.com/stormyboy68/Pando360.git"
APP_DIR="/opt/Pando360"
FRONT_DIR="$APP_DIR/frontend"
FRONT_PORT=3000
BACK_PORT=8000

echo "🔄 Update system packages..."
sudo apt update -y

echo "🐳 Install Docker & docker-compose plugin..."
sudo apt install -y docker.io git ufw curl

# Install Docker Compose V2 as plugin
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

echo "📦 Install Node.js v20+ and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🚀 Enable Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

echo "📦 Clone or update project source..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull origin main || git pull
else
  sudo git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "🚧 Setup firewall..."
sudo ufw allow OpenSSH
sudo ufw allow "${FRONT_PORT}/tcp"
sudo ufw allow "${BACK_PORT}/tcp"
sudo ufw --force enable

echo "🏗 Build and launch backend via Docker Compose..."
export RUN_SETUP=true
docker compose up -d --build

echo "🌐 Setting up Frontend (Next.js)..."
cd "$FRONT_DIR"

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🛠 Building frontend..."
npm run build

echo "🚀 Starting frontend server..."
npx next start &

# ◽️ نمایش وضعیت و آدرس‌ها
echo "🧾 Containers status:"
docker compose ps

IP=$(hostname -I | awk '{print $1}')
echo "✅ Frontend: http://$IP:$FRONT_PORT"
echo "✅ Backend/API: http://$IP:$BACK_PORT"
echo ""
echo "ℹ️ View logs with: docker compose logs -f"
