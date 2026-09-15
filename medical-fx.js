(()=>{
  const BIG={
    'Gardiens spirituels':['guardians','Gardiens spirituels'],
    'Gardien de la foi':['guardian','Gardien de la foi'],
    'Rappel à la vie':['revive','Rappel à la vie'],
    'Lueur d’espoir':['ward','Lueur d’espoir'],
    'Protection contre la mort':['ward','Protection contre la mort'],
    'Mot de guérison de groupe':['massheal','Soin de groupe'],
    'Préservation de la vie':['massheal','Préservation de la vie']
  };

  function ensureMega(){
    let el=document.getElementById('medicalMegaFx');
    if(el)return el;
    el=document.createElement('div');
    el.id='medicalMegaFx';
    el.className='mega-fx';
    const sparks=Array.from({length:18},(_,i)=>`<i class="spark" style="--a:${i*20}deg;--delay:${(i%6)*0.035}s"></i>`).join('');
    el.innerHTML=`<div class="veil"></div><div class="ring"></div><div class="ring2"></div><div class="crossfx">✚</div><div class="titlefx"></div>${sparks}`;
    document.body.appendChild(el);
    return el;
  }

  function playMega(kind,label){
    const el=ensureMega();
    el.className=`mega-fx ${kind}`;
    el.querySelector('.titlefx').textContent=label;
    void el.offsetWidth;
    el.classList.add('play');
    if(navigator.vibrate) navigator.vibrate([24,28,45]);
    clearTimeout(el._t);
    el._t=setTimeout(()=>el.classList.remove('play'),1550);
  }

  function syncSpiritual(){
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h2');
      if(!h||!h.textContent.includes('Arme spirituelle')) return;
      const active=[...card.querySelectorAll('.pill.good')].some(p=>/Active/i.test(p.textContent));
      card.classList.toggle('spiritual-active',active);
    });
  }

  function install(){
    if(typeof window.showResult==='function'&&!window.__pikFxWrapped){
      const old=window.showResult;
      window.showResult=function(title,detail,fx){
        const out=old.apply(this,arguments);
        const hit=Object.entries(BIG).find(([k])=>String(title||'').includes(k));
        if(hit) setTimeout(()=>playMega(hit[1][0],hit[1][1]),30);
        setTimeout(syncSpiritual,20);
        return out;
      };
      window.__pikFxWrapped=true;
    }
    syncSpiritual();
    const mo=new MutationObserver(()=>syncSpiritual());
    mo.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.__pikFxObserver=mo;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();