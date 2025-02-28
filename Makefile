.PHONY: install build start-backend docker-up migrate test dev

# Install dependencies for the project
install:
	npm install

# Build the project (if applicable)
build:
	npm run build

# Start the backend server (adjust command as needed)
start-backend:
	npm run dev

# Bring up Docker services using the docker-compose in the same folder
docker-up:
	docker-compose -f docker-compose.yml up -d

# Run Prisma migrations (if using Prisma)
migrate:
	npx prisma migrate dev

# Run tests (if available)
test:
	npm test

# New target to sequentially bring up Docker, wait for DB, run migrations, and start the backend
# windows 	@timeout /T 5 /NOBREAK >nul

dev:
	$(MAKE) docker-up
	@echo "Waiting for the database to initialize..."	
	@sleep 5
	$(MAKE) migrate
	$(MAKE) start-backend
