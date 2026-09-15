(()=>{
const svg=`<svg viewBox="0 0 72 72" role="img" aria-label="Emblème médical de Pik" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pg" cx="35%" cy="28%"><stop offset="0" stop-color="#244c37"/><stop offset="1" stop-color="#0b1a12"/></radialGradient><filter id="ps"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#4fd28a" flood-opacity=".55"/></filter></defs><circle cx="36" cy="36" r="30" fill="url(#pg)" stroke="#f4f7f2" stroke-width="3"/><circle cx="36" cy="36" r="24" fill="none" stroke="#4fd28a" stroke-width="1.5" opacity=".65"/><path d="M31 18h10v13h13v10H41v13H31V41H18V31h13z" fill="#ed5c61" stroke="#fff" stroke-width="1.5" filter="url(#ps)"/><path d="M20 57c7-5 13-6 20-3 4 2 8 2 12 0" fill="none" stroke="#4fd28a" stroke-width="2" stroke-linecap="round"/><path d="M23 54c2-6 6-9 12-10" fill="none" stroke="#8ee7b8" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const style=document.createElement('style');style.textContent=`
.top{gap:8px!important;grid-template-columns:minmax(245px,.92fr) minmax(0,2.08fr)!important;align-items:stretch!important}
.identity{padding:12px 108px 12px 14px!important;min-height:0!important}
.identity:after{content:none!important}
.identity .eyebrow,.identity h1,.identity p,.identity .tag{position:relative;z-index:2;max-width:100%!important}
.identity h1{font-size:clamp(1.65rem,3vw,2.45rem)!important;margin:.14rem 0 .28rem!important}
.identity p{font-size:.82rem!important;line-height:1.3!important}
.identity .tag{margin-top:6px!important;padding:3px 7px!important;font-size:.7rem!important}
.signature-icon{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:72px;height:72px;opacity:.9;filter:drop-shadow(0 0 16px #4fd28a2d);pointer-events:none;z-index:1}
.signature-icon svg{width:100%;height:100%;display:block}
.vitals{padding:7px!important;gap:5px!important;grid-template-columns:minmax(190px,1.55fr) repeat(6,minmax(58px,.72fr))!important;align-content:start!important}
.vitals>.stat{padding:6px 7px!important;border-radius:9px!important;min-height:0!important}
.vitals>.stat b{font-size:1.02rem!important;line-height:1.05!important}
.vitals>.stat small{font-size:.54rem!important;line-height:1.15!important;letter-spacing:.035em!important}
.vitals .hpbox{gap:4px!important}
.vitals .hp-actions{gap:4px!important;margin-top:4px!important}
.vitals .num{padding:5px!important}
.vitals .mini{padding:4px 6px!important}
@media(max-width:767px){
  .top{display:block!important}
  .identity{padding:10px 82px 10px 12px!important}
  .identity h1{font-size:1.52rem!important}
  .identity p{font-size:.76rem!important}
  .signature-icon{width:58px;height:58px;right:10px;top:50%}
  .vitals{display:grid!important;grid-template-columns:repeat(3,1fr)!important;padding:6px!important;gap:5px!important}
  .vitals>.hpstat{grid-column:1/-1!important}
  .vitals>.stat{padding:6px!important}
}
@media(min-width:768px) and (max-width:1366px){
  .top{grid-template-columns:minmax(235px,.8fr) minmax(0,2.2fr)!important;gap:7px!important}
  .identity{padding:10px 104px 10px 13px!important}
  .identity h1{font-size:clamp(1.6rem,2.7vw,2.2rem)!important}
  .identity p{font-size:.78rem!important}
  .signature-icon{width:78px;height:78px;right:12px;top:50%}
  .vitals{display:grid!important;grid-template-columns:minmax(180px,1.45fr) repeat(6,minmax(54px,.72fr))!important;padding:6px!important;gap:4px!important}
  .vitals>.stat{padding:5px 6px!important}
  .vitals>.stat b{font-size:.98rem!important}
  .vitals>.stat small{font-size:.52rem!important}
}
@media(prefers-reduced-motion:no-preference){.signature-icon{animation:sigFloat 4.5s ease-in-out infinite}@keyframes sigFloat{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 3px));filter:drop-shadow(0 0 22px #4fd28a42)}}}`;document.head.appendChild(style);
const mount=()=>{const id=document.querySelector('.identity');if(!id||id.querySelector('.signature-icon'))return false;const d=document.createElement('div');d.className='signature-icon';d.innerHTML=svg;id.appendChild(d);return true};
if(!mount()){const o=new MutationObserver(()=>{if(mount())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true})}
const fav=document.createElement('link');fav.rel='icon';fav.type='image/svg+xml';fav.href='data:image/svg+xml,'+encodeURIComponent(svg);document.head.appendChild(fav);
})();