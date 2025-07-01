#!/bin/bash
set -e

REPO="https://github.com/stormyboy68/Pando360.git"
FRONT_DIR="frontend/"
FRONT_PORT=3000
BACK_PORT=8000

echo "🔄 Update system packages..."
sudo apt update -y

echo "🐳 Checking Docker installation..."
if ! command -v docker >/dev/null 2>&1; then
  echo "📦 Installing Docker..."
  sudo apt update -y
  sudo apt install -y docker.io
  sudo systemctl enable docker
  sudo systemctl start docker
else
  echo "✅ Docker is already installed: $(docker -v)"
fi

echo "🧩 Checking Docker Compose plugin..."
if ! docker compose version >/dev/null 2>&1; then
  echo "📦 Installing Docker Compose V2 plugin..."
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
  echo "✅ Docker Compose plugin installed."
else
  echo "✅ Docker Compose plugin already installed: $(docker compose version | head -n 1)"
fi


echo "📦 Checking for Node.js..."
if command -v node >/dev/null 2>&1; then
  NODE_VERSION=$(node -v)
  echo "✅ Node.js is already installed: $NODE_VERSION"
else
  echo "📦 Downloading Node.js v22+ and npm..."
  curl -sL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
  sudo bash /tmp/nodesource_setup.sh

  echo "📦 Installing Node.js v22+ and npm..."
  sudo apt install -y nodejs

  echo "✅ Installed Node.js version: $(node -v)"
  echo "✅ Installed npm version: $(npm -v)"
fi

echo "🚀 Enable Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

echo "🚧 Setup firewall..."
sudo ufw allow OpenSSH
sudo ufw allow "${FRONT_PORT}/tcp"
# sudo ufw allow "${BACK_PORT}/tcp"
sudo ufw --force enable

echo "🏗 Build and launch backend via Docker Compose..."
docker compose down 
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

echo "🧾 Containers status:"
docker compose ps

IP=$(hostname -I | awk '{print $1}')
echo "✅ Frontend: http://$IP:$FRONT_PORT"
# echo "✅ Backend/API: http://$IP:$BACK_PORT"
echo ""
echo "ℹ️ View logs with: docker compose logs -f"
