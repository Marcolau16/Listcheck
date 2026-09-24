# 💅 Sistema Web de Agendamiento de Citas - Larav Beuty Studio | Manicura

Un sitio web moderno, rápido y mobile-first para agendar citas en línea para servicios de uñas, maquillaje, spa de cejas y estilizado de cabello.

---

## 🌟 Características Principales

### 📱 1. Experiencia de Usuario Mobile-First (Estilo apnt.app)
- **Diseño Responsive Idéntico**: En dispositivos móviles funciona y se siente como una aplicación nativa; en computadoras de escritorio se presenta en un marco central tipo smartphone de alta gama con sombras elegantes.
- **Cabecera de Perfil**: Foto de portada, logo circular del negocio, insignias de verificación, nombre, especialidad y dirección completa.
- **Pestañas de Navegación Rápida**:
  - 📋 **Servicios / Inicio**: Banner de promociones del mes, botón principal "Reserve Ahora" y botón directo de WhatsApp "¿Tienes una pregunta? Contáctame".
  - 📸 **Galería de Tratamientos**: Álbumes organizados (*Faciales*, *Corporales*) con visor modal / Lightbox en pantalla completa, zoom y navegación táctil con flechas.
  - ⭐ **Reseñas**: Puntuación de 5.0 estrellas, testimonios de clientes verificados y botón con modal para publicar nuevas reseñas.
  - 📍 **Ubicación & Horarios**: Dirección con enlace directo a Google Maps, notas de atención, tabla de horarios por día de la semana con resaltado automático del día de hoy y botones de contacto telefónico e Instagram.

### 🗓 2. Embudo de Reserva Inteligente Paso a Paso (`booking.html`)
- **Paso 1: Catálogo de Servicios**:
  - Organizados por categorías colapsables (*Uñas*, *Maquillaje*, *Spa de Cejas*, *Estilizado de Cabello*).
  - Selección múltiple de servicios con cálculo instantáneo de duración y costo.
  - Descripciones desplegables ("Lee más..." / "Leer menos").
  - Barra flotante inferior fija con recuento dinámico y botón "Seguir".
- **Paso 2: Especialista**:
  - Selección de profesional (*Larav Beauty*).
- **Paso 3: Calendario Interactivo y Turnos**:
  - Calendario mensual con navegación de meses.
  - Días hábiles resaltados en verde y días no laborales o pasados deshabilitados.
  - Generación de turnos automáticos según los horarios del día seleccionado.
  - Bloqueo de turnos ocupados para evitar citas duplicadas.
- **Paso 4: Datos del Cliente**:
  - Nombre, teléfono con selector de país (predeterminado México `+52`), correo opcional y notas.
- **Paso 5: Confirmación Inmediata**:
  - Generación de folio único de cita (ej. `#CF-84920`).
  - **Confirmar por WhatsApp**: Abre directamente un chat de WhatsApp con el negocio con todos los detalles de la reserva ya redactados y listos para enviar.
  - **Agregar a Google Calendar**: Enlace directo para añadir el evento al calendario del cliente.

### ⚙️ 3. Panel de Administración Completo (`admin.html`)
- Protegido por PIN de seguridad (por defecto: `1234`, configurable).
- **Métricas**: Citas totales, pendientes por confirmar e ingresos estimados.
- **Gestión de Citas**: Ver, filtrar y cambiar estados (*Pendiente*, *Confirmada*, *Completada*, *Cancelada*) con botón directo para escribirle por WhatsApp al cliente con un clic.
- **Catálogo de Servicios**: Agregar nuevos tratamientos, editar precios, cambiar duración, activar o pausar servicios.
- **Horarios de Atención**: Configurar días abiertos/cerrados, hora de apertura, cierre e intervalos entre citas (15, 30, 45, 60 min).
- **Datos del Negocio**: Personalizar nombre, teléfono, WhatsApp, Instagram, dirección, notas y textos de promociones.
- **Moderación de Reseñas**: Eliminar o gestionar las opiniones recibidas.

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Sin Servidor (100% Estático / Modo Directo)
Puedes abrir directamente el archivo `index.html` en cualquier navegador (Chrome, Edge, Safari, Firefox).
Todo el sistema funciona inmediatamente utilizando `localStorage` para guardar citas y configuraciones.

### Opción 2: Con Servidor Local de PHP (Persistencia en Archivo JSON)
Dado que tienes PHP instalado, puedes ejecutar en esta carpeta:

```bash
php -S localhost:8000
```

Luego abre en tu navegador:
- **Sitio Web:** [http://localhost:8000](http://localhost:8000)
- **Flujo de Reservas:** [http://localhost:8000/booking.html](http://localhost:8000/booking.html)
- **Panel Administrativo:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

En este modo, las citas y cambios que se realicen se sincronizarán en `data/db.json`, permitiendo que clientes y administrador compartan los mismos datos en tiempo real.

---

## 🌐 Cómo Desplegar a Internet

1. **GitHub Pages / Vercel / Netlify**:
   - Sube estos archivos a un repositorio de GitHub y activa GitHub Pages o conecta a Vercel/Netlify. Funciona 100% sin configuración adicional.
2. **Hosting Web (cPanel, Hostinger, GoDaddy, Apache, Nginx)**:
   - Sube todo el contenido de la carpeta a tu directorio `public_html`.
   - Si tu hosting cuenta con PHP, el backend `api.php` guardará automáticamente las citas en el servidor.

---

## 🔑 Credenciales por Defecto

- **PIN de Administrador:** `1234`
- (Puedes cambiar el PIN en cualquier momento dentro de la sección *Datos del Negocio* en `admin.html`).
