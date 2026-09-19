let PRODUCTS = {femme:[], homme:[], mesure:[]};
let currentCat = 'femme';
function applySectionVisibility(){
  const catalogueSec = document.getElementById('catalogue');
  const mesureSec = document.getElementById('sur-mesure-section');
  if(catalogueSec) catalogueSec.style.display = currentCat === 'mesure' ? 'none' : '';
  if(mesureSec) mesureSec.style.display = currentCat === 'mesure' ? '' : 'none';
}
let currentSub = 'tout';

function waLink(text){
  return 'https://wa.me/22956990915?text=' + encodeURIComponent(text);
}

function renderSubfilters(){
  const el = document.getElementById('subfilters');
  const subs = [...new Set(PRODUCTS[currentCat].map(p=>p.sub))];
  if(subs.length === 0){ el.innerHTML=''; return; }
  let html = `<button class="chip ${currentSub==='tout'?'active':''}" data-sub="tout">Tout</button>`;
  subs.forEach(s=>{
    html += `<button class="chip ${currentSub===s?'active':''}" data-sub="${s}">${SUBLABELS[s]||s}</button>`;
  });
  el.innerHTML = html;
  el.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      currentSub = btn.dataset.sub;
      renderSubfilters();
      renderGrid();
    });
  });
}

function renderGrid(){
  const grid = document.getElementById('grid');
  const meta = CAT_META[currentCat] || {title:'', desc:''};
  document.getElementById('cat-title').textContent = currentCat === 'mesure' ? 'Sur-mesure' : meta.title;
  document.getElementById('cat-desc').textContent = meta.desc || '';

  if(currentCat === 'mesure'){
    document.getElementById('catalogue').style.display = 'none';
    document.getElementById('sur-mesure-section').scrollIntoView({behavior:'smooth'});
    return;
  } else {
    document.getElementById('catalogue').style.display = '';
  }

  let items = PRODUCTS[currentCat];
  if(currentSub !== 'tout') items = items.filter(p=>p.sub===currentSub);

  if(items.length === 0){
    grid.innerHTML = `<div class="empty-note">Cette catégorie arrive bientôt. <a href="${waLink('Bonjour AMEREY SHOP, je souhaite être informé(e) quand la collection ' + currentCat + ' sera disponible.')}" style="color:var(--clay); text-decoration:underline;">Être averti sur WhatsApp</a></div>`;
    return;
  }

  grid.innerHTML = items.map(p=>{
    const msg = `Bonjour AMEREY SHOP, je souhaite commander : ${p.name} (${p.price}). Merci de me confirmer la disponibilité et les modalités de livraison.`;
    const hasPhoto = !!p.photo;
    const photoHtml = hasPhoto
      ? `<img src="${p.photo}" alt="${p.name}" loading="lazy">`
      : `Photo produit à ajouter`;
    return `
    <div class="card">
      <div class="card-photo"${hasPhoto?` data-lightbox="${p.photo}" data-name="${p.name.replace(/"/g,'&quot;')}"`:''}>${photoHtml}${hasPhoto?'<span class="zoom-icon">⤢</span>':''}</div>
      ${p.badge?`<span class="card-badge">${p.badge}</span>`:''}
      <span class="card-price-tag">${p.price}</span>
      <div class="card-body">
        <span class="card-cat">${SUBLABELS[p.sub]||''}</span>
        <div class="card-name">${p.name}</div>
        ${p.colors ? `<div class="card-colors">Existe aussi en : ${p.colors.join(', ')}</div>` : ''}
        <a class="card-cta" href="${waLink(msg)}" target="_blank">Commander →</a>
      </div>
    </div>`;
  }).join('');
}

document.getElementById('grid').addEventListener('click', (e)=>{
  const photoEl = e.target.closest('.card-photo');
  if(photoEl && photoEl.dataset.lightbox) openLightbox(photoEl.dataset.lightbox, photoEl.dataset.name);
});

function openLightbox(key, name){
  const src = key;
  if(!src) return;
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').alt = name || '';
  document.getElementById('lightbox-caption').textContent = name || '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightbox-img').src = '';
  document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', (e)=>{
  if(e.target.id === 'lightbox' || e.target.id === 'lightbox-close') closeLightbox();
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

document.getElementById('tabs').addEventListener('click', (e)=>{
  const btn = e.target.closest('.tab-btn');
  if(!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = btn.dataset.cat;
  currentSub = 'tout';
  renderSubfilters();
  renderGrid();
  applySectionVisibility();
  if(currentCat !== 'mesure'){
    document.getElementById('catalogue').scrollIntoView({behavior:'smooth'});
  } else {
    document.getElementById('sur-mesure-section').scrollIntoView({behavior:'smooth'});
  }
});

/* ---------- Questionnaire sur-mesure ---------- */
const CATEGORIES_BY_GENRE = {
  'Femme': ['Chemise / Haut','Robe','Ensemble / Tenue complète','Jupe / Pantalon'],
  'Homme': ['Chemise','Ensemble / Tenue complète','Pantalon','Boubou']
};
const TEXTURES = ['Coton','Wax / Pagne','Dentelle','Lin','Soie','Autre'];
const COULEURS = [
  {name:'Blanc',hex:'#F5F2EA'},{name:'Noir',hex:'#1C1B17'},{name:'Vert',hex:'#173226'},
  {name:'Or',hex:'#B8912F'},{name:'Terracotta',hex:'#9C5A3C'},{name:'Bleu',hex:'#2C4A6E'},
  {name:'Rouge',hex:'#7A2A2A'},{name:'Autre',hex:null}
];
const MEASURE_FIELD_DEFS = {
  poitrine: {key:'poitrine', label:'Tour de poitrine', min:55, max:200},
  taille:   {key:'taille', label:'Tour de taille', min:45, max:200},
  hanches:  {key:'hanches', label:'Tour de hanches', min:55, max:210},
  hauteur:  {key:'hauteur', label:'Hauteur / stature', min:130, max:215},
  epaules:  {key:'epaules', label:'Largeur d\u2019épaules', min:30, max:70},
  manche:   {key:'manche', label:'Longueur de manche', min:35, max:90},
  jambe:    {key:'jambe', label:'Longueur de jambe (entrejambe)', min:50, max:120}
};
const CATEGORY_MEASURE_MAP = {
  'Chemise': ['poitrine','epaules','manche','hauteur'],
  'Chemise / Haut': ['poitrine','epaules','manche','hauteur'],
  'Robe': ['poitrine','taille','hanches','hauteur'],
  'Ensemble / Tenue complète': ['poitrine','taille','hanches','hauteur'],
  'Jupe / Pantalon': ['taille','hanches','jambe','hauteur'],
  'Pantalon': ['taille','hanches','jambe','hauteur'],
  'Boubou': ['poitrine','hauteur']
};
const DEFAULT_MEASURE_KEYS = ['poitrine','taille','hanches','hauteur'];
function getMeasureFields(){
  const keys = CATEGORY_MEASURE_MAP[wiz.categorie] || DEFAULT_MEASURE_KEYS;
  return keys.map(k => MEASURE_FIELD_DEFS[k]);
}
function mesureFieldError(key, opts){
  opts = opts || {};
  const f = MEASURE_FIELD_DEFS[key];
  const raw = (wiz[key]||'').toString().trim();
  if(raw===''){ return opts.requireFilled ? 'Champ requis' : null; }
  const v = Number(raw.replace(',','.'));
  if(!isFinite(v) || isNaN(v)) return 'Merci d\u2019entrer un nombre';
  if(v < f.min || v > f.max) return `Doit être entre ${f.min} et ${f.max} cm`;
  return null;
}
function mesuresAllValid(){
  return getMeasureFields().every(f => (wiz[f.key]||'').toString().trim()!=='' && !mesureFieldError(f.key));
}
const OCCASIONS = ['Mariage','Soirée / Événement','Cérémonie traditionnelle','Quotidien / Bureau','Je ne sais pas encore','Autre'];
const COUNTRY_CODES = [
  {name:'Bénin', iso:'BJ', code:'+229'},
  {name:'Afghanistan', iso:'AF', code:'+93'},{name:'Afrique du Sud', iso:'ZA', code:'+27'},{name:'Albanie', iso:'AL', code:'+355'},
  {name:'Algérie', iso:'DZ', code:'+213'},{name:'Allemagne', iso:'DE', code:'+49'},{name:'Andorre', iso:'AD', code:'+376'},
  {name:'Angola', iso:'AO', code:'+244'},{name:'Antigua-et-Barbuda', iso:'AG', code:'+1268'},{name:'Arabie saoudite', iso:'SA', code:'+966'},
  {name:'Argentine', iso:'AR', code:'+54'},{name:'Arménie', iso:'AM', code:'+374'},{name:'Australie', iso:'AU', code:'+61'},
  {name:'Autriche', iso:'AT', code:'+43'},{name:'Azerbaïdjan', iso:'AZ', code:'+994'},{name:'Bahamas', iso:'BS', code:'+1242'},
  {name:'Bahreïn', iso:'BH', code:'+973'},{name:'Bangladesh', iso:'BD', code:'+880'},{name:'Barbade', iso:'BB', code:'+1246'},
  {name:'Belgique', iso:'BE', code:'+32'},{name:'Belize', iso:'BZ', code:'+501'},{name:'Bhoutan', iso:'BT', code:'+975'},
  {name:'Biélorussie', iso:'BY', code:'+375'},{name:'Birmanie (Myanmar)', iso:'MM', code:'+95'},{name:'Bolivie', iso:'BO', code:'+591'},
  {name:'Bosnie-Herzégovine', iso:'BA', code:'+387'},{name:'Botswana', iso:'BW', code:'+267'},{name:'Brésil', iso:'BR', code:'+55'},
  {name:'Brunei', iso:'BN', code:'+673'},{name:'Bulgarie', iso:'BG', code:'+359'},{name:'Burkina Faso', iso:'BF', code:'+226'},
  {name:'Burundi', iso:'BI', code:'+257'},{name:'Cambodge', iso:'KH', code:'+855'},{name:'Cameroun', iso:'CM', code:'+237'},
  {name:'Canada', iso:'CA', code:'+1'},{name:'Cap-Vert', iso:'CV', code:'+238'},{name:'République centrafricaine', iso:'CF', code:'+236'},
  {name:'Chili', iso:'CL', code:'+56'},{name:'Chine', iso:'CN', code:'+86'},{name:'Chypre', iso:'CY', code:'+357'},
  {name:'Colombie', iso:'CO', code:'+57'},{name:'Comores', iso:'KM', code:'+269'},{name:'Congo-Brazzaville', iso:'CG', code:'+242'},
  {name:'Congo-Kinshasa (RDC)', iso:'CD', code:'+243'},{name:'Corée du Nord', iso:'KP', code:'+850'},{name:'Corée du Sud', iso:'KR', code:'+82'},
  {name:'Costa Rica', iso:'CR', code:'+506'},{name:'Côte d\u2019Ivoire', iso:'CI', code:'+225'},{name:'Croatie', iso:'HR', code:'+385'},
  {name:'Cuba', iso:'CU', code:'+53'},{name:'Danemark', iso:'DK', code:'+45'},{name:'Djibouti', iso:'DJ', code:'+253'},
  {name:'Dominique', iso:'DM', code:'+1767'},{name:'Égypte', iso:'EG', code:'+20'},{name:'Émirats arabes unis', iso:'AE', code:'+971'},
  {name:'Équateur', iso:'EC', code:'+593'},{name:'Érythrée', iso:'ER', code:'+291'},{name:'Espagne', iso:'ES', code:'+34'},
  {name:'Estonie', iso:'EE', code:'+372'},{name:'Eswatini', iso:'SZ', code:'+268'},{name:'États-Unis', iso:'US', code:'+1'},
  {name:'Éthiopie', iso:'ET', code:'+251'},{name:'Fidji', iso:'FJ', code:'+679'},{name:'Finlande', iso:'FI', code:'+358'},
  {name:'France', iso:'FR', code:'+33'},{name:'Gabon', iso:'GA', code:'+241'},{name:'Gambie', iso:'GM', code:'+220'},
  {name:'Géorgie', iso:'GE', code:'+995'},{name:'Ghana', iso:'GH', code:'+233'},{name:'Grèce', iso:'GR', code:'+30'},
  {name:'Grenade', iso:'GD', code:'+1473'},{name:'Guatemala', iso:'GT', code:'+502'},{name:'Guinée', iso:'GN', code:'+224'},
  {name:'Guinée-Bissau', iso:'GW', code:'+245'},{name:'Guinée équatoriale', iso:'GQ', code:'+240'},{name:'Guyana', iso:'GY', code:'+592'},
  {name:'Haïti', iso:'HT', code:'+509'},{name:'Honduras', iso:'HN', code:'+504'},{name:'Hongrie', iso:'HU', code:'+36'},
  {name:'Inde', iso:'IN', code:'+91'},{name:'Indonésie', iso:'ID', code:'+62'},{name:'Irak', iso:'IQ', code:'+964'},
  {name:'Iran', iso:'IR', code:'+98'},{name:'Irlande', iso:'IE', code:'+353'},{name:'Islande', iso:'IS', code:'+354'},
  {name:'Israël', iso:'IL', code:'+972'},{name:'Italie', iso:'IT', code:'+39'},{name:'Jamaïque', iso:'JM', code:'+1876'},
  {name:'Japon', iso:'JP', code:'+81'},{name:'Jordanie', iso:'JO', code:'+962'},{name:'Kazakhstan', iso:'KZ', code:'+7'},
  {name:'Kenya', iso:'KE', code:'+254'},{name:'Kirghizistan', iso:'KG', code:'+996'},{name:'Kiribati', iso:'KI', code:'+686'},
  {name:'Koweït', iso:'KW', code:'+965'},{name:'Laos', iso:'LA', code:'+856'},{name:'Lesotho', iso:'LS', code:'+266'},
  {name:'Lettonie', iso:'LV', code:'+371'},{name:'Liban', iso:'LB', code:'+961'},{name:'Liberia', iso:'LR', code:'+231'},
  {name:'Libye', iso:'LY', code:'+218'},{name:'Liechtenstein', iso:'LI', code:'+423'},{name:'Lituanie', iso:'LT', code:'+370'},
  {name:'Luxembourg', iso:'LU', code:'+352'},{name:'Macédoine du Nord', iso:'MK', code:'+389'},{name:'Madagascar', iso:'MG', code:'+261'},
  {name:'Malaisie', iso:'MY', code:'+60'},{name:'Malawi', iso:'MW', code:'+265'},{name:'Maldives', iso:'MV', code:'+960'},
  {name:'Mali', iso:'ML', code:'+223'},{name:'Malte', iso:'MT', code:'+356'},{name:'Maroc', iso:'MA', code:'+212'},
  {name:'Maurice', iso:'MU', code:'+230'},{name:'Mauritanie', iso:'MR', code:'+222'},{name:'Mexique', iso:'MX', code:'+52'},
  {name:'Moldavie', iso:'MD', code:'+373'},{name:'Monaco', iso:'MC', code:'+377'},{name:'Mongolie', iso:'MN', code:'+976'},
  {name:'Monténégro', iso:'ME', code:'+382'},{name:'Mozambique', iso:'MZ', code:'+258'},{name:'Namibie', iso:'NA', code:'+264'},
  {name:'Népal', iso:'NP', code:'+977'},{name:'Nicaragua', iso:'NI', code:'+505'},{name:'Niger', iso:'NE', code:'+227'},
  {name:'Nigeria', iso:'NG', code:'+234'},{name:'Norvège', iso:'NO', code:'+47'},{name:'Nouvelle-Zélande', iso:'NZ', code:'+64'},
  {name:'Oman', iso:'OM', code:'+968'},{name:'Ouganda', iso:'UG', code:'+256'},{name:'Ouzbékistan', iso:'UZ', code:'+998'},
  {name:'Pakistan', iso:'PK', code:'+92'},{name:'Panama', iso:'PA', code:'+507'},{name:'Papouasie-Nouvelle-Guinée', iso:'PG', code:'+675'},
  {name:'Paraguay', iso:'PY', code:'+595'},{name:'Pays-Bas', iso:'NL', code:'+31'},{name:'Pérou', iso:'PE', code:'+51'},
  {name:'Philippines', iso:'PH', code:'+63'},{name:'Pologne', iso:'PL', code:'+48'},{name:'Portugal', iso:'PT', code:'+351'},
  {name:'Qatar', iso:'QA', code:'+974'},{name:'République dominicaine', iso:'DO', code:'+1809'},{name:'République tchèque', iso:'CZ', code:'+420'},
  {name:'Roumanie', iso:'RO', code:'+40'},{name:'Royaume-Uni', iso:'GB', code:'+44'},{name:'Russie', iso:'RU', code:'+7'},
  {name:'Rwanda', iso:'RW', code:'+250'},{name:'Saint-Kitts-et-Nevis', iso:'KN', code:'+1869'},{name:'Saint-Marin', iso:'SM', code:'+378'},
  {name:'Saint-Vincent-et-les-Grenadines', iso:'VC', code:'+1784'},{name:'Sainte-Lucie', iso:'LC', code:'+1758'},{name:'Salvador', iso:'SV', code:'+503'},
  {name:'Samoa', iso:'WS', code:'+685'},{name:'São Tomé-et-Principe', iso:'ST', code:'+239'},{name:'Sénégal', iso:'SN', code:'+221'},
  {name:'Serbie', iso:'RS', code:'+381'},{name:'Seychelles', iso:'SC', code:'+248'},{name:'Sierra Leone', iso:'SL', code:'+232'},
  {name:'Singapour', iso:'SG', code:'+65'},{name:'Slovaquie', iso:'SK', code:'+421'},{name:'Slovénie', iso:'SI', code:'+386'},
  {name:'Somalie', iso:'SO', code:'+252'},{name:'Soudan', iso:'SD', code:'+249'},{name:'Soudan du Sud', iso:'SS', code:'+211'},
  {name:'Sri Lanka', iso:'LK', code:'+94'},{name:'Suède', iso:'SE', code:'+46'},{name:'Suisse', iso:'CH', code:'+41'},
  {name:'Suriname', iso:'SR', code:'+597'},{name:'Syrie', iso:'SY', code:'+963'},{name:'Tadjikistan', iso:'TJ', code:'+992'},
  {name:'Tanzanie', iso:'TZ', code:'+255'},{name:'Tchad', iso:'TD', code:'+235'},{name:'Thaïlande', iso:'TH', code:'+66'},
  {name:'Timor oriental', iso:'TL', code:'+670'},{name:'Togo', iso:'TG', code:'+228'},{name:'Tonga', iso:'TO', code:'+676'},
  {name:'Trinité-et-Tobago', iso:'TT', code:'+1868'},{name:'Tunisie', iso:'TN', code:'+216'},{name:'Turkménistan', iso:'TM', code:'+993'},
  {name:'Turquie', iso:'TR', code:'+90'},{name:'Ukraine', iso:'UA', code:'+380'},{name:'Uruguay', iso:'UY', code:'+598'},
  {name:'Vanuatu', iso:'VU', code:'+678'},{name:'Venezuela', iso:'VE', code:'+58'},{name:'Vietnam', iso:'VN', code:'+84'},
  {name:'Yémen', iso:'YE', code:'+967'},{name:'Zambie', iso:'ZM', code:'+260'},{name:'Zimbabwe', iso:'ZW', code:'+263'}
];
function isoToFlag(iso){
  if(!iso) return '🏳️';
  return iso.toUpperCase().replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}
function renderPhoneList(query){
  const q = (query||'').trim().toLowerCase();
  const filtered = COUNTRY_CODES.filter(c => !q || c.name.toLowerCase().includes(q) || c.code.includes(q));
  if(filtered.length === 0){
    return `<div class="phone-empty">Aucun pays trouvé</div>`;
  }
  return filtered.map(c => `
    <button type="button" class="phone-item ${c.iso===wiz.telIso ? 'active':''}" data-code="${c.code}" data-iso="${c.iso}">
      <span class="flag">${isoToFlag(c.iso)}</span>
      <span class="pname">${c.name}</span>
      <span class="pcode">${c.code}</span>
    </button>`).join('');
}
const WIZ_STEPS = ['genre','categorie','texture','couleur','occasion','photo','details','mesures','contact'];
let wizStep = 0;
let wiz = {
  genre:null, categorie:null, texture:null, textureAutre:'',
  couleur:null, couleurAutre:'', mesureChoix:null,
  poitrine:'', taille:'', hanches:'', longueur:'', hauteur:'',
  photoData:null, photoName:'', photoRatio:1,
  occasion:null, occasionAutre:'', delai:'', budget:'', note:'',
  nom:'', telCode:'+229', telIso:'BJ', telNumber:''
};
const SITE_PROVENANCE = 'Site web AMEREY SHOP';

function wizRender(){
  const step = WIZ_STEPS[wizStep];
  document.getElementById('wiz-progress').textContent = `Étape ${wizStep+1} / ${WIZ_STEPS.length}`;
  document.getElementById('wiz-fill').style.width = ((wizStep+1)/WIZ_STEPS.length*100) + '%';
  document.getElementById('wiz-prev').disabled = wizStep === 0;

  const body = document.getElementById('wiz-body');
  const nextBtn = document.getElementById('wiz-next');
  nextBtn.textContent = step === 'contact' ? 'Envoyer sur WhatsApp' : 'Suivant →';
  nextBtn.disabled = false;

  if(step === 'genre'){
    body.innerHTML = `<div class="wiz-q">Vous êtes...</div>
      <div class="option-grid">
        ${['Femme','Homme'].map(g=>`<button type="button" class="option-card ${wiz.genre===g?'selected':''}" data-set="genre" data-val="${g}">${g}</button>`).join('')}
      </div>`;
  }
  else if(step === 'categorie'){
    const opts = CATEGORIES_BY_GENRE[wiz.genre] || [];
    body.innerHTML = `<div class="wiz-q">Quelle catégorie de tenue souhaitez-vous ?</div>
      <div class="option-grid">
        ${opts.map(c=>`<button type="button" class="option-card ${wiz.categorie===c?'selected':''}" data-set="categorie" data-val="${c}">${c}</button>`).join('')}
      </div>`;
  }
  else if(step === 'texture'){
    body.innerHTML = `<div class="wiz-q">Quel tissu / quelle texture préférez-vous ?</div>
      <div class="option-grid">
        ${TEXTURES.map(t=>`<button type="button" class="option-card ${wiz.texture===t?'selected':''}" data-set="texture" data-val="${t}">${t}</button>`).join('')}
      </div>
      ${wiz.texture==='Autre'?`<div class="field" style="margin-top:14px;"><label>Précisez le tissu</label><input type="text" id="texture-autre" value="${wiz.textureAutre}" placeholder="Ex : bazin, velours..."></div>`:''}`;
  }
  else if(step === 'couleur'){
    body.innerHTML = `<div class="wiz-q">Quelle couleur souhaitez-vous ?</div>
      <div class="swatch-row">
        ${COULEURS.map(c=>`
          <div class="swatch-item">
            <button type="button" class="swatch ${wiz.couleur===c.name?'selected':''}" data-set="couleur" data-val="${c.name}" style="background:${c.hex || 'repeating-linear-gradient(45deg,#ddd,#ddd 4px,#fff 4px,#fff 8px)'}"></button>
            ${c.name}
          </div>`).join('')}
      </div>
      ${wiz.couleur==='Autre'?`<div class="field" style="margin-top:14px;"><label>Précisez la couleur</label><input type="text" id="couleur-autre" value="${wiz.couleurAutre}" placeholder="Ex : bordeaux, turquoise..."></div>`:''}`;
  }
  else if(step === 'occasion'){
    body.innerHTML = `<div class="wiz-q">Pour quelle occasion souhaitez-vous cette tenue ?</div>
      <div class="option-grid">
        ${OCCASIONS.map(o=>`<button type="button" class="option-card ${wiz.occasion===o?'selected':''}" data-set="occasion" data-val="${o}">${o}</button>`).join('')}
      </div>
      ${wiz.occasion==='Autre'?`<div class="field" style="margin-top:14px;"><label>Précisez l'occasion</label><input type="text" id="occasion-autre" value="${wiz.occasionAutre}" placeholder="Ex : baptême, anniversaire..."></div>`:''}
      <p class="hint" style="margin-top:14px;">Cela nous aide à orienter le choix du tissu et des finitions.</p>`;
  }
  else if(step === 'photo'){
    body.innerHTML = `<div class="wiz-q">Un modèle qui vous inspire ?</div>
      <p class="hint" style="margin-bottom:14px;">Vous avez vu une tenue quelque part (photo, réseaux sociaux, catalogue) que vous aimeriez qu'on s'en inspire ou qu'on recrée ? Joignez-la ici — c'est facultatif.</p>
      <div class="field">
        <label>Photo d'inspiration (optionnel)</label>
        <input type="file" accept="image/*" id="photo-input">
      </div>
      ${wiz.photoData ? `
      <div style="margin-top:14px; display:flex; align-items:center; gap:14px;">
        <img src="${wiz.photoData}" style="width:90px; height:90px; object-fit:cover; border-radius:4px; border:1px solid var(--line);">
        <div>
          <div style="font-size:13px; color:var(--ink-soft); margin-bottom:8px;">${wiz.photoName || 'Photo ajoutée'}</div>
          <button type="button" class="btn-ghost" id="photo-remove">Retirer la photo</button>
        </div>
      </div>` : ''}
      <p class="hint" style="margin-top:14px;">La photo sera intégrée à votre fiche PDF. Si vous envoyez votre commande par message direct, pensez à joindre la photo manuellement sur WhatsApp.</p>`;
    const fileInput = document.getElementById('photo-input');
    if(fileInput){
      fileInput.addEventListener('change', (e)=>{
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(ev){
          wiz.photoData = ev.target.result;
          wiz.photoName = file.name;
          const img = new Image();
          img.onload = function(){
            wiz.photoRatio = img.naturalWidth / img.naturalHeight || 1;
            wizRender();
          };
          img.onerror = function(){ wiz.photoRatio = 1; wizRender(); };
          img.src = wiz.photoData;
        };
        reader.readAsDataURL(file);
      });
    }
    const removeBtn = document.getElementById('photo-remove');
    if(removeBtn){
      removeBtn.addEventListener('click', ()=>{ wiz.photoData=null; wiz.photoName=''; wiz.photoRatio=1; wizRender(); });
    }
  }
  else if(step === 'details'){
    const errDelai = wiz.delai.trim()==='' ? 'Le délai souhaité est obligatoire' : '';
    const budgetNum = Number(String(wiz.budget).replace(/[^0-9.,]/g,'').replace(',','.'));
    const errBudget = wiz.budget.trim()==='' ? 'Le budget est obligatoire'
      : (!isFinite(budgetNum) || isNaN(budgetNum)) ? 'Merci d\u2019entrer un montant'
      : (budgetNum < 30000) ? 'Nos tenues démarrent à 30 000 FCFA — indiquez un budget à partir de ce montant' : '';
    body.innerHTML = `<div class="wiz-q">Quelques précisions supplémentaires</div>
      <p class="hint" style="margin-bottom:14px;">Ces informations nous aident à préparer un devis réaliste.</p>
      <div class="field">
        <label>Délai souhaité *</label>
        <input type="text" id="d-delai" class="${errDelai?'invalid':''}" value="${wiz.delai}" placeholder="Ex : sous 2 semaines, avant le 15 décembre...">
        <div class="field-error ${errDelai?'show':''}">${errDelai}</div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>Budget indicatif (FCFA) *</label>
        <input type="text" inputmode="numeric" id="d-budget" class="${errBudget?'invalid':''}" value="${wiz.budget}" placeholder="Ex : 35 000 (minimum 30 000 FCFA)">
        <div class="field-error ${errBudget?'show':''}">${errBudget}</div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>Note libre</label>
        <textarea id="d-note" rows="4" placeholder="Ex : broderie sur le col, poches latérales, doublure, référence à une tenue déjà portée...">${wiz.note}</textarea>
      </div>
      <p class="hint" style="margin-top:6px;">* Champs obligatoires — nécessaires pour vous proposer un devis réaliste.</p>`;
    nextBtn.disabled = !!errDelai || !!errBudget;
  }
  else if(step === 'mesures'){
    body.innerHTML = `<div class="wiz-q">Comment souhaitez-vous procéder pour les mesures ?</div>
      <div class="option-grid">
        <button type="button" class="option-card ${wiz.mesureChoix==='donner'?'selected':''}" data-set="mesureChoix" data-val="donner">Je donne mes mesures</button>
        <button type="button" class="option-card ${wiz.mesureChoix==='boutique'?'selected':''}" data-set="mesureChoix" data-val="boutique">Je passe en boutique pour la prise de mesure</button>
      </div>
      ${wiz.mesureChoix==='donner'?`
      <p class="hint" style="margin-bottom:10px;">Mesures demandées pour : <b>${wiz.categorie || 'votre tenue'}</b></p>
      <div class="measure-fields">
        ${getMeasureFields().map(f=>`
        <div class="field">
          <label>${f.label} (cm)</label>
          <input type="number" inputmode="decimal" step="0.5" min="${f.min}" max="${f.max}"
                 data-field="${f.key}" data-min="${f.min}" data-max="${f.max}"
                 class="${mesureFieldError(f.key)?'invalid':''}" value="${wiz[f.key]}">
          <div class="field-error ${mesureFieldError(f.key)?'show':''}">${mesureFieldError(f.key)||''}</div>
        </div>`).join('')}
        <div class="field" style="grid-column:1/-1;"><label>Longueur souhaitée</label><input type="text" data-field="longueur" value="${wiz.longueur}" placeholder="Ex : mi-mollet, cheville..."></div>
      </div>
      <p class="hint">Prenez vos mesures avec un mètre ruban, sans trop serrer. Les valeurs doivent rester dans une fourchette réaliste — nos stylistes vérifient tout à la confirmation.</p>`:''}`;
    nextBtn.disabled = !wiz.mesureChoix || (wiz.mesureChoix==='donner' && !mesuresAllValid());
  }
  else if(step === 'contact'){
    const msgPreview = `Genre : ${wiz.genre||'—'} · Catégorie : ${wiz.categorie||'—'} · Tissu : ${wiz.texture==='Autre'?wiz.textureAutre:wiz.texture||'—'} · Couleur : ${wiz.couleur==='Autre'?wiz.couleurAutre:wiz.couleur||'—'} · Occasion : ${wiz.occasion==='Autre'?wiz.occasionAutre:wiz.occasion||'—'} · Mesures : ${wiz.mesureChoix==='boutique'?'Prise en boutique':(wiz.mesureChoix==='donner'?'Fournies par le client':'—')}${wiz.photoData ? ' · Photo d\u2019inspiration jointe' : ''}`;
    const errNom = wiz.nom.trim()==='' ? 'Le nom est obligatoire' : '';
    const errTel = wiz.telNumber.trim()==='' ? 'Le numéro est obligatoire' : '';
    body.innerHTML = `<div class="wiz-q">Vos coordonnées</div>
      <p class="hint" style="margin-bottom:10px;">Ces informations sont indispensables pour vous identifier et vous recontacter dès que la commande est prête.</p>
      <div class="field">
        <label>Nom complet *</label>
        <input type="text" id="c-nom" value="${wiz.nom}" placeholder="Votre nom" class="${errNom?'invalid':''}">
        <div class="field-error ${errNom?'show':''}">${errNom}</div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>Téléphone *</label>
        <div class="phone-field">
          <div class="phone-select-wrap">
            <button type="button" class="phone-select-trigger" id="phone-trigger">
              <span class="flag" id="phone-trigger-flag">${isoToFlag(wiz.telIso)}</span>
              <span class="code" id="phone-trigger-code">${wiz.telCode}</span>
              <span class="caret">▾</span>
            </button>
            <div class="phone-dropdown" id="phone-dropdown" style="display:none;">
              <input type="text" class="phone-search" id="phone-search" placeholder="Rechercher un pays...">
              <div class="phone-list" id="phone-list">${renderPhoneList('')}</div>
            </div>
          </div>
          <input type="tel" id="c-tel-number" value="${wiz.telNumber}" placeholder="Numéro" class="${errTel?'invalid':''}" style="flex:1;">
        </div>
        <div class="field-error ${errTel?'show':''}">${errTel}</div>
      </div>
      <div class="recap-box" style="margin-top:16px;"><b>Récapitulatif</b><br>${msgPreview}</div>`;
    const phoneTrigger = document.getElementById('phone-trigger');
    const phoneDropdown = document.getElementById('phone-dropdown');
    const phoneSearch = document.getElementById('phone-search');
    const phoneList = document.getElementById('phone-list');
    if(phoneTrigger){
      phoneTrigger.addEventListener('click', (e)=>{
        e.stopPropagation();
        const isOpen = phoneDropdown.style.display === 'block';
        phoneDropdown.style.display = isOpen ? 'none' : 'block';
        phoneTrigger.classList.toggle('open', !isOpen);
        if(!isOpen){ phoneSearch.value = ''; phoneList.innerHTML = renderPhoneList(''); phoneSearch.focus(); }
      });
      phoneSearch.addEventListener('input', (e)=>{ phoneList.innerHTML = renderPhoneList(e.target.value); });
      phoneList.addEventListener('click', (e)=>{
        const item = e.target.closest('.phone-item');
        if(!item) return;
        wiz.telCode = item.dataset.code;
        wiz.telIso = item.dataset.iso;
        document.getElementById('phone-trigger-flag').textContent = isoToFlag(item.dataset.iso);
        document.getElementById('phone-trigger-code').textContent = item.dataset.code;
        phoneDropdown.style.display = 'none';
        phoneTrigger.classList.remove('open');
      });
    }
    nextBtn.disabled = !!errNom || !!errTel;
  }
}

document.getElementById('wiz-body').addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-set]');
  if(!btn) return;
  wiz[btn.dataset.set] = btn.dataset.val;
  wizRender();
});
document.getElementById('wiz-body').addEventListener('input', (e)=>{
  if(e.target.id === 'texture-autre') wiz.textureAutre = e.target.value;
  if(e.target.id === 'couleur-autre') wiz.couleurAutre = e.target.value;
  if(e.target.id === 'occasion-autre') wiz.occasionAutre = e.target.value;
  if(e.target.id === 'd-delai'){
    wiz.delai = e.target.value;
    const err = wiz.delai.trim()==='' ? 'Le délai souhaité est obligatoire' : '';
    e.target.classList.toggle('invalid', !!err);
    const errBox = e.target.parentElement.querySelector('.field-error');
    if(errBox){ errBox.textContent = err; errBox.classList.toggle('show', !!err); }
    const budgetNum = Number(String(wiz.budget).replace(/[^0-9.,]/g,'').replace(',','.'));
    const budgetOk = wiz.budget.trim()!=='' && isFinite(budgetNum) && !isNaN(budgetNum) && budgetNum>=30000;
    document.getElementById('wiz-next').disabled = wiz.delai.trim()==='' || !budgetOk;
  }
  if(e.target.id === 'd-budget'){
    wiz.budget = e.target.value;
    const budgetNum = Number(String(wiz.budget).replace(/[^0-9.,]/g,'').replace(',','.'));
    const err = wiz.budget.trim()==='' ? 'Le budget est obligatoire'
      : (!isFinite(budgetNum) || isNaN(budgetNum)) ? 'Merci d\u2019entrer un montant'
      : (budgetNum < 30000) ? 'Nos tenues démarrent à 30 000 FCFA — indiquez un budget à partir de ce montant' : '';
    e.target.classList.toggle('invalid', !!err);
    const errBox = e.target.parentElement.querySelector('.field-error');
    if(errBox){ errBox.textContent = err; errBox.classList.toggle('show', !!err); }
    document.getElementById('wiz-next').disabled = wiz.delai.trim()==='' || !!err;
  }
  if(e.target.id === 'd-note') wiz.note = e.target.value;
  if(e.target.id === 'c-nom'){
    wiz.nom = e.target.value;
    const err = e.target.value.trim()==='' ? 'Le nom est obligatoire' : '';
    e.target.classList.toggle('invalid', !!err);
    const errBox = e.target.parentElement.querySelector('.field-error');
    if(errBox){ errBox.textContent = err; errBox.classList.toggle('show', !!err); }
    document.getElementById('wiz-next').disabled = wiz.nom.trim()==='' || wiz.telNumber.trim()==='';
  }
  if(e.target.id === 'c-tel-number'){
    wiz.telNumber = e.target.value;
    const err = e.target.value.trim()==='' ? 'Le numéro est obligatoire' : '';
    e.target.classList.toggle('invalid', !!err);
    const errBox = e.target.closest('.field').querySelector('.field-error');
    if(errBox){ errBox.textContent = err; errBox.classList.toggle('show', !!err); }
    document.getElementById('wiz-next').disabled = wiz.nom.trim()==='' || wiz.telNumber.trim()==='';
  }
  if(e.target.dataset.field){
    wiz[e.target.dataset.field] = e.target.value;
    if(MEASURE_FIELD_DEFS[e.target.dataset.field]){
      const err = mesureFieldError(e.target.dataset.field, {requireFilled:true});
      e.target.classList.toggle('invalid', !!err);
      const errBox = e.target.parentElement.querySelector('.field-error');
      if(errBox){ errBox.textContent = err || ''; errBox.classList.toggle('show', !!err); }
      document.getElementById('wiz-next').disabled = wiz.mesureChoix==='donner' && !mesuresAllValid();
    }
  }
});

function wizValid(){
  const step = WIZ_STEPS[wizStep];
  if(step==='genre') return !!wiz.genre;
  if(step==='categorie') return !!wiz.categorie;
  if(step==='texture') return !!wiz.texture && (wiz.texture!=='Autre' || wiz.textureAutre.trim()!=='');
  if(step==='couleur') return !!wiz.couleur && (wiz.couleur!=='Autre' || wiz.couleurAutre.trim()!=='');
  if(step==='occasion') return !!wiz.occasion && (wiz.occasion!=='Autre' || wiz.occasionAutre.trim()!=='');
  if(step==='photo') return true;
  if(step==='details'){
    const budgetNum = Number(String(wiz.budget).replace(/[^0-9.,]/g,'').replace(',','.'));
    return wiz.delai.trim()!=='' && wiz.budget.trim()!=='' && isFinite(budgetNum) && !isNaN(budgetNum) && budgetNum>=30000;
  }
  if(step==='mesures') return wiz.mesureChoix==='boutique' || (wiz.mesureChoix==='donner' && mesuresAllValid());
  if(step==='contact') return wiz.nom.trim()!=='' && wiz.telNumber.trim()!=='';
  return true;
}

function generateMesurePDF(w){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const green = [44,74,58];
  const gold = [197,113,78];
  const cream = [247,242,231];
  const ink = [28,27,23];
  const inkSoft = [91,90,82];
  const line = [222,213,198];

  // Filigrane illustré en fond de page (très léger)
  try{
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({opacity:0.07}));
    doc.addImage(MESURE_BG_SMALL, 'JPEG', 55, 90, 100, 141);
    doc.restoreGraphicsState();
  }catch(e){}

  // Bandeau vert
  doc.setFillColor(...green);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(...cream);
  doc.setFont('helvetica','bold');
  doc.setFontSize(24);
  doc.text('AMEREY SHOP', 15, 20);
  doc.setFont('helvetica','italic');
  doc.setFontSize(11);
  doc.setTextColor(...gold);
  doc.text('Fiche de commande sur-mesure', 15, 29);
  doc.setTextColor(...cream);
  doc.setFontSize(9);
  const today = new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
  doc.text('Généré le ' + today + '  ·  Provenance : ' + SITE_PROVENANCE, 15, 36);

  // Trait terracotta
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.2);
  doc.line(15, 50, 195, 50);

  const colL = 15, colR = 110;
  const pageBottom = 260; // tout le contenu texte doit tenir avant cette limite
  let y = 62;

  function rowDivider(){
    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(15, y, 195, y);
    y += 4;
  }

  function fieldAt(x, label, value, size){
    doc.setFont('helvetica','bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...inkSoft);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont('helvetica','italic');
    doc.setFontSize(size || 11);
    doc.setTextColor(...ink);
    doc.text(String(value || '—'), x, y + 5.5);
  }

  function fieldPair(labelL, valueL, labelR, valueR){
    fieldAt(colL, labelL, valueL);
    fieldAt(colR, labelR, valueR);
    y += 10;
    rowDivider();
  }

  function fieldRow(label, value){
    fieldAt(colL, label, value);
    y += 10;
    rowDivider();
  }

  function fieldWrapped(label, value, maxLines){
    doc.setFont('helvetica','italic');
    doc.setFontSize(10);
    let lines = doc.splitTextToSize(String(value || '—'), 178);
    if(maxLines && lines.length > maxLines){
      lines = lines.slice(0, maxLines);
      lines[maxLines-1] = lines[maxLines-1].replace(/.{0,1}$/, '') + '…';
    }
    doc.setFont('helvetica','bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...inkSoft);
    doc.text(label.toUpperCase(), colL, y);
    doc.setFont('helvetica','italic');
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    doc.text(lines, colL, y + 5.5);
    y += 5.5 + lines.length * 4.6;
    rowDivider();
  }

  const texture = w.texture==='Autre' ? w.textureAutre : w.texture;
  const couleur = w.couleur==='Autre' ? w.couleurAutre : w.couleur;
  const occasion = w.occasion==='Autre' ? w.occasionAutre : w.occasion;
  const phone = ((w.telCode||'') + ' ' + (w.telNumber||'')).trim();
  const mesureTxt = w.mesureChoix==='boutique'
    ? 'Prise de mesure en boutique'
    : `Poitrine ${w.poitrine||'—'} cm · Taille ${w.taille||'—'} cm · Hanches ${w.hanches||'—'} cm · Hauteur ${w.hauteur||'—'} cm · Longueur : ${w.longueur||'—'}`;

  fieldPair('Client', w.nom, 'Téléphone', phone);
  fieldPair('Genre', w.genre, 'Catégorie de tenue', w.categorie);
  fieldPair('Tissu', texture, 'Couleur', couleur);
  fieldPair('Occasion', occasion, 'Délai souhaité', w.delai);
  fieldRow('Budget indicatif', w.budget);
  fieldWrapped('Mesures', mesureTxt, 2);

  // La note libre occupe tout l'espace texte restant sur la page,
  // tronquée proprement si nécessaire pour que tout tienne sur une seule page.
  const remaining = pageBottom - y;
  const noteMaxLines = Math.max(1, Math.floor((remaining - 6) / 4.6));
  fieldWrapped('Note complémentaire', w.note, noteMaxLines);

  // Bas de page 1
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.line(15, 268, 195, 268);
  doc.setFont('helvetica','italic');
  doc.setFontSize(9);
  doc.setTextColor(...inkSoft);
  doc.text('AMEREY SHOP — 99PF+WW7, Cadjehoun, Cotonou', 15, 275);
  doc.text('+229 56 99 09 15 — amereyshop@gmail.com', 15, 280.5);
  doc.text('Instagram & TikTok — @amerey_shop', 15, 286);
  doc.setFont('helvetica','normal');
  doc.setFontSize(7.5);
  doc.text('Document généré automatiquement depuis le site — à confirmer avec la boutique.', 15, 292);

  // Page 2 (uniquement si une photo d'inspiration a été jointe) : la photo occupe toute la page
  if(w.photoData){
    doc.addPage();
    doc.setFillColor(...green);
    doc.rect(0, 0, 210, 16, 'F');
    doc.setTextColor(...cream);
    doc.setFont('helvetica','bold');
    doc.setFontSize(10.5);
    doc.text('AMEREY SHOP — Photo d\u2019inspiration transmise par le client', 15, 10.5);
    try{
      const maxW = 180, maxH = 265;
      const ratio = w.photoRatio || 1;
      let iw = maxW, ih = maxW / ratio;
      if(ih > maxH){ ih = maxH; iw = maxH * ratio; }
      const px = (210 - iw) / 2;
      const py = 16 + (277 - ih) / 2;
      const fmt = w.photoData.indexOf('image/png') !== -1 ? 'PNG' : 'JPEG';
      doc.addImage(w.photoData, fmt, px, py, iw, ih);
    }catch(e){}
    doc.setFont('helvetica','italic');
    doc.setFontSize(8);
    doc.setTextColor(...inkSoft);
    doc.text('Photo fournie à titre indicatif par ' + (w.nom || 'le client') + ' — à confirmer avec la boutique.', 15, 293);
  }

  const fileName = 'commande-sur-mesure-' + (w.nom ? w.nom.replace(/\s+/g,'-').toLowerCase() : 'client') + '.pdf';
  doc.save(fileName);
  return fileName;
}

document.getElementById('wiz-prev').addEventListener('click', ()=>{
  if(wizStep>0){ wizStep--; wizRender(); }
});
document.getElementById('wiz-next').addEventListener('click', ()=>{
  if(!wizValid()){ return; }
  if(WIZ_STEPS[wizStep] === 'contact'){
    const fileName = generateMesurePDF(wiz);
    const msgPdf = `Bonjour AMEREY SHOP, je viens de vous envoyer ma fiche de commande sur-mesure en PDF (${fileName}), en provenance du ${SITE_PROVENANCE}. Merci de me confirmer la disponibilité et le devis.${wiz.photoData ? ' (Une photo d\u2019inspiration est intégrée à la fiche PDF.)' : ''}`;

    const texture = wiz.texture==='Autre' ? wiz.textureAutre : wiz.texture;
    const couleur = wiz.couleur==='Autre' ? wiz.couleurAutre : wiz.couleur;
    const occasion = wiz.occasion==='Autre' ? wiz.occasionAutre : wiz.occasion;
    const phone = (wiz.telCode + ' ' + wiz.telNumber).trim();
    const mesureTxt = wiz.mesureChoix==='boutique'
      ? 'Prise de mesure en boutique'
      : `Poitrine ${wiz.poitrine||'—'} cm, Taille ${wiz.taille||'—'} cm, Hanches ${wiz.hanches||'—'} cm, Hauteur ${wiz.hauteur||'—'} cm, Longueur : ${wiz.longueur||'—'}`;
    const msgDirect = `Bonjour AMEREY SHOP, je souhaite passer une commande sur-mesure (en provenance du ${SITE_PROVENANCE}) :
Client : ${wiz.nom || '—'}
Téléphone : ${phone || '—'}
Genre : ${wiz.genre || '—'}
Catégorie de tenue : ${wiz.categorie || '—'}
Tissu : ${texture || '—'}
Couleur : ${couleur || '—'}
Occasion : ${occasion || '—'}
Délai souhaité : ${wiz.delai || '—'}
Budget indicatif : ${wiz.budget || '—'}
Mesures : ${mesureTxt}
Note : ${wiz.note || '—'}
Merci de me confirmer la disponibilité et le devis.${wiz.photoData ? '\n(J\u2019ai une photo d\u2019inspiration à vous joindre séparément dans cette conversation.)' : ''}`;

    document.getElementById('wiz-progress').textContent = 'Terminé';
    document.getElementById('wiz-fill').style.width = '100%';
    document.getElementById('wiz-body').innerHTML = `
      <div style="text-align:center; padding:20px 6px;">
        <div style="font-size:40px; margin-bottom:14px;">✓</div>
        <div class="wiz-q" style="margin-bottom:10px;">Votre fiche PDF a été téléchargée</div>
        <p style="color:var(--ink-soft); font-size:14px; line-height:1.6; margin-bottom:18px;">
          Le fichier <strong>${fileName}</strong> est enregistré sur votre téléphone.
          Cliquez ci-dessous pour l'envoyer sur WhatsApp avec votre message — pensez à joindre le PDF depuis vos téléchargements dans la conversation.
        </p>
        <a href="${waLink(msgPdf)}" target="_blank" class="btn btn-gold" style="width:100%; justify-content:center; margin-bottom:18px;">Envoyer votre PDF</a>

        <p style="color:var(--ink-soft); font-size:13px; line-height:1.6; margin-bottom:14px; border-top:1px solid var(--line); padding-top:18px;">
          Vous préférez ne pas joindre de fichier ? Vous pouvez aussi transmettre votre commande directement par message, sans PDF.
        </p>
        <a href="${waLink(msgDirect)}" target="_blank" class="btn" style="width:100%; justify-content:center; border:1.5px solid var(--green-deep); color:var(--green-deep);">Envoyer par message direct</a>
        ${wiz.photoData ? `<div class="direct-note">📸 <b>Vous avez ajouté une photo d'inspiration.</b> Avec l'option PDF ci-dessus, elle est déjà intégrée à la fiche (page 2) — c'est l'option la plus simple, on vous la recommande. Si vous préférez le <b>message direct</b>, pensez à joindre cette photo séparément, juste après l'envoi du message, dans la même conversation WhatsApp.</div>` : ''}
      </div>
    `;
    document.querySelector('.wizard-nav').style.display = 'none';
    return;
  }
  wizStep++;
  wizRender();
});

wizRender();

document.addEventListener('click', (e)=>{
  const dropdown = document.getElementById('phone-dropdown');
  const trigger = document.getElementById('phone-trigger');
  if(dropdown && dropdown.style.display === 'block'){
    if(!dropdown.contains(e.target) && (!trigger || !trigger.contains(e.target))){
      dropdown.style.display = 'none';
      if(trigger) trigger.classList.remove('open');
    }
  }
});
fetch('data/catalogue.json')
  .then(response => {
    if(!response.ok) throw new Error('Catalogue indisponible');
    return response.json();
  })
  .then(data => {
    PRODUCTS = data;
    renderSubfilters();
    renderGrid();
    applySectionVisibility();
  })
  .catch(() => {
    document.getElementById('grid').innerHTML = '<div class="empty-note">Le catalogue est momentanément indisponible. Ouvre le site depuis GitHub Pages ou un serveur local.</div>';
  });

function selectHeroCat(cat){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.cat===cat));
  currentCat = cat;
  currentSub = 'tout';
  renderSubfilters();
  renderGrid();
  applySectionVisibility();
}

/* ---------- Bannière cookies ---------- */
try{
  if(!localStorage.getItem('amerey_cookie_choice')){
    setTimeout(()=>{ document.getElementById('cookie-banner').classList.add('show'); }, 900);
  }
}catch(e){
  setTimeout(()=>{ document.getElementById('cookie-banner').classList.add('show'); }, 900);
}
function hideCookieBanner(choice){
  document.getElementById('cookie-banner').classList.remove('show');
  try{ localStorage.setItem('amerey_cookie_choice', choice || 'accepted'); }catch(e){}
}
document.getElementById('cookie-accept').addEventListener('click', ()=>hideCookieBanner('accepted'));
document.getElementById('cookie-refuse').addEventListener('click', ()=>hideCookieBanner('refused'));

document.getElementById('logo-home').addEventListener('click', (e)=>{
  e.preventDefault();
  try{ if('scrollRestoration' in history) history.scrollRestoration = 'manual'; }catch(err){}
  window.scrollTo({top:0, left:0, behavior:'smooth'});
  wizStep = 0;
  currentCat = 'femme';
  currentSub = 'tout';
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.cat==='femme'));
  renderSubfilters();
  renderGrid();
  applySectionVisibility();
});

/* ---------- Animations au scroll (contenu toujours visible par défaut) ---------- */
if('IntersectionObserver' in window){
  const revealEls = document.querySelectorAll('.reveal:not(.in)');
  revealEls.forEach(el=>el.classList.add('pre'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.remove('pre'); io.unobserve(en.target); }
    });
  }, {threshold:0.12});
  revealEls.forEach(el=>io.observe(el));
}
