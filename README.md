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

Las solicitudes llegan por correo a través de [FormSubmit](https://formsubmit.co) (gratis, sin cuenta). Al inicio de `script.js`:

- `CONTACT_EMAIL` — correo que recibe las solicitudes (también aparece en el pie de página de `index.html`).
- `FORM_ENDPOINT` — URL a la que se envían las solicitudes por `POST` en JSON. Por defecto es FormSubmit apuntando a `CONTACT_EMAIL`; puede cambiarse por Formspree u otro servicio. Si se deja vacío, el formulario abre el cliente de correo del visitante con la solicitud ya redactada.

**Activación:** la primera solicitud que se envíe desde la página publicada hace que FormSubmit mande un correo con un enlace "Activate Form" a `CONTACT_EMAIL`. Hay que pulsarlo una vez; a partir de ahí cada solicitud llega como un correo con los datos en una tabla.

Campos enviados: `name`, `email`, `phone`, `farm`, `date`, `time`, `mode`, `message`.

## Personalización rápida

- **Horarios disponibles:** opciones del `<select id="time">` en `index.html`.
- **Días hábiles:** el formulario acepta de lunes a viernes, a partir del día siguiente (ver `validators.date` en `script.js`).
- **Colores:** variables CSS en `:root` al inicio de `styles.css`.

## Publicar (GitHub Pages)

1. En GitHub: **Settings → Pages**.
2. En *Build and deployment*, **Source: Deploy from a branch**.
3. Elige la rama `claude/agroayuda-landing-page-gbwjw4` y la carpeta `/ (root)`, y pulsa **Save**.

En uno o dos minutos la página queda en `https://chmoking.github.io/webservicev1/`. Cada push a esa rama la actualiza. También puede publicarse tal cual en Netlify, Vercel o cualquier hosting estático.
