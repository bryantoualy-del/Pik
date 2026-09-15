(()=>{
const svg=`<svg viewBox="0 0 72 72" role="img" aria-label="Emblème médical de Pik" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pg" cx="35%" cy="28%"><stop offset="0" stop-color="#244c37"/><stop offset="1" stop-color="#0b1a12"/></radialGradient><filter id="ps"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#4fd28a" flood-opacity=".55"/></filter></defs><circle cx="36" cy="36" r="30" fill="url(#pg)" stroke="#f4f7f2" stroke-width="3"/><circle cx="36" cy="36" r="24" fill="none" stroke="#4fd28a" stroke-width="1.5" opacity=".65"/><path d="M31 18h10v13h13v10H41v13H31V41H18V31h13z" fill="#ed5c61" stroke="#fff" stroke-width="1.5" filter="url(#ps)"/><path d="M20 57c7-5 13-6 20-3 4 2 8 2 12 0" fill="none" stroke="#4fd28a" stroke-width="2" stroke-linecap="round"/><path d="M23 54c2-6 6-9 12-10" fill="none" stroke="#8ee7b8" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const style=document.createElement('style');style.textContent=`
.top{gap:7px!important;grid-template-columns:minmax(250px,.9fr) minmax(0,2.1fr)!important;align-items:stretch!important}
.identity{padding:9px 94px 9px 12px!important;min-height:0!important;overflow:hidden!important}
.identity:after{content:none!important}
.identity .eyebrow,.identity h1,.identity p,.identity .tag{position:relative;z-index:2;max-width:100%!important}
.identity h1{font-size:clamp(1.5rem,2.6vw,2.15rem)!important;margin:.08rem 0 .2rem!important;line-height:.96!important}
.identity p{font-size:.75rem!important;line-height:1.22!important;white-space:nowrap!important}
.identity .tag{margin-top:4px!important;padding:2px 6px!important;font-size:.66rem!important}
.signature-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:64px;height:64px;opacity:.9;filter:drop-shadow(0 0 14px #4fd28a2d);pointer-events:none;z-index:1}
.signature-icon svg{width:100%;height:100%;display:block}
.vitals{display:grid!important;grid-template-columns:minmax(250px,1.75fr) repeat(6,minmax(56px,.62fr))!important;align-items:stretch!important;padding:5px!important;gap:4px!important}
.vitals>.stat{grid-row:auto!important;min-height:0!important;padding:5px 6px!important;border-radius:8px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
.vitals>.hpstat{grid-row:auto!important;display:grid!important;grid-template-columns:auto minmax(150px,1fr) auto!important;grid-template-rows:auto!important;align-items:center!important;column-gap:6px!important;row-gap:0!important}
.vitals>.hpstat>small{grid-column:1!important;grid-row:1!important;white-space:nowrap!important;margin:0!important}
.vitals .hpbox{grid-column:2!important;grid-row:1!important;display:grid!important;grid-template-columns:repeat(3,minmax(42px,1fr))!important;gap:4px!important;margin:0!important}
.vitals .hp-actions{grid-column:3!important;grid-row:1!important;display:flex!important;gap:3px!important;margin:0!important;white-space:nowrap!important}
.vitals .num{padding:4px 5px!important;min-height:30px!important;height:30px!important;font-size:.82rem!important}
.vitals .mini{padding:3px 5px!important;min-height:30px!important;height:30px!important;font-size:.66rem!important}
.vitals>.stat b{font-size:.96rem!important;line-height:1!important}
.vitals>.stat small{font-size:.5rem!important;line-height:1.05!important;letter-spacing:.03em!important}
@media(max-width:767px){
  .top{display:block!important}
  .identity{padding:9px 78px 9px 11px!important}
  .identity h1{font-size:1.46rem!important}
  .identity p{font-size:.73rem!important;white-space:normal!important}
  .signature-icon{width:56px;height:56px;right:9px;top:50%}
  .vitals{grid-template-columns:repeat(3,1fr)!important;padding:5px!important;gap:4px!important}
  .vitals>.hpstat{grid-column:1/-1!important;display:grid!important;grid-template-columns:auto 1fr auto!important;padding:5px!important}
  .vitals .hpbox{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .vitals>.stat{padding:5px!important}
}
@media(min-width:768px) and (max-width:1366px){
  .top{display:grid!important;grid-template-columns:1fr!important;gap:5px!important}
  .identity{padding:7px 72px 7px 11px!important;min-height:56px!important}
  .identity h1{font-size:1.5rem!important;margin:.02rem 0 .1rem!important}
  .identity p{font-size:.69rem!important;line-height:1.12!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;padding-right:2px!important}
  .identity .tag{margin-top:2px!important;padding:1px 6px!important;font-size:.61rem!important}
  .signature-icon{width:44px;height:44px;right:11px;top:50%!important;z-index:1!important}
  .vitals{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:auto auto!important;padding:4px!important;gap:4px!important;overflow:visible!important}
  .vitals>.hpstat{grid-column:1/-1!important;grid-row:1!important;display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;column-gap:6px!important;padding:4px 6px!important;min-width:0!important;overflow:hidden!important}
  .vitals>.hpstat>small{grid-column:1!important;grid-row:1!important;white-space:nowrap!important}
  .vitals .hpbox{grid-column:2!important;grid-row:1!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;min-width:0!important;max-width:none!important}
  .vitals .hp-actions{grid-column:3!important;grid-row:1!important;display:flex!important;gap:4px!important;min-width:0!important;white-space:nowrap!important}
  .vitals>.stat:not(.hpstat){grid-row:2!important;grid-column:auto!important;min-width:0!important;padding:5px 4px!important;text-align:center!important;overflow:hidden!important}
  .vitals>.stat b{font-size:.9rem!important;white-space:nowrap!important}
  .vitals>.stat small{font-size:.46rem!important;white-space:normal!important;line-height:1.05!important}
  .vitals .num{height:26px!important;min-height:26px!important;padding:2px 4px!important;font-size:.74rem!important;min-width:0!important;width:100%!important;box-sizing:border-box!important}
  .vitals .mini{height:26px!important;min-height:26px!important;padding:2px 5px!important;font-size:.59rem!important;flex:0 0 auto!important}
}
@media(prefers-reduced-motion:no-preference){.signature-icon{animation:sigFloat 4.5s ease-in-out infinite}@keyframes sigFloat{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 3px));filter:drop-shadow(0 0 20px #4fd28a42)}}}`;document.head.appendChild(style);
const mount=()=>{const id=document.querySelector('.identity');if(!id||id.querySelector('.signature-icon'))return false;const d=document.createElement('div');d.className='signature-icon';d.innerHTML=svg;id.appendChild(d);return true};
if(!mount()){const o=new MutationObserver(()=>{if(mount())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true})}
const fav=document.createElement('link');fav.rel='icon';fav.type='image/svg+xml';fav.href='data:image/svg+xml,'+encodeURIComponent(svg);document.head.appendChild(fav);
})();