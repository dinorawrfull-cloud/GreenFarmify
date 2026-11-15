# GreenFarmify Inteligente

Plataforma demostrativa para monitoreo agrícola y apoyo a decisiones de cultivo en Yucatán, México.

## Arquitectura

```text
GreenFarmify/
├── frontend/                 # HTML + CSS + JavaScript (aplicación web)
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── backend/
    ├── csharp/GreenFarmify.Api/  # API alternativa ASP.NET Core
    └── java/                     # API alternativa Spring Boot
```

**Importante:** C# y Java son dos implementaciones alternativas del backend. Ejecuta una u otra, no ambas en el mismo puerto. El frontend es compartido.

## Requisitos

- Frontend: navegador moderno y un servidor estático local.
- C#: .NET 8 SDK.
- Java: JDK 17+ y Maven 3.9+.

## Ejecutar el frontend

Desde `frontend/`:

```bash
python -m http.server 5500
```

Abre `http://localhost:5500`.

El frontend intenta consultar `http://localhost:5080/api`. Si la API no está disponible, usa datos demostrativos claramente identificados como **DATOS DE PRUEBA**.

## Ejecutar backend C#

```bash
cd backend/csharp/GreenFarmify.Api
dotnet restore
dotnet run
```

API: `http://localhost:5080/api`

## Ejecutar backend Java

```bash
cd backend/java
mvn spring-boot:run
```

API: `http://localhost:8080/api`

Para usar Java, cambia `API_BASE` en `frontend/app.js` a `http://localhost:8080/api`.

## Endpoints incluidos

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/municipios`
- `GET /api/municipios/{id}`
- `GET /api/cultivos`
- `GET /api/calendario/{mes}`

## Datos, mapa y sensores

- Los valores que vienen incluidos son ficticios y están marcados como datos de prueba.
- El mapa de esta versión es una vista esquemática para demostrar navegación y selección; **no representa límites municipales oficiales**.
- Para producción, incorpora el GeoJSON municipal oficial del INEGI en el frontend y reemplaza la capa esquemática por una capa GeoJSON (por ejemplo, con Leaflet).
- Conecta sensores físicos mediante la API, autenticación, validación, marcas de tiempo y almacenamiento persistente antes de presentar mediciones como reales.
- Las recomendaciones de cultivos son orientativas. Deben validarse con análisis de suelo, variedad, manejo, disponibilidad de agua y asesoría agronómica local.

## Paleta visual de referencia

| Nombre | HEX |
|---|---|
| Cornell Red | `#BA1B18` |
| Salmon | `#EA8871` |
| Citron | `#E2D37A` |
| Dark Moss Green | `#526022` |
| Black Bean | `#351710` |

## Siguientes pasos para producción

1. Integrar GeoJSON oficial de municipios del INEGI.
2. Configurar base de datos y autenticación por productor.
3. Integrar telemetría MQTT/HTTP para sensores.
4. Consumir fuentes climáticas y agropecuarias oficiales, conservando fuente, fecha y tipo de dato (histórico, pronóstico o sensor).
5. Validar recomendaciones agronómicas con especialistas de Yucatán.
