# Amigo Invisible — Contexto para Claude

Aplicacion React para sorteos de Amigo Invisible con envio de emails automatico.

**URL produccion:** amigoinvisible.yealva.es
**Repo:** github.com/Franjalgu/amigo-invisible
**Estado:** Concluido (marzo 2026)

---

## Stack

- React 18 + Vite 5 (SPA, sin router)
- Papaparse (import CSV)
- Vercel (hosting + serverless functions)
- Resend API (emails, 100/dia gratis)
- Dominio IONOS, remitente: noreply@contact.yealva.es

## Estructura

```
src/App.jsx          # Toda la logica y UI (fichero unico)
api/send-email.js    # Vercel Serverless Function — llama a Resend
public/ejemplo.csv   # CSV de ejemplo
```

## Arquitectura

- Todo en `App.jsx`: estado, logica, estilos CSS-in-JS (objeto `C` con tokens), componentes SVG inline
- Sin CSS externo, sin librerias de UI, sin router
- 4 pasos: setup -> add -> ex -> done
- `sessionStorage` para persistir sesion (se borra al cerrar navegador)
- `localStorage` para historial (max 10 sorteos)

## Estado principal (App.jsx)

| Variable | Descripcion |
|----------|-------------|
| `ps` | Participantes `{id, name, email}` |
| `ex` | Exclusiones `{id, a, b}` (ids) |
| `res` | Asignaciones `{giver, receiver}` |
| `step` | setup / add / ex / done |
| `ems` | Estado email por giver.id: go/ok/err/undefined |
| `organizerEmailSent` | Flag para no reenviar resumen al organizador |
| `historySavedRef` | useRef guard para evitar duplicados en historial |

## API send-email.js

Dos modos segun `type` en el body:
- Sin type: email a participante (giverName, receiverName, etc.)
- `type: "organizer"`: resumen con tabla de asignaciones al organizador

Todos los datos se escapan con `esc()` antes de inyectarse en HTML (prevencion XSS).

## Diseno visual

- Tema oscuro navideno: bg `#1a1114`, card `#231a1e`
- Acento rojo `#e8364f`, dorado `#d4a843`, verde ok `#34d399`
- Fuentes: Crimson Pro (titulos), DM Sans (cuerpo)
- Nieve animada con canvas (componente Snow)

## Despliegue

```bash
git add . && git commit -m "descripcion" && git push
# Vercel despliega automaticamente desde main
```

Variable de entorno en Vercel: `RESEND_API_KEY`

## Notas importantes

- El dominio lkidiomas.com rebota emails de contact.yealva.es (bounce conocido, requiere acceso DNS ajeno)
- Algoritmo sorteo: fuerza bruta con shuffle, max 1000 intentos
- Exclusiones son bidireccionales
- `sendAll` solo envia pendientes/error, nunca retoca los ya enviados
- Email al organizador se envia automaticamente cuando todos estan en estado "ok"
