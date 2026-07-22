import{k as c,u as m,r as p,j as e,H as u,X as x}from"./index-DfmKz0js-1784747795006.js";import{S as b}from"./shield-alert-B5t4OhwK-1784747795006.js";function y(){const{codigo:a}=c(),i=m();if(p.useEffect(()=>{const r=n=>n.preventDefault(),o=n=>{if(n.key==="F12"||n.ctrlKey&&n.shiftKey&&(n.key==="I"||n.key==="J")||n.ctrlKey&&(n.key==="U"||n.key==="u"||n.key==="P"||n.key==="p"))return n.preventDefault(),!1};document.addEventListener("contextmenu",r),document.addEventListener("keydown",o);const s=document.createElement("style");return s.innerHTML=`
      @media print {
        body * {
          display: none !important;
        }
        body:after {
          content: "Impressão de propostas bloqueada por motivos de segurança e direitos de autor.";
          display: block;
          text-align: center;
          font-family: sans-serif;
          font-size: 24px;
          margin-top: 50px;
        }
      }
      body {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `,document.head.appendChild(s),()=>{document.removeEventListener("contextmenu",r),document.removeEventListener("keydown",o),document.head.removeChild(s)}},[]),!a)return i("/services"),null;const d=r=>{try{const o=r.target,s=o.contentDocument||o.contentWindow?.document;if(s){s.addEventListener("click",t=>{const l=t.target;l.closest("#umbulab-panel")||l.closest("#open-panel-btn")||l.closest("#success-modal")||(t.preventDefault(),t.stopPropagation())},!0),s.addEventListener("contextmenu",t=>t.preventDefault(),!0),s.addEventListener("keydown",t=>{if(t.key==="F12"||t.ctrlKey&&t.shiftKey&&(t.key==="I"||t.key==="J")||t.ctrlKey&&(t.key==="U"||t.key==="u"||t.key==="P"||t.key==="p"))return t.preventDefault(),!1},!0);const n=s.createElement("style");n.innerHTML=`
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) {
            user-select: none !important;
            -webkit-user-select: none !important;
          }
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) a, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) button, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) input, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) textarea, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) select {
            pointer-events: none !important;
          }
          @media print {
            body { display: none !important; }
          }
        `,s.head.appendChild(n)}}catch{console.warn("Proteção de iframe parcial: origin cruzado ou falha no acesso.")}};return e.jsxs(e.Fragment,{children:[e.jsxs(u,{children:[e.jsx("title",{children:"Visualização de Proposta | UmbuLab"}),e.jsx("meta",{name:"robots",content:"noindex, nofollow"})]}),e.jsxs("div",{className:"fixed inset-0 z-[99999] bg-black overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"bg-neutral-900 text-white p-3 flex items-center justify-between border-b border-neutral-800 shrink-0 shadow-lg relative z-50",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20",children:e.jsx(b,{size:20})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-black uppercase tracking-widest text-neutral-300",children:"Modo de Visualização Seguro"}),e.jsx("p",{className:"text-[10px] text-amber-500/80 font-medium",children:"Interações, cópias e impressões desativadas"})]})]}),e.jsxs("div",{className:"hidden sm:flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl border border-white/5",children:[e.jsx("span",{className:"text-xs text-neutral-500",children:"Proposta de Referência:"}),e.jsx("span",{className:"font-mono text-sm font-bold text-white tracking-wider",children:a.toUpperCase()})]}),e.jsxs("button",{onClick:()=>i("/services"),className:"flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-500/20",children:[e.jsx(x,{size:16}),e.jsx("span",{className:"hidden sm:inline",children:"Fechar Visualização"})]})]}),e.jsxs("div",{className:"relative flex-1 w-full h-full bg-white overflow-hidden",children:[e.jsx("iframe",{src:`/propostas/${a}/index.html`,className:"w-full h-full border-none",title:`Proposta ${a}`,onLoad:d}),e.jsx("div",{className:"absolute inset-0 pointer-events-none flex items-center justify-center z-[60] overflow-hidden mix-blend-multiply opacity-[0.03]",children:e.jsxs("div",{className:"transform -rotate-45 text-black font-black text-6xl sm:text-8xl md:text-[120px] tracking-tighter whitespace-nowrap select-none flex flex-col items-center",children:[e.jsx("span",{children:"PROPOSTA EM"}),e.jsx("span",{children:"DESENVOLVIMENTO"})]})})]})]})]})}export{y as ProposalViewer};
