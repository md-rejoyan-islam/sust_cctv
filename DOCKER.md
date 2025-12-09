# CCTV Project - Docker Setup

This project uses Docker to containerize both the client (Next.js) and server (Express.js) applications along with MongoDB.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 2. Start All Services

```bash
# Build and start all containers
docker-compose up -d

# Or build fresh images
docker-compose up -d --build
```

### 3. Stop All Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (WARNING: This will delete MongoDB data)
docker-compose down -v
```

## Services

| Service | Container Name | Port  | Description            |
| ------- | -------------- | ----- | ---------------------- |
| Client  | cctv-client    | 5506  | Next.js frontend       |
| Server  | cctv-server    | 5505  | Express.js backend API |
| MongoDB | cctv-mongodb   | 27017 | MongoDB database       |

## Accessing the Application

- **Frontend**: http://localhost:5506
- **Backend API**: http://localhost:5505
- **API Documentation**: http://localhost:5505/api-docs (if enabled)

## Useful Commands

```bash
# View logs of all services
docker-compose logs -f

# View logs of a specific service
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f mongodb

# Restart a specific service
docker-compose restart server

# Rebuild a specific service
docker-compose up -d --build server

# Check service status
docker-compose ps

# Execute command in a container
docker-compose exec server sh
docker-compose exec mongodb mongosh
```

## Environment Variables

### MongoDB

- `MONGO_USERNAME`: MongoDB admin username (default: admin)
- `MONGO_PASSWORD`: MongoDB admin password (default: password123)

### JWT Configuration

- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: Token expiration time in seconds (default: 3600)
- `JWT_REFRESH_SECRET`: Secret key for refresh token
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration (default: 604800)

## Development

For development, you might want to run services individually:

```bash
# Start only MongoDB
docker-compose up -d mongodb

# Then run client and server locally with their dev commands
cd server && pnpm dev
cd client && pnpm dev
```

## Troubleshooting

### Container won't start

```bash
# Check container logs
docker-compose logs <service-name>

# Rebuild containers
docker-compose up -d --build
```

### MongoDB connection issues

```bash
# Ensure MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb
```

### Port conflicts

If ports 5505, 5506, or 27017 are in use, modify the port mappings in `docker-compose.yml`.

## Production Considerations

1. **Security**: Change all default passwords and secrets in `.env`
2. **Volumes**: MongoDB data is persisted in a Docker volume
3. **SSL/TLS**: Consider adding an nginx reverse proxy with SSL for production
4. **Backup**: Regularly backup the MongoDB volume
