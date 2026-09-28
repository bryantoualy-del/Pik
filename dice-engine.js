(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let overlay;

  function ensure(){
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'pikDiceOverlay';
    overlay.innerHTML = '<div class="pik-dice-scene" role="dialog" aria-modal="true" aria-label="Résultat du jet de dé"><div class="pik-dice-title"></div><div class="pik-dice-table"></div><div class="pik-dice-ring"></div><div class="pik-dice-host"></div><div class="pik-dice-result"><div class="pik-dice-total"></div><div class="pik-dice-detail"></div><div class="pik-dice-hint">Touchez pour continuer</div></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => {
      if (overlay.dataset.dismissable === '1') close();
    });
    return overlay;
  }

  function die(value, extra=''){
    const el = document.createElement('div');
    el.className = 'pik-die-wrap ' + extra;
    el.innerHTML = '<div class="pik-die"><div class="pik-die-number">' + value + '</div></div>';
    return el;
  }

  function close(){
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.dataset.dismissable = '0';
    setTimeout(() => { if(overlay){ overlay.querySelector('.pik-dice-host').innerHTML=''; } }, 160);
  }

  async function roll(opts){
    const o = ensure();
    const rolls = Array.isArray(opts.rolls) && opts.rolls.length ? opts.rolls : [opts.chosen || 1];
    const chosen = opts.chosen ?? rolls[0];
    const mode = opts.mode || 'normal';
    const host = o.querySelector('.pik-dice-host');
    const title = o.querySelector('.pik-dice-title');
    const result = o.querySelector('.pik-dice-result');
    result.classList.remove('show');
    o.dataset.dismissable = '0';
    title.innerHTML = (opts.label || 'Jet de d20') + '<small>' + (mode === 'adv' ? 'Avantage' : mode === 'dis' ? 'Désavantage' : 'Jet normal') + '</small>';
    host.innerHTML = '';

    const nodes = rolls.slice(0,2).map((v,i) => {
      const n = die(v, rolls.length > 1 ? 'dual ' + (i ? 'second' : 'first') : '');
      n.classList.add('rolling');
      host.appendChild(n);
      return n;
    });

    o.classList.add('open');
    if (navigator.vibrate) navigator.vibrate(18);
    await sleep(1280);

    nodes.forEach((n,i) => {
      n.classList.remove('rolling');
      const selected = rolls.length === 1 || rolls[i] === chosen && !nodes.some((x,j) => j < i && rolls[j] === chosen);
      n.classList.add(selected ? 'selected' : 'discarded');
      if (selected && chosen === 20) n.classList.add('nat20');
      if (selected && chosen === 1) n.classList.add('nat1');
    });

    if (chosen === 20 && navigator.vibrate) navigator.vibrate([24,35,42]);
    if (chosen === 1 && navigator.vibrate) navigator.vibrate([35,25,35]);

    await sleep(280);
    o.querySelector('.pik-dice-total').textContent = opts.total != null ? String(opts.total) : String(chosen);
    o.querySelector('.pik-dice-detail').textContent = opts.detail || ('d20 ' + chosen);
    result.classList.add('show');
    o.dataset.dismissable = '1';
    await sleep(520);
  }

  window.PikDice = { roll, close };
})();