window.mountKnowledgeGraph=function(host){
const records=[["me",null,"Yumeng Chen","AI consulting and applied AI research. Each work item has one primary category. Shared capabilities connect related work across categories."],["research","me","Research","Original investigation, research outputs and academic inquiry."],["consulting","me","Consulting","Client and stakeholder advice: opportunity assessment, strategy and development plans."],["analytics","me","Analytics","Data preparation, modelling and reporting that support decisions."],["delivery","me","Project Delivery","Systems, prototypes and user enablement that put solutions into use."],["published","research","Publications","Peer-reviewed research outputs."],["manuscripts","research","Manuscripts","Research submitted for review; kept distinct from published work."],["dissertation","research","Dissertation research","Independent degree research."],["researchwork","research","Research coursework","Academic investigation through modelling and comparative analysis."],["icmi","published","ACM ICMI 2026","First-author work on culture-conditioned prompting and multimodal model behaviour. Related work includes controlled evaluation, replication and adapter training.","#/paper/icmi","Qwen / LLaVA · LoRA / QLoRA · Model evaluation"],["submitted","manuscripts","Submitted manuscript","Co-author contribution: model training, results analysis and manuscript writing. Unpublished title and research details are not disclosed."],["edinresearch","dissertation","Film & audience research","University of Edinburgh dissertation research within Film Exhibition and Curation. Dissertation mark: 77."],["risk","researchwork","Bayesian decision studies","Academic case studies in Bayesian networks, causal assumptions and expected utility.","#/project/risk","Python · PyAgrum · Bayesian reasoning"],["commercial","consulting","Commercial strategy","Market and opportunity assessment for strategic decisions."],["advisory","consulting","Client advisory","Tailored recommendations and stakeholder-facing proposals."],["huaweistrategy","commercial","Huawei · AI opportunities","European AI startup and investment assessment, university partnerships and technology incubation. Market sizing, business planning and valuation informed opportunity analysis.","#/experience/0"],["alpha","commercial","Alpha Approach · Digital humans","Market sizing, business plans and valuation evidence across digital-human applications.","#/experience/earlier"],["ogilvy","commercial","Ogilvy · Market entry","Consumer and competitor research supporting overseas market-entry strategy.","#/experience/earlier"],["gcac","advisory","GCAC · Project proposals","Cultural-market research and strategy proposals presented to government stakeholders.","#/experience/earlier"],["dbc","advisory","DBC · STEM transitions","Skills-gap analysis translated into tailored career and academic development plans, with end-to-end engagement management.","#/experience/2"],["modelling","analytics","Machine learning","Interpretable quantitative analysis of population patterns."],["reporting","analytics","BI & visualisation","Decision-support dashboards and monitoring workflows."],["foundations","analytics","Data foundations","Structured data models and reliable analytical queries."],["clusters","modelling","Unsupervised learning report","Coursework 1: Gender-stratified discovery of socio-economic profiles in 48,842 Adult Income records, comparing K-Means and Gaussian Mixture Models with PCA and clustering diagnostics.","#/project/clusters","Python · K-Means / GMM · PCA"],["monitor","reporting","Huawei · Company monitoring","Power BI monitoring for 1,000+ companies and industry reporting.","#/experience/0","Power BI · Industry intelligence"],["dashboard","reporting","Public-health dashboard","Data preparation, refresh workflows and interactive exploratory filters.","#/project/dashboard","pandas · API integration · ipywidgets"],["sql","foundations","Transport database","Normalised relational schema, integrity constraints and operational SQL analysis.","#/project/sql","SQL · 3NF · Data integrity"],["neo4j","foundations","Huawei · Knowledge graph","A five-layer graph connecting talent, research, funding and market information.","#/experience/0","Neo4j · Knowledge modelling"],["systems","delivery","System engineering","Implementation, maintenance and continued operation."],["design","delivery","Product design","User research translated into a tested prototype."],["enablement","delivery","User enablement","Training, troubleshooting and technical guidance for adoption."],["source","systems","Source Intelligence","Ongoing team project: system development and maintenance, technical support and technical consulting.","#/project/source"],["amytis","design","Amytis workspace","Team interviews, research synthesis, interaction design and iterative prototype evaluation.","#/project/amytis"],["training","enablement","Huawei · Internal adoption","Training and troubleshooting for internal trackers, dashboards and the knowledge-graph resource system; ongoing system support and maintenance.","#/experience/0"],["supervised","modelling","Supervised learning report","Coursework 2: Bayesian structure learning and classification on the Adult Income dataset. Compared five structure-learning algorithms, prior-knowledge constraints, model complexity, confusion matrices and ROC curves.","#/project/supervised","Bayesys · GeNIe · Bayesian networks · Classification evaluation"],["analysis-tech","analytics","Analytical technologies","Tools used in analysis, business intelligence and graph-based data modelling. Dashed links show the work in which each technology is applied."]];
const nodes=records.map(([id,parent,label,text,route,skills])=>({id,parent,label,text,route,skills,type:parent===null?'profile':parent==='me'?'category':records.find(r=>r[1]===id)?'subcategory':'evidence',x:0,y:0,z:0}));
const capabilities=[
{id:'cap-neo4j',parent:'analysis-tech',label:'Neo4j',text:'Graph technology used across the Huawei knowledge graph and Source Intelligence Platform.',items:['neo4j','source']},
{id:'cap-python',parent:'analysis-tech',label:'Python',text:'Analytical programming across modelling, dashboards and decision studies.',items:['clusters','dashboard','risk']},
{id:'cap-powerbi',parent:'analysis-tech',label:'Power BI',text:'Business intelligence and company-monitoring dashboards.',items:['monitor']},
{id:'cap-support',label:'Technical support',text:'User training, technical guidance and continued system use.',items:['training','source','dbc']},
{id:'cap-commercial',label:'Commercial analysis',text:'Market sizing, business planning, valuation and opportunity assessment.',items:['huaweistrategy','alpha','ogilvy','gcac']}
];
nodes.push(...capabilities.map(c=>({...c,type:'capability',x:0,y:0,z:0})));
const crossPairs=capabilities.flatMap(c=>c.items.map(id=>[id,c.id]));
nodes.find(n=>n.id==='analysis-tech').type='subcategory';
const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
function ordered(id='me'){return [byId[id],...nodes.filter(n=>n.parent===id).flatMap(n=>ordered(n.id))]}
const children=id=>nodes.filter(n=>n.parent===id);
const pairs=nodes.filter(n=>n.parent).map(n=>[n.parent,n.id]);
const colors={profile:'#172b43',category:'#486985',subcategory:'#718da5',evidence:'#9faebb',capability:'#8e7c9c'};
let visible=[],visiblePairs=[],visibleCross=[];
let selected='me',hover=null,rotX=-.24,rotY=.28,targetX=-.24,targetY=.28,zoom=1,drag=false,last=null,frame=0,dead=false,projected=[],w=600,h=500;
const connected=id=>new Set([...visiblePairs,...visibleCross].filter(p=>p.includes(id)).flat());
host.innerHTML='<div class="graph-shell"><div class="graph-stage"><canvas tabindex="0" role="img" aria-label="Interactive 3D knowledge graph. Use arrow keys to rotate, plus or minus to zoom. Select any node using the menu beside the graph."></canvas><div class="graph-toolbar"><button data-action="reset">Reset</button><button data-action="in" aria-label="Zoom in">+</button><button data-action="out" aria-label="Zoom out">−</button></div><div class="graph-key">'+['profile','category','subcategory','evidence','capability'].map(t=>'<span><i style="background:'+colors[t]+'"></i>'+t+'</span>').join('')+'</div></div><aside class="graph-panel"><label for="graph-node">Explore a node</label><select id="graph-node">'+[...ordered(),...capabilities.filter(c=>!c.parent).map(c=>byId[c.id])].map(n=>'<option value="'+n.id+'">'+(n.parent==='me'?'':n.type==='subcategory'?'— ':n.type==='evidence'?'—— ':'')+n.label+'</option>').join('')+'</select><div id="graph-info"></div><p class="graph-count">Solid arrows: hierarchy · Dashed lines: shared capabilities</p><p class="graph-help">All levels visible · Click to highlight<br>Drag to rotate · Release to stop<br>Touch: drag the network</p></aside></div>';
const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d'),select=host.querySelector('select');
function info(id){
selected=id;hover=null;
const n=byId[id];select.value=id;
const related=capabilities.filter(c=>c.items.includes(id));
visible=nodes.map(n=>({...n}));
const placed=Object.fromEntries(visible.map(n=>[n.id,n]));
const branches=children('me'),tones=['#51789a','#86709e','#4e8a88','#9b8357','#6d8a69'];
branches.forEach((branch,i)=>{
const center=-Math.PI/2+i*Math.PI*2/branches.length;
const position=(n,r,angle,z=0)=>{Object.assign(placed[n.id],{x:Math.cos(angle)*r,y:Math.sin(angle)*r,z,tone:tones[i]})};
position(branch,155,center,[-85,90,-65,95,-50][i]);
const subs=children(branch.id);
subs.forEach((sub,j)=>{
const angle=center+(j-(subs.length-1)/2)*(.95/Math.max(1,subs.length));
position(sub,235,angle,(j%2?1:-1)*90+(i-2)*25);
const leaves=children(sub.id);
leaves.forEach((leaf,k)=>position(leaf,320+(k%2)*13,angle+(k-(leaves.length-1)/2)*(.95/Math.max(1,subs.length))/Math.max(1,leaves.length),(k%2?1:-1)*135+(j-1)*35));
});
});
capabilities.filter(c=>!c.parent).forEach((c,i)=>{const angle=-Math.PI/2+(i+.5)*Math.PI*2/capabilities.length;Object.assign(placed[c.id],{x:Math.cos(angle)*235,y:Math.sin(angle)*235,z:i%2?145:-140,tone:'#8e7c9c'})});
visiblePairs=pairs;visibleCross=crossPairs;
const parent=byId[n.parent],ns=children(id);
host.querySelector('#graph-info').innerHTML='<p class="graph-node-type">'+n.type+'</p><h3>'+n.label+'</h3><p>'+n.text+'</p>'+(n.skills?'<p class="graph-skills">'+n.skills+'</p>':'')+(n.route?'<a href="'+n.route+'">Open evidence ↗</a>':'')+(parent?'<p class="graph-related-title">Parent</p><div class="graph-related"><button data-node="'+parent.id+'">← '+parent.label+'</button></div>':'')+(ns.length?'<p class="graph-related-title">Contains · '+ns.length+'</p><div class="graph-related">'+ns.map(n=>'<button data-node="'+n.id+'">'+n.label+' →</button>').join('')+'</div>':n.type==='capability'?'':'<p class="graph-related-title">Evidence item</p>')+(related.length?'<p class="graph-related-title">Shared capabilities</p><div class="graph-related">'+related.map(c=>'<button data-node="'+c.id+'">'+c.label+' ↔</button>').join('')+'</div>':'')+(n.type==='capability'?'<p class="graph-related-title">Used in</p><div class="graph-related">'+n.items.map(id=>'<button data-node="'+id+'">'+byId[id].label+' ↔</button>').join('')+'</div>':'');
}
info('me');
let lastDrawKey='';
function resize(){lastDrawKey='';const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
const obs=new ResizeObserver(resize);obs.observe(canvas);
function point(n){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=n.x*cy-n.z*sy,z=n.x*sy+n.z*cy,y=n.y*cx-z*sx,zz=n.y*sx+z*cx;const scale=650/(650+zz);const fit=Math.min(w/920,h/880)*zoom;return {...n,px:w/2+x*scale*fit,py:h/2+y*scale*fit,s:scale,depth:zz,r:(n.id==='me'?12:n.type==='category'?8:n.type==='subcategory'?4.5:n.type==='capability'?4:2.5)*scale}}
const stars=Array.from({length:220},(_,i)=>({x:((Math.sin(i*127.1+3)*43758.5453)%1+1)%1,y:((Math.sin(i*311.7+7)*17431.137)%1+1)%1,r:i%17===0?1:.5,alpha:.12+(i%5)*.045}));
function draw(){
if(dead)return;const drawKey=[targetX,targetY,zoom,w,h,selected,hover].join('|');if(drawKey===lastDrawKey){frame=requestAnimationFrame(draw);return}lastDrawKey=drawKey;rotX=targetX;rotY=targetY;ctx.clearRect(0,0,w,h);
for(const star of stars){ctx.globalAlpha=star.alpha;ctx.fillStyle='#547494';ctx.beginPath();ctx.arc(star.x*w,star.y*h,star.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
projected=visible.map(point);
const map=Object.fromEntries(projected.map(n=>[n.id,n])),active=hover||selected,near=connected(active);near.add(active);
for(const n of projected.filter(n=>n.type==='category'||n.id==='me')){
const glow=ctx.createRadialGradient(n.px,n.py,0,n.px,n.py,n.id==='me'?100:80);
glow.addColorStop(0,(n.tone||'#51789a')+'12');glow.addColorStop(1,'#f5f7fa00');
ctx.fillStyle=glow;ctx.fillRect(n.px-100,n.py-100,200,200);
}
for(const [a,b] of visiblePairs){
const p=map[a],q=map[b],lit=active!=='me'&&(a===active||b===active);
ctx.beginPath();ctx.moveTo(p.px,p.py);
ctx.quadraticCurveTo((p.px+q.px)/2+(q.py-p.py)*.1,(p.py+q.py)/2-(q.px-p.px)*.1,q.px,q.py);
ctx.strokeStyle=lit?'#345c82b0':(q.tone||'#718da5')+(active==='me'?'45':'22');ctx.lineWidth=lit?1.25:.6;ctx.stroke();
}
for(const [a,b] of visibleCross){
const p=map[a],q=map[b],lit=a===active||b===active;
ctx.beginPath();ctx.setLineDash([2,5]);ctx.moveTo(p.px,p.py);ctx.lineTo(q.px,q.py);ctx.strokeStyle=lit?'#856899b0':'#85689928';ctx.lineWidth=lit?1.1:.5;ctx.stroke();ctx.setLineDash([]);
}
for(const n of [...projected].sort((a,b)=>b.depth-a.depth)){
const lit=near.has(n.id);const prominence=n.id==='me'?1:n.type==='category'?.95:n.type==='subcategory'?.78:.6;ctx.globalAlpha=(active==='me'||lit?1:.35)*prominence*Math.max(.5,Math.min(1.15,n.s));
ctx.shadowColor=n.tone||colors[n.type];ctx.shadowBlur=n.id==='me'?18:n.type==='category'?10:3;
ctx.beginPath();ctx.arc(n.px,n.py,n.r+(n.id===active?1.5:0),0,Math.PI*2);const sphere=ctx.createRadialGradient(n.px-n.r*.3,n.py-n.r*.35,0,n.px,n.py,n.r*1.5);sphere.addColorStop(0,'#ffffff');sphere.addColorStop(.4,n.id==='me'?colors.profile:n.tone||colors[n.type]);sphere.addColorStop(1,n.id==='me'?'#142238':n.tone||colors[n.type]);ctx.fillStyle=sphere;ctx.fill();ctx.shadowBlur=0;
if(n.id===active){ctx.beginPath();ctx.arc(n.px,n.py,n.r+6,0,Math.PI*2);ctx.strokeStyle='#55799c45';ctx.lineWidth=1;ctx.stroke()}
}
ctx.globalAlpha=1;
drawLabels(active,near);
frame=requestAnimationFrame(draw);
}
function drawLabels(active,near){
const boxes=[],priority=n=>n.id===active?0:n.id==='me'?1:n.type==='category'?2:near.has(n.id)?3:n.type==='capability'?4:n.type==='subcategory'?5:6;
const collides=(a,b)=>a.x<b.x+b.w+5&&a.x+a.w+5>b.x&&a.y<b.y+b.h+4&&a.y+a.h+4>b.y;
for(const n of [...projected].sort((a,b)=>priority(a)-priority(b)||a.id.localeCompare(b.id))){
const size=n.id==='me'?13:n.type==='category'?12:10;
ctx.font=(n.id===active||n.type==='category'?'500 ':'400 ')+size+'px -apple-system,Arial,sans-serif';
const words=n.label.split(' '),lines=[];let line='';
for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>116&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);
const tw=Math.max(...lines.map(t=>ctx.measureText(t).width)),th=lines.length*14;
const right=n.px>=w/2,candidates=[];
for(const distance of [12,30,50,72,96,124])for(const dy of [0,-18,18,-38,38,-64,64]){
candidates.push({x:right?n.px+distance:n.px-distance-tw,y:n.py-th/2+dy,w:tw,h:th});
candidates.push({x:right?n.px-distance-tw:n.px+distance,y:n.py-th/2+dy,w:tw,h:th});
}
let box=candidates.find(b=>b.x>14&&b.y>55&&b.x+b.w<w-14&&b.y+b.h<h-14&&!boxes.some(o=>collides(b,o))&&!projected.some(p=>collides(b,{x:p.px-p.r-2,y:p.py-p.r-2,w:p.r*2+4,h:p.r*2+4})));
if(!box)continue;
boxes.push(box);
const ax=Math.max(box.x,Math.min(box.x+box.w,n.px)),ay=Math.max(box.y,Math.min(box.y+box.h,n.py));
if(Math.hypot(ax-n.px,ay-n.py)>18){ctx.beginPath();ctx.moveTo(n.px,n.py);ctx.lineTo(ax,ay);ctx.strokeStyle='#6b83964a';ctx.lineWidth=.5;ctx.stroke()}
ctx.fillStyle=n.id===active?'#142c44':n.type==='category'?'#314f69':active==='me'||near.has(n.id)?'#63788b':'#9ba8b3';
lines.forEach((t,i)=>ctx.fillText(t,box.x,box.y+11+i*14));
}
}
function hit(x,y){return [...projected].sort((a,b)=>a.depth-b.depth).find(n=>Math.hypot(x-n.px,y-n.py)<Math.max(n.r+8,13))}
function move(e){
const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
if(drag&&last){const dx=e.clientX-last.x,dy=e.clientY-last.y;targetY+=dx*.006;targetX+=dy*.006;last.x=e.clientX;last.y=e.clientY;if(Math.hypot(e.clientX-last.startX,e.clientY-last.startY)>5)last.moved=true}
const n=drag?null:hit(x,y);hover=n?.id||null;canvas.style.cursor=n?'pointer':drag?'grabbing':'grab';canvas.title=n?n.label:'';
}
function release(e){
if(!drag)return;
if(last&&!last.moved&&e.type==='pointerup'){const r=canvas.getBoundingClientRect(),n=hit(e.clientX-r.left,e.clientY-r.top);if(n)info(n.id)}
drag=false;last=null;canvas.style.cursor='grab';
}
canvas.addEventListener('pointermove',move);
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;last={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
canvas.addEventListener('pointerup',release);
canvas.addEventListener('pointercancel',release);
canvas.addEventListener('lostpointercapture',release);
canvas.addEventListener('pointerleave',()=>{hover=null;canvas.title=''});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')targetY-=.2;if(e.key==='ArrowRight')targetY+=.2;if(e.key==='ArrowUp')targetX-=.2;if(e.key==='ArrowDown')targetX+=.2;if(e.key==='+')zoom=Math.min(1.6,zoom+.1);if(e.key==='-')zoom=Math.max(.6,zoom-.1)}});
select.addEventListener('change',()=>info(select.value));host.addEventListener('click',e=>{const n=e.target.closest('[data-node]');if(n)info(n.dataset.node);const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='reset'){targetX=rotX=-.24;targetY=rotY=.28;zoom=1;info('me')}if(b.dataset.action==='in')zoom=Math.min(1.6,zoom+.15);if(b.dataset.action==='out')zoom=Math.max(.6,zoom-.15)});
resize();draw();return()=>{dead=true;cancelAnimationFrame(frame);obs.disconnect()}
};