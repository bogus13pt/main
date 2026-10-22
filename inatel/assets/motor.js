(function(){
const J=window.JOGADA,NS='http://www.w3.org/2000/svg',B=[198,67],D=J.duracao||1900;
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const temAlt=J.alternativas&&J.alternativas.length>0;
document.title=J.titulo;
const root=document.getElementById('jogada');
root.innerHTML=
'<a class="voltar" href="index.html"><img src="assets/bola.svg" alt="">Voltar às jogadas</a>'+
'<h1>'+J.titulo+'</h1><p class="lead">'+J.intro+'</p>'+
'<div class="court"><svg viewBox="0 0 400 345" role="img" aria-label="Meio-campo com a animação da jogada">'+
'<defs><pattern id="planks" width="24" height="345" patternUnits="userSpaceOnUse"><rect width="24" height="345" fill="var(--wood)"/><rect x="12" width="12" height="345" fill="var(--wood2)" opacity=".45"/></pattern></defs>'+
'<rect width="400" height="345" fill="url(#planks)"/>'+
'<g fill="none" stroke="var(--line)" stroke-width="2"><rect x="34" y="20" width="328" height="322"/><rect x="158" y="20" width="79" height="138"/><path d="M158 158 A40 40 0 0 0 237 158"/><path d="M55 20 L55 100 A146 146 0 0 0 340 100 L340 20"/><path d="M158 342 A40 40 0 0 1 237 342"/><line x1="178" y1="58" x2="218" y2="58"/><circle cx="198" cy="67" r="6"/></g>'+
'<g id="tr" fill="none" stroke="var(--trail)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></g><g id="pl"></g>'+
'<circle id="ball" r="6" fill="var(--ball)" stroke="var(--ink)" stroke-width=".8"/></svg></div>'+
'<div class="prog" id="prog"></div><p class="cap" id="cap" aria-live="polite"></p>'+
'<div class="row"><button id="prev">Anterior</button><button id="next" class="primary">Seguinte</button><button id="all">Ver jogada completa</button><button id="rst">Reiniciar</button></div>'+
(temAlt?'<div class="alts"><p>'+(J.perguntaAlternativas||'Leitura após a última fase')+'</p><div class="row">'+
J.alternativas.map((a,k)=>'<button class="alt" data-a="'+k+'">'+a.rotulo+'</button>').join('')+'</div></div>':'')+
'<div class="legend" aria-hidden="true">'+
'<span><svg viewBox="0 0 30 12"><line x1="2" y1="6" x2="28" y2="6" stroke="var(--ink)" stroke-width="2"/></svg>Deslocação</span>'+
'<span><svg viewBox="0 0 30 12"><path d="M2 6 q3 -5 6 0 t6 0 t6 0 t6 0" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>Drible</span>'+
'<span><svg viewBox="0 0 30 12"><line x1="2" y1="6" x2="28" y2="6" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/></svg>Passe</span>'+
'<span><svg viewBox="0 0 30 12"><line x1="2" y1="6" x2="22" y2="6" stroke="var(--ink)" stroke-width="2"/><line x1="24" y1="0" x2="24" y2="12" stroke="var(--ink)" stroke-width="3"/></svg>Bloqueio</span></div>'+
'<ol class="fases">'+(J.resumo||[]).map(t=>'<li>'+t+'</li>').join('')+'</ol>';
const $=id=>document.getElementById(id);
const cl=o=>JSON.parse(JSON.stringify(o));
const q=(a,c,b,u)=>{c=c||[(a[0]+b[0])/2,(a[1]+b[1])/2];const v=1-u;return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]]};
const ez=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
const tgt=(st,p)=>p==='B'?B:st.pos[p];
let alt=0,steps,snaps,i=0,busy=false,chain=false;
function build(){const A=temAlt?J.alternativas[alt]:null;steps=J.fases.concat(A?(A.passos||[A]):[]);snaps=[{pos:cl(J.inicio.pos),h:J.inicio.bola,bp:null}];
steps.forEach(s=>{const st=cl(snaps[snaps.length-1]);s.a.forEach(a=>{if(a.m)st.pos[a.m]=a.to.slice()});
s.a.forEach(a=>{if(a.p){if(a.p==='B'){st.h=null;st.bp=B.slice()}else{st.h=a.p;st.bp=null}}});snaps.push(st)});
$('prog').innerHTML=steps.map(()=>'<i></i>').join('');}
const pl=$('pl'),tr=$('tr'),ball=$('ball'),cap=$('cap'),P={};
Object.keys(J.inicio.pos).forEach(n=>{const g=document.createElementNS(NS,'g');
const c=document.createElementNS(NS,'circle');c.setAttribute('r','12');c.setAttribute('fill','var(--team)');c.setAttribute('stroke','var(--line)');c.setAttribute('stroke-width','1.5');
const t=document.createElementNS(NS,'text');t.setAttribute('text-anchor','middle');t.setAttribute('dy','5');t.setAttribute('fill','var(--teamInk)');
t.setAttribute('style','font:600 15px "Barlow Condensed","Arial Narrow",sans-serif');t.textContent=n;g.append(c,t);pl.append(g);P[n]=g});
function draw(st,bpt){for(const n in P)P[n].setAttribute('transform','translate('+st.pos[n][0]+','+st.pos[n][1]+')');
const b=bpt||(st.h?[st.pos[st.h][0]+10,st.pos[st.h][1]-10]:st.bp);ball.setAttribute('cx',b[0]);ball.setAttribute('cy',b[1]);}
function setCap(k){const s=k===0?{h:'Posição inicial',c:J.inicio.c}:steps[k-1];
cap.innerHTML='<small>'+s.h+'</small>'+s.c;[...$('prog').children].forEach((e,j)=>e.className=j<k?'on':'');}
function show(k){i=k;tr.innerHTML='';draw(snaps[k]);setCap(k);}
function el(tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);tr.append(e);return e}
function play(){if(busy||i>=steps.length)return;busy=true;const s=steps[i],st0=snaps[i],cur=cl(st0);
setCap(i+1);tr.innerHTML='';
const items=s.a.map(a=>{const it={a};if(a.m){it.from=st0.pos[a.m].slice();it.e=el('polyline',{points:''})}
else{it.e=el('polyline',{points:'','stroke-dasharray':'6 5'})}return it});
const t0=performance.now(),dur=reduce?1:D;
function fr(now){const t=Math.min(1,(now-t0)/dur);let bpt=null;
items.forEach(it=>{const a=it.a;if(a.p&&!it.from){if(t<a.t[0])return;const h=cur.h;it.from=h?[cur.pos[h][0]+10,cur.pos[h][1]-10]:(bpt||cur.bp).slice();it.to=tgt(cur,a.p)}const u=ez(Math.max(0,Math.min(1,(t-a.t[0])/(a.t[1]-a.t[0])))),pts=[],N=40;
for(let k=0;k<=N*u;k++){const w=k/N;let p=a.m?q(it.from,a.c,a.to,w):q(it.from,a.c,it.to,w);
if(a.d){const p2=q(it.from,a.c,a.to,Math.min(1,w+.01)),dx=p2[0]-p[0],dy=p2[1]-p[1],L=Math.hypot(dx,dy)||1,o=4*Math.sin(k*1.6);p=[p[0]-dy/L*o,p[1]+dx/L*o]}
pts.push(p[0].toFixed(1)+','+p[1].toFixed(1))}
it.e.setAttribute('points',pts.join(' '));
if(a.m){cur.pos[a.m]=q(it.from,a.c,a.to,u);
if(a.s&&u>=1&&!it.sc){it.sc=1;const p=q(it.from,a.c,a.to,.95),dx=a.to[0]-p[0],dy=a.to[1]-p[1],L=Math.hypot(dx,dy)||1,x=a.to[0]+dx/L*14,y=a.to[1]+dy/L*14;
el('line',{x1:x-dy/L*9,y1:y+dx/L*9,x2:x+dy/L*9,y2:y-dx/L*9,'stroke-width':'3'})}}
else if(t>=a.t[0]&&t<a.t[1]){bpt=q(it.from,a.c,it.to,u);cur.h=null}
else if(t>=a.t[1]){if(a.p==='B'){cur.h=null;cur.bp=B.slice()}else{cur.h=a.p;cur.bp=null}}});
draw(cur,bpt);
if(t<1)requestAnimationFrame(fr);else{busy=false;i++;draw(snaps[i]);
if(chain&&i<steps.length)setTimeout(play,450);else chain=false;}}
requestAnimationFrame(fr);}
function setAlt(a){alt=a;document.querySelectorAll('.alt').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.a===a));
if(!busy){const k=Math.min(i,J.fases.length);build();show(k)}}
document.querySelectorAll('.alt').forEach(b=>b.onclick=()=>setAlt(+b.dataset.a));
$('next').onclick=()=>{chain=false;play()};
$('prev').onclick=()=>{if(!busy&&i>0){chain=false;show(i-1)}};
$('rst').onclick=()=>{if(!busy){chain=false;show(0)}};
$('all').onclick=()=>{if(busy)return;show(0);chain=true;setTimeout(play,300)};
build();if(temAlt)setAlt(0);show(0);
})();
