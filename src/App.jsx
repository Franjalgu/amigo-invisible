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
  const nr=useRef(null);
  const fileRef=useRef(null);

  // --- SESIÓN: cargar al montar ---
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
      }
      // Cargar historial de localStorage
      const hist = localStorage.getItem(HISTORY_KEY);
      if(hist) setHistory(JSON.parse(hist));
    } catch(e){}
  },[]);

  // --- SESIÓN: guardar al cambiar estado relevante ---
  useEffect(()=>{
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ps,ex,res,step,grp,eventDate,eventPlace,bud,emailMsg,ems,organizerEmail}));
    } catch(e){}
  },[ps,ex,res,step,grp,eventDate,eventPlace,bud,emailMsg,ems,organizerEmail]);

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

  // Solo envía a los que están pendientes o con error (no los ya enviados)
  const sendAll=async()=>{
    const pending=res.filter(a=>ems[a.giver.id]!=="ok"&&ems[a.giver.id]!=="go");
    for(let i=0;i<pending.length;i++){
      await new Promise(r=>setTimeout(r,i*400));
      await sendOneEmail(pending[i]);
    }
  };

  // Enviar email resumen al organizador
  const sendOrganizerEmail=async(currentEms)=>{
    if(!organizerEmail||organizerEmailSent)return;
    try{
      const dateStr=eventDate?new Date(eventDate+"T12:00:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"";
      const assignments=res.map(a=>({giverName:a.giver.name,giverEmail:a.giver.email,receiverName:a.receiver.name}));
      await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"organizer",to:organizerEmail,groupName:grp,assignments,budget:bud,eventDate:dateStr,eventPlace,message:emailMsg})});
      setOrganizerEmailSent(true);
    }catch(e){}
  };

  // Guardar sorteo en historial (localStorage)
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

  // Reenviar email fallido
  const resendEmail=(a)=>{
    setEms(p=>({...p,[a.giver.id]:undefined}));
    setTimeout(()=>sendOneEmail(a),100);
  };

  // Guardar nuevo email editado
  const saveEditedEmail=(giverId)=>{
    if(!editEmailVal||!editEmailVal.includes("@"))return setErr("Email no válido");
    setRes(prev=>prev.map(a=>a.giver.id===giverId?{...a,giver:{...a.giver,email:editEmailVal}}:a));
    setEms(p=>({...p,[giverId]:"err"})); // marcar como err para mostrar botón reenviar
    setEditingEmail(null);
    setEditEmailVal("");
    setErr("");
  };

  // Detectar cuando todos los emails están enviados
  useEffect(()=>{
    if(!res||res.length===0)return;
    const allOk=res.every(a=>ems[a.giver.id]==="ok");
    if(allOk){
      sendOrganizerEmail(ems);
      saveToHistory();
    }
  },[ems]);

  const reset=()=>{
    setRes(null);setEms({});setStep("setup");setErr("");setPreviewFor(null);
    setPs([]);setEx([]);setGrp("");setEventDate("");setEventPlace("");setBud("");setEmailMsg("");
    setOrganizerEmail("");setOrganizerEmailSent(false);
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

  // --- EXPORTAR A EXCEL ---
  const exportToExcel=()=>{
    if(!res)return;
    // Construir CSV con BOM para Excel
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

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;min-height:100vh}
        .W{position:relative;z-index:1;max-width:560px;margin:0 auto;padding:40px 20px 60px}
        .H{text-align:center;margin-bottom:28px}
        .HI{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;background:${C.accentSoft};color:${C.accent};margin-bottom:12px;animation:gl 3s ease-in-out infinite}
        @keyframes gl{0%,100%{box-shadow:0 0 0 0 ${C.accentGlow}}50%{box-shadow:0 0 18px 4px ${C.accentGlow}}}
        .H h1{font-family:'Crimson Pro',serif;font-size:1.9rem;font-weight:700;letter-spacing:-0.02em}
        .H h1 em{font-style:normal;color:${C.accent}}
        .H p{color:${C.muted};font-size:0.84rem;margin-top:3px}
        .D{display:flex;gap:7px;justify-content:center;margin-bottom:22px}
        .d{width:26px;height:4px;border-radius:2px;background:${C.border};transition:all .4s}
        .d.on{background:${C.accent};width:40px}.d.ok{background:${C.ok}}
        .K{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:20px;margin-bottom:12px}
        .KT{font-family:'Crimson Pro',serif;font-size:1.05rem;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
        .bg{font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:700;background:${C.accentSoft};color:${C.accent};padding:2px 8px;border-radius:10px}
        .R{display:flex;gap:8px;margin-bottom:8px}
        input,select,textarea{background:${C.bg};border:1.5px solid ${C.border};border-radius:10px;padding:9px 13px;color:${C.text};font-family:'DM Sans',sans-serif;font-size:.84rem;outline:none;transition:border-color .2s;width:100%;resize:vertical}
        input:focus,select:focus,textarea:focus{border-color:${C.accent}}
        input::placeholder,textarea::placeholder{color:${C.muted};opacity:.5}
        select{cursor:pointer}select option{background:${C.card}}
        .GI{text-align:center;font-family:'Crimson Pro',serif;font-size:1rem;font-weight:600;border-style:dashed}
        .B{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
        .B:active{transform:scale(.97)}.B:disabled{opacity:.35;cursor:not-allowed}
        .Ba{background:${C.accent};color:#fff}.Ba:hover{filter:brightness(1.1)}
        .Bg{background:${C.goldSoft};color:${C.gold};border:1px solid rgba(212,168,67,.25)}.Bg:hover{background:rgba(212,168,67,.2)}
        .Bo{background:transparent;color:${C.muted};border:1px solid ${C.border}}.Bo:hover{border-color:${C.accent};color:${C.accent}}
        .Bs{background:${C.okSoft};color:${C.ok};border:1px solid rgba(52,211,153,.25)}
        .Bd{background:rgba(100,100,255,0.1);color:#a0a0ff;border:1px solid rgba(100,100,255,.25)}.Bd:hover{background:rgba(100,100,255,0.2)}
        .BF{width:100%}.BR{display:flex;gap:8px;margin-top:14px}.BR .B{flex:1}
        .BX{width:28px;height:28px;padding:0;border-radius:7px;background:transparent;color:${C.muted};border:1px solid transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .2s}
        .BX:hover{color:${C.err};border-color:${C.err};background:${C.errSoft}}
        .BXs{width:26px;height:26px;padding:0;border-radius:6px;background:transparent;border:1px solid transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
        .BXs.re{color:${C.gold}}.BXs.re:hover{background:${C.goldSoft};border-color:rgba(212,168,67,.3)}
        .BXs.ed{color:${C.muted}}.BXs.ed:hover{color:${C.accent};background:${C.accentSoft};border-color:rgba(232,54,79,.3)}
        .PL{display:flex;flex-direction:column;gap:5px;margin-top:12px}
        .PI{display:flex;align-items:center;gap:9px;padding:9px 11px;background:${C.bg};border-radius:9px;border:1px solid ${C.border};animation:si .3s ease}
        @keyframes si{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
        .AV{width:28px;height:28px;border-radius:50%;background:${C.accentSoft};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;flex-shrink:0}
        .PN{font-weight:600;font-size:.84rem}.PE{font-size:.7rem;color:${C.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .EI{display:flex;align-items:center;gap:7px;padding:7px 11px;background:${C.errSoft};border:1px solid rgba(248,113,113,.2);border-radius:9px;font-size:.78rem;animation:si .3s ease}
        .EN{flex:1;color:${C.err};font-weight:500}
        .ER{background:${C.errSoft};border:1px solid rgba(248,113,113,.25);color:${C.err};padding:9px 13px;border-radius:10px;font-size:.78rem;margin-bottom:10px;animation:si .3s ease}
        .OKB{background:${C.okSoft};border:1px solid rgba(52,211,153,.25);color:${C.ok};padding:9px 13px;border-radius:10px;font-size:.78rem;margin-bottom:10px;animation:si .3s ease}
        .AI{display:flex;align-items:center;gap:9px;padding:11px 13px;background:${C.bg};border:1px solid ${C.border};border-radius:10px;margin-bottom:5px;animation:si .3s ease;cursor:pointer;transition:border-color .2s}
        .AI:hover{border-color:${C.gold}}
        .AA{color:${C.gold};font-size:1rem;flex-shrink:0}.AN{font-weight:600;font-size:.84rem}
        .AE{font-size:.68rem;color:${C.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px}
        .EB{font-size:.68rem;font-weight:600;padding:3px 7px;border-radius:7px;margin-left:auto;flex-shrink:0;display:flex;align-items:center;gap:3px}
        .EB.ok{background:${C.okSoft};color:${C.ok}}.EB.go{background:${C.goldSoft};color:${C.gold}}.EB.err{background:${C.errSoft};color:${C.err}}.EB.no{background:${C.bg};color:${C.muted};border:1px solid ${C.border}}
        .AI-actions{display:flex;align-items:center;gap:4px;flex-shrink:0}
        .edit-email-row{padding:8px 13px 10px;background:${C.bg};border:1px solid ${C.accent};border-top:none;border-radius:0 0 10px 10px;margin-top:-5px;margin-bottom:5px;display:flex;gap:8px;align-items:center;animation:si .2s ease}
        .edit-email-row input{font-size:.78rem;padding:6px 10px}
        .edit-email-row .B{padding:6px 10px;font-size:.75rem}
        .RH{text-align:center;margin-bottom:16px}.RH h2{font-family:'Crimson Pro',serif;font-size:1.35rem;font-weight:700}
        .BN{font-size:2rem;margin-bottom:5px;animation:bn 1s ease infinite}@keyframes bn{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .BT{display:inline-flex;align-items:center;gap:4px;font-family:'Crimson Pro',serif;font-size:.85rem;color:${C.gold};background:${C.goldSoft};padding:3px 10px;border-radius:7px;margin:3px}
        .FN{text-align:center;font-size:.68rem;color:${C.muted};margin-top:18px;opacity:.45}
        .HN{text-align:center;font-size:.73rem;color:${C.muted};margin-top:7px}
        .FA{animation:fu .4s ease}@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .info-flex{flex:1;min-width:0}
        .drop-zone{border:2px dashed ${C.border};border-radius:12px;padding:18px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:8px}
        .drop-zone:hover{border-color:${C.accent};background:${C.accentSoft}}
        .drop-zone p{color:${C.muted};font-size:.78rem;margin-top:5px}
        .sep{display:flex;align-items:center;gap:10px;margin:12px 0;color:${C.muted};font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em}
        .sep::before,.sep::after{content:"";flex:1;height:1px;background:${C.border}}
        .preview-box{background:${C.bg};border:1px solid ${C.border};border-radius:10px;padding:14px;font-size:.78rem;white-space:pre-wrap;line-height:1.5;color:${C.text};margin:4px 0 8px;animation:si .3s ease}
        .preview-close{font-size:.7rem;color:${C.muted};cursor:pointer;text-align:right;margin-top:6px}
        .preview-close:hover{color:${C.accent}}
        .lbl{font-size:.7rem;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
        .fg{margin-bottom:10px}
        .session-banner{background:${C.goldSoft};border:1px solid rgba(212,168,67,.25);border-radius:10px;padding:9px 13px;font-size:.76rem;color:${C.gold};margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}
        .hist-btn{position:absolute;right:0;top:0;background:transparent;border:1px solid ${C.border};border-radius:8px;padding:5px 10px;color:${C.muted};cursor:pointer;font-size:.72rem;display:flex;align-items:center;gap:5px;transition:all .2s}
        .hist-btn:hover{border-color:${C.accent};color:${C.accent}}
        .hist-entry{background:${C.bg};border:1px solid ${C.border};border-radius:10px;padding:13px;margin-bottom:8px;animation:si .3s ease}
        .hist-entry:hover{border-color:${C.gold};cursor:pointer}
        .hist-date{font-size:.68rem;color:${C.muted};margin-bottom:3px}
        .hist-name{font-weight:600;font-size:.9rem;font-family:'Crimson Pro',serif}
        .hist-meta{font-size:.72rem;color:${C.muted};margin-top:3px}
        .hist-assignments{margin-top:10px;display:flex;flex-direction:column;gap:3px}
        .hist-row{font-size:.75rem;display:flex;align-items:center;gap:6px;padding:4px 8px;background:${C.card};border-radius:6px}
      `}</style>
      <Snow/>
      <div className="W">
        <div className="H" style={{position:"relative"}}>
          <button className="hist-btn" onClick={()=>setShowHistory(!showHistory)}>
            <History/> Historial {history.length>0&&`(${history.length})`}
          </button>
          <div className="HI"><Gift/></div>
          <h1>Amigo <em>Invisible</em></h1>
          <p>Sortea, pon exclusiones y envía resultados por email</p>
        </div>
        <div className="D">
          <div className={`d ${step==="setup"?"on":["add","ex","done"].includes(step)?"ok":""}`}/>
          <div className={`d ${step==="add"?"on":["ex","done"].includes(step)?"ok":""}`}/>
          <div className={`d ${step==="ex"?"on":step==="done"?"ok":""}`}/>
          <div className={`d ${step==="done"?"on":""}`}/>
        </div>
        {err&&<div className="ER">{err}</div>}
        {importResult&&<div className="OKB">✅ Importados: {importResult.added} participantes{importResult.exAdded>0&&`, ${importResult.exAdded} exclusiones`}{importResult.skipped>0&&` (${importResult.skipped} omitidos)`}</div>}

        {/* HISTORIAL */}
        {showHistory&&(
          <div className="FA">
            <div className="K">
              <div className="KT"><History/> Historial de sorteos</div>
              {history.length===0?(
                <p style={{fontSize:".78rem",color:C.muted,textAlign:"center",padding:"20px 0"}}>Aún no hay sorteos guardados</p>
              ):(
                history.map(h=>(
                  <div className="hist-entry" key={h.id}>
                    <div className="hist-date">{h.date}</div>
                    <div className="hist-name">{h.grp||"Sin nombre"}</div>
                    <div className="hist-meta">
                      {h.total} participantes
                      {h.eventDate&&` · ${new Date(h.eventDate+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}`}
                      {h.eventPlace&&` · ${h.eventPlace}`}
                      {h.bud&&` · ${h.bud}`}
                    </div>
                    <div className="hist-assignments">
                      {h.participants.map((p,i)=>(
                        <div className="hist-row" key={i}>
                          <span style={{fontWeight:600}}>{p.giverName}</span>
                          <span style={{color:C.gold}}>→</span>
                          <span style={{color:C.gold,fontWeight:600}}>{p.receiverName}</span>
                          <span style={{color:C.muted,marginLeft:"auto",fontSize:".68rem"}}>{p.giverEmail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
              <button className="B Bo BF" style={{marginTop:8}} onClick={()=>setShowHistory(false)}><ArrowLeft/> Volver</button>
            </div>
          </div>
        )}

        {/* STEP 1: SETUP */}
        {!showHistory&&step==="setup"&&(
          <div className="FA">
            <div className="K">
              <div className="KT"><Gift/> Datos del evento</div>
              <div className="fg">
                <div className="lbl">Nombre del grupo / evento</div>
                <input className="GI" placeholder="Ej: Navidad Oficina 2026" value={grp} onChange={e=>setGrp(e.target.value)}/>
              </div>
              <div className="R">
                <div className="fg" style={{flex:1}}>
                  <div className="lbl">📅 Fecha del intercambio</div>
                  <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)}/>
                </div>
                <div className="fg" style={{flex:1}}>
                  <div className="lbl">💰 Presupuesto</div>
                  <input placeholder="Ej: 20€" value={bud} onChange={e=>setBud(e.target.value)}/>
                </div>
              </div>
              <div className="fg">
                <div className="lbl">📍 Lugar (opcional)</div>
                <input placeholder="Ej: Restaurante La Buena Vida" value={eventPlace} onChange={e=>setEventPlace(e.target.value)}/>
              </div>
              <div className="fg">
                <div className="lbl">📧 Tu email (organizador)</div>
                <input type="email" placeholder="Ej: organizador@email.com" value={organizerEmail} onChange={e=>setOrganizerEmail(e.target.value)}/>
                <p style={{fontSize:".68rem",color:C.muted,marginTop:4}}>Recibirás un resumen con todas las asignaciones cuando se envíen todos los emails.</p>
              </div>
            </div>
            <div className="K">
              <div className="KT"><FileText/> Instrucciones para el email</div>
              <p style={{fontSize:".76rem",color:C.muted,marginBottom:10}}>Mensaje que recibirá cada participante junto con el nombre de su amigo invisible.</p>
              <textarea rows={3} placeholder="Ej: Recordad que el regalo tiene que ser hecho a mano o de segunda mano. Máximo 20€. ¡Nos vemos el viernes a las 14h!" value={emailMsg} onChange={e=>setEmailMsg(e.target.value)}/>
            </div>
            <div className="BR">
              <button className="B Bg BF" onClick={()=>{setErr("");setStep("add")}}>Siguiente: Participantes →</button>
            </div>
          </div>
        )}

        {/* STEP 2: PARTICIPANTS */}
        {!showHistory&&step==="add"&&(
          <div className="FA">
            <div className="K">
              <div className="KT"><Upload/> Importar desde CSV</div>
              <div className="drop-zone" onClick={()=>fileRef.current?.click()}>
                <Upload/>
                <p>Pulsa para subir un archivo .csv</p>
                <p style={{fontSize:".68rem",marginTop:3,opacity:.5}}>Columnas: nombre, email, exclusion (opcional)</p>
              </div>
              <input ref={fileRef} type="file" accept=".csv,.txt,.tsv" style={{display:"none"}} onChange={handleFileImport}/>
              <p style={{fontSize:".68rem",color:C.muted,lineHeight:1.4}}>
                <strong>Ejemplo:</strong> <code style={{background:C.bg,padding:"1px 4px",borderRadius:4,fontSize:".68rem"}}>Juan;juan@mail.com;María,Pedro</code>
              </p>
            </div>
            <div className="sep">o añade manualmente</div>
            <div className="K">
              <div className="KT"><Plus/> Participantes {ps.length>0&&<span className="bg">{ps.length}</span>}</div>
              <div className="R">
                <input ref={nr} placeholder="Nombre" value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
                <input type="email" placeholder="email@ejemplo.com" value={em} onChange={e=>setEm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
              </div>
              <button className="B Ba BF" onClick={add}><Plus/> Añadir</button>
              {ps.length>0&&<div className="PL">{ps.map(p=>(
                <div className="PI" key={p.id}>
                  <div className="AV">{p.name.charAt(0).toUpperCase()}</div>
                  <div className="info-flex"><div className="PN">{p.name}</div><div className="PE">{p.email}</div></div>
                  <button className="BX" onClick={()=>rm(p.id)}><Trash/></button>
                </div>
              ))}</div>}
            </div>
            <div className="BR">
              <button className="B Bo" onClick={()=>{setErr("");setStep("setup")}}>← Volver</button>
              <button className="B Bg" disabled={ps.length<3} onClick={()=>{setErr("");setStep("ex")}}>Siguiente: Exclusiones →</button>
            </div>
            {ps.length>0&&ps.length<3&&<p className="HN">Mínimo 3 participantes</p>}
          </div>
        )}

        {/* STEP 3: EXCLUSIONS */}
        {!showHistory&&step==="ex"&&(
          <div className="FA">
            <div className="K">
              <div className="KT"><Ban/> Exclusiones {ex.length>0&&<span className="bg">{ex.length}</span>}</div>
              <p style={{fontSize:".76rem",color:C.muted,marginBottom:11}}>¿Hay personas que NO deberían tocarse? (parejas, familia...)</p>
              <div className="R">
                <select value={ea} onChange={e=>setEa(e.target.value)}><option value="">Persona 1</option>{ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <span style={{color:C.muted,alignSelf:"center",fontSize:".78rem"}}>↔</span>
                <select value={eb} onChange={e=>setEb(e.target.value)}><option value="">Persona 2</option>{ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
              </div>
              <button className="B Bo BF" onClick={addEx}><Ban/> Añadir exclusión</button>
              {ex.length>0&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
                {ex.map(e=><div className="EI" key={e.id}><Ban/><span className="EN">{pn(e.a)} ↔ {pn(e.b)}</span><button className="BX" onClick={()=>setEx(ex.filter(x=>x.id!==e.id))}><Trash/></button></div>)}
              </div>}
            </div>
            <div className="BR">
              <button className="B Bo" onClick={()=>{setErr("");setStep("add")}}>← Volver</button>
              <button className="B Ba" onClick={sorteo}><Shuf/> Sortear</button>
            </div>
            {ex.length===0&&<p className="HN">Sin exclusiones puedes sortear directamente</p>}
          </div>
        )}

        {/* STEP 4: RESULTS */}
        {!showHistory&&step==="done"&&res&&(
          <div className="FA">
            <div className="RH">
              <div className="BN">🎉</div>
              <h2>¡Sorteo completado!</h2>
              {grp&&<p style={{color:C.muted,fontSize:".84rem"}}>{grp}</p>}
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",marginTop:4}}>
                {bud&&<span className="BT">🎁 {bud}</span>}
                {eventDate&&<span className="BT">📅 {new Date(eventDate+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>}
                {eventPlace&&<span className="BT">📍 {eventPlace}</span>}
              </div>
            </div>
            <div className="K">
              <div className="KT"><Star/> Asignaciones <span className="bg">{res.length} regalos</span></div>
              <p style={{fontSize:".7rem",color:C.muted,marginBottom:8}}>Pulsa en una fila para previsualizar el email</p>
              {res.map(a=>(
                <div key={a.giver.id}>
                  <div className="AI" onClick={()=>{if(editingEmail!==a.giver.id)setPreviewFor(previewFor===a.giver.id?null:a.giver.id)}}>
                    <div className="AV">{a.giver.name.charAt(0).toUpperCase()}</div>
                    <div className="info-flex">
                      <div className="AN">{a.giver.name} <span className="AA">→</span> <span style={{color:C.gold}}>{a.receiver.name}</span></div>
                      <div className="AE">{a.giver.email}</div>
                    </div>
                    <div className="AI-actions" onClick={e=>e.stopPropagation()}>
                      {/* Botón reenviar si hay error */}
                      {ems[a.giver.id]==="err"&&(
                        <button className="BXs re" title="Reenviar email" onClick={()=>resendEmail(a)}><Refresh/></button>
                      )}
                      {/* Botón editar email */}
                      <button className="BXs ed" title="Editar email" onClick={()=>{
                        if(editingEmail===a.giver.id){setEditingEmail(null);}
                        else{setEditingEmail(a.giver.id);setEditEmailVal(a.giver.email);setPreviewFor(null);}
                      }}><Edit/></button>
                      <span className={`EB ${ems[a.giver.id]==="ok"?"ok":ems[a.giver.id]==="go"?"go":ems[a.giver.id]==="err"?"err":"no"}`}>
                        {ems[a.giver.id]==="ok"?<><Check/> Enviado</>:ems[a.giver.id]==="go"?"Enviando...":ems[a.giver.id]==="err"?"Error":<><Mail/> Pendiente</>}
                      </span>
                    </div>
                  </div>
                  {/* Editar email inline */}
                  {editingEmail===a.giver.id&&(
                    <div className="edit-email-row" onClick={e=>e.stopPropagation()}>
                      <input type="email" value={editEmailVal} onChange={e=>setEditEmailVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEditedEmail(a.giver.id);if(e.key==="Escape")setEditingEmail(null);}} autoFocus placeholder="nuevo@email.com"/>
                      <button className="B Ba" onClick={()=>saveEditedEmail(a.giver.id)}>Guardar</button>
                      <button className="B Bo" onClick={()=>setEditingEmail(null)}>✕</button>
                    </div>
                  )}
                  {previewFor===a.giver.id&&<div className="preview-box">{previewEmail(a)}<div className="preview-close" onClick={()=>setPreviewFor(null)}>cerrar ✕</div></div>}
                </div>
              ))}
            </div>
            {emailMsg&&(
              <div className="K" style={{background:"transparent",border:`1px dashed ${C.border}`}}>
                <div className="KT"><FileText/> Instrucciones incluidas</div>
                <p style={{fontSize:".78rem",color:C.muted,lineHeight:1.5}}>{emailMsg}</p>
              </div>
            )}
            <div className="BR">
              <button className="B Bo" onClick={reset}>← Nuevo sorteo</button>
              <button className="B Bd" onClick={exportToExcel}><Download/> Excel</button>
              <button className="B Bs" onClick={sendAll} disabled={allSent}>
                <Mail/> {allSent?"Emails enviados":"Enviar emails"}
              </button>
            </div>
            {someSent&&!allSent&&<p className="HN" style={{color:C.gold}}>Algunos emails fallaron — usa el botón 🔄 para reenviar</p>}
          </div>
        )}
      </div>
    </>
  );
}
