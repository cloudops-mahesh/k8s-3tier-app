## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- minikube
- kubectl
- Helm

### Deploy

```bash
# Start minikube
minikube start --driver=docker --cpus=2 --memory=4096
minikube addons enable ingress
minikube addons enable metrics-server

# Build images inside minikube
minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t backend:v2 ./backend
docker build -t frontend:v2 ./frontend

# Deploy with Helm
helm install myapp ./helm

# Get access URL
minikube service -n ingress-nginx ingress-nginx-controller --url
```

## ✨ Features

- ✅ 3-tier architecture (Frontend + Backend + Database)
- ✅ Helm chart packaging
- ✅ HPA autoscaling (tested 2→10 pods at 165% CPU)
- ✅ NGINX Ingress routing
- ✅ ConfigMaps for configuration
- ✅ Secrets for sensitive data
- ✅ StatefulSet for PostgreSQL with persistent storage
- ✅ Health checks (readiness + liveness probes)
- ✅ Multi-stage Docker builds
- ✅ Namespace isolation

## 📊 HPA Autoscaling Test
