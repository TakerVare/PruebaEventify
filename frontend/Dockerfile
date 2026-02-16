# =============================================================================
# DOCKERFILE - Eventify Frontend (Vue 3 + Vite + Vuetify 3)
# =============================================================================
# Multi-stage build para optimizar el tamaño de la imagen
# =============================================================================

# -----------------------------------------------------------------------------
# STAGE 1: BUILD
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Argumentos de compilación para variables de entorno de Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar aplicación (Vite reemplazará import.meta.env.VITE_API_URL con el valor)
RUN npm run build

# -----------------------------------------------------------------------------
# STAGE 2: RUNTIME - NGINX
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS final

# Copiar archivos compilados desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
