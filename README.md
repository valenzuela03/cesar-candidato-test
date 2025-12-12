Configuración de Variables de Entorno

Antes de iniciar, debes configurar las variables de entorno para el backend.

1.  Navega a la carpeta `backend`.
2.  Crea un archivo `.env` con las siguientes variables:

**Archivo: `backend/.env`**
```env
PORT=3000

# Configuración de Base de Datos (PostgreSQL)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=GestionEscolar
DB_HOST=localhost
DB_PORT=5432

# Seguridad
JWT_SECRET=key
JWT_EXPIRES_IN=8h
```
---

## 2. Ejecutar con Docker

1.  Asegúrate de estar en la raíz del proyecto.
2.  Ejecuta:
    ```bash
    docker compose up -d --build
    ```
    Esto levantará:
    - **PostgreSQL** en el puerto `5432`.
    - **Backend** en `http://localhost:3000`.
    - **Frontend** en `http://localhost:5173`.

### Ejecutar Migraciones y Seeders (En Docker)
Una vez que los contenedores estén corriendo, inicializa la base de datos:

1.  Ejecuta las migraciones:
    ```bash
    docker exec -it backend npx sequelize-cli db:migrate
    ```
2.  Ejecuta los seeders:
    ```bash
    docker exec -it backend npx sequelize-cli db:seed:all
    ```

    para quitar docker:
    ```bash
    docker compose down -v
    ```

---

## 3. Ejecutar en Modo Desarrollo Local (Sin Docker)

Si prefieres ejecutar los servicios manualmente en tu máquina:

### Base de Datos
1.  Asegúrate de tener PostgreSQL corriendo.
2.  Crea una base de datos llamada `GestionEscolar` (o el nombre que hayas puesto en tu `.env`).

### Backend
1.  Entra a la carpeta `backend`:
    ```bash
    cd backend
    ```
2.  Instala dependencias:
    ```bash
    npm install
    ```
3.  Ejecuta Migraciones y Seeders:
    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```
4.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run dev
    ```

### Frontend
1.  En otra terminal, entra a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instala dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    El sitio estará disponible en `http://localhost:5173`.

---
