/* Social — parité d'ergonomie avec Wonq, données propres à Pik */
(() => {
  const skills = [
    ['Athlétisme','FOR',0,''],['Acrobaties','DEX',1,''],['Discrétion','DEX',1,''],['Escamotage','DEX',1,''],
    ['Arcanes','INT',2,''],['Histoire','INT',2,''],['Investigation','INT',2,''],['Nature','INT',5,'Maîtrise'],['Religion','INT',5,'Maîtrise'],
    ['Dressage','SAG',5,''],['Intuition','SAG',8,'Maîtrise'],['Médecine','SAG',11,'Expertise'],['Perception','SAG',8,'Maîtrise'],['Survie','SAG',5,''],
    ['Intimidation','CHA',-1,''],['Persuasion','CHA',-1,''],['Représentation','CHA',-1,''],['Tromperie','CHA',-1,'']
  ];
  const abilities = [
    {name:'Force',abbr:'FOR',score:10,mod:0,save:0,saveProf:false},
    {name:'Dextérité',abbr:'DEX',score:12,mod:1,save:1,saveProf:false},
    {name:'Constitution',abbr:'CON',score:14,mod:2,save:2,saveProf:false},
    {name:'Intelligence',abbr:'INT',score:14,mod:2,save:2,saveProf:false},
    {name:'Sagesse',abbr:'SAG',score:20,mod:5,save:8,saveProf:true},
    {name:'Charisme',abbr:'CHA',score:8,mod:-1,save:2,saveProf:true}
  ];
  const items = [
    ['Demi-plate élaborée','Armure principale'],
    ['Bouclier renforcé','Bouclier'],
    ['Masse d’armes','Arme'],
    ['Arbalète légère','Arme'],
    ['Sacoche médicale compartimentée','Équipement médical'],
    ['Trousse de soins','Équipement médical'],
    ['Matériel d’herboriste','Outil maîtrisé'],
    ['Bandages','Consommable'],
    ['Fioles diverses','Consommable'],
    ['Écaille de la Voix du Terrier','Objet notable']
  ];
  let mode = 'normal';
  let tab = 'skills';

  const style = document.createElement('style');
  style.id = 'pik-social-style';
  style.textContent =
    '.social-shell{overflow:visible}.social-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}.social-head h2{margin:.1rem 0}.social-roll-modes{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}' +
    '.social-tabs{display:flex;gap:7px;overflow:auto;margin:0 0 12px;padding-bottom:2px}.social-tabs button{white-space:nowrap}.social-tabs .on,.social-roll-modes .on{border-color:var(--gold,#d8b56b);box-shadow:inset 0 0 18px #d3a65e20;background:#2a2418}' +
    '.social-skills{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.ability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
    '.ability-card{border:1px solid var(--line,#3d4a42);border-radius:13px;background:linear-gradient(145deg,#171b18,#0e1210);padding:11px}.ability-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.ability-card-head span{color:var(--gold,#d8b56b);font-size:.7rem;font-weight:900;letter-spacing:.12em}.ability-card-head h3{margin:1px 0 0;font-size:1rem}.ability-card-head>strong{font:900 2rem Georgia,serif;color:#f5ead8}' +
    '.ability-values{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:9px 0}.ability-values span{border:1px solid #403f39;border-radius:8px;padding:6px;text-align:center;color:var(--muted,#aeb7af);font-size:.7rem}.ability-values b{display:block;color:#f0dcc0;font-size:1rem}.ability-values .proficient{border-color:#8b7249;background:#251f17;color:#d8bb80}.ability-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px}.ability-actions button{min-height:38px;padding:6px}.ability-actions .save-proficient{border-color:#9b7c4e;box-shadow:inset 0 0 16px #d3a65e13}' +
    '.social-skill{min-height:62px;border:1px solid var(--line,#3d4a42);border-radius:11px;background:#121713;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;text-align:left;color:inherit}.social-skill b,.social-skill small{display:block}.social-skill small{color:var(--muted,#aeb7af)}.social-skill strong{font-size:1.25rem;color:var(--gold,#d8b56b)}.social-skill.mastered{border-color:#665b3d}.social-skill.expertise{border-color:#9b7c4e;box-shadow:inset 0 0 18px #d3a65e12}' +
    '.social-passives{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.social-passives span{border:1px solid var(--line,#3d4a42);border-radius:999px;padding:5px 9px;color:var(--muted,#aeb7af)}' +
    '.inventory-tools{display:flex;gap:8px;align-items:center;margin:8px 0}.inventory-tools input{width:min(420px,100%);min-height:42px;border:1px solid var(--line,#3d4a42);border-radius:10px;background:#0d130f;color:inherit;padding:0 11px}.inventory-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.inventory-card{border:1px solid var(--line,#3d4a42);border-radius:11px;background:#121713;padding:11px;min-height:62px}.inventory-card small{display:block;color:var(--muted,#aeb7af);margin-top:3px}' +
    '@media(max-width:767px){.social-head{display:block}.social-roll-modes{justify-content:flex-start;margin-top:10px}.social-skills,.ability-grid{grid-template-columns:1fr}.inventory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.social-tabs{position:sticky;top:151px;z-index:25;background:#0b120ef2;padding:5px 0}}@media(min-width:768px) and (max-width:1100px){.social-skills,.ability-grid,.inventory-grid{grid-template-columns:repeat(2,1fr)}}';
  document.head.appendChild(style);

  const journalView = document.querySelector('.view[data-view="journal"]');
  if (!journalView) return;
  const socialView = document.createElement('section');
  socialView.className = 'view';
  socialView.dataset.view = 'social';
  socialView.id = 'social';
  socialView.innerHTML =
    '<div class="grid"><article class="card full social-shell">' +
      '<div class="social-head"><div><div class="eyebrow">Hors combat</div><h2>Social</h2><div class="meta">Compétences, caractéristiques, jets de sauvegarde et équipement de Pik.</div></div>' +
      '<div><div class="social-roll-modes" id="socialRollModes"><button class="ability on" data-social-mode="normal">Normal</button><button class="ability" data-social-mode="adv">Avantage</button><button class="ability" data-social-mode="dis">Désavantage</button></div><div class="social-dice-settings" id="socialDiceSettings"><button class="ability" data-dice-speed="cinematic">Dés · Ciné</button><button class="ability" data-dice-speed="fast">Rapide</button><button class="ability" data-dice-speed="off">Off</button><button class="ability" data-dice-toggle="sound">Son</button><button class="ability" data-dice-toggle="haptics">Vibration</button></div></div></div>' +
      '<div class="social-tabs" id="socialTabs"><button class="ability on" data-social-tab="skills">Compétences</button><button class="ability" data-social-tab="abilities">Carac. &amp; JdS</button><button class="ability" data-social-tab="inventory">Inventaire</button></div>' +
      '<div id="socialContent"></div>' +
    '</article></div>';
  journalView.parentNode.insertBefore(socialView, journalView);

  const journalIndex = navItems.findIndex(x => x[0] === 'journal');
  if (journalIndex >= 0 && !navItems.some(x => x[0] === 'social')) navItems.splice(journalIndex, 0, ['social','Social']);

  const content = socialView.querySelector('#socialContent');
  const fmt = n => n >= 0 ? '+' + n : String(n);
  const roll = (label, bonus) => {
    const a = d(20), b = mode === 'normal' ? null : d(20);
    const chosen = mode === 'adv' ? Math.max(a,b) : mode === 'dis' ? Math.min(a,b) : a;
    const total = chosen + bonus;
    const diceText = b === null ? 'd20 ' + a : 'd20 ' + a + ' / ' + b + ' → ' + chosen;
    const detail = diceText + ' ' + fmt(bonus) + ' = ' + total + (mode === 'adv' ? ' · avantage' : mode === 'dis' ? ' · désavantage' : '');
    if (window.PikDice) {
      window.PikDice.roll({ label, rolls: b === null ? [a] : [a,b], chosen, total, detail, mode });
    }
    addJournal('roll', 'Social · ' + label, detail);
    showResult('Social · ' + label, detail, chosen === 20 ? 'crit' : 'hit');
    save();
  };

  function renderSkills(){
    content.innerHTML =
      '<div class="social-passives"><span>Perception passive <b>18</b></span><span>Intuition passive <b>18</b></span><span>Investigation passive <b>12</b></span><span>Maîtrise <b>+3</b></span></div>' +
      '<div class="social-skills">' +
      skills.map(s => '<button class="social-skill ' + (s[3] === 'Expertise' ? 'expertise' : s[3] ? 'mastered' : '') + '" data-skill="' + s[0] + '"><span><b>' + s[0] + '</b><small>' + s[1] + (s[3] ? ' · ' + s[3] : '') + '</small></span><strong>' + fmt(s[2]) + '</strong></button>').join('') +
      '</div>';
    content.querySelectorAll('[data-skill]').forEach(btn => {
      const s = skills.find(x => x[0] === btn.dataset.skill);
      btn.onclick = () => roll(s[0], s[2]);
    });
  }

  function renderAbilities(){
    content.innerHTML =
      '<div class="social-passives"><span>JdS maîtrisés : <b>Sagesse, Charisme</b></span><span>Incantation : <b>Sagesse</b></span><span>Langues : <b>Commun, Kobold, Gobelin</b></span></div>' +
      '<div class="ability-grid">' +
      abilities.map(a =>
        '<div class="ability-card"><div class="ability-card-head"><div><span>' + a.abbr + '</span><h3>' + a.name + '</h3></div><strong>' + a.score + '</strong></div>' +
        '<div class="ability-values"><span>Mod.<b>' + fmt(a.mod) + '</b></span><span>Test<b>' + fmt(a.mod) + '</b></span><span class="' + (a.saveProf ? 'proficient' : '') + '">JdS<b>' + fmt(a.save) + '</b></span></div>' +
        '<div class="ability-actions"><button class="ability" data-check="' + a.abbr + '">Tester</button><button class="ability ' + (a.saveProf ? 'save-proficient' : '') + '" data-save="' + a.abbr + '">JdS</button></div></div>'
      ).join('') + '</div>';
    content.querySelectorAll('[data-check]').forEach(btn => {
      const a = abilities.find(x => x.abbr === btn.dataset.check);
      btn.onclick = () => roll('Test de ' + a.name, a.mod);
    });
    content.querySelectorAll('[data-save]').forEach(btn => {
      const a = abilities.find(x => x.abbr === btn.dataset.save);
      btn.onclick = () => roll('JdS de ' + a.name, a.save);
    });
  }

  function renderInventory(){
    content.innerHTML =
      '<div class="social-passives"><span>Outil maîtrisé : <b>matériel d’herboriste</b></span><span>Armures : <b>légères, intermédiaires, lourdes, boucliers</b></span></div>' +
      '<div class="inventory-tools"><input id="socialInventorySearch" type="search" placeholder="Rechercher dans l’inventaire…" aria-label="Rechercher dans l’inventaire"></div>' +
      '<div class="inventory-grid" id="socialInventoryGrid">' +
      items.map(i => '<div class="inventory-card" data-item-search="' + (i[0] + ' ' + i[1]).toLowerCase() + '"><b>' + i[0] + '</b><small>' + i[1] + '</small></div>').join('') +
      '</div>';
    const input = content.querySelector('#socialInventorySearch');
    input.oninput = () => {
      const q = input.value.trim().toLowerCase();
      content.querySelectorAll('.inventory-card').forEach(card => card.hidden = !!q && !card.dataset.itemSearch.includes(q));
    };
  }

  function renderTab(){
    socialView.querySelectorAll('[data-social-tab]').forEach(b => b.classList.toggle('on', b.dataset.socialTab === tab));
    if (tab === 'skills') renderSkills();
    if (tab === 'abilities') renderAbilities();
    if (tab === 'inventory') renderInventory();
  }

  socialView.querySelectorAll('[data-social-mode]').forEach(btn => btn.onclick = () => {
    mode = btn.dataset.socialMode;
    socialView.querySelectorAll('[data-social-mode]').forEach(b => b.classList.toggle('on', b.dataset.socialMode === mode));
  });
  const DICE_KEY='pikDiceSettingsV2';
  const readDice=()=>{try{return {speed:'cinematic',sound:true,haptics:true,...JSON.parse(localStorage.getItem(DICE_KEY)||'{}')}}catch(e){return {speed:'cinematic',sound:true,haptics:true}}};
  const writeDice=s=>{localStorage.setItem(DICE_KEY,JSON.stringify(s));if(window.PikDice)window.PikDice.setSettings(s);paintDice()};
  function paintDice(){
    const s=readDice();
    socialView.querySelectorAll('[data-dice-speed]').forEach(b=>b.classList.toggle('dice-setting-on',b.dataset.diceSpeed===s.speed));
    socialView.querySelectorAll('[data-dice-toggle]').forEach(b=>{const on=!!s[b.dataset.diceToggle];b.classList.toggle('dice-setting-on',on);b.classList.toggle('dice-setting-muted',!on)});
  }
  socialView.querySelectorAll('[data-dice-speed]').forEach(btn=>btn.onclick=()=>writeDice({...readDice(),speed:btn.dataset.diceSpeed}));
  socialView.querySelectorAll('[data-dice-toggle]').forEach(btn=>btn.onclick=()=>{const s=readDice(),k=btn.dataset.diceToggle;writeDice({...s,[k]:!s[k]})});
  window.addEventListener('pikdice:settings',paintDice);
  window.addEventListener('pikdice:ready',paintDice);

  socialView.querySelectorAll('[data-social-tab]').forEach(btn => btn.onclick = () => {
    tab = btn.dataset.socialTab;
    renderTab();
  });
  paintDice();
  renderTab();
})();