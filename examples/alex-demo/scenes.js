// scenes.js — Alex Kim · Context Window theme
// BPM=100, DUR=TB(120)=72s

'use strict';
const W=1920,H=1080,FPS=30,BPM=100,B=60/BPM,TB=b=>b*B,DUR=TB(120);
const C={bg:'#0D1117',panel:'#161B22',code:'#21262D',border:'#30363D',
  user:'#D29922',assistant:'#3FB950',tool:'#58A6FF',think:'#BC8CFF',
  dim:'#8B949E',txt:'#E6EDF3',white:'#FFFFFF'};
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x;
const P=(t,a,b)=>cl((t-a)/(b-a));
const L=(a,b,k)=>a+(b-a)*k;
const eo=x=>x>=1?1:1-Math.pow(2,-10*x);
const ei=x=>x<=0?0:Math.pow(2,10*x-10);
// seeded hash from "Alex Kim"
const SEED=('Alex Kim').split('').reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0)%10000;
const hs=n=>{const x=Math.sin((SEED+n)*127.1+311.7)*43758.5453;return x-Math.floor(x)};

let FR=0;
const cv=document.getElementById('c');
const X=cv.getContext('2d');
cv.width=W;cv.height=H;

const JM=(sz,w=400)=>`${w} ${sz}px 'JetBrains Mono'`;
const SY=(sz,w=800)=>`${w} ${sz}px Syne`;

function T(c,s,x,y,{f,col=C.txt,al='left',a}={}){
  if(f)c.font=f;c.textAlign=al;c.textBaseline='middle';
  const pa=c.globalAlpha;if(a!=null)c.globalAlpha=pa*a;
  c.fillStyle=col;c.fillText(s,x,y);if(a!=null)c.globalAlpha=pa;
}
function TW(c,s,f){c.font=f;return c.measureText(s).width}
function RR(c,x,y,w,h,r,fill,stroke,sw=1){
  c.beginPath();c.roundRect(x,y,w,h,r);
  if(fill){c.fillStyle=fill;c.fill()}
  if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.stroke()}
}
function STREAM(c,str,x,y,prog,{f=JM(22,400),col=C.txt,lh=40,maxW=0}={}){
  c.font=f;c.textAlign='left';c.textBaseline='middle';c.fillStyle=col;
  const vis=Math.min(str.length,Math.floor(prog*str.length+0.5));
  const shown=str.slice(0,vis);
  if(maxW>0){
    const words=shown.split(' ');let line='',ly=y,last='';
    for(const w of words){
      const test=line?line+' '+w:w;
      if(c.measureText(test).width>maxW&&line){c.fillText(line,x,ly);line=w;ly+=lh;}
      else line=test;
    }
    if(line){c.fillText(line,x,ly);last=line;}
    if(prog<1&&Math.floor(FR/8)%2===0){
      c.fillRect(x+c.measureText(last).width+2,ly-10,2,20);
    }
  } else {
    c.fillText(shown,x,y);
    if(prog<1&&Math.floor(FR/8)%2===0)
      c.fillRect(x+c.measureText(shown).width+2,y-10,2,20);
  }
}
function JBLOCK(c,lines,x,y,w,prog){
  const lh=30,pad=16,h=lines.length*lh+pad*2;
  RR(c,x,y,w,h,8,C.code,C.border,1);
  const vis=Math.floor(prog*lines.length);
  for(let i=0;i<vis;i++){
    const[k,v,vc=C.tool]=lines[i];
    const ly=y+pad+lh*i+lh/2;
    T(c,k,x+pad,ly,{f:JM(20,400),col:C.dim});
    T(c,v,x+pad+TW(c,k,JM(20,400)),ly,{f:JM(20,700),col:vc});
  }
  return h;
}
function METER(c,t,fill){
  const a=eo(P(t,TB(18),TB(21)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  const x=1220,y=100,w=660,mh=28;
  T(c,'CONTEXT',x,y-20,{f:JM(16,700),col:C.dim});
  RR(c,x,y,w,mh,6,C.code,C.border,1);
  if(fill>0){
    const fw=(w-4)*fill;
    const grd=c.createLinearGradient(x+2,0,x+2+fw,0);
    grd.addColorStop(0,C.tool);
    grd.addColorStop(1,fill>=1?C.assistant:C.tool);
    RR(c,x+2,y+2,fw,mh-4,4,grd);
  }
  T(c,Math.round(fill*100)+'%',x+w/2,y+mh/2,{f:JM(16,700),col:C.txt,al:'center'});
  const info=[['model:   ','claude-opus-4-8'],['tokens:  ',Math.round(fill*8192)+' / 8192'],['chunks:  ',Math.round(fill*14)+' retrieved']];
  const iy=y+50;
  RR(c,x,iy,w,info.length*34+20,8,C.panel,C.border,1);
  info.forEach(([k,v],i)=>{
    T(c,k,x+16,iy+10+34*i+17,{f:JM(18,400),col:C.dim});
    T(c,v,x+16+TW(c,k,JM(18,400)),iy+10+34*i+17,{f:JM(18,700),col:C.tool});
  });
  c.globalAlpha=pa;
}
function HEADER(c,t){
  const a=eo(P(t,TB(8),TB(10)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,28,W-80,58,8,C.panel,C.border,1);
  T(c,'context_window',W/2,57,{f:SY(26,800),col:C.txt,al:'center'});
  if(Math.floor(FR/15)%2===0||t>TB(10)){
    c.fillStyle=C.assistant;c.beginPath();c.arc(W-120,57,5,0,7);c.fill();
  }
  T(c,'live session',W-108,57,{f:JM(18,700),col:C.assistant});
  c.globalAlpha=pa;
}

// ── scenes ──
function sceneBoot(c,t){
  if(t>=TB(10))return;
  const a=eo(P(t,0,TB(1)))*ei(1-P(t,TB(7.5),TB(9)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  const pw=820,ph=240,px=W/2-pw/2,py=H/2-ph/2;
  RR(c,px,py,pw,ph,12,C.panel,C.border,1.5);
  const lines=[
    {s:'> context_window v2.4.1',col:C.assistant},
    {s:'> loading tools............. done',col:C.dim},
    {s:'> awaiting query',col:C.txt},
  ];
  const vis=Math.min(3,Math.floor(P(t,TB(1),TB(7))*4.5));
  lines.slice(0,vis).forEach(({s,col},i)=>{
    T(c,s,px+32,py+50+i*66,{f:JM(26,700),col:i===vis-1?col:C.dim});
  });
  if(vis>0&&Math.floor(FR/8)%2===0&&t<TB(6.5)){
    const lw=TW(c,lines[vis-1].s,JM(26,700));
    c.fillStyle=C.assistant;c.fillRect(px+32+lw+4,py+50+(vis-1)*66-12,3,24);
  }
  c.globalAlpha=pa;
}

function sceneQuery(c,t){
  if(t<TB(8)||t>TB(108))return;
  const dy=20*(1-eo(P(t,TB(8),TB(10))));
  const a=eo(P(t,TB(8),TB(10)))*ei(1-P(t,TB(104),TB(108)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,100+dy,1160,108,12,C.panel,C.user,1.5);
  T(c,'user',58,128+dy,{f:JM(18,700),col:C.user});
  STREAM(c,'who is this person? give me their story.',58,168+dy,eo(P(t,TB(9.5),TB(18))),{f:JM(24,400),col:C.txt,maxW:1100,lh:36});
  c.globalAlpha=pa;
}

function sceneTC1(c,t){
  if(t<TB(18)||t>TB(76))return;
  const dy=20*(1-eo(P(t,TB(18),TB(20))));
  const a=eo(P(t,TB(18),TB(20)))*ei(1-P(t,TB(72),TB(76)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,230+dy,1160,54,8,C.code,C.tool,1.5);
  T(c,'tool_call ',58,257+dy,{f:JM(20,700),col:C.tool});
  T(c,'retrieve_experience(  resume_id="alex_001"  )',58+TW(c,'tool_call ',JM(20,700)),257+dy,{f:JM(20,400),col:C.dim});
  JBLOCK(c,[
    ['role:       ','"Software Engineer"',C.user],
    ['company:    ','"Acme AI"',C.txt],
    ['duration:   ','"2022 – present"',C.txt],
    ['impact:     ','"2M daily requests · 6 model providers"',C.assistant],
    ['stack:      ','"Python · LangGraph · Kubernetes"',C.tool],
    ['prev:       ','"Stripe · payments infra · gRPC migrations"',C.dim],
  ],40,290+dy,1160,eo(P(t,TB(21),TB(37))));
  c.globalAlpha=pa;
}

function sceneTC2(c,t){
  if(t<TB(38)||t>TB(86))return;
  const dy=20*(1-eo(P(t,TB(38),TB(40))));
  const a=eo(P(t,TB(38),TB(40)))*ei(1-P(t,TB(82),TB(86)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,230+dy,1160,54,8,C.code,C.tool,1.5);
  T(c,'tool_call ',58,257+dy,{f:JM(20,700),col:C.tool});
  T(c,'analyze_projects(  resume_id="alex_001"  top_n=3  )',58+TW(c,'tool_call ',JM(20,700)),257+dy,{f:JM(20,400),col:C.dim});
  const projs=[
    {name:'CONTEXT COMPRESSION SDK',detail:'60% token reduction  ·  open source  ·  LLM infra',col:C.tool},
    {name:'AGENT MEMORY LAYER',detail:'persistent memory  ·  3 teams in production',col:C.assistant},
    {name:'EVAL HARNESS',detail:'40 model variants  ·  regression on prompt changes',col:C.think},
  ];
  projs.forEach(({name,detail,col},i)=>{
    const pp=eo(P(t,TB(40+i*5),TB(44+i*5)));if(pp<=0)return;
    const ppa=c.globalAlpha;c.globalAlpha=ppa*pp;
    const cy=290+i*132+dy;
    RR(c,40,cy,1160,118,10,C.panel,col,1.5);
    RR(c,40,cy,6,118,3,col);
    T(c,name,66,cy+42,{f:SY(30,800),col:C.txt});
    T(c,detail,66,cy+84,{f:JM(20,400),col:C.dim});
    c.globalAlpha=ppa;
  });
  c.globalAlpha=pa;
}

function sceneThink(c,t){
  if(t<TB(58)||t>TB(96))return;
  const dy=20*(1-eo(P(t,TB(58),TB(61))));
  const a=eo(P(t,TB(58),TB(61)))*ei(1-P(t,TB(92),TB(96)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,100+dy,1160,500,12,C.panel,C.think,1.5);
  T(c,'<thinking>',60,136+dy,{f:JM(22,700),col:C.think});
  STREAM(c,
    'Alex built the infrastructure layer that makes LLM products actually work in production — context routing, memory, evals. '+
    'Not someone who adds AI features on top of existing products. '+
    'Someone who builds the substrate other people\'s products run on. '+
    'The SDK and the memory layer compound each other. Strong signal for infra-focused AI roles.',
    60,220+dy,eo(P(t,TB(60),TB(78))),{f:JM(22,400),col:C.txt,lh:42,maxW:1080});
  T(c,'</thinking>',60,560+dy,{f:JM(22,700),col:C.think,a:eo(P(t,TB(78),TB(80)))});
  c.globalAlpha=pa;
}

function sceneFinal(c,t){
  if(t<TB(80)||t>TB(116))return;
  const dy=20*(1-eo(P(t,TB(80),TB(83))));
  const a=eo(P(t,TB(80),TB(83)))*ei(1-P(t,TB(112),TB(116)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  RR(c,40,100+dy,1160,460,12,C.panel,C.assistant,2);
  T(c,'assistant',60,136+dy,{f:JM(20,700),col:C.assistant});
  STREAM(c,
    'Product engineer who moved into AI infra and never looked back. '+
    'Built the context pipeline handling 2M daily requests at Acme AI, '+
    'then open-sourced a compression SDK that cuts token costs 60%. '+
    'The kind of person who sees the missing layer and builds it.',
    60,220+dy,eo(P(t,TB(82),TB(104))),{f:JM(26,400),col:C.txt,lh:46,maxW:1080});
  c.globalAlpha=pa;
}

function sceneOutro(c,t){
  if(t<TB(108))return;
  const a=eo(P(t,TB(108),TB(112)));if(a<=0)return;
  const pa=c.globalAlpha;c.globalAlpha=pa*a;
  c.font=SY(120,800);c.textAlign='center';c.textBaseline='middle';
  const grd=c.createLinearGradient(W/2-400,0,W/2+400,0);
  grd.addColorStop(0,C.tool);grd.addColorStop(1,C.think);
  c.fillStyle=grd;c.fillText('CONTEXT COMPLETE',W/2,H/2-80);
  T(c,'alex@alexkim.dev  ·  github.com/alexkim  ·  alexkim.dev',W/2,H/2+30,{f:JM(24,400),col:C.dim,al:'center'});
  T(c,'open to: AI infra  ·  context engineering  ·  agent tooling',W/2,H/2+86,{f:JM(20,400),col:C.dim,al:'center'});
  T(c,'made with resumotion°',W/2,H/2+160,{f:JM(14,400),col:C.border,al:'center'});
  c.globalAlpha=pa;
}

// ── context fill ramp ──
function ctxFill(t){
  if(t<TB(18))return 0;
  if(t<TB(38))return L(0,0.3,eo(P(t,TB(18),TB(40))));
  if(t<TB(60))return L(0.3,0.65,eo(P(t,TB(38),TB(62))));
  if(t<TB(82))return L(0.65,0.85,eo(P(t,TB(60),TB(82))));
  if(t<TB(104))return L(0.85,1,eo(P(t,TB(82),TB(104))));
  return 1;
}

// ── background ──
function BG(c){
  c.fillStyle=C.bg;c.fillRect(0,0,W,H);
  c.fillStyle='rgba(48,54,61,0.3)';
  for(let x=0;x<W;x+=48)for(let y=0;y<H;y+=48){c.beginPath();c.arc(x,y,1.5,0,7);c.fill()}
}

function render(t){
  FR=Math.round(t*FPS);
  BG(X);
  HEADER(X,t);
  METER(X,t,ctxFill(t));
  sceneBoot(X,t);
  sceneQuery(X,t);
  sceneTC1(X,t);
  sceneTC2(X,t);
  sceneThink(X,t);
  sceneFinal(X,t);
  sceneOutro(X,t);
  // scanlines
  X.fillStyle='rgba(0,0,0,0.018)';
  for(let y=0;y<H;y+=3)X.fillRect(0,y,W,1);
}

window.__render=render;
window.__meta={DUR,FPS,BPM,scenes:[
  ['boot',0,TB(8)],['query',TB(8),TB(18)],
  ['tc1',TB(18),TB(38)],['tc2',TB(38),TB(58)],
  ['think',TB(58),TB(82)],['final',TB(82),TB(108)],
  ['outro',TB(108),DUR]
]};
window.__ready=Promise.all([
  document.fonts.load(SY(26,800)),
  document.fonts.load(JM(22,400)),
  document.fonts.load(JM(20,700)),
]);
