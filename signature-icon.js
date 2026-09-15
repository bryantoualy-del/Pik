(()=>{
const svg=`<svg viewBox="0 0 72 72" role="img" aria-label="Emblème médical de Pik" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pg" cx="35%" cy="28%"><stop offset="0" stop-color="#244c37"/><stop offset="1" stop-color="#0b1a12"/></radialGradient><filter id="ps"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#4fd28a" flood-opacity=".55"/></filter></defs><circle cx="36" cy="36" r="30" fill="url(#pg)" stroke="#f4f7f2" stroke-width="3"/><circle cx="36" cy="36" r="24" fill="none" stroke="#4fd28a" stroke-width="1.5" opacity=".65"/><path d="M31 18h10v13h13v10H41v13H31V41H18V31h13z" fill="#ed5c61" stroke="#fff" stroke-width="1.5" filter="url(#ps)"/><path d="M20 57c7-5 13-6 20-3 4 2 8 2 12 0" fill="none" stroke="#4fd28a" stroke-width="2" stroke-linecap="round"/><path d="M23 54c2-6 6-9 12-10" fill="none" stroke="#8ee7b8" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const style=document.createElement('style');style.textContent=`
.identity{padding-right:134px!important}
.identity:after{content:none!important}
.identity .eyebrow,.identity h1,.identity p,.identity .tag{position:relative;z-index:2;max-width:calc(100% - 92px)}
.signature-icon{position:absolute;right:16px;top:12px;width:86px;height:86px;opacity:.94;filter:drop-shadow(0 0 18px #4fd28a36);pointer-events:none;z-index:1}
.signature-icon svg{width:100%;height:100%;display:block}
.vitals>.stat:not(.hpstat){max-width:116px;width:100%;justify-self:start}
@media(max-width:767px){
  .identity{padding-right:112px!important}
  .identity .eyebrow,.identity h1,.identity p,.identity .tag{max-width:calc(100% - 74px)}
  .signature-icon{width:70px;height:70px;right:10px;top:9px;opacity:.9}
  .vitals>.stat:not(.hpstat){max-width:none;width:auto;justify-self:stretch}
}
@media(min-width:768px) and (max-width:1366px){
  .identity{padding-right:152px!important}
  .identity .eyebrow,.identity h1,.identity p,.identity .tag{max-width:calc(100% - 106px)}
  .signature-icon{width:102px;height:102px;right:16px;top:10px;opacity:.96}
  .vitals{gap:7px!important}
  .vitals>.stat:not(.hpstat){max-width:108px;width:100%;justify-self:start;padding:8px 9px!important}
  .vitals>.stat:not(.hpstat) b{font-size:1.12rem!important}
  .vitals>.stat:not(.hpstat) small{font-size:.60rem!important}
}
@media(prefers-reduced-motion:no-preference){.signature-icon{animation:sigFloat 4.5s ease-in-out infinite}@keyframes sigFloat{50%{transform:translateY(-3px);filter:drop-shadow(0 0 24px #4fd28a48)}}}`;document.head.appendChild(style);
const mount=()=>{const id=document.querySelector('.identity');if(!id||id.querySelector('.signature-icon'))return false;const d=document.createElement('div');d.className='signature-icon';d.innerHTML=svg;id.appendChild(d);return true};
if(!mount()){const o=new MutationObserver(()=>{if(mount())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true})}
const fav=document.createElement('link');fav.rel='icon';fav.type='image/svg+xml';fav.href='data:image/svg+xml,'+encodeURIComponent(svg);document.head.appendChild(fav);
})();