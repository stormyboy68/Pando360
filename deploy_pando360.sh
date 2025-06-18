#!/bin/bash
set -e

# ▪️ Config – فقط متغیرها را تنظیم کن
REPO="https://github.com/stormyboy68/Pando360.git"
APP_DIR="/opt/Pando360"
FRONT_PORT=3000
BACK_PORT=8000

echo "🔄 Update system packages..."
sudo apt update -y

echo "🐳 Install Docker & docker-compose..."
sudo apt install -y docker.io docker-compose git ufw

echo "🚀 Enable Docker service..."
sudo systemctl enable docker && sudo systemctl start docker

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

echo "🏗 Build and launch Docker Compose..."
export RUN_SETUP=true
sudo docker compose up -d --build

# ◽️ گزینه: خروجی لاگ‌ها:
echo "🧾 Containers status:"
sudo docker compose ps

# 🌐 نمایش آدرس دسترسی:
IP=$(hostname -I | awk '{print $1}')
echo "✅ Frontend: http://$IP:$FRONT_PORT"
echo "✅ Backend/API: http://$IP:$BACK_PORT"
echo ""
echo "ℹ️ برای دیدن لاگ‌ها: docker compose logs -f"
