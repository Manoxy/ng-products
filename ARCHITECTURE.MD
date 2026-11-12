# Guía de Arquitectura Frontend - Angular Moderno (Signals & Standalone)

Este documento define los estándares de diseño, organización y buenas prácticas adoptados en el desarrollo de la aplicación full-stack.

---

## 1. Principios Arquitectónicos Clave

* **Standalone Components por Defecto:** Eliminación completa de `NgModules`. Cada componente es autónomo y declara sus dependencias directamente en el decorador `@Component`.
* **Inyección de Dependencias Moderna:** Uso exclusivo de la función `inject()` en lugar de la inyección tradicional por constructor.
* **Reactividad con Signals:** Uso prioritario de `signal()` para la gestión del estado local y asíncrono, reduciendo la dependencia de `Zone.js` y optimizando el ciclo de renderizado.
* **Imports Centralizados (`SHARED_IMPORTS`):** Agrupación común de directivas, pipes y módulos de Angular Material para agilizar el desarrollo de vistas.

---

## 2. Organización de Carpetas (`src/`)

```text
src/
├── app/
│   ├── components/            # Vistas o páginas principales de la aplicación
│   │   ├── config/            # Configuración general
│   │   ├── home/              # Página de inicio
│   │   ├── login/             # Módulo de autenticación
│   │   ├── my-account/        # Gestión de cuenta de usuario
│   │   └── products/          # Listado, detalle y gestión de productos
│   ├── core/                  # Elementos centrales y globales (Singletons)
│   │   ├── guards/            # Guardianes de rutas
│   │   ├── interceptors/      # Interceptores HTTP
│   │   ├── services/          # Servicios de comunicación con el backend
│   │   └── strategies/        # Estrategias personalizadas
│   ├── shared/                # Recursos transversales reutilizables
│   │   ├── components/        # Componentes globales compartidos
│   │   │   ├── footer/        # Pie de página global
│   │   │   ├── header/        # Barra de navegación superior
│   │   │   ├── loading/       # Indicador de carga global
│   │   │   ├── logo/          # Componente de marca/logo
│   │   │   └── messages/      # Sistema de notificaciones/alertas
│   │   ├── constants/         # Constantes de la aplicación
│   │   ├── directives/        # Directivas personalizadas
│   │   ├── functions/         # Funciones utilitarias
│   │   ├── imports/           # Agrupador SHARED_IMPORTS
│   │   ├── models/            # Interfaces y tipos de datos (DTOs y estructuras)
│   │   └── pipes/             # Pipes personalizados
│   ├── app.component.ts       # Componente raíz
│   ├── app.config.ts          # Configuración global de la aplicación (Providers)
│   └── app.routes.ts          # Enrutamiento principal
├── environments/              # Variables de entorno (prod y desarrollo)
├── styles/                    # Estilos globales y variables SASS (_variables.scss, styles.scss)
├── index.html                 # HTML principal
└── main.ts                    # Punto de entrada de la aplicación
