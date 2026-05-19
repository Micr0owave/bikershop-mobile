# VeloService - Gestión Técnica de Talleres de Bicicletas

Aplicación móvil B2B desarrollada en React Native con Expo para mecánicos de talleres de bicicletas. Permite gestionar órdenes de trabajo, registrar evidencia fotográfica, consultar historial y acceder a perfiles técnicos.

## Características principales

### Autenticación
- Login con email y contraseña
- Recuperación de contraseña
- Sesión persistente con JWT
- Logout seguro

### Dashboard
- Vista general de métricas
- Acceso rápido a secciones principales
- Información de membresía (GOLD, SILVER, NORMAL)

### Gestión de Órdenes
- Listado de órdenes por estado (Pendiente, En proceso, Completada, Cancelada)
- Detalle de orden con información del cliente
- Cambio de estado de orden
- Gestión de inventario asociado

### Recepción
- Formulario de recepción de bicicletas
- 4 campos para subir evidencia fotográfica
- Validaciones de datos
- Registro automático con timestamp

### Hoja de Vida
- Historial cronológico filtrable por número de serie
- Búsqueda rápida
- Seguimiento de todas las intervenciones

### Perfil Técnico
- Información del mecánico
- Especialidades y métricas
- Rama de trabajo
- Nivel de membresía

### Navegación
- Drawer navigation para acceso a secciones
- Navegación intuitiva basada en file-system routing
- Logout desde el menú lateral

## Requisitos previos

- **Node.js** 18+ 
- **npm** o **yarn**
- **Expo CLI** (se instala automáticamente)
- **Android emulador** O **dispositivo Android físico** con Expo Go / Expo Dev Client
- **Java 17-21** (para builds locales, opcional si usas EAS Build)

## Instalación

### 1. Clonar y navegar al proyecto

```bash
cd "c:\Users\OneDrive\Escritorio\github\bikershop-mobile\bikershop"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar instalación

```bash
npm run lint
npx tsc --noEmit
```

## Ejecutar la aplicación

### Opción A: Expo Go (Sin dev client - Más rápido)

Ideal para desarrollo rápido sin necesidad de compilación.

```bash
npx expo start
```

Luego:
- En Android: Abre Expo Go → Escanea el código QR que aparece en terminal
- En emulador: Presiona `a` en la terminal para abrir automáticamente

### Opción B: Expo Dev Client (Con recarga en vivo avanzada)

Incluye más características de desarrollo.

```bash
npx expo start --dev-client
```

### Opción C: EAS Build (Generar APK para instalación)

La forma más confiable para builds finales sin problemas de Java local.

```bash
npx eas build --platform android --profile development
```

Este comando:
- Builds en la nube (sin necesitar Java local)
- Genera un APK descargable
- Incluye Expo Dev Client automáticamente
- Puedes instalar directamente en tu dispositivo

Luego:
- Abre el enlace que proporciona
- Descarga el APK en tu dispositivo
- Instala la app
- Abre la app y escanea el código QR de `npx expo start --dev-client`

## Credenciales de prueba

### Login
- **Email:** `cualquier@email.com` (cualquier email válido con formato)
- **Contraseña:** cualquiera con 6+ caracteres

Ejemplo:
- Email: `mecanico@taller.com`
- Contraseña: `password123`

### Datos de sesión
Una vez autenticado, se cargan automáticamente:
- **Nombre:** Camilo Pizarro
- **Especialidad:** Mantenimiento y diagnóstico
- **Rama:** Santiago Centro
- **Membresía:** GOLD
- **Taller ID:** TALLER-CHL-001

## Flujo de usuario

### 1. Inicio de sesión
```
App abierta → Pantalla Login → Ingresar email/contraseña → Dashboard
```

### 2. Explorar órdenes
```
Dashboard → Órdenes → [Seleccionar orden] → Detalle con opciones de cambio de estado
```

### 3. Recibir bicicleta
```
Dashboard → Recepción → Completar formulario → Subir 4 fotos → Enviar
```

### 4. Consultar historial
```
Dashboard → Hoja de vida → Buscar por número de serie → Ver intervenciones
```

### 5. Ver perfil
```
Dashboard → Perfil → Ver métricas y especialidades
```

### 6. Logout
```
Menú lateral (ícono ≡) → Logout
```

## 🏗️ Arquitectura

### Stack tecnológico
- **React Native** - Framework base
- **Expo SDK 54** - Toolchain
- **Expo Router** - Navegación file-system
- **TypeScript** - Type safety
- **AsyncStorage** - Persistencia local
- **React Navigation** - Drawer navigation

### Estructura de carpetas

```
bikershop/
├── app/                          # Rutas Expo Router
│   ├── _layout.tsx              # Layout raíz
│   ├── index.tsx                # Entrada (redirección)
│   ├── (auth)/                  # Rutas de autenticación
│   │   ├── login.tsx
│   │   ├── forgot-password.tsx
│   │   └── mail-sent.tsx
│   ├── (app)/                   # Rutas de app autenticada
│   │   ├── _layout.tsx          # Drawer navigation
│   │   ├── dashboard.tsx
│   │   ├── ordenes.tsx
│   │   ├── ordenes/[id].tsx
│   │   ├── recepcion.tsx
│   │   ├── hoja-vida.tsx
│   │   └── perfil.tsx
│   └── modal.tsx
├── components/
│   ├── AuthProvider.tsx         # Context de autenticación
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── ui/
│   │   ├── badge.tsx            # Componente de membresía
│   │   └── collapsible.tsx
│   └── ...
├── constants/
│   └── theme.ts                 # Paleta de colores
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── ...
├── assets/
│   └── images/
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## Diseño visual

### Paleta de colores
- **Primario:** Azul `#0A7EA4`
- **Fondo:** Blanco `#FFFFFF`
- **Texto:** Gris oscuro `#11181C`
- **Bordes:** Gris claro `#E6E9EE`

### Especificaciones de UI
- Área táctil mínima: 48x48 dp
- Border radius: 14px típicamente
- Sombra: elevation 4 / shadow radius 20

## Validaciones implementadas

### Email
- Formato: `usuario@dominio.extensión`

### Teléfono
- Formato: `+569XXXXXXXX` (móviles chilenos)
- Longitud: 12 caracteres exactamente

### RUT
- Formato chileno con dígito verificador
- Validación de checksum

## Troubleshooting

### "App blank or stuck on splash screen"
**Solución:** El bundler Metro no está corriendo
```bash
npx expo start --dev-client
```
Luego abre la app en tu dispositivo.

### "Cannot find module" errors
**Solución:** Reinstalar dependencias
```bash
rm -r node_modules
npm install
npm start
```

### "Java version incompatible" (si usas build local)
**Solución:** Usa EAS Build en su lugar
```bash
npx eas build --platform android --profile development
```

### "Device not connected"
**Solución:** Verificar ADB
```bash
adb devices
adb start-server
```

### "TypeError: Cannot read property of undefined"
**Solución:** Asegúrate de que `AuthProvider` envuelve la app en `_layout.tsx`

### "Página en blanco después de login"
**Solución:** Revisa la consola de Expo y los logs con:
```bash
npx expo start --dev-client
```

## Scripts disponibles

```bash
# Iniciar development server (Expo Go)
npm start

# Iniciar con dev client
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build para Android (local - requiere Java)
npm run android

# Build para Android (EAS - recomendado)
npx eas build --platform android --profile development

# Limpiar caché
npm run reset
```

## Ciclo de desarrollo

1. Hacer cambios en el código
2. El bundler Metro recarga automáticamente
3. La app se actualiza en el dispositivo en tiempo real
4. Si cambios requieren recalibración de React Native, la app reinicia

## Autenticación JWT

El sistema genera JWT siguiendo el patrón:
```
VEL0-[email_sin_caracteres_especiales]-[taller_id]-[unix_timestamp]
```

Ejemplo:
```
VEL0-mecanicotaller.com-TALLER-CHL-001-1715097600
```

Los tokens se guardan en **AsyncStorage** y persisten entre sesiones.

## Multi-tenant

Cada taller tiene un `tallerId` único que filtra:
- Órdenes
- Historial
- Información del perfil

**Taller actual:** `TALLER-CHL-001`

## Deployment

Para deployar a producción:

1. Cambiar perfil de build:
```bash
npx eas build --platform android --profile production
```

2. Configurar variables de entorno en `.env` o EAS settings

3. Generar signing key de producción (primera vez)

4. Distribuir mediante:
   - Play Store (app store)
   - Link de descarga directa
   - Enterprise distribution

## Licencia

Desarrollado para VeloService - 2026

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0.0  
**Estado:** Funcional
