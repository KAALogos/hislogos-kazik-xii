/* HiSLogos / Uczeń — samodzielna aplikacja bez backendu i bibliotek. */
'use strict';
(() => {
  const STORAGE = 'hislogos-xii-v1';
  const $ = s => document.querySelector(s);
  const view = $('#view');
  const total = DATA.exercises.length;
  const defaultState = () => ({version:1,started:new Date().toISOString(),answers:{},theme:'dark'});
  let state;
  try { state = {...defaultState(),...(JSON.parse(localStorage.getItem(STORAGE)) || {})}; } catch { state = defaultState(); }
  if (!state.answers || typeof state.answers !== 'object') state.answers = {};
  let activeModule = 'home', activeIndex = {}, drafts = {}, auditFocus = 20;
  const validModules = new Set(DATA.modules.map(m => m.id));
  const done = a => !!a && (a.status === 'mastered' || a.status === 'recovered');
  const solved = () => DATA.exercises.filter(e => done(state.answers[e.id])).length;
  const reviewCount = () => DATA.exercises.filter(e => state.answers[e.id]?.status === 'review').length;
  function save(){ try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {} }
  function safe(x){ return String(x ?? '').replace(/[&<>"']/g,ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function moduleExercises(id){return DATA.exercises.filter(e=>e.module===id)}
  function progress(id){const qs=moduleExercises(id);return {done:qs.filter(q=>done(state.answers[q.id])).length,total:qs.length}}
  function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast._id);toast._id=setTimeout(()=>el.classList.remove('show'),2300)}
  function scrollTop(){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
  function setTheme(next){state.theme=next;document.documentElement.dataset.theme=next;$('#theme-switch').textContent=next==='dark'?'☼':'◐';$('#theme-switch').title=next==='dark'?'Włącz jasny motyw':'Włącz ciemny motyw';save()}
  setTheme(state.theme === 'light' ? 'light' : 'dark');
  function linkTo(id){window.location.hash=id==='home'?'start':id;const same=(window.location.hash==='#'+(id==='home'?'start':id));if(same && activeModule===id){render();scrollTop()}}
  function pathFromHash(){const h=decodeURIComponent(location.hash.replace(/^#/,''));return validModules.has(h)?h:'home'}
  function mobileClose(){const bar=$('#sidebar');bar.classList.remove('open');$('#mobile-backdrop').classList.remove('active');$('#mobile-backdrop').hidden=true;$('#nav-toggle').setAttribute('aria-expanded','false')}
  function updateChrome(){
    let count=solved(); $('#side-progress-count').textContent=`${count}/${total}`; $('#side-progress-bar').style.width=`${count/total*100}%`;
    const pages=[{id:'home',n:'⌂',label:'Centrum treningowe'},...DATA.modules.map(m=>({id:m.id,n:m.n,label:m.label}))];
    $('#chapter-nav').innerHTML=pages.map(p=>{const n=validModules.has(p.id)?progress(p.id):null;
      return `<button class="nav-item ${activeModule===p.id?'active':''}" data-go="${p.id}" ${activeModule===p.id?'aria-current="page"':''}><span class="nav-index">${p.n}</span><span>${safe(p.label)}</span>${n?`<span class="nav-end">${n.done}/${n.total}</span>`:''}</button>`;
    }).join('');
    $('#crumb-current').textContent=activeModule==='home'?'Centrum treningowe':DATA.modules.find(m=>m.id===activeModule)?.label||'Trening';
  }
  function render(){activeModule=pathFromHash();updateChrome();view.innerHTML=activeModule==='home'?homePage():modulePage(DATA.modules.find(m=>m.id===activeModule));if(activeModule==='home')updateAudit(auditFocus);else renderPractice(activeModule);upgradeImages();mobileClose()}
  function chapterCard(m){const p=progress(m.id);return `<button type="button" class="module-card" data-go="${m.id}"><span class="module-top"><span class="module-number">MODUŁ ${m.n}</span><span class="module-progress">${p.done}/${p.total} zadań</span></span><h3>${safe(m.title)}</h3><p>${safe(m.short)}</p><span class="module-tags"><span class="pill">${m.duration}</span>${m.refs.length?`<span class="pill accent">${m.refs.length} zagadnień z testu</span>`:'<span class="pill accent">Finał</span>'}</span><span class="tiny-progress"><span style="width:${p.total?p.done/p.total*100:0}%"></span></span></button>`}
  function homePage(){
    const uncertain=DATA.observed.uncertain; const wrong=DATA.observed.key.map((x,i)=>DATA.observed.answers[i]!==x?i+1:null).filter(Boolean);
    return `<section class="hero"><div class="hero-inner"><div class="hero-overline">HISTORY LAB / MISJA XII</div><h1 class="display">Nie zgaduj.<br><em>Rozgryź historię.</em></h1><p class="lead">16 znaków zapytania to 16 tropów. Nie uczysz się literek odpowiedzi. Uczysz się rozumieć, dlaczego coś wydarzyło się właśnie tak.</p><p class="hero-copy">Europa XVII–XVIII wieku · materiał oparty na Twoim rozwiązanym arkuszu · nowe zadania z wyjaśnieniami</p><div class="btn-row"><button class="btn btn-primary" data-go="wladza">Zaczynam misję <span aria-hidden="true">↗</span></button><button class="btn btn-ghost" data-action="scroll-dashboard">Zobacz diagnozę ↓</button></div></div></section>
    <section id="dashboard" aria-label="Punkt wyjścia"><div class="section-head"><div><div class="eyebrow">Stan po teście XII</div><h2 class="section-title">Wynik to początek. Nie koniec.</h2><p class="section-sub">Wynik z arkusza ma sens dopiero wtedy, gdy odróżnimy wiedzę od trafnej intuicji i rzeczywiste braki od przypadkowych pomyłek.</p></div></div>
    <div class="metric-grid"><div class="panel metric"><span class="trend">WYNIK TESTU</span><strong>17<span class="metric-small">/25</span></strong><div class="small">68% punktów</div></div><div class="panel metric"><span class="trend">TWOJE PYTAJNIKI</span><strong>16</strong><div class="small">sygnałów niepewności</div></div><div class="panel metric"><span class="trend">TRAFIONE MIMO „?”</span><strong style="color:var(--good)">10</strong><div class="small">wiedza do utrwalenia</div></div><div class="panel metric"><span class="trend">POMYŁKI BEZ „?”</span><strong style="color:var(--bad)">2</strong><div class="small">zadania 5 i 18</div></div></div>
    <div class="panel note-panel"><div class="note-icon">i</div><div><h3>Co znaczy pytajnik?</h3><p>Nie oznacza automatycznie błędu. W zadaniach ${uncertain.join(', ')} sam zaznaczyłeś niepewność. <strong>10 odpowiedzi było dobrych, 6 błędnych</strong>. Pozostałe dwa błędy (5 i 18) nie miały pytajnika. Nie przypisujemy Ci pewności tam, gdzie jej nie oznaczyłeś.</p></div></div></section>
    <section aria-label="Moduły nauki"><div class="section-head"><div><div class="eyebrow">Ścieżka treningowa</div><h2 class="section-title">Sześć etapów. Jeden cel.</h2><p class="section-sub">Najpierw mechanizmy i kontekst, potem ćwiczenia bez powtarzania pytań z arkusza.</p></div></div><div class="module-grid">${DATA.modules.map(chapterCard).join('')}</div></section>
    <section aria-label="Mapa odpowiedzi" id="audit"><div class="audit-head"><div><div class="eyebrow">Mapa pierwotnego testu</div><h2 class="section-title">Wybierz numer zadania</h2></div><span class="pill">25 odpowiedzi</span></div><div class="audit-grid">${DATA.observed.key.map((k,i)=>{const n=i+1,u=uncertain.includes(n),bad=k!==DATA.observed.answers[i];return `<button class="audit-cell ${bad?'is-error':u?'is-uncertain':'is-good'}" data-audit="${n}" title="Zadanie ${n}: ${bad?'błąd':u?'pytajnik, odpowiedź dobra':'odpowiedź dobra, brak pytajnika'}" aria-label="Pokaż zadanie ${n}">${String(n).padStart(2,'0')}</button>`}).join('')}</div><div class="audit-legend"><span><i class="legend-dot gold"></i>Pytajnik i dobra odpowiedź</span><span><i class="legend-dot red"></i>Odpowiedź błędna</span><span><i class="legend-dot" style="background:var(--good)"></i>Dobra bez pytajnika</span></div><div id="audit-info" class="audit-info" aria-live="polite"></div></section>
    <section class="section-head"><div><div class="eyebrow">Poza testem</div><h2 class="section-title">Jak trenować skutecznie?</h2><p class="section-sub">Zanim sprawdzisz odpowiedź, zaznacz, czy ją znasz, czy tylko przypuszczasz. Po błędzie przeczytaj wyjaśnienie i spróbuj jeszcze raz. Postępy zapisują się tylko w tej przeglądarce.</p></div></section><div class="btn-row"><button type="button" class="btn btn-secondary" data-action="export">↧ Pobierz postępy (.json)</button><button type="button" class="btn btn-secondary" data-action="import">↥ Wczytaj postępy</button><button type="button" class="btn btn-secondary" data-go="misja">Przejdź do finału ↗</button><button type="button" class="btn btn-danger" data-action="reset">Wyzeruj ćwiczenia</button></div>
    <div class="section-head"><div><div class="eyebrow">Warsztat historyka</div><h2 class="section-title">Źródła, nie dekoracje</h2></div></div><div class="sources-grid"><div class="source-card"><b>Galeria Zwierciadlana w Wersalu</b><p>Fotografia RyanMcK, 2006; domena publiczna.</p><a href="${safe(DATA.images.wersal.link)}" target="_blank" rel="noopener noreferrer">Oryginał w Wikimedia Commons ↗</a></div><div class="source-card"><b>Europa po pokoju westfalskim</b><p>Rekonstrukcja z atlasu Reginalda Lane’a Poole’a (1896–1902); domena publiczna.</p><a href="${safe(DATA.images.mapa.link)}" target="_blank" rel="noopener noreferrer">Oryginał mapy ↗</a></div><div class="source-card"><b>Koronacja Wilhelma III i Marii II</b><p>Druk ulotny z 1689 r. Houghton Library, Harvard University; domena publiczna.</p><a href="${safe(DATA.images.koronacja.link)}" target="_blank" rel="noopener noreferrer">Zobacz rycinę ↗</a></div><div class="source-card"><b>Bill of Rights (1689)</b><p>Historyczny angielski akt prawny. W ćwiczeniach przywołano krótki fragment w języku polskim.</p><a href="https://www.legislation.gov.uk/aep/WillandMarSess2/1/2" target="_blank" rel="noopener noreferrer">Oryginalny tekst ustawy ↗</a></div></div>`;
  }
  function updateAudit(n){const box=$('#audit-info');if(!box)return;const i=n-1,u=DATA.observed.uncertain.includes(n),bad=DATA.observed.answers[i]!==DATA.observed.key[i];
    const module=DATA.modules.find(m=>m.refs.includes(n));const note=DATA.observed.notes[n]|| (u?'Odpowiedź trafna mimo zgłoszonej niepewności: warto umieć uzasadnić ją bez podpowiedzi.':'Odpowiedź trafna. W skanie nie ma pytajnika — nie oznacza to automatycznie pełnej pewności.');
    box.innerHTML=`<strong>Zadanie ${n}: ${safe(DATA.observed.topics[i])}</strong><p>Uczeń: <b>${DATA.observed.answers[i]}</b> · klucz: <b>${DATA.observed.key[i]}</b> · ${bad?'<span style="color:var(--bad)">błąd</span>':'<span style="color:var(--good)">dobrze</span>'} · ${u?'zaznaczony pytajnik':'bez pytajnika'}. ${safe(note)}</p>${module?`<button class="plain-action" data-go="${module.id}">Przećwicz w module „${safe(module.label)}” →</button>`:''}`;
    document.querySelectorAll('[data-audit]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.audit)===n)));
  }
  function modulePage(m){
    const p=progress(m.id);
    const image=m.image?DATA.images[m.image]:null;
    const visual=image?`<div class="chapter-visual ${m.image==='mapa'?'landscape':m.image==='koronacja'?'archival':''}"><img src="${safe(image.src)}" data-image="${m.image}" alt="${safe(image.alt)}"><button class="visual-open" type="button" data-zoom="${m.image}">＋ Powiększ źródło</button></div><div class="caption-line">${safe(image.caption)} <a href="${safe(image.link)}" target="_blank" rel="noopener noreferrer">Zobacz oryginał ↗</a> · Jeśli nie ma sieci, widoczny jest autentyczny wycinek ze skanu.</div>`:'';
    return `<div class="chapter-intro"><button class="back-link" data-go="home">← Wróć do centrum treningowego</button><div class="eyebrow">MODUŁ ${m.n} / ${m.duration}</div><h1>${safe(m.title)}</h1><p class="subline">${safe(m.intro)}</p><div class="chapter-meta"><span class="pill accent">${p.done}/${p.total} opanowanych</span>${m.refs.length?`<span class="pill">Zadania z arkusza: ${m.refs.join(', ')}</span>`:'<span class="pill">Nowe sytuacje konkursowe</span>'}</div><div class="btn-row" style="margin-top:24px"><button class="btn btn-primary" data-action="to-practice">Przejdź do ćwiczeń ↓</button></div></div>
    ${visual}<div class="lesson-grid">${m.lessons.map((les,j)=>`<article class="panel lesson ${j===m.lessons.length-1&&m.lessons.length%2?'wide':''}"><div class="mini-label">${safe(les.label)}</div><h3>${safe(les.title)}</h3><p>${les.body}</p><details class="lesson-details"><summary>Dlaczego to ważne? ↓</summary><p>${les.more}</p></details></article>`).join('')}</div>
    ${m.special==='ustroje'?`<div class="truth-table"><div class="truth-box"><div class="key">FRANCJA</div><strong>Dwór</strong><p>Kontrola elit przez dostęp do monarchy.</p></div><div class="truth-box"><div class="key">ANGLIA</div><strong>Parlament</strong><p>Ograniczenie królewskiej samowoli.</p></div><div class="truth-box"><div class="key">PRUSY</div><strong>Urzędy + armia</strong><p>Silny aparat państwa i reformy odgórne.</p></div></div>`:''}
    ${m.special==='timeline'?`<div class="timeline">${[['1618','Początek wojny'],['1648','Pokój westfalski'],['1688','Chwalebna rewolucja'],['1689','Bill of Rights'],['1703','Petersburg']].map(t=>`<div class="timepoint"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>`:''}
    ${m.special==='sources'?`<div class="panel note-panel" style="margin-top:17px"><div class="note-icon">§</div><div><h3>Oryginalny sens Bill of Rights, 1689</h3><p>Władza zawieszania ustaw bez zgody parlamentu jest bezprawna. <strong>To reguła prawna.</strong> Nie jest to statystyka poparcia dla monarchy ani dowód, że nikt nigdy jej nie naruszył.</p><p style="margin-top:9px"><a href="https://www.legislation.gov.uk/aep/WillandMarSess2/1/2" target="_blank" rel="noopener noreferrer">Sprawdź historyczny akt prawny ↗</a></p></div></div>`:''}
    <blockquote class="pullquote">${safe(m.quote)}</blockquote><section class="practice" id="practice"><div class="practice-header"><div><div class="eyebrow">Laboratorium / Ćwiczenia</div><h2>Teraz Twoja kolej.</h2><div class="practice-count">Jedno pytanie naraz. Każde ma uzasadnienie.</div></div><span class="pill">${p.total} zadań</span></div><div id="question-container"></div><div class="stepdots" id="question-stepdots"></div></section>`;
  }
  function currentQ(mid){const q=moduleExercises(mid);let idx=activeIndex[mid];if(idx===undefined){idx=Math.max(0,q.findIndex(e=>!done(state.answers[e.id])));activeIndex[mid]=idx<0?0:idx}activeIndex[mid]=Math.max(0,Math.min(idx,q.length-1));return {q:q[activeIndex[mid]],idx:activeIndex[mid],qs:q}}
  function draftOf(id){return drafts[id]||(drafts[id]={choice:null,confidence:null,tf:{},pairs:{},classes:{},order:null,writing:'',reveal:false})}
  function renderPractice(mid){const c=$('#question-container');if(!c)return;const {q,idx,qs}=currentQ(mid);if(!q)return;
    const saved=state.answers[q.id],locked=done(saved),d=draftOf(q.id),status=locked?`<span class="pill accent">✓ Ukończone</span>`:saved?.status==='review'?`<span class="pill" style="color:var(--gold)">Do powtórki</span>`:'';
    let controls='';
    if(q.type==='mcq'){controls=`<div class="options" role="group" aria-label="Możliwe odpowiedzi">${q.options.map((o,i)=>`<button type="button" class="option ${String(d.choice)===String(i)?'selected':''} ${locked&&i===q.answer?'correct':''} ${locked&&Number(d.choice)===i&&i!==q.answer?'incorrect':''}" data-choice="${i}" ${locked?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${safe(o)}</span></button>`).join('')}</div>`}
    if(q.type==='tf'){controls=`<div class="pair-list">${q.statements.map((s,i)=>`<div class="pair-row"><span>${i+1}. ${safe(s)}</span><div class="btn-row">${[['P','Prawda'],['F','Fałsz']].map(([v,label])=>`<button class="btn btn-secondary ${d.tf[i]===v?'chosen':''}" style="${d.tf[i]===v?'border-color:var(--accent);color:var(--accent)':''}" data-tf="${i}:${v}" ${locked?'disabled':''}>${label}</button>`).join('')}</div></div>`).join('')}</div>`}
    if(q.type==='order'){if(!d.order)d.order=q.items.map(x=>x[0]);const byId=Object.fromEntries(q.items);controls=`<div class="order-list" id="order-list">${d.order.map((id,i)=>`<div class="order-item" data-drag-index="${i}" draggable="${!locked}"><span class="order-handle" aria-hidden="true">⠿</span><strong>${safe(byId[id])}</strong><div class="order-actions"><button type="button" data-move="${i}:-1" aria-label="Przesuń w górę" ${i===0||locked?'disabled':''}>↑</button><button type="button" data-move="${i}:1" aria-label="Przesuń w dół" ${i===d.order.length-1||locked?'disabled':''}>↓</button></div></div>`).join('')}</div>`}
    if(q.type==='match'){let labels=q.pairs.map(x=>x[1]);labels=[...labels.slice(2),...labels.slice(0,2)];controls=`<div class="pair-list">${q.pairs.map((p,i)=>`<label class="pair-row"><span>${safe(p[0])}</span><select data-pair="${i}" ${locked?'disabled':''}><option value="">Wybierz dopasowanie…</option>${labels.map(v=>`<option value="${safe(v)}" ${d.pairs[i]===v?'selected':''}>${safe(v)}</option>`).join('')}</select></label>`).join('')}</div>`}
    if(q.type==='classify'){controls=`<div class="classify-list">${q.statements.map(([text],i)=>`<label class="classify-row"><strong>${safe(text)}</strong><select data-classify="${i}" ${locked?'disabled':''}><option value="">Wybierz ocenę…</option>${q.labels.map((v,j)=>`<option value="${j}" ${String(d.classes[i])===String(j)?'selected':''}>${safe(v)}</option>`).join('')}</select></label>`).join('')}</div>`}
    if(q.type==='self'){controls=`<textarea class="answer-text" id="written-answer" placeholder="Spróbuj odpowiedzieć własnymi słowami…" ${locked?'disabled':''}>${safe(d.writing)}</textarea>${d.reveal||locked?`<div class="example-solution"><b>Przykładowe wyjaśnienie</b>${safe(q.model)}</div>`:''}`}
    const know=locked?`<div class="feedback good"><strong>Odpowiedź opanowana${saved?.status==='recovered'?' po powtórce':''}.</strong><p>${safe(saved?.explanation||q.why||q.model)}</p></div>`:saved?.status==='review'&&!d.reset?`<div class="feedback bad"><strong>${q.type==='self'?'Zapisano do powtórki.':'Jeszcze nie. Sprawdź wyjaśnienie.'}</strong><p>${safe(saved.explanation||q.why||q.model)}</p><div class="feedback-action"><button class="btn btn-secondary" data-action="retry">Spróbuję ponownie ↻</button></div></div>`:'';
    const selectionIncomplete=q.type==='self'?false:d.confidence===null;
    const conf=q.type==='self'||locked?'':`<div class="confidence"><span class="confidence-title">Zanim sprawdzisz: na ile jesteś pewien?</span><button type="button" data-confidence="wiem" class="${d.confidence==='wiem'?'selected':''}">Wiem, dlaczego</button><button type="button" data-confidence="niepewny" class="${d.confidence==='niepewny'?'selected':''}">Nie mam pewności</button></div>`;
    const verify=q.type==='self'?(locked?'':d.reveal?`<div class="self-buttons"><button class="btn btn-primary" data-action="self-yes">✓ Potrafię wyjaśnić</button><button class="btn btn-secondary" data-action="self-no">↻ Wrócę do tego</button></div>`:`<div class="submit-row"><span class="microcopy">Twoja odpowiedź nie jest automatycznie oceniana.</span><button class="btn btn-primary" data-action="reveal">Porównaj z przykładem ↗</button></div>`):locked?'':saved?.status==='review'&&!d.reset?'':`<div class="submit-row"><span class="microcopy">${selectionIncomplete?'Najpierw wybierz poziom pewności.':'Sprawdź rozumowanie, nie tylko literę.'}</span><button type="button" class="btn btn-primary" data-action="check" ${selectionIncomplete?'disabled':''}>Sprawdź odpowiedź →</button></div>`;
    c.innerHTML=`<div class="question-card"><div class="question-top"><span class="question-type">${safe(q.level)}</span><span class="question-number">${idx+1} / ${qs.length} &nbsp; ${status}</span></div><h3>${safe(q.q)}</h3>${q.type==='order'?'<p class="prompt-small">Na komputerze możesz też przeciągnąć elementy. Na telefonie użyj strzałek.</p>':''}${controls}${conf}${verify}${know}<div class="question-footer"><button data-action="prev" ${idx===0?'disabled':''}>← Poprzednie</button>${locked&&idx<qs.length-1?`<button class="btn btn-primary" data-action="next">Następne zadanie →</button>`:idx===qs.length-1&&locked?`<button class="btn btn-primary" data-action="finish">${mid==='misja'?'Zobacz wynik misji':'Ukończ moduł'} →</button>`:`<button data-action="next" ${idx===qs.length-1?'disabled':''}>Następne →</button>`}</div></div>`;
    $('#question-stepdots').innerHTML=qs.map((x,j)=>`<button type="button" class="stepdot ${j===idx?'active':''} ${done(state.answers[x.id])?'done':state.answers[x.id]?.status==='review'?'review':''}" data-step="${j}" title="Zadanie ${j+1}" aria-label="Przejdź do zadania ${j+1}"></button>`).join('');
  }
  function checkAnswer(mid){const {q}=currentQ(mid),d=draftOf(q.id);if(!d.confidence)return toast('Zaznacz, czy znasz odpowiedź, czy zgadujesz.');let pass=false,complete=true;
    if(q.type==='mcq'){complete=d.choice!==null;pass=Number(d.choice)===q.answer}
    if(q.type==='tf'){complete=q.statements.every((_,i)=>d.tf[i]);pass=complete&&q.answer.every((v,i)=>d.tf[i]===(v?'P':'F'))}
    if(q.type==='match'){complete=q.pairs.every((_,i)=>!!d.pairs[i]);pass=complete&&q.pairs.every((p,i)=>d.pairs[i]===p[1])}
    if(q.type==='classify'){complete=q.statements.every((_,i)=>d.classes[i]!==undefined);pass=complete&&q.statements.every((p,i)=>Number(d.classes[i])===p[1])}
    if(q.type==='order'){complete=!!d.order;pass=complete&&q.answer.every((id,i)=>d.order[i]===id)}
    if(!complete){toast('Uzupełnij wszystkie części zadania.');return}
    const old=state.answers[q.id]||{},attempts=(old.attempts||0)+1;
    state.answers[q.id]={status:pass?(attempts===1?'mastered':'recovered'):'review',attempts,confidence:d.confidence,explanation:q.why||'',updated:new Date().toISOString(),lastAnswer:q.type==='mcq'?q.options[Number(d.choice)]:q.type==='order'?d.order.join(' → '):q.type==='tf'?Object.values(d.tf).join('/'):q.type==='match'?{...d.pairs}:q.type==='classify'?{...d.classes}:null};
    d.reset=false;save();updateChrome();renderPractice(mid);if(pass)toast(d.confidence==='niepewny'?'Trafione! Teraz utrwal wyjaśnienie.':'Dobrze. Masz uzasadnienie.');
  }
  function selfGrade(mid,passed){const {q}=currentQ(mid),d=draftOf(q.id),old=state.answers[q.id]||{},attempts=(old.attempts||0)+1;
    state.answers[q.id]={status:passed?(attempts===1?'mastered':'recovered'):'review',attempts,confidence:'samoocena',explanation:q.model,written:d.writing.slice(0,3000),updated:new Date().toISOString()}; d.reset=false;save();updateChrome();renderPractice(mid);toast(passed?'Zapisano jako opanowane.':'Dodano do powtórki.');}
  function finish(mid){const m=DATA.modules.find(x=>x.id===mid),p=progress(mid);const area=$('#question-container');if(!area)return;
    const uncertain=moduleExercises(mid).filter(e=>state.answers[e.id]?.confidence==='niepewny').length;
    area.innerHTML=`<div class="final-results"><div class="eyebrow">Podsumowanie modułu</div><h3>${p.done===p.total?'Wszystkie zadania rozwiązane.':'To jeszcze nie koniec ćwiczeń.'}</h3><p>Opanowane: <b>${p.done} z ${p.total}</b>. ${uncertain?`W ${uncertain} odpowiedziach zaznaczyłeś brak pewności — wróć do wyjaśnień, zanim uznasz temat za utrwalony.`:'Dobrze, że oceniałeś poziom pewności w odpowiedziach.'}</p><div class="status-group"><span class="pill accent">✓ ${p.done} opanowanych</span><span class="pill">↻ ${moduleExercises(mid).filter(x=>state.answers[x.id]?.status==='review').length} do powtórki</span></div><div class="btn-row" style="margin-top:22px"><button class="btn btn-primary" data-go="${DATA.modules[DATA.modules.indexOf(m)+1]?.id||'home'}">${mid==='misja'?'Wróć do centrum':'Następny moduł'} →</button><button class="btn btn-secondary" data-action="go-first">Przejrzyj zadania</button></div></div>`;
    $('#question-stepdots').innerHTML='';area.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function upgradeImages(){document.querySelectorAll('img[data-image]').forEach(img=>{const item=DATA.images[img.dataset.image];if(!item?.upgrade||!navigator.onLine)return;const tester=new Image();tester.onload=()=>{if(img.isConnected)img.src=item.upgrade};tester.onerror=()=>{};tester.src=item.upgrade})}
  function moveOrder(q,d,from,to){if(to<0||to>=d.order.length)return;const moved=d.order.splice(from,1)[0];d.order.splice(to,0,moved);renderPractice(activeModule)}
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-go]');if(nav){e.preventDefault();linkTo(nav.dataset.go);return}
    const audit=e.target.closest('[data-audit]');if(audit){auditFocus=Number(audit.dataset.audit);updateAudit(auditFocus);return}
    const zoom=e.target.closest('[data-zoom]');if(zoom){const item=DATA.images[zoom.dataset.zoom],img=$('img[data-image="'+zoom.dataset.zoom+'"]');if(!item||!img)return;$('#dialog-img').src=img.currentSrc||img.src;$('#dialog-img').alt=item.alt;$('#dialog-caption').textContent=item.caption;$('#image-dialog').showModal();return}
    const choice=e.target.closest('[data-choice]');if(choice){const {q}=currentQ(activeModule);draftOf(q.id).choice=Number(choice.dataset.choice);renderPractice(activeModule);return}
    const tf=e.target.closest('[data-tf]');if(tf){const {q}=currentQ(activeModule),[i,v]=tf.dataset.tf.split(':');draftOf(q.id).tf[i]=v;renderPractice(activeModule);return}
    const move=e.target.closest('[data-move]');if(move){const {q}=currentQ(activeModule),d=draftOf(q.id),[i,shift]=move.dataset.move.split(':').map(Number);moveOrder(q,d,i,i+shift);return}
    const conf=e.target.closest('[data-confidence]');if(conf){const {q}=currentQ(activeModule);draftOf(q.id).confidence=conf.dataset.confidence;renderPractice(activeModule);return}
    const step=e.target.closest('[data-step]');if(step){activeIndex[activeModule]=Number(step.dataset.step);renderPractice(activeModule);return}
    const action=e.target.closest('[data-action]');if(!action)return;
    const a=action.dataset.action;
    if(a==='scroll-dashboard'){$('#dashboard')?.scrollIntoView({behavior:'smooth'});return}
    if(a==='to-practice'){$('#practice')?.scrollIntoView({behavior:'smooth',block:'start'});return}
    if(a==='check'){checkAnswer(activeModule);return}
    if(a==='retry'){const {q}=currentQ(activeModule);draftOf(q.id).reset=true;draftOf(q.id).confidence=null;renderPractice(activeModule);return}
    if(a==='reveal'){const {q}=currentQ(activeModule);draftOf(q.id).reveal=true;renderPractice(activeModule);return}
    if(a==='self-yes'||a==='self-no'){selfGrade(activeModule,a==='self-yes');return}
    if(a==='prev'||a==='next'){activeIndex[activeModule]+=(a==='prev'?-1:1);renderPractice(activeModule);$('#practice')?.scrollIntoView({behavior:'smooth'});return}
    if(a==='finish'){finish(activeModule);return}
    if(a==='go-first'){activeIndex[activeModule]=0;renderPractice(activeModule);return}
    if(a==='export'){exportProgress();return}
    if(a==='import'){$('#import-file').click();return}
    if(a==='reset'){if(confirm('Usunąć zapisane rozwiązania i samooceny z TEJ przeglądarki? Wynik oryginalnego arkusza pozostanie bez zmian.')){state.answers={};drafts={};activeIndex={};save();render();toast('Postępy ćwiczeń wyzerowane.')}return}
  });
  document.addEventListener('change',e=>{if(!validModules.has(activeModule))return;const {q}=currentQ(activeModule),d=draftOf(q.id);if(e.target.matches('[data-pair]'))d.pairs[e.target.dataset.pair]=e.target.value;if(e.target.matches('[data-classify]'))d.classes[e.target.dataset.classify]=e.target.value;});
  document.addEventListener('input',e=>{if(e.target.id==='written-answer'&&validModules.has(activeModule)){const {q}=currentQ(activeModule);draftOf(q.id).writing=e.target.value;}});
  let dragging=null;
  document.addEventListener('dragstart',e=>{const row=e.target.closest('[data-drag-index]');if(!row||row.getAttribute('draggable')!=='true')return;dragging=Number(row.dataset.dragIndex);row.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragging))});
  document.addEventListener('dragover',e=>{if(e.target.closest('[data-drag-index]')&&dragging!==null)e.preventDefault()});
  document.addEventListener('drop',e=>{const row=e.target.closest('[data-drag-index]');if(!row||dragging===null)return;e.preventDefault();const index=Number(row.dataset.dragIndex),from=dragging;dragging=null;const {q}=currentQ(activeModule),d=draftOf(q.id);moveOrder(q,d,from,index)});
  document.addEventListener('dragend',()=>{dragging=null;document.querySelectorAll('.dragging').forEach(el=>el.classList.remove('dragging'))});
  $('#nav-toggle').addEventListener('click',()=>{const sb=$('#sidebar'),open=!sb.classList.contains('open');sb.classList.toggle('open',open);$('#mobile-backdrop').classList.toggle('active',open);$('#mobile-backdrop').hidden=!open;$('#nav-toggle').setAttribute('aria-expanded',String(open))});
  $('#mobile-backdrop').addEventListener('click',mobileClose);
  $('#theme-switch').addEventListener('click',()=>{setTheme(state.theme==='dark'?'light':'dark')});
  $('#save-export').addEventListener('click',exportProgress);
  $('#import-file').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      if(f.size>2000000)throw Error('Zbyt duży plik');
      const obj=JSON.parse(await f.text());
      if(obj?.app!=='HiSLogos / Uczeń'||!obj.exercises||typeof obj.exercises!=='object')throw Error('Niepoprawny format pliku');
      const ids=new Set(DATA.exercises.map(q=>q.id));
      const imported=Object.entries(obj.exercises).filter(([id,v])=>ids.has(id)&&v&&['mastered','recovered','review'].includes(v.status));
      if(!imported.length)throw Error('Brak prawidłowych postępów w pliku');
      if(!confirm(`Zaimportować ${imported.length} zapisanych odpowiedzi? Dla tych zadań nadpisze to obecny stan w tej przeglądarce.`))return;
      imported.forEach(([id,v])=>{state.answers[id]=v});
      save();drafts={};activeIndex={};render();toast(`Wczytano ${imported.length} odpowiedzi.`);
    }catch(err){toast('Nie udało się wczytać pliku: '+err.message)}finally{e.target.value=''}
  });
  $('#image-dialog-close').addEventListener('click',()=>$('#image-dialog').close());
  $('#image-dialog').addEventListener('click',e=>{if(e.target.id==='image-dialog')e.target.close()});
  window.addEventListener('hashchange',()=>{render();scrollTop()});
  function exportProgress(){const data={app:'HiSLogos / Uczeń',module:'XII — Europa XVII–XVIII',version:state.version,exported:new Date().toISOString(),originalTest:{score:17,max:25,uncertain:16},exercises:state.answers};const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download='HiSLogos_XII_postepy.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Pobrano postępy.');}
  render();
})();
