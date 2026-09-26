(()=>{
  const STYLE_ID='pik-eco-availability-style';
  const ACTION_FNS=['sacredFlame','meleeWeapon','preserveLife','turnUndead','castGuardianFaith'];
  const BONUS_FNS=['castSpiritualWeapon','nimble'];

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      button.eco-unavailable,
      button.eco-unavailable:hover,
      button.eco-unavailable:focus-visible{
        opacity:.30!important;
        filter:grayscale(.9) saturate(.25)!important;
        cursor:not-allowed!important;
        box-shadow:none!important;
        transform:none!important;
      }
      button.eco-unavailable::after{
        content:' · indisponible';
        font-size:.72em;
        font-weight:700;
        letter-spacing:.01em;
        opacity:.9;
      }
      .economy.used{
        opacity:.34!important;
        filter:grayscale(.75) saturate(.35);
      }
    `;
    document.head.appendChild(style);
  }

  function spellKind(id){
    try{
      const sp=spells.find(x=>x.id===id);
      if(!sp) return null;
      if(String(sp.cast||'').includes('10 min')) return null;
      return String(sp.cast||'').includes('bonus')?'bonus':'action';
    }catch(_){ return null; }
  }

  function getKind(btn){
    if(!btn || btn.closest('.turnbar,.nav,.modal-wrap,.hp-actions,.journal-tools')) return null;
    const raw=btn.getAttribute('onclick')||'';
    if(ACTION_FNS.some(fn=>raw.includes(fn+'('))) return 'action';
    if(BONUS_FNS.some(fn=>raw.includes(fn+'('))) return 'bonus';
    const cast=raw.match(/castSpell\(['"]([^'"]+)['"]\)/);
    if(cast) return spellKind(cast[1]);
    const meta=btn.closest('.card,.item,.spell')?.querySelector('.meta')?.textContent||'';
    if(/^\s*Action bonus\b/i.test(meta) || /^\s*Bonus\b/i.test(meta)) return 'bonus';
    if(/^\s*Action\b/i.test(meta)) return 'action';
    return null;
  }

  function setEcoState(btn,kind){
    const blocked=!!kind && typeof S!=='undefined' && S.economy && S.economy[kind]===false;
    const ours=btn.dataset.ecoDisabled==='1';
    btn.dataset.ecoKind=kind||'';
    btn.classList.toggle('eco-unavailable',blocked);
    if(blocked){
      if(!btn.disabled || ours){
        btn.disabled=true;
        btn.dataset.ecoDisabled='1';
      }
      btn.setAttribute('aria-disabled','true');
      btn.title=kind==='bonus'?'Action bonus déjà utilisée ce tour':'Action déjà utilisée ce tour';
    }else if(ours){
      btn.disabled=false;
      delete btn.dataset.ecoDisabled;
      btn.removeAttribute('aria-disabled');
      btn.removeAttribute('title');
    }
  }

  function syncTurnbar(){
    const defs=[['ecoAction','action'],['ecoBonus','bonus'],['ecoReaction','reaction'],['ecoMove','move']];
    for(const [id,key] of defs){
      const b=document.getElementById(id);
      if(!b || typeof S==='undefined' || !S.economy) continue;
      const available=S.economy[key]!==false;
      b.classList.toggle('used',!available);
      const small=b.querySelector('small');
      if(small) small.textContent=available?'disponible':'utilisée';
      b.setAttribute('aria-pressed',available?'false':'true');
    }
  }

  const originalCastSpell=window.castSpell;
  if(typeof originalCastSpell==='function'&&!window.__pikSpiritualWeaponCastPatched){
    window.castSpell=function(id){
      if(id==='spiritualWeapon' && typeof S!=='undefined' && S.spiritualWeapon){
        return window.castSpiritualWeapon(S.spiritualWeapon.slot,true);
      }
      return originalCastSpell.apply(this,arguments);
    };
    window.__pikSpiritualWeaponCastPatched=true;
  }

  function syncSpiritualWeaponButtons(){
    const active=typeof S!=='undefined' && !!S.spiritualWeapon;
    document.querySelectorAll('button[onclick*="spiritualWeapon"]').forEach(btn=>{
      const raw=btn.getAttribute('onclick')||'';
      if(!raw.includes('castSpell(')) return;
      if(active){
        btn.textContent='Frapper avec l’arme active';
        btn.title='Action bonus uniquement — aucun emplacement dépensé';
      }else if(btn.closest('.spell')){
        btn.textContent='Lancer';
        if(!btn.classList.contains('eco-unavailable')) btn.removeAttribute('title');
      }
    });
  }

  function sync(){
    ensureStyle();
    syncTurnbar();
    syncSpiritualWeaponButtons();
    document.querySelectorAll('main button.primary, main button.ability').forEach(btn=>setEcoState(btn,getKind(btn)));
  }

  let scheduled=false;
  function scheduleSync(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;sync();});
  }

  const mo=new MutationObserver(scheduleSync);
  mo.observe(document.body,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(scheduleSync,0),true);
  window.addEventListener('pageshow',scheduleSync);
  sync();
})();