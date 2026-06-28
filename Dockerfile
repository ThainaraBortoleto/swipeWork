FROM node:20-alpine

WORKDIR /app

# Instala bash e curl para scripts
RUN apk add --no-cache bash curl

# Copia package files
COPY package*.json ./

# Instala dependências (prefere npm ci se há package-lock.json)
RUN if [ -f package-lock.json ]; then \
      echo "📦 Usando npm ci (reproducível)..." && \
      npm ci --legacy-peer-deps; \
    else \
      echo "📦 Usando npm install..." && \
      npm install --legacy-peer-deps; \
    fi

# Copia projeto
COPY . .

# Torna executável o script de entrypoint
RUN chmod +x scripts/entrypoint.sh

EXPOSE 3000

# Define variáveis padrão
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

# Executa via script de entrypoint
ENTRYPOINT ["bash", "scripts/entrypoint.sh"]