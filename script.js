// ========== CONFIGURAÇÕES ==========
const SUPABASE_URL = "https://srmavbuaarejrqlibyha.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWF2YnVhYXJlanJxbGlieWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzUzNjIsImV4cCI6MjA3NjQ1MTM2Mn0.LpKRrGABJWE3cgnQI5eShlYlKwyS_NUp1To7FPhJ1sQ";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const PROFILE_ID = "marcio";
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Belem';

// Período-alvo fixo do ciclo
const start = new Date('2025-10-19T12:00:00'); // 12h evita erro de virada fuso
const end   = new Date('2025-11-08T12:00:00');
const msPerDay = 86400000;
const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const classMap  = ['col-dom','col-seg','col-ter','col-qua','col-qui','col-sex','col-sab'];

// ========== DADOS DO PROTOCOLO (NOVO: EM JSON) ==========
const PROTOCOL_DATA = {
  manha: {
    title: '🌅 Manhã',
    meta: '06:30–09:00',
    meta_dia: 'Ativar metabolismo e lipólise matinal mantendo foco mental e estabilidade energética.',
    items: [
      { name: 'GH (Genryzon)', obs: 'Dom 1,5 mg · Ter/Qui 1,0 mg · Aplicar ao acordar, <b>jejum absoluto</b>.', schedule: [1, 0, 1, 0, 1, 0, 0] },
      { name: 'Café + C8', obs: '10 mL C8 no café preto (manhã). Opcional 5 mL à tarde.', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'Vitamina D3 + K2 (4 gotas)', obs: '<b>Mesmos dias do GH</b> (Dom/Ter/Qui). Tomar <b>30–60 min</b> após o GH, com café + 10 mL C8.', schedule: [1, 0, 1, 0, 1, 0, 0] },
      { name: 'Liberdya (Venvanse gotas)', obs: 'Dose habitual prescrita · após café + C8.', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'Ômega-3 (Sports Research)', obs: '2 cápsulas manhã <b>Seg–Sex</b>; <b>Sábado opcional</b>. Domingo <b>off</b>.', schedule: [0, 1, 1, 1, 1, 1, 2] }, // 2 para opcional
      { name: 'Astaxantina', obs: '12 mg manhã <b>Seg–Sex</b>. Sábado e Domingo <b>off</b>.', schedule: [0, 1, 1, 1, 1, 1, 0] },
      { name: 'Hidrolift', obs: '250 mL manhã (½ sachê). +500 mL no pré-treino em dias de treino.', schedule: [1, 1, 1, 1, 1, 1, 1] },
    ]
  },
  omad: {
    title: '☀️ OMAD / Almoço',
    meta: '13:00',
    meta_dia: 'Promover anabolismo limpo e saciedade plena com densidade nutricional máxima.',
    items: [
      { name: 'Carnes nobres + queijo', obs: 'Total 450–500 g (ex.: picanha, maminha, cupim) + 80–100 g de queijo.', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'Verduras + batatas baby', obs: 'Verduras 100 g + azeite 10 mL · 3 batatas pequenas (~80 g).', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'CoQ10 (Ubiquinol 100 mg)', obs: 'Tomar com refeição <b>Seg–Sex</b>. Sábado e Domingo <b>off</b>.', schedule: [0, 1, 1, 1, 1, 1, 0] },
    ]
  },
  pre: {
    title: '🔥 Pré-treino',
    meta: '18:00–18:30',
    meta_dia: 'Preparar o corpo para desempenho e expansão muscular preservando cetose funcional.',
    items: [
      { name: 'Palatinose 10 g', obs: 'Dissolver em água 20–30 min antes.', schedule: [0, 1, 1, 1, 1, 1, 1] },
      { name: 'Creatina 5–6 g', obs: 'Pode ir no mesmo copo da palatinose. Em dia sem treino: tomar à noite.', schedule: [0, 1, 1, 1, 1, 1, 1] },
      { name: 'Acetyl-L-Carnitine 500 mg', obs: '15–20 min antes do treino. Energia mitocondrial + foco.', schedule: [0, 1, 1, 1, 1, 1, 1] },
      { name: 'Hidrolift 500 mL', obs: '1 sachê completo (eletrólitos + vitamina C).', schedule: [0, 1, 1, 1, 1, 1, 1] },
      { name: 'Tadalafila 10 mg', obs: 'Uso apenas no <b>sábado</b>, se desejado.', schedule: [0, 0, 0, 0, 0, 0, 2] },
    ]
  },
  pos: {
    title: '💪 Pós-treino / Ceia',
    meta: '20:00–21:00',
    meta_dia: 'Otimizar síntese proteica e recuperação tecidual, restaurando glicogênio sem inflamar.',
    items: [
      { name: 'Shake: BodyBalance + Whey', obs: 'Proteína total 30–35 g · + morango (6–8) e goiaba (1–2).', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'Inulina / FOS', obs: '2–3 g em dias alternados (Dom/ Ter/ Qui/ Sáb <b>após 26/out</b>). Misturar no shake.', schedule: [1, 0, 1, 0, 1, 0, 1], title: 'Ativo a partir de 26/out' },
    ]
  },
  noite: {
    title: '🌙 Noturno',
    meta: '21:00–22:30',
    meta_dia: 'Induzir relaxamento profundo e reparo celular com alinhamento do eixo GH-GABA-sono.',
    items: [
      { name: 'Magnesium Breakthrough (BiOptimizers)', obs: '1 cápsula às ~21h. Evitar usar junto do café.', schedule: [1, 1, 1, 1, 1, 1, 1] },
      { name: 'GABA + Melatonina', obs: 'Dose habitual. Tomar 15–30 min antes de deitar.', schedule: [1, 1, 1, 1, 1, 1, 1] },
    ]
  },
  avancado: {
    title: '⚡ Avançado (a partir de <b>26/out</b>)',
    meta: '<span class="pill">início 26/out</span>',
    meta_dia: 'Ativar rotas mitocondriais e sinalização redox com foco em longevidade celular.',
    note: '⚠️ Refeed: <b>26/out</b> e <b>09/nov</b> – <span class="pill">até 100 g</span> de carbo limpo (batata, arroz integral, burrata, frutas).',
    items: [
      { name: 'R-ALA Cyclodextrin 500 mg', obs: 'Tomar 15–20 min após o GH (Seg–Sex).', schedule: [0, 1, 1, 1, 1, 1, 0] },
      { name: 'Methyl Charge+ (sublingual)', obs: '1 pump manhã + 1 pump noite (diário a partir de 26/out).', schedule: [1, 1, 1, 1, 1, 1, 1] },
    ]
  }
};

// ===== Estado persistente (localStorage) =====
const STORE_KEY = 'mca_omad_v17';
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY))||{} }catch(_){ return {} } }
function saveState(o){ localStorage.setItem(STORE_KEY, JSON.stringify(o)) }
let state = loadState();
if(!state.checks) state.checks = {}; // { key: true }
if(!state.ui) state.ui = {};         // { mode, selectedDateISO, week }

// ===== Datas iniciais & modo =====
function todayLocalNoon(){
  const d = new Date(); d.setHours(12,0,0,0); return d;
}
const now = todayLocalNoon();
let selectedDate = state.ui.selectedDateISO ? new Date(state.ui.selectedDateISO) : new Date(Math.min(Math.max(now, start), end));
let mode = state.ui.mode || 'semana';
const weeks = [
  {label:1, start:new Date('2025-10-19T12:00:00'), end:new Date('2025-10-25T12:00:00')},
  {label:2, start:new Date('2025-10-26T12:00:00'), end:new Date('2025-11-01T12:00:00')},
  {label:3, start:new Date('2025-11-02T12:00:00'), end:new Date('2025-11-08T12:00:00')},
];
let currentWeek = weeks.find(w => selectedDate>=w.start && selectedDate<=w.end) || weeks[0];

// ========== Renderização Dinâmica do Protocolo (NOVO) ==========
function renderProtocol() {
  const container = document.getElementById('protocol-container');
  // Se você já tem marcações no app, o innerHTML = '' vai preservar o estado
  // anterior, mas como estamos editando o código, vamos garantir que o container
  // seja limpo antes de desenhar.
  container.innerHTML = '';

  for (const sectionKey in PROTOCOL_DATA) {
    const section = PROTOCOL_DATA[sectionKey];

    // 1. Cria a tag <section>
    const sectionEl = document.createElement('section');
    sectionEl.className = `card ${sectionKey}`;
    sectionEl.dataset.section = sectionKey;

    // 2. Cria o cabeçalho (band)
    const band = document.createElement('div');
    band.className = 'band';
    band.innerHTML = `${section.title} <small class="meta">${section.meta}</small>`;
    sectionEl.appendChild(band);

    // 3. Cria o corpo (inner)
    const inner = document.createElement('div');
    inner.className = 'inner';

    // 4. Cria a tabela
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>${sectionKey === 'omad' ? 'Item' : 'Suplemento / Medicação'}</th>
          <th class="col-th col-dom">Dom</th><th class="col-th col-seg">Seg</th><th class="col-th col-ter">Ter</th><th class="col-th col-qua">Qua</th><th class="col-th col-qui">Qui</th><th class="col-th col-sex">Sex</th><th class="col-th col-sab">Sáb</th>
          <th class="obs">Observação</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    // 5. Preenche as linhas da tabela (items)
    section.items.forEach(item => {
      const row = document.createElement('tr');
      let rowHtml = `<td>${item.name}</td>`;

      item.schedule.forEach((status, i) => {
        const cls = classMap[i];
        if (status === 0) {
          rowHtml += `<td class="off col ${cls}">—</td>`;
        } else {
          // Status 1 (Ativo) ou 2 (Opcional)
          const titleAttr = item.title ? `title="${item.title}"` : '';
          rowHtml += `<td class="col ${cls}"><input type="checkbox" ${titleAttr}></td>`;
        }
      });

      rowHtml += `<td class="obs">${item.obs}</td>`;
      row.innerHTML = rowHtml;
      tbody.appendChild(row);
    });

    inner.appendChild(table);

    // 6. Adiciona a meta e notas, se existirem
    inner.innerHTML += `<div class="meta-dia">Meta: <em>${section.meta_dia}</em></div>`;
    if (section.note) {
      inner.innerHTML += `<div class="note">${section.note}</div>`;
    }

    sectionEl.appendChild(inner);
    container.appendChild(sectionEl);
  }
}

// ========== UI HEADER ==========
function fmtDate(d){ return new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium', timeZone:tz}).format(d) }
function fmtDayLabel(d){ return new Intl.DateTimeFormat('pt-BR',{weekday:'long', day:'2-digit', month:'2-digit', timeZone:tz}).format(d) }
function refreshHeader(){
  const dnum = Math.floor((selectedDate - start)/msPerDay) + 1;
  document.getElementById('dnum').textContent = Math.min(Math.max(dnum,1),21);
  document.getElementById('wlabel').textContent = currentWeek.label;
  document.getElementById('modeLabel').textContent = mode==='dia' ? 'Dia' : 'Semana';
  document.getElementById('dateLabel').textContent = fmtDate(selectedDate);
  document.getElementById('todayChip').textContent = 'Hoje: ' + fmtDayLabel(now);
}

// Cabeçalhos das semanas com as datas certas
function applyWeekHeaders(){
  const weekStart = new Date(currentWeek.start);
  document.querySelectorAll('thead tr').forEach(tr=>{
    classMap.forEach((cls,i)=>{
      const th = tr.querySelector('.col-th.'+cls);
      if (!th) return;
      const d = new Date(weekStart.getTime()+i*msPerDay);
      const dm = new Intl.DateTimeFormat('pt-BR',{day:'2-digit', month:'2-digit', timeZone:tz}).format(d);
      th.textContent = `${weekdays[i]} (${dm})`;
    });
  });
}

// ========== Helpers de data/dia ==========
function dateForWeekday(w, weekdayIndex){ // 0..6
  return new Date(w.start.getTime() + weekdayIndex*msPerDay);
}
function weekdayIndexFromClass(td){
  const m = td.className.match(/col-(dom|seg|ter|qua|qui|sex|sab)/);
  const map = {dom:0,seg:1,ter:2,qua:3,qui:4,sex:5,sab:6};
  return m ? map[m[1]] : 0;
}

// ========== Persistência por DIA REAL ==========
function buildKeyForCheckbox(cb){
  const td = cb.closest('td');
  const row = cb.closest('tr');
  const section = cb.closest('section').dataset.section;
  const wIdx = weekdayIndexFromClass(td);
  const dateObj = dateForWeekday(currentWeek, wIdx);
  const dayISO = dateObj.toISOString().slice(0,10) + '_W' + currentWeek.label; // chave real por data e semana
  const rowLabel = (row.querySelector('td:first-child')?.textContent || 'row').trim().replace(/\s+/g,'_').slice(0,60);
  return `${dayISO}|${section}|${rowLabel}`;
}

function restoreCheckboxes(){
  document.querySelectorAll('td.col input[type=checkbox]').forEach(cb=>{
    const key = buildKeyForCheckbox(cb);
    cb.dataset.key = key;
    cb.checked = !!state.checks[key];
    cb.onchange = ()=>{
      state.checks[cb.dataset.key] = cb.checked;
      saveState(state);
      updateSummary(); updateChart();
    };
  });
}

// ========== Modo Semana/Dia ==========
function setMode(newMode){
  mode = (newMode === 'dia') ? 'dia' : 'semana';

  // ativa botões de visão
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode}"]`)?.classList.add('active');

  // mostra/oculta carrossel do dia
  const dc = document.getElementById('dayCarousel');
  if (dc) dc.classList.toggle('hidden', mode !== 'dia');

  // garante que selectedDate esteja dentro do range e que a semana atual bata com a data
  selectedDate = new Date(Math.min(Math.max(selectedDate.getTime(), start.getTime()), end.getTime()));
  currentWeek = weeks.find(w => selectedDate>=w.start && selectedDate<=w.end) || weeks[0];
  applyWeekHeaders();
  restoreCheckboxes();

  if (mode === 'dia'){
    showOnlyDay(selectedDate);
  } else {
    showAllDays();
    highlightTodayColumn();
  }

  // persiste e atualiza UI
  state.ui.mode = mode;
  state.ui.selectedDateISO = selectedDate.toISOString();
  saveState(state);
  refreshHeader(); updateSummary(); updateChart();
}

function showOnlyDay(dateObj){
  // Ajusta semana exibida com base na data escolhida
  currentWeek = weeks.find(w => dateObj>=w.start && dateObj<=w.end) || weeks[0];
  applyWeekHeaders();
  restoreCheckboxes();

  // índice do dia (0..6) e classe correspondente
  const wIdx = dateObj.getDay();
  const keepClass = classMap[wIdx];

  // Esconde todos os THs de dia, exceto o do dia selecionado
  document.querySelectorAll('.col-th').forEach(th=> th.classList.add('hidden'));
  document.querySelectorAll(`.col-th.${keepClass}`).forEach(th=> th.classList.remove('hidden'));

  // Esconde todas as células de dia e deixa só as do dia atual (em TODAS as seções)
  document.querySelectorAll('td.col').forEach(td=> td.classList.add('hidden'));
  document.querySelectorAll(`td.${keepClass}`).forEach(td=> td.classList.remove('hidden'));

  // Label do carrossel
  const lbl = document.getElementById('dayLabel');
  if (lbl) lbl.textContent = fmtDayLabel(dateObj);

  // No modo dia não há destaque “today”
  document.querySelectorAll('.today').forEach(el => el.classList.remove('today'));
}

function showAllDays(){
  // Mostra todas as colunas de todos os blocos
  document.querySelectorAll('.col-th').forEach(th=> th.classList.remove('hidden'));
  document.querySelectorAll('td.col').forEach(td=> td.classList.remove('hidden'));
  applyWeekHeaders();
}

function highlightTodayColumn(){
  // Limpa marcas antigas
  document.querySelectorAll('.today').forEach(el=>el.classList.remove('today'));
  // Coluna do “hoje” (baseado em `now`, já normalizado)
  const idx = now.getDay();
  document.querySelectorAll('.'+classMap[idx]).forEach(td=>td.classList.add('today'));
}

// Navegação do carrossel diário (◀ ▶)
document.addEventListener('click', (e)=>{
  if (e.target.id==='prevDay'){
    const d = new Date(selectedDate.getTime() - msPerDay);
    selectedDate = new Date(Math.max(d.getTime(), start.getTime()));
    setMode('dia'); // re-render usando a nova data
  }
  if (e.target.id==='nextDay'){
    const d = new Date(selectedDate.getTime() + msPerDay);
    selectedDate = new Date(Math.min(d.getTime(), end.getTime()));
    setMode('dia');
  }
});
  
// Botões de modo (Semana/Dia)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.mode-btn');
  if (!btn) return;
  setMode(btn.dataset.mode); // 'semana' ou 'dia'
});
  
// Botões de semana (Semana 1/2/3)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.week-btn'); 
  if(!btn) return;

  // UI: ativa botão clicado
  document.querySelectorAll('.week-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');

  // Encontra a semana e move a selectedDate para dentro dela, se necessário
  const wlabel = Number(btn.dataset.week);
  const w = weeks.find(x => x.label===wlabel) || weeks[0];
  currentWeek = w;
  if (selectedDate < w.start || selectedDate > w.end){
    selectedDate = new Date(w.start); // ancora no início da semana
  }
    restoreCheckboxes();

  // Atualiza visão conforme o modo atual
  if (mode==='dia') showOnlyDay(selectedDate);
  else { showAllDays(); highlightTodayColumn(); }

  // Persistência e UI
  state.ui.selectedDateISO = selectedDate.toISOString();
  state.ui.mode = mode;
  state.ui.week = currentWeek.label;
  saveState(state);

  refreshHeader(); updateSummary(); updateChart();
  window.scrollTo({top:0, behavior:'smooth'});
});
function saveUI(){ state.ui = { mode, selectedDateISO:selectedDate.toISOString(), week: currentWeek.label }; saveState(state); }

// ========== Summary e Chart ==========
function countForSpecificDate(dateObj){
  // conta apenas checkboxes da coluna do dia (mesmo em modo semana)
  const idx = dateObj.getDay();
  const cls = classMap[idx];
  let total=0, done=0;
  document.querySelectorAll('tbody tr').forEach(tr=>{
    const td = tr.querySelector('td.'+cls);
    if(!td) return;
    const cb = td.querySelector('input[type=checkbox]');
    if (cb){ total++; if (cb.checked) done++; }
  });
  return {total, done};
}

function updateSummary(){
  const {total, done} = countForSpecificDate(selectedDate);
  const pct = total? Math.round(done*100/total) : 0;
  document.getElementById('sumDay').textContent = fmtDayLabel(selectedDate);
  document.getElementById('doneCount').textContent = done;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('pct').textContent = pct + '%';
  const fill = document.getElementById('barFill');
  fill.style.width = pct + '%';
  fill.className = pct>=85 ? 'g' : (pct>=60 ? 'y' : 'r');
}

function updateChart(){
  const weekStart = new Date(currentWeek.start);
  const chart = document.getElementById('chart');
  chart.innerHTML = '';
  for(let i=0;i<7;i++){
    const d = new Date(weekStart.getTime() + i*msPerDay);
    const {total, done} = countForSpecificDate(d);
    const pct = total? Math.round(done*100/total) : 0;
    const col = document.createElement('div'); col.className='col';
    const bar = document.createElement('div'); bar.style.height = Math.max(3, Math.floor(0.8*pct)) + 'px';
    col.title = `${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][i]}: ${pct}% (${done}/${total})`;
    col.appendChild(bar); chart.appendChild(col);
  }
}

// ========== Restore / Reset / Export / Import ==========
function restoreAll(){
  restoreCheckboxes();
  refreshHeader();
  applyWeekHeaders();
  (mode==='dia') ? showOnlyDay(selectedDate) : showAllDays();
  if(mode==='semana') highlightTodayColumn();
  updateSummary(); updateChart();
}
document.getElementById('resetBtn').onclick = ()=>{
  if(confirm('Deseja limpar TODAS as marcações deste ciclo?')){
    state.checks = {}; saveState(state);
    document.querySelectorAll('td.col input[type=checkbox]').forEach(cb => cb.checked = false);
    updateSummary(); updateChart();
  }
};

// ========== PWA ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(()=>{}); });
}
let deferredPrompt=null;
const installBtn=document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt=e; installBtn.style.display='inline-block';
});
installBtn?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt=null; installBtn.style.display='none';
});

// ========== SYNC SUPABASE (Upsert sem erro de duplicidade) ==========
// Estrutura da tabela esperada:
// create table public.daily_state (
//   profile_id text not null,
//   day date not null,
//   state jsonb not null,
//   updated_at timestamptz default now(),
//   primary key (profile_id, day)
// );
const syncStatus = document.getElementById('syncStatus');
function isoToday(){ const d = new Date(); d.setHours(12,0,0,0); return d.toISOString().slice(0,10); }

// Captura TUDO deste app (um namespace só)
function collectAppState(){
  return { ...state }; // suficiente (checks + ui)
}
function applyAppState(s){
  if(!s) return;
  state = s; saveState(state);
  restoreAll();
}

// Botões “Sync ↑/↓” visuais (opcionais)
(function addSyncButtons(){
  const bar=document.createElement('div');
  Object.assign(bar.style,{position:'fixed',top:'10px',right:'10px',zIndex:'9999',display:'flex',gap:'8px'});
  const b1=document.createElement('button'); b1.textContent='Sync ↑'; b1.title='Salvar na nuvem';
  Object.assign(b1.style,{padding:'6px 10px',borderRadius:'8px',border:'1px solid #ccc',background:'#f0f9ff'});
  const b2=document.createElement('button'); b2.textContent='Sync ↓'; b2.title='Baixar da nuvem';
  Object.assign(b2.style,{padding:'6px 10px',borderRadius:'8px',border:'1px solid #ccc',background:'#f6ffed'});
  b1.onclick = syncUp; b2.onclick = syncDown; bar.append(b1,b2); document.body.append(bar);
})();

async function syncUp(){
  try{
    const day = isoToday();
    const payload = { profile_id: PROFILE_ID, day, state: collectAppState(), updated_at: new Date().toISOString() };
    const { error } = await sb.from('daily_state')
      .upsert(payload, { onConflict: 'profile_id,day' });
    if (error) throw error;
    syncStatus.textContent = '✅ Salvo ('+day+')';
  }catch(err){
    syncStatus.textContent = '❌ Sync falhou';
    alert('Falha ao salvar (Sync ↑): ' + (err?.message||err));
  }
}

async function syncDown(){
  try{
    const day = isoToday();
    const { data, error } = await sb.from('daily_state')
      .select('state').eq('profile_id', PROFILE_ID).eq('day', day).maybeSingle();
    if (error) throw error;
    if (!data){ syncStatus.textContent='⚠️ Sem dados '+day; alert('Nenhum dado encontrado para '+day); return; }
    applyAppState(data.state);
    syncStatus.textContent='✅ Carregado ('+day+')';
  }catch(err){
    syncStatus.textContent='❌ Sync falhou';
    alert('Falha ao carregar (Sync ↓): ' + (err?.message||err));
  }
}
// Botão "Sincronizar Agora" (salva ↑ e baixa ↓ em sequência)
document.getElementById('syncNowBtn')?.addEventListener('click', async () => {
  const el = document.getElementById('syncStatus');
  try {
    if (el) el.textContent = '⏳ Sincronizando...';
    await syncUp();    // salva o estado local na nuvem
    await syncDown();  // lê de volta (garante convergência)
    if (el) el.textContent = '✅ Sincronizado';
  } catch (e) {
    if (el) el.textContent = '❌ Erro na sincronização';
  }
});
// ========== Inicialização ==========
(function init(){
  // NOVO: Renderiza as tabelas antes de restaurar o estado
  renderProtocol();
  
  // semana ativa no topo
  document.querySelector(`.week-btn[data-week="${weeks.findIndex(w=>selectedDate>=w.start&&selectedDate<=w.end)+1}"]`)?.classList.add('active');
  restoreAll();
  // modo inicial
  setMode(mode);
})();
