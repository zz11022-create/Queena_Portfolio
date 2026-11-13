export const events = {
  paint: {name:'The Color Thief', brief:'Paint three parts of a town postcard. Each color disappears after you use it.', type:'Drawing'},
  shape: {name:'Wrong Shape Olympics', brief:'Build a cat from three unlikely shapes. Pick its body, head and tail.', type:'Drawing'},
  critic: {name:'The Worst Art Critic', brief:'Inspect a mysterious exhibit. Give it an outrageous interpretation and sign your review.', type:'Writing'}
};
const palette=['#ffba66','#e77a7c','#a4bfe7','#a6cd90','#b6a1dd'];
const shapes=['Circle','Triangle','Square'];
export function newEntry(kind) {return {id:crypto.randomUUID(),kind,picks:[],review:'',date:new Date().toISOString()}}
export function eventArt(entry) {
  const {kind,picks}=entry;
  const ink='#482e23';
  let art='';
  if(kind==='paint') {
    const colors=picks.map(i=>palette[i]);
    art=`<rect width="280" height="160" fill="${colors[0]||'#dceafa'}"/><circle cx="220" cy="40" r="20" fill="#ffdf70"/><path d="M0 121Q59 78 129 115T280 95V160H0Z" fill="${colors[1]||'#d9ddc5'}"/><path d="M85 100l45-44 45 44zm11 0h68v42H96z" fill="${colors[2]||'#f8e6d2'}" stroke="${ink}" stroke-width="4"/><path d="M123 142v-24h18v24" fill="#805b49"/>`;
  } else {
    const figure=(i,x,y,r,color)=>i===0?`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`:i===1?`<path d="M${x} ${y-r}l${r} ${r*2}h-${2*r}Z" fill="${color}"/>`:`<rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" rx="4" fill="${color}"/>`;
    const parts=kind==='critic'?[1,0,2]:picks;
    art=`<rect width="280" height="160" fill="#fff0bd"/><g stroke="${ink}" stroke-width="4">${parts.length>2?figure(parts[2],184,99,20,'#b4a2d1'):''}${parts.length?figure(parts[0],146,100,39,'#efb690'):''}${parts.length>1?figure(parts[1],105,69,27,'#91c9c1')+'<path d="m83 51 3-20 15 17m11-1 15-17 1 25" fill="#91c9c1"/><path d="M92 67h4m14 0h4m-17 12q6 7 13-1" fill="none"/>':''}</g>`;
  }
  return `<svg class="event-art" viewBox="0 0 280 160" role="img" aria-label="${events[kind].name} artwork">${art}</svg>`;
}
export function eventPlay(entry,esc,sceneButton){
  const {kind,picks}=entry, event=events[kind];
  const choices=kind==='paint'?['Apricot','Coral','Sky','Sage','Lilac']:shapes;
  const prompt=kind==='paint'?['Color the sky','Color the hills','Color the cottage']:['Choose a body','Choose a head','Choose a tail'];
  const work=kind==='critic'?`<label class="field">What is this exhibit secretly about?<textarea class="input" id="critic-review" maxlength="240" placeholder="The museum calls it a cat. I suspect…">${esc(entry.review)}</textarea></label>`:
    picks.length<3?`<h3>${prompt[picks.length]}</h3><div class="photo-options">${choices.map((c,i)=>kind==='paint'&&picks.includes(i)?'':`<button data-pick="${i}">${c}</button>`).join('')}</div>`:'<p>Your exhibit is ready for its ticket.</p>';
  return `<h2 class="ribbon-title">${event.name}</h2><div class="paper-panel"><p>${event.brief}</p>${eventArt(entry)}${work}</div>${kind==='critic'||picks.length===3?sceneButton('Collect My Ticket','collect-event'):''}`;
}
