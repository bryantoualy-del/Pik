import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js';

const SETTINGS_KEY='pikDiceSettingsV2';
const defaults={speed:'cinematic',sound:true,haptics:true};
let settings=loadSettings();
let overlay=null,renderer=null,scene=null,camera=null,clockId=0;
let queue=[],busy=false,currentResolve=null,currentDice=[];

function loadSettings(){
  try{return {...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch(e){return {...defaults}}
}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));window.dispatchEvent(new CustomEvent('pikdice:settings',{detail:{...settings}}))}
function setSettings(patch){settings={...settings,...patch};saveSettings();return {...settings}}
function getSettings(){return {...settings}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const easeOut=t=>1-Math.pow(1-t,3);
const clamp01=t=>Math.max(0,Math.min(1,t));

function ensureOverlay(){
  if(overlay) return overlay;
  overlay=document.createElement('div');
  overlay.id='pikDiceOverlay';
  overlay.innerHTML='<div class="pik-dice-scene" role="dialog" aria-modal="true" aria-label="Lancer de dé"><div class="pik-dice-title"></div><div class="pik-dice-status">Lancer du d20</div><canvas class="pik-dice-canvas"></canvas><div class="pik-dice-vignette"></div><div class="pik-dice-queue"></div><div class="pik-dice-result"><div class="pik-dice-verdict"></div><div class="pik-dice-total"></div><div class="pik-dice-detail"></div><div class="pik-dice-hint">Touchez pour continuer</div></div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click',()=>{if(overlay.dataset.dismissable==='1') finishCurrent()});
  window.addEventListener('resize',resizeRenderer,{passive:true});
  return overlay;
}

function ensureThree(){
  ensureOverlay();
  if(renderer) return true;
  try{
    const canvas=overlay.querySelector('.pik-dice-canvas');
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(34,1,.1,100);
    camera.position.set(0,2.35,7.8);
    camera.lookAt(0,.15,0);

    scene.add(new THREE.HemisphereLight(0xbfffe0,0x06100b,1.35));
    const key=new THREE.DirectionalLight(0xe8fff1,3.1);key.position.set(-3,5,5);key.castShadow=true;scene.add(key);
    const rim=new THREE.PointLight(0x4fd28a,10,12,2);rim.position.set(3,1.2,3);scene.add(rim);
    const red=new THREE.PointLight(0xed5c61,4,10,2);red.position.set(-3,-.5,1);scene.add(red);

    const floor=new THREE.Mesh(new THREE.CircleGeometry(4.6,72),new THREE.MeshStandardMaterial({color:0x0b1d14,roughness:.92,metalness:.05,transparent:true,opacity:.9}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-1.18;floor.receiveShadow=true;scene.add(floor);
    const ring=new THREE.Mesh(new THREE.RingGeometry(2.55,2.58,96),new THREE.MeshBasicMaterial({color:0x4fd28a,transparent:true,opacity:.18,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;ring.position.y=-1.15;scene.add(ring);
    resizeRenderer();
    return true;
  }catch(e){
    console.warn('Pik Dice WebGL indisponible',e);
    return false;
  }
}

function resizeRenderer(){
  if(!renderer||!overlay) return;
  const rect=overlay.getBoundingClientRect();
  renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
  camera.aspect=Math.max(1,rect.width)/Math.max(1,rect.height);
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
}

function makeNumberTexture(n){
  const c=document.createElement('canvas');c.width=c.height=256;
  const x=c.getContext('2d');
  x.clearRect(0,0,256,256);
  x.font='900 118px Georgia';x.textAlign='center';x.textBaseline='middle';
  x.lineWidth=11;x.strokeStyle='rgba(4,12,8,.82)';x.strokeText(String(n),128,133);
  x.fillStyle=n===20?'#fff1b3':n===1?'#ffabb2':'#f2fff6';x.fillText(String(n),128,133);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer?.capabilities?.getMaxAnisotropy?.()||1);return t;
}

function createD20(value,index,count){
  const group=new THREE.Group();
  const geometry=new THREE.IcosahedronGeometry(1,0).toNonIndexed();
  const mat=new THREE.MeshStandardMaterial({color:0x17623f,metalness:.72,roughness:.3,flatShading:true,emissive:0x07170f,emissiveIntensity:.45,transparent:true,opacity:1});
  const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);

  const pos=geometry.attributes.position;
  const faces=[];
  for(let i=0,face=1;i<pos.count;i+=3,face++){
    const a=new THREE.Vector3().fromBufferAttribute(pos,i),b=new THREE.Vector3().fromBufferAttribute(pos,i+1),c=new THREE.Vector3().fromBufferAttribute(pos,i+2);
    const center=a.clone().add(b).add(c).multiplyScalar(1/3);
    const normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    if(center.dot(normal)<0) normal.negate();
    faces.push({normal:center.clone().normalize(),n:face});
    const label=new THREE.Mesh(new THREE.PlaneGeometry(.48,.48),new THREE.MeshBasicMaterial({map:makeNumberTexture(face),transparent:true,depthWrite:false,side:THREE.DoubleSide}));
    label.position.copy(center.clone().normalize().multiplyScalar(1.012));
    label.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);
    label.renderOrder=3;group.add(label);
  }
  const targetFace=faces.find(f=>f.n===value)||faces[0];
  const targetQ=new THREE.Quaternion().setFromUnitVectors(targetFace.normal.clone(),new THREE.Vector3(0,.18,1).normalize());
  const endX=count===2?(index===0?-1.35:1.35):0;
  group.position.set(endX+(Math.random()-.5)*.35,4.4+index*.35,(Math.random()-.5)*.4);
  group.rotation.set(Math.random()*4,Math.random()*4,Math.random()*4);
  group.userData={value,index,targetQ,endX,materials:[mat],labels:group.children.slice(1)};
  scene.add(group);
  return group;
}

function clearDice(){
  currentDice.forEach(g=>{
    scene?.remove(g);
    g.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.material){
        const arr=Array.isArray(o.material)?o.material:[o.material];
        arr.forEach(m=>{if(m.map)m.map.dispose();m.dispose()});
      }
    });
  });
  currentDice=[];
}

function setGroupOpacity(g,opacity){
  g.traverse(o=>{if(o.material){const arr=Array.isArray(o.material)?o.material:[o.material];arr.forEach(m=>{m.transparent=true;m.opacity=opacity})}});
}

function vibrate(pattern){if(settings.haptics&&navigator.vibrate)navigator.vibrate(pattern)}
function tone(kind){
  if(!settings.sound) return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext;const ac=new AC();
    const g=ac.createGain();g.connect(ac.destination);
    const o=ac.createOscillator();o.connect(g);
    const now=ac.currentTime;
    if(kind==='impact'){o.type='sine';o.frequency.setValueAtTime(95,now);o.frequency.exponentialRampToValueAtTime(42,now+.16);g.gain.setValueAtTime(.055,now);g.gain.exponentialRampToValueAtTime(.001,now+.18)}
    else if(kind==='crit'){o.type='triangle';o.frequency.setValueAtTime(420,now);o.frequency.exponentialRampToValueAtTime(980,now+.28);g.gain.setValueAtTime(.045,now);g.gain.exponentialRampToValueAtTime(.001,now+.34)}
    else{o.type='sine';o.frequency.setValueAtTime(160,now);o.frequency.exponentialRampToValueAtTime(85,now+.12);g.gain.setValueAtTime(.025,now);g.gain.exponentialRampToValueAtTime(.001,now+.14)}
    o.start(now);o.stop(now+(kind==='crit'?.35:.2));setTimeout(()=>ac.close(),500);
  }catch(e){}
}

function frameLoop(){if(!renderer||!scene||!camera)return;renderer.render(scene,camera);clockId=requestAnimationFrame(frameLoop)}
function startLoop(){cancelAnimationFrame(clockId);frameLoop()}
function stopLoop(){cancelAnimationFrame(clockId);clockId=0;renderer?.render(scene,camera)}

async function animateRoll(dice,duration){
  const start=performance.now();
  const endY=-.05;
  let settled=false,settleStart=0;
  const startQ=dice.map(()=>null);
  return new Promise(resolve=>{
    function step(now){
      const t=clamp01((now-start)/duration);
      const fall=easeOut(clamp01(t/0.72));
      dice.forEach((g,i)=>{
        if(t<.72){
          g.position.y=4.4+i*.35+(endY-(4.4+i*.35))*fall;
          g.position.x=g.userData.endX+Math.sin(t*16+i)*(.34*(1-t));
          g.rotation.x+=.17+i*.015;g.rotation.y+=.21-i*.018;g.rotation.z+=.12;
        }else{
          if(!settled){settled=true;settleStart=t;dice.forEach((x,j)=>startQ[j]=x.quaternion.clone());tone('impact');vibrate(20);overlay.classList.add('impact');setTimeout(()=>overlay?.classList.remove('impact'),170)}
          const s=clamp01((t-.72)/.28),k=1-Math.pow(1-s,3);
          g.position.y=endY+Math.sin((1-s)*Math.PI*2)*.08*(1-s);
          g.position.x+=(g.userData.endX-g.position.x)*.14;
          g.quaternion.copy(startQ[i]).slerp(g.userData.targetQ,k);
        }
      });
      renderer.render(scene,camera);
      if(t<1)requestAnimationFrame(step);else resolve();
    }
    requestAnimationFrame(step);
  });
}

async function emphasize(dice,chosen){
  const selectedIndex=dice.findIndex(g=>g.userData.value===chosen);
  dice.forEach((g,i)=>{
    if(i===selectedIndex){g.scale.setScalar(1.08);g.position.x+=(0-g.position.x)*.35}
    else{setGroupOpacity(g,.18);g.scale.setScalar(.72);g.position.x*=1.28}
  });
  renderer.render(scene,camera);await sleep(220);
}

function updateQueueBadge(){
  if(!overlay)return;const q=overlay.querySelector('.pik-dice-queue');
  if(queue.length){q.textContent=queue.length+' jet'+(queue.length>1?'s':'')+' en attente';q.classList.add('show')}else q.classList.remove('show');
}

function finishCurrent(){
  if(!overlay)return;
  overlay.dataset.dismissable='0';overlay.classList.remove('open','nat20','nat1','reveal','impact');
  stopLoop();clearDice();
  const r=currentResolve;currentResolve=null;
  setTimeout(()=>{r?.();busy=false;pump()},120);
}

async function perform(opts,resolve){
  settings=loadSettings();
  if(settings.speed==='off'){resolve();busy=false;pump();return}
  currentResolve=resolve;
  const o=ensureOverlay();
  const ok=ensureThree();
  if(!ok){resolve();busy=false;pump();return}
  clearDice();
  o.className='';
  o.dataset.dismissable='0';
  o.querySelector('.pik-dice-result').classList.remove('show');
  const mode=opts.mode||'normal';
  const rolls=Array.isArray(opts.rolls)&&opts.rolls.length?opts.rolls.slice(0,2):[opts.chosen||1];
  const chosen=opts.chosen??rolls[0];
  o.querySelector('.pik-dice-title').innerHTML=(opts.label||'Jet de d20')+'<small>'+(mode==='adv'?'Avantage · meilleur résultat':mode==='dis'?'Désavantage · résultat le plus faible':'Jet normal')+'</small>';
  o.querySelector('.pik-dice-status').textContent=settings.speed==='fast'?'Jet rapide':'Lancer du d20';
  if(chosen===20)o.classList.add('nat20');if(chosen===1)o.classList.add('nat1');
  o.classList.add('open');resizeRenderer();startLoop();vibrate(14);tone('start');
  currentDice=rolls.map((v,i)=>createD20(v,i,rolls.length));
  const duration=settings.speed==='fast'?520:1320;
  await animateRoll(currentDice,duration);
  await emphasize(currentDice,chosen);
  o.querySelector('.pik-dice-verdict').textContent=chosen===20?'20 naturel · critique':chosen===1?'1 naturel · échec critique':'Résultat du jet';
  o.querySelector('.pik-dice-total').textContent=opts.total!=null?String(opts.total):String(chosen);
  o.querySelector('.pik-dice-detail').textContent=opts.detail||('d20 '+chosen);
  o.querySelector('.pik-dice-result').classList.add('show');
  o.classList.add('reveal');
  if(chosen===20){tone('crit');vibrate([22,30,44])}
  else if(chosen===1){vibrate([36,24,36])}
  o.querySelector('.pik-dice-status').textContent=rolls.length===2?'Dé retenu : '+chosen:'Face obtenue : '+chosen;
  o.dataset.dismissable='1';
  updateQueueBadge();
  if(queue.length){await sleep(settings.speed==='fast'?450:850);if(o.dataset.dismissable==='1')finishCurrent()}
}

function pump(){
  if(busy||!queue.length){updateQueueBadge();return}
  busy=true;const job=queue.shift();updateQueueBadge();perform(job.opts,job.resolve);
}
function roll(opts={}){return new Promise(resolve=>{queue.push({opts:{...opts},resolve});pump()})}
function close(){if(overlay?.dataset.dismissable==='1')finishCurrent()}
function cancelAll(){queue.splice(0).forEach(j=>j.resolve());updateQueueBadge();if(busy)finishCurrent()}

window.PikDice={roll,close,cancelAll,getSettings,setSettings,version:'2.0.0',source:'social-only'};
window.dispatchEvent(new CustomEvent('pikdice:ready',{detail:{version:'2.0.0'}}));
