window.mountKnowledgeGraph=function(host){
const nodes=[
{id:'me',label:'Yumeng Chen',type:'profile',text:'AI consulting and applied AI research. Connections show where capabilities are used, not proficiency scores.',x:0,y:0,z:0},
{id:'huawei',label:'Huawei UK R&D',type:'experience',text:'AI industry intelligence, Power BI dashboards, Neo4j knowledge graphs and internal user support.',route:'#/experience/0',x:-190,y:-95,z:70},
{id:'dbc',label:'DBC',type:'experience',text:'STEM career and academic strategies, skills-gap analysis and technical coaching.',route:'#/experience/2',x:160,y:135,z:-60},
{id:'qmul',label:'QMUL',type:'experience',text:'MSc Computer Science, Distinction. Data analytics, databases and decision science.',route:'#/experience/1',x:15,y:-190,z:-90},
{id:'source',label:'Source Intelligence',type:'project',text:'Ongoing team project. System development, maintenance, technical support and consulting.',route:'#/project/source',x:195,y:-70,z:75},
{id:'vlm',label:'VLM auditing',type:'project',text:'Cross-cultural model evaluation, prompt comparisons and LoRA / QLoRA adaptation.',route:'#/project/vlm',x:70,y:-120,z:190},
{id:'clusters',label:'Segmentation',type:'project',text:'Gender-stratified analysis of 48,842 records with K-Means, GMM and PCA.',route:'#/project/clusters',x:-120,y:110,z:175},
{id:'amytis',label:'Amytis',type:'project',text:'User research, interaction design, prototyping and evaluation in a team project.',route:'#/project/amytis',x:185,y:65,z:160},
{id:'sql',label:'Transport SQL',type:'project',text:'Relational database design, integrity constraints and analytical SQL queries.',route:'#/project/sql',x:-190,y:90,z:-70},
{id:'dashboard',label:'Dashboard',type:'project',text:'Python public-health dashboard with data preparation, refresh workflows and filters.',route:'#/project/dashboard',x:-75,y:195,z:30},
{id:'risk',label:'Decision analysis',type:'project',text:'Bayesian modelling, causal assumptions and decision scenarios.',route:'#/project/risk',x:100,y:40,z:-195},
{id:'paper',label:'ICMI 2026',type:'research',text:'First-author publication on culture-conditioned prompting and multimodal model behaviour.',route:'#/paper/icmi',x:-10,y:-40,z:235},
{id:'python',label:'Python',type:'skill',text:'Used in analytics, model evaluation, dashboards and probabilistic modelling.',x:-70,y:55,z:105},
{id:'powerbi',label:'Power BI',type:'skill',text:'Company monitoring dashboards and reporting at Huawei.',x:-260,y:-80,z:0},
{id:'neo4j',label:'Neo4j',type:'skill',text:'Five-layer knowledge graph linking talent, research, funding and market data.',x:-160,y:-180,z:160},
{id:'llm',label:'VLMs / LLMs',type:'skill',text:'Qwen and LLaVA evaluation, controlled prompts and model adaptation.',x:115,y:-180,z:80},
{id:'lora',label:'LoRA / QLoRA',type:'skill',text:'Parameter-efficient adaptation of Qwen models.',x:180,y:-120,z:-140},
{id:'fairness',label:'Fairness & evaluation',type:'skill',text:'Annotation standards, bias-aware interpretation and model reliability.',x:-80,y:-150,z:-170},
{id:'sqlskill',label:'SQL & data integrity',type:'skill',text:'Normalised relational design and operational reporting queries.',x:-230,y:10,z:-155},
{id:'consulting',label:'Technical consulting',type:'skill',text:'Requirements, user training, technical guidance and support.',x:230,y:20,z:-60},
{id:'users',label:'User research',type:'skill',text:'Interviews, personas, prototyping and usability evaluation.',x:230,y:170,z:40},
{id:'commercial',label:'Commercial analysis',type:'skill',text:'Market sizing, business planning, valuation and opportunity assessment.',x:-90,y:30,z:-230},
{id:'ml',label:'Machine learning',type:'skill',text:'Clustering, PCA, model selection and interpretable profiles.',x:-165,y:180,z:95},
{id:'bayes',label:'Bayesian reasoning',type:'skill',text:'Networks and influence diagrams for uncertainty and decision analysis.',x:95,y:200,z:-155}
];
const pairs=[['me','huawei'],['me','dbc'],['me','qmul'],['me','source'],['me','vlm'],['me','clusters'],['me','amytis'],['me','sql'],['me','dashboard'],['me','risk'],['me','paper'],['huawei','powerbi'],['huawei','neo4j'],['huawei','commercial'],['huawei','consulting'],['source','consulting'],['dbc','consulting'],['amytis','users'],['amytis','consulting'],['vlm','llm'],['vlm','lora'],['vlm','fairness'],['vlm','python'],['paper','vlm'],['clusters','ml'],['clusters','fairness'],['clusters','python'],['sql','sqlskill'],['qmul','sqlskill'],['qmul','ml'],['dashboard','python'],['risk','python'],['risk','bayes'],['risk','commercial'],['qmul','bayes']];
const colors={profile:'#1d1d1f',experience:'#7b6f62',project:'#4c7487',skill:'#72907f',research:'#8a7ca0'};
let selected='me',hover=null,rotX=.15,rotY=-.25,targetX=.15,targetY=-.25,zoom=1,drag=false,last=null,paused=false,frame=0,dead=false,projected=[],w=600,h=500,velocityX=0,velocityY=0,previousTime=0,pointer=null;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const connected=id=>new Set(pairs.filter(p=>p.includes(id)).flat());
host.innerHTML='<div class="graph-shell"><div class="graph-stage"><canvas tabindex="0" role="img" aria-label="Interactive 3D knowledge graph. Use arrow keys to rotate, plus or minus to zoom. Select any node using the menu beside the graph."></canvas><div class="graph-toolbar"><button data-action="pause" aria-label="Pause graph motion">Pause motion</button><button data-action="reset">Reset</button><button data-action="in" aria-label="Zoom in">+</button><button data-action="out" aria-label="Zoom out">−</button></div><div class="graph-key">'+['project','skill','experience','research'].map(t=>'<span><i style="background:'+colors[t]+'"></i>'+t+'</span>').join('')+'</div></div><aside class="graph-panel"><label for="graph-node">Explore a node</label><select id="graph-node">'+nodes.map(n=>'<option value="'+n.id+'">'+n.label+'</option>').join('')+'</select><div id="graph-info"></div><p class="graph-count">'+nodes.length+' nodes · '+pairs.length+' connections</p><p class="graph-help">Move anywhere to rotate · Drag to spin<br>Hover to trace · Select to explore<br>Touch: drag the network</p></aside></div>';
const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d'),select=host.querySelector('select');
function info(id){selected=id;const n=nodes.find(n=>n.id===id);select.value=id;const ns=[...connected(id)].filter(x=>x!==id);host.querySelector('#graph-info').innerHTML='<p class="graph-node-type">'+n.type+'</p><h3>'+n.label+'</h3><p>'+n.text+'</p>'+(n.route?'<a href="'+n.route+'">Open details ↗</a>':'')+'<p class="graph-related-title">Connected to</p><div class="graph-related">'+ns.map(id=>{const n=nodes.find(n=>n.id===id);return '<button data-node="'+id+'">'+n.label+'</button>'}).join('')+'</div>'}
info('me');
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
const obs=new ResizeObserver(resize);obs.observe(canvas);
function point(n){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=n.x*cy-n.z*sy,z=n.x*sy+n.z*cy,y=n.y*cx-z*sx,zz=n.y*sx+z*cx;const scale=650/(650+zz);const fit=Math.min(w/650,h/590)*zoom;return {...n,px:w/2+x*scale*fit,py:h/2+y*scale*fit,s:scale,depth:zz,r:(n.id==='me'?9:n.type==='skill'?4:6)*scale}}
function draw(time=performance.now()){if(dead)return;const dt=Math.min((time-(previousTime||time))/16.667,3);previousTime=time;if(!drag&&!paused&&!reducedMotion.matches){targetX+=velocityX*dt;targetY+=velocityY*dt;const decay=Math.pow(.965,dt);velocityX*=decay;velocityY*=decay}rotX+=(targetX-rotX)*.06;rotY+=(targetY-rotY)*.06;ctx.clearRect(0,0,w,h);projected=nodes.map(point);const map=Object.fromEntries(projected.map(n=>[n.id,n]));const active=hover||selected,near=connected(active);near.add(active);
for(const[a,b]of pairs){const p=map[a],q=map[b];const lit=active!=='me'&&(a===active||b===active);ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(q.px,q.py);ctx.strokeStyle=lit?'rgba(67,112,139,.65)':'rgba(124,140,151,'+(active==='me'?'.2':'.07')+')';ctx.lineWidth=lit?1.5:.7;ctx.stroke()}
for(const n of [...projected].sort((a,b)=>b.depth-a.depth)){const lit=near.has(n.id);ctx.globalAlpha=active==='me'?Math.max(.45,Math.min(1,n.s*.8)):lit?1:.18;ctx.beginPath();ctx.arc(n.px,n.py,n.r+(n.id===active?2:0),0,Math.PI*2);ctx.fillStyle=colors[n.type];ctx.fill();if(n.id===active){ctx.beginPath();ctx.arc(n.px,n.py,n.r+7,0,Math.PI*2);ctx.strokeStyle='#4c748733';ctx.lineWidth=4;ctx.stroke()}ctx.font=(n.id===active?'600 ':'400 ')+(n.id==='me'?12:10)+'px -apple-system,Arial,sans-serif';ctx.fillStyle=n.id===active?'#1d1d1f':'#62626a';const label=n.label;const tw=ctx.measureText(label).width;const lx=n.px>w*.58?n.px-n.r-5-tw:n.px+n.r+5;ctx.fillText(label,Math.max(8,Math.min(w-tw-8,lx)),Math.max(20,Math.min(h-12,n.py+3)))}ctx.globalAlpha=1;frame=requestAnimationFrame(draw)}
function hit(x,y){return [...projected].sort((a,b)=>a.depth-b.depth).find(n=>Math.hypot(x-n.px,y-n.py)<Math.max(n.r+8,13))}
function move(e){
const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
if(drag&&last){const dx=e.clientX-last.x,dy=e.clientY-last.y;targetY+=dx*.012;targetX+=dy*.009;velocityY=dx*.009;velocityX=dy*.006;last.x=e.clientX;last.y=e.clientY;if(Math.hypot(e.clientX-last.startX,e.clientY-last.startY)>5)last.moved=true}
const n=drag?null:hit(x,y);hover=n?.id||null;canvas.style.cursor=n?'pointer':drag?'grabbing':'grab';canvas.title=n?n.label:'';
}
function pageMove(e){
if(e.pointerType!=='mouse'){pointer=null;return}
if(pointer&&!drag&&!paused&&!reducedMotion.matches&&!e.target.closest('button,select,input,a')){
const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
velocityY=velocityY*.45+Math.max(-.14,Math.min(.14,dx*.004))*.55;
velocityX=velocityX*.45+Math.max(-.10,Math.min(.10,dy*.003))*.55;
}
pointer={x:e.clientX,y:e.clientY};
}
function release(e){
if(!drag)return;
if(last&&!last.moved&&e.type==='pointerup'){const r=canvas.getBoundingClientRect(),n=hit(e.clientX-r.left,e.clientY-r.top);if(n)info(n.id);velocityX=velocityY=0}
drag=false;last=null;canvas.style.cursor='grab';
}
window.addEventListener('pointermove',pageMove);
canvas.addEventListener('pointermove',move);
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;velocityX=velocityY=0;last={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
canvas.addEventListener('pointerup',release);
canvas.addEventListener('pointercancel',release);
canvas.addEventListener('lostpointercapture',release);
canvas.addEventListener('pointerleave',()=>{hover=null;canvas.title=''});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')targetY-=.2;if(e.key==='ArrowRight')targetY+=.2;if(e.key==='ArrowUp')targetX-=.2;if(e.key==='ArrowDown')targetX+=.2;if(e.key==='+')zoom=Math.min(1.6,zoom+.1);if(e.key==='-')zoom=Math.max(.6,zoom-.1)}});
select.addEventListener('change',()=>info(select.value));host.addEventListener('click',e=>{const n=e.target.closest('[data-node]');if(n)info(n.dataset.node);const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='reset'){velocityX=velocityY=0;pointer=null;targetX=.15;targetY=-.25;zoom=1;info('me')}if(b.dataset.action==='pause'){paused=!paused;velocityX=velocityY=0;pointer=null;b.textContent=paused?'Resume motion':'Pause motion';b.setAttribute('aria-label',paused?'Resume graph motion':'Pause graph motion')}if(b.dataset.action==='in')zoom=Math.min(1.6,zoom+.15);if(b.dataset.action==='out')zoom=Math.max(.6,zoom-.15)});
resize();draw();return()=>{dead=true;cancelAnimationFrame(frame);obs.disconnect();window.removeEventListener('pointermove',pageMove)}
};