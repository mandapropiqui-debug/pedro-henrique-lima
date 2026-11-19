(function(){
'use strict';
var WA_NUM='5511985053179';
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function waUrl(lines){
  var msg=['Olá, Pedro.'].concat(lines).join('\n');
  return 'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(msg);
}
$$('[data-wa]').forEach(function(a){
  a.href=waUrl(a.getAttribute('data-wa').split('|'));
});

/* ---------- ABERTURA: SEMENTE QUE VIRA ARVORE (3D) ---------- */
var open=$('#open'),cv=$('#grow'),planted=false;
function revealEnter(txt){var e=$('#enter');e.classList.add('show');e.tabIndex=0;$('#ocall').innerHTML=txt}
(function(){
  if(!window.THREE){revealEnter('Quase 20 anos de OAB');return}
  try{
    var S=cv.clientWidth||300;
    var rd=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    rd.setPixelRatio(Math.min(window.devicePixelRatio||1,2));rd.setSize(S,S,false);
    var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,60);cam.position.set(0,3.6,10.5);cam.lookAt(0,1.3,0);
    sc.add(new THREE.AmbientLight(0xf8fce3,.42));
    var dl=new THREE.DirectionalLight(0xf8fce3,.75);dl.position.set(4,8,5);sc.add(dl);
    var pl=new THREE.PointLight(0xf8fce3,.8,16);pl.position.set(0,4,3);sc.add(pl);
    var CR=0xf8fce3;
    function mat(c,e){return new THREE.MeshLambertMaterial({color:c,emissive:CR,emissiveIntensity:e})}
    var world=new THREE.Group();sc.add(world);
    var island=new THREE.Group();world.add(island);
    var top=new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.3,.3,48),mat(0x364323,.05));top.position.y=-.15;island.add(top);
    var rim=new THREE.Mesh(new THREE.TorusGeometry(2.3,.025,8,64),mat(CR,.6));rim.rotation.x=Math.PI/2;rim.position.y=0;island.add(rim);
    var soil=new THREE.Mesh(new THREE.CylinderGeometry(2.3,.35,1.7,48),mat(0x283612,.1));soil.position.y=-1.15;island.add(soil);
    var soil2=new THREE.Mesh(new THREE.CylinderGeometry(2.32,2.18,.12,48),mat(0x32401e,.3));soil2.position.y=-.36;island.add(soil2);
    // tufos de grama
    var tufts=[];
    for(var i=0;i<14;i++){var a=i/14*6.283+Math.random()*.3,r=1.2+Math.random()*.9;
      var t=new THREE.Mesh(new THREE.ConeGeometry(.09+Math.random()*.05,.3+Math.random()*.25,5),mat(i%3?0x32401e:0x364323,.35));
      t.position.set(Math.cos(a)*r,0,Math.sin(a)*r);t.scale.setScalar(.001);island.add(t);tufts.push({m:t,d:i*.08,s:0,v:0})}
    // arvore
    var tree=new THREE.Group();island.add(tree);
    var trunk=new THREE.Mesh(new THREE.CylinderGeometry(.09,.17,1.9,10),mat(0xb9c39a,.2));trunk.position.y=.95;tree.add(trunk);
    var b1=new THREE.Mesh(new THREE.CylinderGeometry(.04,.08,.9,8),mat(CR,.3));b1.position.set(.3,1.5,0);b1.rotation.z=-.7;tree.add(b1);
    var b2=b1.clone();b2.position.set(-.3,1.35,.1);b2.rotation.z=.7;tree.add(b2);
    var leaves=[[0,2.55,0,.95,0x364323,.2],[.7,2.0,.2,.7,0x32401e,.22],[-.7,1.95,-.1,.72,0x364323,.26],[.1,3.2,.1,.62,0x32401e,.3],[-.2,2.2,.7,.55,0x364323,.32],[.35,2.35,-.6,.5,0x32401e,.34]].map(function(p,i){
      var m=new THREE.Mesh(new THREE.IcosahedronGeometry(p[3],1),mat(p[4],p[5]));m.position.set(p[0],p[1],p[2]);m.scale.setScalar(.001);tree.add(m);return {m:m,d:.7+i*.12,s:0,v:0}});
    trunk.scale.y=.001;trunk.position.y=0;b1.scale.setScalar(.001);b2.scale.setScalar(.001);
    var tr={s:0,v:0};
    // semente
    var seed=new THREE.Mesh(new THREE.SphereGeometry(.28,16,16),mat(CR,.9));seed.scale.set(.8,1.1,.8);seed.position.y=3.2;world.add(seed);
    var halo=new THREE.Mesh(new THREE.TorusGeometry(.6,.025,8,40),mat(CR,1));halo.position.y=3.2;world.add(halo);
    var halo2=halo.clone();world.add(halo2);
    // onda
    var wave=new THREE.Mesh(new THREE.TorusGeometry(.4,.04,8,50),mat(CR,1));wave.rotation.x=Math.PI/2;wave.position.y=.05;wave.visible=false;island.add(wave);
    // folhinhas
    var fl=[];for(var k=0;k<10;k++){var f=new THREE.Mesh(new THREE.OctahedronGeometry(.08,0),mat(CR,.8));f.scale.set(1,.5,1.6);f.visible=false;island.add(f);fl.push({m:f,a:k/10*6.283,h:1+Math.random()*2,r:1.2+Math.random()*1})}
    var phase=0,pt=0,ry=0,vry=.004,drag=false,lx=0,moved=0,vis=true,raf=0,t0=0,tp=0;
    function plant(){if(planted)return;planted=true;phase=1;pt=0;$('#ocall').style.opacity=0;open.classList.add('planting')}
    cv.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;moved=0;try{cv.setPointerCapture(e.pointerId)}catch(x){}});
    cv.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);ry+=dx*.012;vry=dx*.004});
    cv.addEventListener('pointerup',function(){drag=false;if(moved<8)plant()});
    cv.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')plant()});
    cv.tabIndex=0;
    function spring(o,tg,k,d){var f=Math.min(3,(window.__f||1));o.v+=(tg-o.s)*k*f;o.v*=Math.pow(d,f);o.s+=o.v*f}
    function loop(t){
      t/=1000;if(!t0)t0=t;
      if(!open.parentNode||open.classList.contains('gone')){raf=0;return}
      var dt=Math.min(.05,t-(tp||t));tp=t;var f60=dt*60;window.__f=f60;
      if(!drag){ry+=vry*f60;vry+=(.004-vry)*.02}
      world.rotation.y=ry;
      if(phase===0){seed.position.y=3.2+Math.sin(t*2)*.15;halo.position.y=halo2.position.y=seed.position.y;var p=(t*.9)%1;halo.scale.setScalar(.7+p*.9);halo.material.opacity=1;halo2.scale.setScalar(.7+((p+.5)%1)*.9);seed.rotation.y=t}
      if(phase>=1){pt+=dt;
        if(phase===1){var q=Math.min(1,pt/.55);seed.position.y=3.2*(1-q*q)+.05;halo.visible=halo2.visible=false;
          if(q>=1){phase=2;pt=0;seed.visible=false;wave.visible=true}}
        if(phase===2){var w=Math.min(1,pt/1.2);wave.scale.setScalar(1+w*5);wave.material.emissiveIntensity=1-w;wave.material.transparent=true;wave.material.opacity=1-w;
          spring(tr,1,.08,.78);trunk.scale.y=Math.max(.001,tr.s);trunk.position.y=.95*Math.max(.001,tr.s);
          var bs=Math.max(0,Math.min(1,(pt-.5)/.5));b1.scale.setScalar(Math.max(.001,bs));b2.scale.setScalar(Math.max(.001,bs));
          leaves.forEach(function(l){if(pt>l.d)spring(l,1,.09,.74);l.m.scale.setScalar(Math.max(.001,l.s))});
          tufts.forEach(function(g){if(pt>g.d+.3)spring(g,1,.1,.74);g.m.scale.setScalar(Math.max(.001,g.s))});
          fl.forEach(function(f){f.m.visible=pt>1.6});
          if(pt>2.2){phase=3;revealEnter('Quase 20 anos de OAB');$('#ocall').style.opacity=1}}
        if(phase===3){leaves.forEach(function(l,i){l.m.rotation.y=t*.3+i;l.m.scale.setScalar(1+Math.sin(t*1.6+i)*.03)});tree.rotation.z=Math.sin(t*1.1)*.012}
        if(phase>=2){fl.forEach(function(f){var a=f.a+t*.5;f.m.position.set(Math.cos(a)*f.r,f.h+Math.sin(t*1.2+f.a)*.3,Math.sin(a)*f.r);f.m.rotation.y=t*2})}
      }
      rd.render(sc,cam);raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    window.__plant=plant;
  }catch(err){cv.style.display='none';revealEnter('Quase 20 anos de OAB')}
})();
function enter(){
  open.classList.add('gone');
  setTimeout(function(){open.style.display='none'},750);
  $('.menu').classList.add('show');
  startMascot();
}
$('#enter').addEventListener('click',enter);
$('#skip').addEventListener('click',enter);

/* ---------- reveal ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
$$('.rv').forEach(function(el){io.observe(el)});

/* ---------- menu ativo e fala do mascote ---------- */
var cur='links';
var says={links:'Oi! Fale comigo pelo WhatsApp.',multa:'Recebeu um auto? Faça a triagem.',terra:'Terra regularizada vale mais, segundo o post.',trajetoria:'Cada anel conta um capítulo.',faq:'Escolha uma pergunta.',contato:'Conte a sua situação.'};
var secs=$$('section[data-m]');
var so=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){var m=e.target.getAttribute('data-m');cur=m;
    $$('.menu a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-m')===m)});
    mascotSay(m,e.target.classList.contains('light'));}
})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){so.observe(s)});

var lo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)$('.menu').classList.toggle('onlight',e.target.classList.contains('light'))})},{rootMargin:'-30px 0px -90% 0px'});
$$('main>.sec').forEach(function(s){lo.observe(s)});
/* ---------- mascote: sai pelo mesmo lado, alterna cantos ---------- */
var mas=$('#mascot'),mt=$('#mtext'),mimg=$('img',mas),corner='bl',started=false,lastSaid='';
function mascotSay(m,light){mimg.src=light?'assets/logo-green.png':'assets/logo-cream.png';if(started)lastSaid=m}
function show(){
  mas.className='mascot '+corner;mt.textContent=says[lastSaid||cur]||says.links;
  mimg.src=(document.querySelector('section[data-m="'+(lastSaid||cur)+'"]')||{classList:{contains:function(){return false}}}).classList.contains('light')?'assets/logo-green.png':'assets/logo-cream.png';
  requestAnimationFrame(function(){mas.classList.add('in')});
  setTimeout(function(){mas.classList.remove('in');
    setTimeout(function(){corner=corner==='bl'?'tr':'bl'},800)},4200);
}
function startMascot(){if(started)return;started=true;lastSaid='links';setTimeout(function(){show();setInterval(show,9500)},2500)}

/* ---------- linha do processo ---------- */
var steps=$$('.step');
steps.forEach(function(s,i){
  $('.sb',s).addEventListener('click',function(){
    var op=s.classList.contains('isopen');
    steps.forEach(function(x){x.classList.remove('isopen');$('.sb',x).setAttribute('aria-expanded','false')});
    if(!op){s.classList.add('isopen','seen');$('.sb',s).setAttribute('aria-expanded','true');
      var seen=0;steps.forEach(function(x,j){if(x.classList.contains('seen'))seen=j+1});
      $('#line').style.setProperty('--p',seen/steps.length)}
  });
});

/* ---------- comparador ---------- */
(function(){
  var box=$('#cmp'),pb=$('#paneb'),g=$('#grip'),inner=$('.inner',pb),pos=.5,drag=false;
  function set(p){pos=Math.max(.04,Math.min(.96,p));pb.style.width=pos*100+'%';g.style.left=pos*100+'%';g.setAttribute('aria-valuenow',Math.round(pos*100));inner.style.setProperty('--w',box.clientWidth+'px')}
  function x(e){var r=box.getBoundingClientRect();return (e.clientX-r.left)/r.width}
  box.addEventListener('pointerdown',function(e){drag=true;box.setPointerCapture(e.pointerId);set(x(e))});
  box.addEventListener('pointermove',function(e){if(drag)set(x(e))});
  box.addEventListener('pointerup',function(){drag=false});
  g.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')set(pos-.05);if(e.key==='ArrowRight')set(pos+.05)});
  addEventListener('resize',function(){set(pos)});
  set(.5);
  if(!reduce){var t=0,id=setInterval(function(){t+=1;set(.5+Math.sin(t/8)*.18);if(t>26){clearInterval(id)}},60)}
})();

/* ---------- terreno 3D de risco ---------- */
(function(){
  var info={
   fogo:['Queimada','Queimada em pastagem','O fogo em pastagem pode ter consequências jurídicas. Incêndios em propriedade rural podem gerar responsabilização civil e administrativa, e cada caso depende de análise.','Queimada em pastagem'],
   app:['Preservação','Antes que a autuação chegue','O perfil recomenda conhecer os riscos da propriedade antes da autuação. Conferir cadastro e áreas protegidas ajuda a enxergar o que pode virar problema.','Riscos da minha propriedade'],
   embargo:['Em debate','Embargo remoto por satélite','O PL 2564/2025 discute o embargo ambiental remoto do IBAMA a partir de imagens de satélite.','PL 2564/2025 e embargo'],
   omissao:['Poder público','Omissão na fiscalização','Decisão do TJ-SP trata da responsabilização do poder público por omissão na fiscalização ambiental.','Omissão na fiscalização ambiental']
  };
  var names={fogo:'Queimada',app:'Preservação',embargo:'Embargo',omissao:'Omissão'};
  var box=$('#risk'),tabs=$('#tabs'),act='fogo',select=function(){};
  function pick(k){
    act=k;$$('#tabs button').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-k')===k)});
    var d=info[k],h=document.createElement('div');
    h.innerHTML='<p class="k"></p><h3></h3><p></p><a class="btn sm" target="_blank" rel="noopener" href="#"><span class="in"><svg class="ic"><use href="#i-wa"/></svg><span class="t"><b>Falar sobre isso</b></span></span></a>';
    h.children[0].textContent=d[0];h.children[1].textContent=d[1];h.children[2].textContent=d[2];
    h.children[3].href=waUrl(['Assunto: '+d[3],'Situação: ','Quero uma orientação']);
    box.innerHTML='';box.appendChild(h);select(k);
  }
  Object.keys(names).forEach(function(k){var b=document.createElement('button');b.type='button';b.setAttribute('data-k',k);b.textContent=names[k];b.addEventListener('click',function(){pick(k)});tabs.appendChild(b)});
  pick('fogo');
  var stage=$('#stage');
  if(!window.THREE){return}
  try{
  var T=THREE,W=stage.clientWidth,H=stage.clientHeight;
  var rd=new T.WebGLRenderer({antialias:true,alpha:true});rd.setPixelRatio(Math.min(devicePixelRatio||1,2));rd.setSize(W,H);stage.appendChild(rd.domElement);
  var sc=new T.Scene(),cam=new T.PerspectiveCamera(38,W/H,.1,100);cam.position.set(0,8.4,12.6);cam.lookAt(0,.2,0);
  sc.add(new T.HemisphereLight(0xf8fce3,0x283612,.85));
  var dl=new T.DirectionalLight(0xf8fce3,.9);dl.position.set(4,8,5);sc.add(dl);
  var world=new T.Group();sc.add(world);
  var hills={fogo:{x:-2.3,z:-1.6,a:1.3,s:2.2},app:{x:2.4,z:-1.9,a:1.0,s:2.6},embargo:{x:2.1,z:2.2,a:1.2,s:2.0},omissao:{x:-2.4,z:2.3,a:.9,s:2.4}};
  function hgt(x,z){var h=.15*Math.sin(x*1.3)*Math.cos(z*1.1);for(var k in hills){var p=hills[k],d=(x-p.x)*(x-p.x)+(z-p.z)*(z-p.z);h+=p.a*Math.exp(-d/p.s)}return h}
  var g=new T.PlaneGeometry(11,11,70,70);g.rotateX(-Math.PI/2);
  var pos=g.attributes.position,col=new Float32Array(pos.count*3),c1=new T.Color(0x32401e),c2=new T.Color(0x7d9450),cc=new T.Color();
  for(var i=0;i<pos.count;i++){var y=hgt(pos.getX(i),pos.getZ(i));pos.setY(i,y);var band=Math.floor(y/.2)/8;cc.copy(c1).lerp(c2,Math.min(1,Math.max(0,band)));col[i*3]=cc.r;col[i*3+1]=cc.g;col[i*3+2]=cc.b}
  g.setAttribute('color',new T.BufferAttribute(col,3));g.computeVertexNormals();
  world.add(new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:1})));
  var slab=new T.Mesh(new T.BoxGeometry(11,.9,11),new T.MeshStandardMaterial({color:0x283612,roughness:1}));slab.position.y=-.46;world.add(slab);
  function M(c,o){return new T.MeshStandardMaterial({color:c,roughness:.9,flatShading:true,transparent:!!o,opacity:o||1})}
  function B(c,o){return new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,side:T.DoubleSide,depthWrite:false})}
  function ringMesh(r){var m=new T.Mesh(new T.RingGeometry(r,r+.12,64),B(0xf8fce3,0));m.rotation.x=-Math.PI/2;m.position.y=.06;return m}
  var objs={};
  function place(k){var p=hills[k],o=new T.Group();o.position.set(p.x,hgt(p.x,p.z),p.z);o.userData.k=k;var r=ringMesh(1.5);o.add(r);o.userData.ring=r;world.add(o);objs[k]=o;return o}
  /* fogo */
  var fo=place('fogo'),flames=[],smoke=[];
  [[0,0,1.3],[.5,.2,.9],[-.45,.25,1],[.1,-.5,.8],[-.2,.5,.7]].forEach(function(f,i){var m=new T.Mesh(new T.ConeGeometry(.3,f[2],7),B(0xf8fce3,.88));m.position.set(f[0],f[2]/2,f[1]);m.userData.h=f[2];m.userData.i=i;fo.add(m);flames.push(m)});
  for(var s=0;s<10;s++){var sm=new T.Mesh(new T.SphereGeometry(.16,8,8),B(0xf8fce3,.25));sm.userData.t=s/10;fo.add(sm);smoke.push(sm)}
  var fl=new T.PointLight(0xf8fce3,1.2,5);fl.position.y=1;fo.add(fl);
  /* app: arvores */
  var ap=place('app');
  function tree(x,z,sc){var t=new T.Group();var tr=new T.Mesh(new T.CylinderGeometry(.06,.08,.4,6),M(0x283612));tr.position.y=.2;t.add(tr);[[.55,.7,.4],[.45,1.05,.62],[.3,1.4,.8]].forEach(function(l,i){var c=new T.Mesh(new T.ConeGeometry(l[0],l[2]+.2,7),M(i%2?0x4a6329:0x3a5120));c.position.y=l[1];t.add(c)});t.position.set(x,0,z);t.scale.setScalar(sc);return t}
  [[0,0,1.15],[.8,.5,.9],[-.8,.4,1],[.5,-.8,.85],[-.5,-.7,.95],[1.1,-.3,.7]].forEach(function(t){var tt=tree(t[0],t[1],t[2]);tt.userData.sway=Math.random()*6;ap.add(tt)});
  var shield=new T.Mesh(new T.CylinderGeometry(1.5,1.5,1.9,40,1,true),B(0xf8fce3,.1));shield.position.y=.9;ap.add(shield);
  /* embargo: satelite */
  var em=place('embargo'),sat=new T.Group();
  var body=new T.Mesh(new T.BoxGeometry(.5,.34,.34),M(0xf8fce3));sat.add(body);
  [-1,1].forEach(function(s){var p=new T.Mesh(new T.BoxGeometry(.8,.03,.4),M(0x32401e));p.position.x=s*.72;sat.add(p);var e=new T.Mesh(new T.BoxGeometry(.8,.035,.05),M(0xf8fce3));e.position.set(s*.72,0,0);sat.add(e)});
  var beam=new T.Mesh(new T.ConeGeometry(.9,2.4,28,1,true),B(0xf8fce3,.2));beam.position.y=-1.3;sat.add(beam);
  sat.position.y=2.6;em.add(sat);
  var grid=new T.Mesh(new T.RingGeometry(.2,.9,6),B(0xf8fce3,.45));grid.rotation.x=-Math.PI/2;grid.position.y=.08;em.add(grid);
  /* omissao: torre sem vigia */
  var om=place('omissao');
  var tw=new T.Mesh(new T.BoxGeometry(.34,1.5,.34),M(0x6a7e45));tw.position.y=.75;om.add(tw);
  var cab=new T.Mesh(new T.BoxGeometry(.8,.42,.8),M(0x4a6329));cab.position.y=1.7;om.add(cab);
  var rf=new T.Mesh(new T.ConeGeometry(.7,.5,4),M(0x283612));rf.position.y=2.17;rf.rotation.y=Math.PI/4;om.add(rf);
  var win=new T.Mesh(new T.BoxGeometry(.5,.16,.82),M(0x1c260c));win.position.y=1.72;om.add(win);
  var dash=new T.Mesh(new T.RingGeometry(1.15,1.2,10,1),B(0xf8fce3,.35));dash.rotation.x=-Math.PI/2;dash.position.y=.07;om.add(dash);
  var beacon=new T.Mesh(new T.SphereGeometry(.09,10,10),B(0xf8fce3,.3));beacon.position.y=2.5;om.add(beacon);
  /* interacao */
  var target=null,drag=false,moved=0,lx=0,visible=true,rot=0;
  function toward(k){var p=hills[k];target=-Math.atan2(p.x,p.z)}
  select=function(k){toward(k)};toward('fogo');world.rotation.y=target;
  var el=rd.domElement,ray=new T.Raycaster(),mv=new T.Vector2();
  el.addEventListener('pointerdown',function(e){drag=true;moved=0;lx=e.clientX;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);world.rotation.y+=dx*.012;target=null});
  el.addEventListener('pointerup',function(e){drag=false;if(moved<6){var r=el.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mv,cam);var hit=ray.intersectObjects(world.children,true)[0];if(hit){var o=hit.object;while(o&&!o.userData.k)o=o.parent;if(o)pick(o.userData.k)}}});
  new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(stage);
  addEventListener('resize',function(){W=stage.clientWidth;H=stage.clientHeight;rd.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix()});
  var t0=performance.now();
  (function loop(){requestAnimationFrame(loop);if(!visible)return;var t=(performance.now()-t0)/1000;
    if(target!==null){var d=target-world.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));world.rotation.y+=d*.08}
    else if(!drag&&!reduce)world.rotation.y+=.002;
    flames.forEach(function(f){var s=1+.28*Math.sin(t*9+f.userData.i*1.7);f.scale.set(1+.1*Math.sin(t*7+f.userData.i),s,1+.1*Math.cos(t*6+f.userData.i))});
    fl.intensity=1.1+.5*Math.sin(t*11);
    smoke.forEach(function(s){var u=(t*.35+s.userData.t)%1;s.position.set(Math.sin(u*6+s.userData.t*9)*.3,1.2+u*2.2,Math.cos(u*5)*.3);s.scale.setScalar(.6+u*1.8);s.material.opacity=.28*(1-u)});
    ap.children.forEach(function(c){if(c.userData.sway!==undefined)c.rotation.z=Math.sin(t*1.4+c.userData.sway)*.04});
    sat.position.x=Math.sin(t*.8)*.5;sat.position.z=Math.cos(t*.8)*.5;sat.rotation.y=t*.4;beam.material.opacity=.14+.08*Math.sin(t*3);grid.rotation.z=t*.5;
    beacon.material.opacity=.15+.15*Math.max(0,Math.sin(t*1.6));dash.rotation.z=-t*.3;
    for(var k in objs){var o=objs[k],on=k===act;o.userData.ring.material.opacity+=((on?.9:0)-o.userData.ring.material.opacity)*.12;var s=on?1.1+.03*Math.sin(t*3):1;o.scale.x+=(s-o.scale.x)*.12;o.scale.y=o.scale.z=o.scale.x}
    rd.render(sc,cam)})();
  }catch(err){stage.style.display='none'}
})();

/* ---------- carrossel pets rotativo ---------- */
(function(){
  var car=$('#car'),ring=$('#ring3'),imgs=$$('#ring3 img'),dots=$$('#dots i'),N=imgs.length;
  var ang=0,vel=0,drag=false,lx=0,pause=0,vis=false,goal=null,raf=0,last=0;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var STEP=360/N;
  function dims(){var w=Math.min(car.clientWidth*.56,236);imgs.forEach(function(im){im.style.width=w+'px';im.style.marginLeft=(-w/2)+'px';im.style.marginTop=(-w*.667)+'px'});return w}
  var w=dims(),R=(w/2)/Math.tan(Math.PI/N)+16;
  window.addEventListener('resize',function(){w=dims();R=(w/2)/Math.tan(Math.PI/N)+16});
  function paint(){
    ring.style.transform='translateZ(-'+R+'px) rotateY('+ang+'deg)';
    var front=0,best=-2;
    imgs.forEach(function(im,i){
      var a=(ang+i*STEP)*Math.PI/180,c=Math.cos(a);
      im.style.transform='rotateY('+(i*STEP)+'deg) translateZ('+R+'px)';
      im.style.opacity=(.4+.6*Math.max(0,(c+.2)/1.2)).toFixed(3);
      im.style.filter='brightness('+(.55+.45*Math.max(0,c)).toFixed(2)+')';
      if(c>best){best=c;front=i}
    });
    dots.forEach(function(d,j){d.classList.toggle('on',j===front)});
  }
  function tick(t){
    if(!vis){raf=0;return}
    var dt=Math.min(.05,(t-last)/1000||.016);last=t;
    if(goal!==null){var d=goal-ang;ang+=d*Math.min(1,dt*7);if(Math.abs(d)<.3){ang=goal;goal=null}}
    else if(drag){}
    else if(Math.abs(vel)>.02){ang+=vel*dt;vel*=Math.pow(.04,dt)}
    else if(!reduce&&t>pause){ang-=14*dt}
    paint();raf=requestAnimationFrame(tick);
  }
  function go(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
  new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis){if(!(imgs[0].offsetWidth>10)||!car.clientWidth){w=dims();R=(w/2)/Math.tan(Math.PI/N)+16}go()}}).observe(car);
  car.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;vel=0;goal=null;try{car.setPointerCapture(e.pointerId)}catch(x){}});
  car.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;ang+=dx*.45;vel=dx*.45*60});
  function up(){if(!drag)return;drag=false;pause=performance.now()+2200}
  car.addEventListener('pointerup',up);car.addEventListener('pointercancel',up);
  dots.forEach(function(d,j){d.addEventListener('click',function(){
    var cur=Math.round(-ang/STEP);var base=-j*STEP;var k=Math.round((ang-base)/360);goal=base+k*360;pause=performance.now()+3500;vel=0;go()});});
  paint();
})();

/* ---------- tronco 3D: cada anel e um capitulo ---------- */
(function(){
  var cv=$('#rcv'),stage=$('#rstage'),cap=$('#rcap'),evs=$$('.ev');
  var cur=0;
  function setCur(i){cur=i;evs.forEach(function(e,j){e.classList.toggle('on',j<=i)});var b=evs[i].querySelector('b');if(b)cap.textContent=b.textContent;if(window.__ringGo)window.__ringGo(i)}
  var inter={};
  var eo=new IntersectionObserver(function(es){es.forEach(function(e){var i=evs.indexOf?0:0;i=+e.target.getAttribute('data-r');inter[i]=e.isIntersecting});
    var m=-1;for(var k in inter){if(inter[k]&&+k>m)m=+k}
    if(m>=0&&m!==cur)setCur(m)
  },{rootMargin:'-360px 0px -22% 0px',threshold:0});
  evs.forEach(function(e){eo.observe(e);e.addEventListener('click',function(){setCur(+e.getAttribute('data-r'))})});
  evs[0].classList.add('on');
  if(!window.THREE){stage.style.display='none';return}
  try{
    var W=cv.clientWidth||360,H=cv.clientHeight||260;
    var rd=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    rd.setPixelRatio(Math.min(window.devicePixelRatio||1,2));rd.setSize(W,H,false);
    var sc=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(34,W/H,.1,60);cam.position.set(0,7.2,9.4);cam.lookAt(0,.7,0);
    sc.add(new THREE.AmbientLight(0xf8fce3,.62));
    var dl=new THREE.DirectionalLight(0xf8fce3,.95);dl.position.set(4,9,6);sc.add(dl);
    var pl=new THREE.PointLight(0xf8fce3,.9,14);pl.position.set(0,4,0);sc.add(pl);
    var world=new THREE.Group();sc.add(world);
    var CR=new THREE.Color(0xf8fce3),G4=new THREE.Color(0x364323),G3=new THREE.Color(0x32401e),G2=new THREE.Color(0x2b3c18),G1=new THREE.Color(0x283612);
    var radii=[[0,.95],[.99,1.79],[1.83,2.63],[2.67,3.47]];
    function geo(r0,r1){var s=new THREE.Shape();s.absarc(0,0,r1,0,Math.PI*2,false);if(r0>0){var h=new THREE.Path();h.absarc(0,0,r0,0,Math.PI*2,true);s.holes.push(h)}
      var g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false,curveSegments:60});g.rotateX(-Math.PI/2);return g}
    var rings=radii.map(function(r,i){
      var top=new THREE.MeshLambertMaterial({color:G4,emissive:CR,emissiveIntensity:.1});
      var side=new THREE.MeshLambertMaterial({color:G4.clone().lerp(CR,.5),emissive:CR,emissiveIntensity:.05});
      var m=new THREE.Mesh(geo(r[0],r[1]),[top,side]);m.scale.y=.16;world.add(m);
      return {m:m,top:top,side:side,h:.16,v:0}});
    function mat(c,e){return new THREE.MeshLambertMaterial({color:c,emissive:CR,emissiveIntensity:e||.12})}
    function box(w,h,d,c,e){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,e));return m}
    var objs=[];
    // 0 livros (OAB)
    (function(){var g=new THREE.Group();
      var b1=box(.8,.16,.55,CR,.35);b1.position.y=.08;var b2=box(.7,.14,.5,G3,.28);b2.position.y=.23;b2.rotation.y=.35;var b3=box(.6,.13,.42,CR,.3);b3.position.y=.375;b3.rotation.y=-.25;
      g.add(b1,b2,b3);g.position.set(0,0,0);objs.push({g:g,ang:null,s:0,v:0});world.add(g)})();
    // 1 arvores (Comissao ambiental)
    (function(){var g=new THREE.Group();
      [[0,0,1],[.42,.2,.75],[-.3,.38,.85]].forEach(function(p){
        var t=new THREE.Mesh(new THREE.CylinderGeometry(.05,.07,.3*p[2],8),mat(CR,.25));t.position.set(p[0],.15*p[2],p[1]);
        var c1=new THREE.Mesh(new THREE.ConeGeometry(.3*p[2],.55*p[2],10),mat(G4,.32));c1.position.set(p[0],.5*p[2]+.12,p[1]);
        var c2=new THREE.Mesh(new THREE.ConeGeometry(.22*p[2],.45*p[2],10),mat(G3,.4));c2.position.set(p[0],.82*p[2]+.12,p[1]);
        g.add(t,c1,c2)});
      var a=3.5,r=1.4;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);objs.push({g:g,ang:a,s:0,v:0});world.add(g)})();
    // 2 ponte (SEINFRA)
    (function(){var g=new THREE.Group();
      var d=box(1.5,.1,.4,CR,.4);d.position.y=.5;g.add(d);
      [-.62,.62].forEach(function(x){var p=box(.14,.5,.34,G3,.3);p.position.set(x,.25,0);g.add(p)});
      var arc=new THREE.Mesh(new THREE.TorusGeometry(.42,.035,6,18,Math.PI),mat(CR,.4));arc.position.set(0,.5,.2);arc.rotation.z=Math.PI;arc.rotation.x=0;arc.position.y=.5;g.add(arc);
      var arc2=arc.clone();arc2.position.z=-.2;g.add(arc2);
      var a=5.55,r=2.23;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);g.rotation.y=-a+Math.PI/2;objs.push({g:g,ang:a,s:0,v:0});world.add(g)})();
    // 3 glebas (regularizacao)
    (function(){var g=new THREE.Group();
      for(var i=0;i<3;i++)for(var j=0;j<2;j++){var f=box(.42,.06,.42,(i+j)%2?CR:G3,(i+j)%2?.4:.3);f.position.set((i-1)*.48,.03,(j-.5)*.48);g.add(f)}
      var pin=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,10),mat(CR,.6));pin.rotation.x=Math.PI;pin.position.set(0,.75,0);
      var hd=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),mat(CR,.6));hd.position.set(0,.98,0);
      var pg=new THREE.Group();pg.add(pin,hd);g.add(pg);
      var a=1.3,r=3.07;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);g.rotation.y=-a+Math.PI/2;objs.push({g:g,ang:a,s:0,v:0,pg:pg});world.add(g)})();
    var ry=0,goal=0,drag=false,lx=0,idleT=0,run=false,vis=false,raf=0,camY=7.2;
    window.__ringGo=function(i){cur=i;if(!drag)goal=objs[i].ang===null?ry:objs[i].ang-Math.PI/2;
      // menor caminho
      goal=ry+Math.atan2(Math.sin(goal-ry),Math.cos(goal-ry))};
    cv.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;try{cv.setPointerCapture(e.pointerId)}catch(x){}});
    cv.addEventListener('pointermove',function(e){if(!drag)return;ry+=(e.clientX-lx)*.012;lx=e.clientX;goal=ry});
    function up(){drag=false}
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop)}).observe(stage);
    function loop(t){
      if(!vis){raf=0;return}
      t=t/1000;
      ry+=(goal-ry)*.07;if(!drag&&objs[cur].ang===null)goal+=.0035;
      world.rotation.y=ry;
      rings.forEach(function(r,i){
        var tgt=i>cur?.16:(i===cur?1.25:.55);
        r.v+=(tgt-r.h)*.12;r.v*=.7;r.h+=r.v;r.m.scale.y=Math.max(.05,r.h);
        var act=i===cur?1:0;
        r.top.color.lerp(i===cur?G4.clone().lerp(CR,.55):(i<cur?G3:G4),.1);
        r.top.emissiveIntensity+=((i===cur?.22:(i<cur?.14:.06))-r.top.emissiveIntensity)*.1;
        r.side.emissiveIntensity+=((i<=cur?.14:.04)-r.side.emissiveIntensity)*.1;
      });
      objs.forEach(function(o,i){
        var tg=i<=cur?1:0;o.v+=(tg-o.s)*.16;o.v*=.7;o.s+=o.v;var s=Math.max(.001,o.s);o.g.scale.setScalar(s);
        var ring=rings[i];o.g.position.y=ring.h+(i===cur?Math.sin(t*2)*.03:0);
        if(i===0&&i===cur)o.g.rotation.y=t*.4;
        if(o.pg)o.pg.position.y=Math.sin(t*2.4)*.1;
      });
      camY+=((cur===0?7.2:6.6)-camY)*.05;cam.position.y=camY;cam.lookAt(0,.7,0);
      rd.render(sc,cam);raf=requestAnimationFrame(loop);
    }
    // ponteiro: ponte e arvores crescem tambem ao tocar
    window.addEventListener('resize',function(){var w=cv.clientWidth,h=cv.clientHeight;if(w&&h){rd.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}});
  }catch(err){stage.style.display='none'}
})();

/* ---------- FAQ em conversa (estilo WhatsApp) ---------- */
(function(){
  var qa=[
   ['Recebi uma multa ambiental. E agora?','Guarde o auto e a data em que recebeu, e procure orientação cedo, porque os prazos correm a partir da notificação. Cada caso depende de análise.'],
   ['Queimada em pastagem gera problema jurídico?','Pode gerar. Incêndios em propriedade rural podem levar a responsabilização civil e administrativa.'],
   ['O que é o PL 2564/2025?','É o projeto de lei sobre embargo ambiental remoto por satélite do IBAMA, tema em debate no perfil.'],
   ['O conteúdo promete resultado?','Não. É informativo e não substitui consulta jurídica.']
  ];
  var chat=$('#chat'),qs=$('#qs');
  function hm(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
  var ticks='<svg viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5.5 4 8.5 9.5 1.5M6.5 8.5 12 1.5 15 1.5"/></svg>';
  function avatar(){var s=document.createElement('span');s.className='av';s.innerHTML='<img src="assets/mono-green.png" alt="" width="178" height="184">';return s}
  function msg(kind,html){var m=document.createElement('div');m.className='m '+kind;if(kind!=='u')m.appendChild(avatar());var b=document.createElement('div');b.className='b';b.innerHTML=html;m.appendChild(b);chat.appendChild(m);return {m:m,b:b}}
  function say(text){
    var o=msg('a t','<i></i><i></i><i></i>');
    setTimeout(function(){
      var words=text.split(' ');o.m.className='m a';
      o.b.innerHTML=words.map(function(w){return '<span class="wd">'+w+' </span>'}).join('')+'<time>'+hm()+'</time>';
      $$('.wd',o.b).forEach(function(s,i){setTimeout(function(){s.classList.add('on')},i*38)});
    },900);
  }
  say('Oi, aqui é do escritório do Pedro. Escolha uma pergunta abaixo.');
  qa.forEach(function(p){
    var b=document.createElement('button');b.type='button';b.textContent=p[0];
    b.addEventListener('click',function(){
      b.classList.add('used');
      msg('u',p[0]+'<time>'+hm()+ticks+'</time>');
      say(p[1]);
    });
    qs.appendChild(b);
  });
})();

/* ---------- TRIAGEM interativa -> WhatsApp organizado ---------- */
(function(){
  var root=$('#tri');if(!root)return;
  var IMOVEL={k:'imovel',t:'Que tipo de imóvel ou situação?',o:['Propriedade rural','Imóvel urbano','Obra ou empreendimento','Poder público (município, estado)','Outro']};
  var TREE={
    start:{k:'assunto',t:'O que <span class="hv">te trouxe aqui?</span>',h:'Escolha o que mais se parece com o seu caso.',o:[
      ['Recebi uma multa ambiental','multa'],['Minha área foi embargada','multa'],['Quero me prevenir de problemas','prev'],['Preciso regularizar a propriedade','reg'],['Outro assunto de Direito Ambiental','out']]},
    multa:[
      {k:'quando',t:'Quando você <span class="hv">recebeu o auto?</span>',h:'Os prazos de defesa são curtos e contam da notificação.',o:['Há menos de 7 dias','Entre 1 semana e 30 dias','Há mais de 30 dias','Não lembro a data']},
      {k:'orgao',t:'Qual <span class="hv">órgão autuou?</span>',o:['IBAMA','Órgão ambiental estadual','Prefeitura ou órgão municipal','Não sei informar']},
      {k:'fase',t:'Em que <span class="hv">fase está?</span>',o:['Só recebi o auto','Já apresentei defesa','Já houve decisão','Há embargo da área']},
      IMOVEL],
    prev:[
      {k:'preocupa',t:'O que mais <span class="hv">te preocupa?</span>',o:['Queimadas e fogo','Reserva legal e APP','Licenciamento','Fiscalização por satélite','Quero uma análise geral']},
      IMOVEL],
    reg:[
      {k:'precisa',t:'O que você <span class="hv">precisa?</span>',o:['CAR','CCIR e ITR','Georreferenciamento (GEO)','Licenciamento','Não sei por onde começar']},
      IMOVEL],
    out:[
      {k:'tema',t:'Sobre o que <span class="hv">é a dúvida?</span>',o:['Contrato ou compra de terra','Obra ou empreendimento','Poder público','Outro tema']},
      IMOVEL]
  };
  var LABEL={assunto:'Assunto',quando:'Recebi o auto',orgao:'Órgão',fase:'Fase',imovel:'Imóvel',preocupa:'Preocupação',precisa:'Preciso de',tema:'Tema'};
  var TITLE={multa:'Multa ambiental',prev:'Prevenção',reg:'Regularização da propriedade',out:'Direito Ambiental'};
  var ans={},flow=[],i=0,branch=null,hist=[];
  function total(){return branch?1+TREE[branch].length+1:5}
  function bar(n){var s='<div class="pg" aria-hidden="true">';for(var k=0;k<total();k++)s+='<i class="'+(k<=n?'on':'')+'"></i>';return s+'</div>'}
  function esc(t){return String(t).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
  function stepAt(n){return n===0?TREE.start:(branch&&n<=TREE[branch].length?TREE[branch][n-1]:null)}
  function render(n,back){
    i=n;var st=stepAt(n);
    if(!st){return contact()}
    var html=bar(n)+'<div class="slide"><div class="qn">Pergunta '+(n+1)+' de '+total()+'</div><h3 class="q">'+st.t.replace(/^(.*?)(<span)/,'<span class="lt">$1</span>$2')+'</h3>'+(st.h?'<p class="hint">'+st.h+'</p>':'<div style="height:10px"></div>')+'<div class="opts">';
    st.o.forEach(function(o,k){var txt=Array.isArray(o)?o[0]:o;html+='<button type="button" class="opt'+(ans[st.k]===txt?' pick':'')+'" style="--i:'+k+'" data-v="'+esc(txt)+'" data-b="'+(Array.isArray(o)?o[1]:'')+'">'+esc(txt)+'</button>'}) ;
    html+='</div>'+(n>0?'<button type="button" class="back">Voltar</button>':'')+'</div>';
    root.innerHTML=html;
    $$('.opt',root).forEach(function(b){b.addEventListener('click',function(){
      $$('.opt',root).forEach(function(x){x.classList.remove('pick')});b.classList.add('pick');
      ans[st.k]=b.getAttribute('data-v');
      if(n===0){branch=b.getAttribute('data-b');ans.assunto=TITLE[branch]==='Multa ambiental'&&ans.assunto.indexOf('embarg')>-1?'Embargo de área / multa ambiental':TITLE[branch]}
      setTimeout(function(){render(n+1)},320);
    })});
    var bk=$('.back',root);if(bk)bk.addEventListener('click',function(){render(n-1)});
  }
  function contact(){
    var n=total()-1;
    root.innerHTML=bar(n)+'<div class="slide"><div class="qn">Última pergunta</div><h3 class="q"><span class="lt">Como podemos</span> <span class="hv">te chamar?</span></h3><p class="hint">Só para o Pedro saber com quem fala. Pode pular.</p>'+
      '<label class="fld"><span>Seu nome</span><input id="tn" type="text" autocomplete="name" placeholder="Nome"></label>'+
      '<label class="fld"><span>Cidade e estado</span><input id="tc" type="text" autocomplete="address-level2" placeholder="Ex.: Teresina, PI"></label>'+
      '<button type="button" class="go" id="tg">Ver minha ficha</button><button type="button" class="back">Voltar</button></div>';
    $('.back',root).addEventListener('click',function(){render(n-1)});
    $('#tg',root).addEventListener('click',function(){ans.nome=$('#tn').value.trim();ans.cidade=$('#tc').value.trim();summary()});
  }
  function summary(){
    var rows=[['Assunto',ans.assunto]];
    ['quando','orgao','fase','preocupa','precisa','tema','imovel'].forEach(function(k){if(ans[k])rows.push([LABEL[k],ans[k]])});
    if(ans.nome)rows.push(['Nome',ans.nome]);if(ans.cidade)rows.push(['Cidade',ans.cidade]);
    var lines=rows.map(function(r){return r[0]+': '+r[1]});
    if(branch==='multa')lines.push('Vou enviar o auto e os documentos em seguida');
    lines.push('Quero uma orientação');
    var urgent=ans.quando==='Há menos de 7 dias'||ans.quando==='Entre 1 semana e 30 dias'||ans.fase==='Há embargo da área';
    var html=bar(total())+'<div class="slide"><div class="qn">Tudo pronto</div><h3 class="q"><span class="lt">Sua</span> <span class="hv">ficha</span></h3><div class="ficha"><h3>Resumo do atendimento</h3><dl>';
    rows.forEach(function(r){html+='<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'});
    html+='</dl>'+(urgent?'<p class="tip">Como o prazo pode estar correndo, vale mandar logo. Tenha o auto e a data da notificação em mãos.</p>':'')+'</div>'+
      '<a class="wa-go" href="'+waUrl(lines)+'" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg>Enviar no WhatsApp</a>'+
      '<button type="button" class="back" id="rs">Refazer a triagem</button></div>';
    root.innerHTML=html;
    $('#rs',root).addEventListener('click',function(){ans={};branch=null;render(0)});
  }
  render(0);
})();

/* ---------- menu retratil, barra de progresso ---------- */
(function(){
  var menu=$('.menu'),bar=document.createElement('div');bar.className='prog';document.body.appendChild(bar);
  function y(){return window.pageYOffset||document.documentElement.scrollTop||0}
  function wake(){var h=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,y()/h):0)+')'}
  document.addEventListener('scroll',wake,{passive:true,capture:true});
  window.addEventListener('scroll',wake,{passive:true});
})();

/* ---------- montagem: titulos palavra a palavra e entradas ---------- */
(function(){
  $$('.h2').forEach(function(h){
    var n=0;
    function split(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var parts=c.textContent.split(/(\s+)/),f=document.createDocumentFragment();
          parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return}
            var s=document.createElement('span');s.className='w';s.style.setProperty('--wd',(n++*90)+'ms');s.textContent=p;f.appendChild(s)});
          node.replaceChild(f,c);
        }else if(c.nodeType===1&&c.tagName!=='BR'){split(c)}
      });
    }
    split(h);h.classList.add('rv0');
  });
  var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ob.unobserve(e.target)}})},{threshold:.2});
  $$('.h2').forEach(function(h){ob.observe(h)});
  var kinds=['','l','r','z'],k=0;
  $$('.sec').forEach(function(s){
    if(s.id==='links')return;
    var i=0;
    $$('.lede,.debate,.step,.ev,.stage,.tabs,.risk,.wa,.qs,.car,.dots,.cmp,.pline',s).forEach(function(el){
      if(el.classList.contains('rv')||el.classList.contains('rx'))return;
      el.classList.add('rx');var kd=kinds[k++%4];if(kd&&!el.classList.contains('ev')&&!el.classList.contains('step'))el.classList.add(kd);
      el.style.setProperty('--d',(i++%4*80)+'ms');ob.observe(el);
    });
  });
  /* particulas nos fundos */
  $$('.bg').forEach(function(bg,bi){
    for(var i=0;i<8;i++){var s=document.createElement('i');s.className='fp';
      s.style.left=((i*13+bi*17)%96)+'%';s.style.bottom='-12px';
      s.style.setProperty('--t',(12+((i*5+bi)%9))+'s');s.style.setProperty('--dl',(-(i*3.1))+'s');s.style.setProperty('--dx',((i%2?1:-1)*(14+i*4))+'px');
      s.style.width=s.style.height=(3+(i%3)*2)+'px';bg.appendChild(s)}
  });
})();
})();
