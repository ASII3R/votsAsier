# Vots Asier

Aplicació de votacions amb un frontend Vue/Vite i un servidor WebSocket.

## Requisits

- Node.js 22 o superior
- npm
- Docker i Docker Compose (només per executar-lo amb contenidors)

## Execució local

Des de l'arrel del repositori, instal·la les dependències de cada servei:

```sh
cd servidor
npm install

cd ../vots-project-asier
npm install
```

Inicia el servidor WebSocket en una terminal:

```sh
cd servidor
npm start
```

Inicia el frontend en una altra terminal:

```sh
cd vots-project-asier
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000). El servidor WebSocket estarà disponible a `ws://localhost:8080`.

Per generar el build de producció del frontend:

```sh
cd vots-project-asier
npm run build
```

## Execució amb Docker

Des de l'arrel del repositori, construeix i inicia els dos serveis:

```sh
docker compose up --build
```

El frontend estarà disponible a [http://localhost:3000](http://localhost:3000) i el servidor WebSocket al port `8080`.

Per executar-los en segon pla:

```sh
docker compose up --build -d
```

Per aturar els contenidors:

```sh
docker compose down
```
