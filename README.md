# AgroAyuda — Landing page

Landing page minimalista de una sola página cuyo único objetivo es que el visitante agende una reunión con AgroAyuda.

## Estructura

```
index.html        Contenido de la página
styles.css        Estilos (paleta verde/arena, tipografías Fraunces + Inter)
script.js         Validación y envío del formulario
assets/favicon.svg
```

No requiere instalación ni proceso de build: es HTML, CSS y JavaScript estático.

## Ver en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Recibir las solicitudes

Al inicio de `script.js` hay dos valores de configuración:

- `FORM_ENDPOINT` — URL a la que se envían las solicitudes por `POST` en formato JSON (por ejemplo, un formulario de [Formspree](https://formspree.io), Getform, o un endpoint propio). Si está vacío, el formulario abre el cliente de correo del visitante con la solicitud ya redactada.
- `CONTACT_EMAIL` — correo de contacto de AgroAyuda (también aparece en el pie de página de `index.html`).

Campos enviados: `name`, `email`, `phone`, `farm`, `date`, `time`, `mode`, `message`.

## Personalización rápida

- **Horarios disponibles:** opciones del `<select id="time">` en `index.html`.
- **Días hábiles:** el formulario acepta de lunes a viernes, a partir del día siguiente (ver `validators.date` en `script.js`).
- **Colores:** variables CSS en `:root` al inicio de `styles.css`.

## Publicar

Al ser un sitio estático puede publicarse tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting de archivos.
