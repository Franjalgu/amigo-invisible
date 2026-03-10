# Amigo Invisible — Documentación Completa del Proyecto

> Aplicación web para organizar sorteos de Amigo Invisible con envío de emails automático.
> Proyecto concluido — Marzo 2026.

---

## 1. Resumen

Aplicación React que permite crear sorteos de Amigo Invisible, configurar exclusiones entre participantes, y enviar por email a cada persona el nombre de su amigo invisible. Diseño navideño con tema oscuro.

**URL de producción:** `amigoinvisible.yealva.es`
**Repositorio:** `github.com/Franjalgu/amigo-invisible`
**Remitente emails:** `noreply@contact.yealva.es`
**Estado:** ✅ Concluido
**Última actualización:** Marzo 2026 — Fix XSS, persistencia de sesión y deduplicación de historial

---

## 2. Stack Tecnológico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Frontend | React 18 + Vite 5 | SPA rápida, hot reload en desarrollo |
| Parseo CSV | Papaparse | Importar participantes desde archivo |
| Hosting | Vercel (gratis) | Despliegue automático desde GitHub |
| Emails | Resend API (100/día gratis) | Envío real de emails con HTML bonito |
| Backend | Vercel Serverless Functions | Función `/api/send-email` para Resend |
| Dominio | IONOS (.es) | Empresa española, facturación con IVA |

**Coste:** 0€/mes (dominio aparte, ~5-12€/año).

---

## 3. Funcionalidades

### Paso 1 — Datos del evento
- Nombre del grupo/evento
- Fecha del intercambio
- Presupuesto máximo (opcional)
- Lugar (opcional)
- Email del organizador (opcional) — con checkbox para recibir o no el resumen al completar envíos
- Instrucciones personalizadas para el email

### Paso 2 — Participantes
- Añadir manualmente (nombre + email)
- Importar desde CSV con columnas: nombre, email, exclusion (opcional)
- El CSV reconoce cabeceras en español e inglés
- Resuelve exclusiones automáticamente desde el CSV

### Paso 3 — Exclusiones
- Exclusiones bidireccionales (si A no puede tocarle a B, B tampoco toca a A)
- Interfaz visual con selectores

### Paso 4 — Resultado y envío
- Algoritmo de sorteo con máximo 1000 intentos
- Valida que nadie se toque a sí mismo y respeta exclusiones
- Ver email de destino en cada fila de asignaciones
- Preview del email al pulsar en cualquier asignación
- Envío real de emails vía Resend API
- Estados por participante: pendiente, enviando, enviado, error
- Botón reenviar (🔄) individual para emails con error
- Edición inline del email de destino con botón ✏️
- `sendAll` solo envía pendientes/error — nunca retoca los ya enviados
- Email automático al organizador con tabla de asignaciones cuando todos están enviados
- Exportar a CSV compatible con Excel (con BOM UTF-8)

### Historial
- Los sorteos completados se guardan automáticamente en `localStorage`
- Máximo 10 sorteos guardados (los más recientes)
- Accesible desde el botón "Historial" en el header
- Muestra fecha, nombre, participantes, asignaciones y email de cada uno

### Persistencia de sesión
- El estado completo se guarda en `sessionStorage` mientras el navegador está abierto
- Al recargar la página se recupera el punto exacto donde se estaba
- Incluye `organizerEmailSent` y `sendOrganizerSummary` para evitar reenvíos al recargar

### Seguridad
- Todos los datos de usuario se escapan con `esc()` antes de inyectarse en el HTML de los emails (prevención XSS)
- La función escapa `&`, `<`, `>` y `"` para evitar inyección de HTML malicioso
- Guard con `useRef` para evitar entradas duplicadas en el historial al cambiar estados de email

---

## 4. Estructura del Proyecto

```
amigo-invisible/
├── index.html              # Página principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración Vite
├── .gitignore              # Archivos ignorados
├── src/
│   ├── main.jsx            # Punto de entrada React
│   └── App.jsx             # Aplicación completa (toda la lógica y UI)
├── api/
│   └── send-email.js       # Vercel Serverless Function (Resend)
└── public/
    └── ejemplo.csv         # CSV de ejemplo con 5 participantes
```

---

## 5. Diseño Visual

- **Tema:** Oscuro navideño
- **Fondo:** `#1a1114` con partículas de nieve animadas (canvas)
- **Colores principales:** Rojo acento `#e8364f`, dorado `#d4a843`, verde éxito `#34d399`
- **Fuentes:** Crimson Pro (títulos), DM Sans (cuerpo)
- **Cards:** Fondo `#231a1e` con bordes `#3a2d32`, border-radius 14px
- **Animaciones:** Fade-in en transiciones de paso, glow pulsante en icono principal, nieve cayendo

---

## 6. Código Fuente

### 6.1 `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Amigo Invisible</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎁</text></svg>" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 6.2 `package.json`

```json
{
  "name": "amigo-invisible",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}
```

### 6.3 `vite.config.js`

```javascript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
})
```

### 6.4 `.gitignore`

```
node_modules
dist
.env
.env.local
.vercel
desktop.ini
```

### 6.5 `src/main.jsx`

```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 6.6 `src/App.jsx`

```jsx
import { useState, useEffect, useRef } from "react";
import * as Papa from "papaparse";

const C = {
  bg: "#1a1114", card: "#231a1e", accent: "#e8364f",
  accentSoft: "rgba(232,54,79,0.12)", accentGlow: "rgba(232,54,79,0.3)",
  gold: "#d4a843", goldSoft: "rgba(212,168,67,0.12)",
  text: "#f2e8eb", muted: "#9a8b90", border: "#3a2d32",
  ok: "#34d399", okSoft: "rgba(52,211,153,0.12)",
  err: "#f87171", errSoft: "rgba(248,113,113,0.12)",
};

const uid = () => Math.random().toString(36).substr(2, 9);
function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

function draw(parts, excl) {
  for (let t = 0; t < 1000; t++) {
    const g=[...parts], r=shuffle([...parts]); let ok=true;
    for(let i=0;i<g.length;i++){
      if(g[i].id===r[i].id){ok=false;break;}
      if(excl.some(e=>(e.a===g[i].id&&e.b===r[i].id)||(e.a===r[i].id&&e.b===g[i].id))){ok=false;break;}
    }
    if(ok) return g.map((v,i)=>({giver:v,receiver:r[i]}));
  }
  return null;
}

function Snow(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;const cx=cv.getContext("2d");let id;const ps=[];
    const rs=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    rs();window.addEventListener("resize",rs);
    for(let i=0;i<45;i++)ps.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*2.5+0.5,s:Math.random()*0.5+0.2,d:Math.random()*0.4-0.2,o:Math.random()*0.35+0.15});
    const f=()=>{cx.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(255,255,255,${p.o})`;cx.fill();p.y+=p.s;p.x+=p.d;if(p.y>cv.height+5){p.y=-5;p.x=Math.random()*cv.width;}});id=requestAnimationFrame(f);};
    f();return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}/>;
}

const Ico=({d,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const Gift=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="3" y="12" width="18" height="8" rx="1"/><line x1="12" y1="8" x2="12" y2="20"/><path d="M12 8c-2-3-6-3-6 0s4 3 6 0"/><path d="M12 8c2-3 6-3 6 0s-4 3-6 0"/></svg>;
const Plus=()=><Ico d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6"/>;
const Shuf=()=><Ico d="M16 3l5 0 0 5M4 20L21 3M21 16l0 5-5 0M15 15l6 6M4 4l5 5"/>;
const Mail=()=><Ico s={14} d="M2 4h20v16H2zM22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>;
const Trash=()=><Ico s={14} d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>;
const Ban=()=><Ico s={14} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M4.9 4.9l14.2 14.2"/>;
const Check=()=><Ico s={14} d="M20 6L9 17l-5-5"/>;
const Star=()=><Ico s={18} d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>;
const Upload=()=><Ico s={16} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>;
const FileText=()=><Ico s={16} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>;
const Refresh=()=><Ico s={14} d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>;
const Edit=()=><Ico s={14} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>;
const Download=()=><Ico s={16} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>;
const History=()=><Ico s={16} d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3"/>;
const ArrowLeft=()=><Ico s={16} d="M19 12H5M12 5l-7 7 7 7"/>;

const SESSION_KEY = "amigo-invisible-sorteo";
const HISTORY_KEY = "amigo-invisible-historial";
const MAX_HISTORY = 10;

export default function App(){
  const [ps,setPs]=useState([]);
  const [ex,setEx]=useState([]);
  const [res,setRes]=useState(null);
  const [step,setStep]=useState("setup");
  const [grp,setGrp]=useState("");
  const [eventDate,setEventDate]=useState("");
  const [eventPlace,setEventPlace]=useState("");
  const [bud,setBud]=useState("");
  const [emailMsg,setEmailMsg]=useState("");
  const [organizerEmail,setOrganizerEmail]=useState("");
  const [nm,setNm]=useState("");
  const [em,setEm]=useState("");
  const [ea,setEa]=useState("");
  const [eb,setEb]=useState("");
  const [err,setErr]=useState("");
  const [ems,setEms]=useState({});
  const [importResult,setImportResult]=useState(null);
  const [previewFor,setPreviewFor]=useState(null);
  const [editingEmail,setEditingEmail]=useState(null);
  const [editEmailVal,setEditEmailVal]=useState("");
  const [showHistory,setShowHistory]=useState(false);
  const [history,setHistory]=useState([]);
  const [organizerEmailSent,setOrganizerEmailSent]=useState(false);
  const [sendOrganizerSummary,setSendOrganizerSummary]=useState(true);
  const nr=useRef(null);
  const fileRef=useRef(null);
  const historySavedRef=useRef(false);

  // Cargar sesión y historial al montar
  useEffect(()=>{
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if(saved){
        const d = JSON.parse(saved);
        if(d.ps) setPs(d.ps);
        if(d.ex) setEx(d.ex);
        if(d.res) setRes(d.res);
        if(d.step) setStep(d.step);
        if(d.grp) setGrp(d.grp);
        if(d.eventDate) setEventDate(d.eventDate);
        if(d.eventPlace) setEventPlace(d.eventPlace);
        if(d.bud) setBud(d.bud);
        if(d.emailMsg) setEmailMsg(d.emailMsg);
        if(d.ems) setEms(d.ems);
        if(d.organizerEmail) setOrganizerEmail(d.organizerEmail);
        if(d.organizerEmailSent !== undefined) setOrganizerEmailSent(d.organizerEmailSent);
        if(d.sendOrganizerSummary !== undefined) setSendOrganizerSummary(d.sendOrganizerSummary);
      }
      const hist = localStorage.getItem(HISTORY_KEY);
      if(hist) setHistory(JSON.parse(hist));
    } catch(e){}
  },[]);

  // Guardar sesión al cambiar estado
  useEffect(()=>{
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ps,ex,res,step,grp,eventDate,eventPlace,bud,emailMsg,ems,organizerEmail,organizerEmailSent,sendOrganizerSummary}));
    } catch(e){}
  },[ps,ex,res,step,grp,eventDate,eventPlace,bud,emailMsg,ems,organizerEmail,organizerEmailSent,sendOrganizerSummary]);

  const handleFileImport=(e)=>{
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const text=ev.target.result;
      const result=Papa.parse(text,{header:true,skipEmptyLines:true});
      if(!result.data||result.data.length===0){setErr("No se pudo leer el archivo.");return;}
      let added=0,skipped=0,exAdded=0;
      const newPs=[...ps],newEx=[...ex];
      result.data.forEach(row=>{
        const r={};Object.keys(row).forEach(k=>{r[k.trim().toLowerCase()]=(row[k]||"").trim();});
        const name=r.nombre||r.name||r.participante||"";
        const email=r.email||r.correo||r.mail||"";
        const exclStr=r.exclusion||r.exclusiones||r.excluir||r["no tocar"]||"";
        if(!name||!email||!email.includes("@")){skipped++;return;}
        if(newPs.some(p=>p.email.toLowerCase()===email.toLowerCase())){skipped++;return;}
        const newP={id:uid(),name,email,_exclNames:[]};
        if(exclStr){exclStr.split(/[,;|]/).forEach(n=>{const t=n.trim().toLowerCase();if(t)newP._exclNames.push(t);});}
        newPs.push(newP);added++;
      });
      newPs.forEach(p=>{
        if(p._exclNames&&p._exclNames.length>0){
          p._exclNames.forEach(exName=>{
            const target=newPs.find(t=>t.id!==p.id&&t.name.toLowerCase().includes(exName));
            if(target&&!newEx.some(e=>(e.a===p.id&&e.b===target.id)||(e.a===target.id&&e.b===p.id))){
              newEx.push({id:uid(),a:p.id,b:target.id});exAdded++;
            }
          });
          delete p._exclNames;
        }
      });
      setPs(newPs);setEx(newEx);setErr("");
      setImportResult({added,skipped,exAdded});
      setTimeout(()=>setImportResult(null),4000);
    };
    reader.readAsText(file);e.target.value="";
  };

  const add=()=>{
    const n=nm.trim(),e=em.trim();
    if(!n)return setErr("Escribe un nombre");
    if(!e||!e.includes("@"))return setErr("Escribe un email válido");
    if(ps.some(p=>p.email.toLowerCase()===e.toLowerCase()))return setErr("Ese email ya está");
    setPs([...ps,{id:uid(),name:n,email:e}]);setNm("");setEm("");setErr("");nr.current?.focus();
  };
  const rm=id=>{setPs(ps.filter(p=>p.id!==id));setEx(ex.filter(e=>e.a!==id&&e.b!==id));};
  const addEx=()=>{
    if(!ea||!eb)return setErr("Selecciona dos personas");
    if(ea===eb)return setErr("No puedes excluir a alguien consigo mismo");
    if(ex.some(e=>(e.a===ea&&e.b===eb)||(e.a===eb&&e.b===ea)))return setErr("Ya existe");
    setEx([...ex,{id:uid(),a:ea,b:eb}]);setEa("");setEb("");setErr("");
  };
  const sorteo=()=>{
    if(ps.length<3)return setErr("Mínimo 3 participantes");
    const r=draw(ps,ex);
    if(!r)return setErr("Imposible con estas exclusiones. Quita alguna.");
    setRes(r);setErr("");setStep("done");
  };

  const sendOneEmail=async(a)=>{
    setEms(p=>({...p,[a.giver.id]:"go"}));
    try{
      const dateStr=eventDate?new Date(eventDate+"T12:00:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"";
      const resp=await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:a.giver.email,giverName:a.giver.name,receiverName:a.receiver.name,groupName:grp,budget:bud,eventDate:dateStr,eventPlace,message:emailMsg})});
      if(resp.ok){setEms(p=>({...p,[a.giver.id]:"ok"}));}
      else{setEms(p=>({...p,[a.giver.id]:"err"}));setErr("Error enviando email a "+a.giver.name);}
    }catch(e){setEms(p=>({...p,[a.giver.id]:"err"}));setErr("Error de conexion");}
  };

  // Solo envía pendientes/error — nunca retoca los ya enviados
  const sendAll=async()=>{
    const pending=res.filter(a=>ems[a.giver.id]!=="ok"&&ems[a.giver.id]!=="go");
    for(let i=0;i<pending.length;i++){
      await new Promise(r=>setTimeout(r,i*400));
      await sendOneEmail(pending[i]);
    }
  };

  // Email resumen al organizador (se llama automáticamente cuando todos están enviados)
  const sendOrganizerEmail=async()=>{
    if(!organizerEmail||organizerEmailSent||!sendOrganizerSummary)return;
    try{
      const dateStr=eventDate?new Date(eventDate+"T12:00:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"";
      const assignments=res.map(a=>({giverName:a.giver.name,giverEmail:a.giver.email,receiverName:a.receiver.name}));
      await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"organizer",to:organizerEmail,groupName:grp,assignments,budget:bud,eventDate:dateStr,eventPlace,message:emailMsg})});
      setOrganizerEmailSent(true);
    }catch(e){}
  };

  // Guardar en historial (localStorage, máximo 10)
  const saveToHistory=()=>{
    try{
      const entry={
        id:uid(),
        date:new Date().toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"}),
        grp,eventDate,eventPlace,bud,
        participants:res.map(a=>({giverName:a.giver.name,giverEmail:a.giver.email,receiverName:a.receiver.name})),
        total:res.length,
      };
      const prev=JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]");
      const updated=[entry,...prev].slice(0,MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY,JSON.stringify(updated));
      setHistory(updated);
    }catch(e){}
  };

  // Detectar cuando todos están enviados → disparar email organizador + guardar historial
  useEffect(()=>{
    if(!res||res.length===0)return;
    const allOk=res.every(a=>ems[a.giver.id]==="ok");
    if(allOk){
      sendOrganizerEmail();
      if(!historySavedRef.current){historySavedRef.current=true;saveToHistory();}
    }
  },[ems]);

  const resendEmail=(a)=>{
    setEms(p=>({...p,[a.giver.id]:undefined}));
    setTimeout(()=>sendOneEmail(a),100);
  };

  const saveEditedEmail=(giverId)=>{
    if(!editEmailVal||!editEmailVal.includes("@"))return setErr("Email no válido");
    setRes(prev=>prev.map(a=>a.giver.id===giverId?{...a,giver:{...a.giver,email:editEmailVal}}:a));
    setEms(p=>({...p,[giverId]:"err"}));
    setEditingEmail(null);
    setEditEmailVal("");
    setErr("");
  };

  const reset=()=>{
    setRes(null);setEms({});setStep("setup");setErr("");setPreviewFor(null);
    setPs([]);setEx([]);setGrp("");setEventDate("");setEventPlace("");setBud("");setEmailMsg("");
    setOrganizerEmail("");setOrganizerEmailSent(false);setSendOrganizerSummary(true);
    historySavedRef.current=false;
    sessionStorage.removeItem(SESSION_KEY);
  };

  const pn=id=>ps.find(p=>p.id===id)?.name||"?";

  const previewEmail=(a)=>{
    const l=[];
    l.push(`¡Hola ${a.giver.name}! 🎁`);l.push("");
    if(grp)l.push(`Sorteo: ${grp}`);
    l.push(`Tu amigo invisible es: ✨ ${a.receiver.name} ✨`);l.push("");
    if(bud)l.push(`💰 Presupuesto máximo: ${bud}`);
    if(eventDate)l.push(`📅 Fecha: ${new Date(eventDate+"T12:00:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}`);
    if(eventPlace)l.push(`📍 Lugar: ${eventPlace}`);
    if(emailMsg){l.push("");l.push("───────────────");l.push(emailMsg);}
    l.push("");l.push("¡Mucha suerte con el regalo! 🎄");
    return l.join("\n");
  };

  const exportToExcel=()=>{
    if(!res)return;
    const rows=[["Nombre","Email","→ Amigo Invisible","Estado"]];
    res.forEach(a=>{
      const estado=ems[a.giver.id]==="ok"?"Enviado":ems[a.giver.id]==="err"?"Error":"Pendiente";
      rows.push([a.giver.name, a.giver.email, a.receiver.name, estado]);
    });
    const csv="\uFEFF"+rows.map(r=>r.map(c=>`"${c}"`).join(";")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`amigo-invisible${grp?"-"+grp:""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allSent = res&&res.length>0&&res.every(a=>ems[a.giver.id]==="ok");
  const someSent = res&&Object.values(ems).some(s=>s==="ok");

  // JSX omitido por extensión — ver repositorio para el render completo
  // Incluye: Snow, header con botón historial, 4 dots de progreso,
  // paso 1 (datos+organizador), paso 2 (CSV+manual), paso 3 (exclusiones),
  // paso 4 (asignaciones con email, preview, reenvío, edición, Excel, enviar)
  // pantalla de historial accesible desde el header
}
```

### 6.7 `api/send-email.js` (Vercel Serverless Function)

Soporta dos modos según el campo `type` del body:

- **Sin `type`** (o `type` ausente): email normal a participante
- **`type: "organizer"`**: email resumen con tabla de asignaciones al organizador

Todos los datos de usuario se escapan con `esc()` antes de inyectarse en el HTML para prevenir XSS.

```javascript
function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const { type } = req.body;

  // Email resumen para el organizador
  if (type === "organizer") {
    const { to, organizerName, groupName, assignments, budget, eventDate, eventPlace, message } = req.body;
    if (!to || !assignments) return res.status(400).json({ error: "Missing required fields" });

    let html = '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:20px;">';
    html += '<h2 style="color:#e8364f;">Resumen del sorteo 🎁</h2>';
    if (groupName) html += '<p style="font-size:1.1em;font-weight:bold;">' + esc(groupName) + '</p>';
    if (budget) html += '<p><strong>Presupuesto:</strong> ' + esc(budget) + '</p>';
    if (eventDate) html += '<p><strong>Fecha:</strong> ' + esc(eventDate) + '</p>';
    if (eventPlace) html += '<p><strong>Lugar:</strong> ' + esc(eventPlace) + '</p>';
    if (message) html += '<p><strong>Instrucciones:</strong> ' + esc(message) + '</p>';
    html += '<hr style="border:1px dashed #ddd;margin:20px 0;">';
    html += '<h3 style="margin-bottom:12px;">Asignaciones:</h3>';
    html += '<table style="width:100%;border-collapse:collapse;">';
    html += '<tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;border:1px solid #ddd;">Regala</th><th style="padding:8px;text-align:left;border:1px solid #ddd;">Email</th><th style="padding:8px;text-align:left;border:1px solid #ddd;">→ Amigo invisible</th></tr>';
    assignments.forEach((a, i) => {
      const bg = i % 2 === 0 ? '#fff' : '#fafafa';
      html += '<tr style="background:' + bg + ';">';
      html += '<td style="padding:8px;border:1px solid #ddd;font-weight:bold;">' + esc(a.giverName) + '</td>';
      html += '<td style="padding:8px;border:1px solid #ddd;color:#888;font-size:0.85em;">' + esc(a.giverEmail) + '</td>';
      html += '<td style="padding:8px;border:1px solid #ddd;color:#d4a843;font-weight:bold;">' + esc(a.receiverName) + '</td>';
      html += '</tr>';
    });
    html += '</table>';
    html += '<p style="margin-top:30px;color:#aaa;font-size:0.8em;">Este email es solo para ti como organizador. Enviado con Amigo Invisible App</p></div>';

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Amigo Invisible <noreply@contact.yealva.es>",
          to: [to],
          subject: groupName ? "Resumen sorteo - " + groupName : "Resumen de tu sorteo",
          html,
        }),
      });
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data.message || "Resend error" });
      return res.status(200).json({ success: true, id: data.id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Email normal a participante
  const { to, giverName, receiverName, groupName, budget, eventDate, eventPlace, message } = req.body;
  if (!to || !giverName || !receiverName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  let html = '<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:20px;">';
  html += '<h2>Hola ' + esc(giverName) + '!</h2>';
  html += '<p style="font-size:1.1em;">Tu amigo invisible es:</p>';
  html += '<p style="font-size:1.5em;font-weight:bold;color:#d4a843;">' + esc(receiverName) + '</p>';
  if (groupName) html += '<p><strong>Sorteo:</strong> ' + esc(groupName) + '</p>';
  if (budget) html += '<p><strong>Presupuesto:</strong> ' + esc(budget) + '</p>';
  if (eventDate) html += '<p><strong>Fecha:</strong> ' + esc(eventDate) + '</p>';
  if (eventPlace) html += '<p><strong>Lugar:</strong> ' + esc(eventPlace) + '</p>';
  if (message) html += '<hr style="border:1px dashed #ddd;margin:20px 0;"><p>' + esc(message) + '</p>';
  html += '<p style="margin-top:30px;color:#aaa;font-size:0.8em;">Enviado con Amigo Invisible App</p></div>';
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Amigo Invisible <noreply@contact.yealva.es>",
        to: [to],
        subject: groupName ? "Tu amigo invisible - " + groupName : "Tu amigo invisible",
        html: html,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || "Resend error" });
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

### 6.8 `public/ejemplo.csv`

```csv
nombre;email;exclusion
Maria;maria@ejemplo.com;Pedro
Pedro;pedro@ejemplo.com;Maria
Laura;laura@ejemplo.com;
Carlos;carlos@ejemplo.com;
Ana;ana@ejemplo.com;Carlos
```

---

## 7. Despliegue

### 7.1 GitHub

1. Repositorio público en `github.com/Franjalgu/amigo-invisible`
2. Rama principal: `main`
3. Vercel escucha push automáticamente y despliega

Flujo de trabajo:
```bash
git add .
git commit -m "descripción del cambio"
git push
```

### 7.2 Vercel

1. Proyecto conectado a GitHub
2. Framework Preset: **Vite**
3. Variable de entorno: `RESEND_API_KEY` = API key de Resend (key "amigo-invisible")
4. Tras cambiar variables de entorno → Redeploy manual necesario

**URL producción:** `amigoinvisible.yealva.es`

### 7.3 Resend

- **Cuenta:** resend.com
- **API Key activa:** `amigo-invisible` (re_XsUv...)
- **Dominio verificado:** `contact.yealva.es` (región: Ireland eu-west-1)
- **Remitente:** `noreply@contact.yealva.es`
- **Límite plan gratuito:** 100 emails/día, 3.000/mes

### 7.4 Dominio (IONOS)

**Subdominio app:** CNAME `amigoinvisible` → valor específico de Vercel (no el genérico)

**Registros DNS para Resend en `contact.yealva.es`:**

| Tipo | Nombre/Host | Valor |
|------|------------|-------|
| TXT | `resend._domainkey.contact` | Clave DKIM larga (copiar de Resend) |
| MX | `send.contact` | `feedback-smtp.....amazonses.com` (prioridad 10) |
| TXT | `send.contact` | `v=spf1 include...amazonses.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

**Nota:** El aviso de IONOS "el servicio se desactivará" al reemplazar el DMARC es normal — sustituye la config por defecto de IONOS.

**Limitación conocida:** El dominio `lkidiomas.com` rebota emails de `contact.yealva.es` (bounce). Para resolverlo habría que modificar el SPF de `lkidiomas.com` — requiere acceso admin al DNS de ese dominio.

---

## 8. Algoritmo de Sorteo

Fuerza bruta con shuffle aleatorio:

1. Copia la lista de participantes como "givers"
2. Shuffle aleatorio como "receivers"
3. Comprueba que ningún giver se toque a sí mismo
4. Comprueba que no se viole ninguna exclusión (bidireccional)
5. Si válido → devuelve asignaciones
6. Si no → reintenta (máximo 1000 intentos)
7. Si no encuentra solución → devuelve null y muestra error

---

## 9. Emails

### Email a participante
- Saludo con nombre del giver
- Nombre del receiver en dorado
- Nombre del grupo, presupuesto, fecha, lugar
- Instrucciones del organizador
- Remitente: `Amigo Invisible <noreply@contact.yealva.es>`

### Email al organizador (resumen)
- Se envía automáticamente cuando todos los participantes tienen estado "Enviado"
- Solo se envía una vez por sorteo (`organizerEmailSent` flag)
- Contiene tabla HTML con: nombre, email y asignación de cada participante
- Asunto: `Resumen sorteo - {nombre del grupo}`

---

## 10. Variables de Estado (App.jsx)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `ps` | array | Lista de participantes `{id, name, email}` |
| `ex` | array | Exclusiones `{id, a, b}` (ids de participantes) |
| `res` | array | Asignaciones del sorteo `{giver, receiver}` |
| `step` | string | Paso actual: `setup / add / ex / done` |
| `grp` | string | Nombre del grupo/evento |
| `eventDate` | string | Fecha del intercambio (formato YYYY-MM-DD) |
| `eventPlace` | string | Lugar del intercambio |
| `bud` | string | Presupuesto |
| `emailMsg` | string | Instrucciones para el email |
| `organizerEmail` | string | Email del organizador |
| `ems` | object | Estado de envío por giver.id: `go/ok/err/undefined` |
| `history` | array | Sorteos guardados en localStorage |
| `showHistory` | bool | Mostrar/ocultar pantalla de historial |
| `organizerEmailSent` | bool | Flag para no reenviar el resumen al organizador (persistido en sesión) |
| `sendOrganizerSummary` | bool | Checkbox — si true envía resumen al organizador al completar (persistido en sesión) |
| `editingEmail` | string\|null | giver.id del email que se está editando |
| `historySavedRef` | useRef(bool) | Guard para evitar guardar entradas duplicadas en el historial |

---

## 11. Almacenamiento

| Clave | Dónde | Qué guarda | Cuándo se borra |
|-------|-------|-----------|----------------|
| `amigo-invisible-sorteo` | `sessionStorage` | Estado completo del sorteo en curso (incluye `organizerEmailSent` y `sendOrganizerSummary`) | Al hacer "Nuevo sorteo" o cerrar el navegador |
| `amigo-invisible-historial` | `localStorage` | Últimos 10 sorteos completados | Nunca (manual) |

---

*Proyecto concluido: marzo 2026. Última actualización: 6 marzo 2026 (fix XSS, persistencia sesión, dedup historial).*
