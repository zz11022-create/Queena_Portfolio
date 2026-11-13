// Each frame is a window onto the supplied illustrated street.
export const photoScenes = [
  {name:'The mayor', box:[660,157,244,184], ideas:['An election in a box','The mayor takes a nap','A very small town meeting']},
  {name:'Laundry day', box:[771,69,148,112], ideas:['The socks run away','A message on the line','An excellent drying day']},
  {name:'Sunflower', box:[1377,149,82,79], ideas:['Too cool for sunshine','A flower on holiday','Who borrowed my shades?']},
  {name:'The washing line', box:[702,73,204,83], ideas:['Laundry day','The missing sock','A parade of colours']},
  {name:'Street corner', box:[698,72,307,278], ideas:['Just before noon','The whole town waits','A perfectly ordinary Tuesday']}
];
const filters = {Original:'none','B&W':'grayscale(1)',Retro:'sepia(.78) saturate(1.35)','High contrast':'contrast(1.6)',Dreamy:'saturate(.67) contrast(.85) brightness(1.13)'};
export function printPhoto(shot) {
  const subject = photoScenes[shot.subject];
  const [x,y,w,h] = subject.box;
  const zoom = shot.close ? 1.27 : 1;
  const width = w/zoom, height = h/zoom;
  const left = x+(w-width)/2, top=y+(h-height)/2;
  return `<div class="film-image" role="img" aria-label="${subject.name}, ${shot.close?'close':'wide'} framing, ${shot.filter}" style="aspect-ratio:${w}/${h};background-size:${1536/width*100}% ${1024/height*100}%;background-position:${left/(1536-width)*100}% ${top/(1024-height)*100}%;filter:${filters[shot.filter]||'none'}"></div>`;
}
export function photography({data,screen,go,render,backRow,nav,sceneButton,esc,persist,toast}) {
  const draft=data.photoDraft;
  const series=data.photoSeries.find(item=>item.id===data.photoId);
  const selected=series?.shots[series.selected];
  const btn=(action,label,pressed)=>`<button data-photo-action="${action}" ${pressed===undefined?'':`aria-pressed="${pressed}"`}>${esc(label)}</button>`;
  const choices=(action,items,current)=>`<div class="photo-options">${items.map((v,i)=>btn(action+'-'+i,v,current===i)).join('')}</div>`;
  const filmstrip=(item)=>`<div class="filmstrip">${item.shots.map((s,i)=>`<button data-photo-action="shot-${i}" aria-label="Select photo ${i+1}: ${photoScenes[s.subject].name}" aria-pressed="${item.selected===i}">${printPhoto(s)}<span>Print ${i+1}</span></button>`).join('')}</div>`;
  const destinations={'photo-intro':data.photoOrigin||'village','photo-camera':'photo-intro','photo-result':'photo-intro','photo-lab':data.photoLabBack||'house','photo-caption':'photo-lab','photo-reflect':'photo-lab','photo-story':'photo-reflect'};
  function page() {
    const back=backRow(destinations[screen]||'house','Photography');
    const title=t=>`<h2 class="ribbon-title">${t}</h2>`;
    const coach=line=>`<div class="coach-note"><img src="assets/coach.png" alt="Coach Sloth"><p>${line}</p></div>`;
    let body='', footer=nav('house');
    if(screen==='photo-intro'){
      body=title('The Accidental Photographer')+printPhoto({subject:4,filter:'Original'})+coach('A cat in a box. A suspicious sock. Find three ordinary things worth a second look.')+'<p class="scene-copy">About 30 seconds · Choose a view, try a closer crop, and take three shots at your own pace.</p>'+sceneButton(draft?'Resume Photo Hunt':'Start Shooting','photo-start');
      footer=nav('village');
    } else if(screen==='photo-camera' && draft){
      body=title('The unusual photo hunt')+`<p class="scene-copy">Shot ${draft.shots.length+1} of 3 · Choose your framing</p><div class="viewfinder">${printPhoto(draft)}</div>`+choices('view',photoScenes.map(s=>s.name),draft.subject)+choices('zoom',['Wide shot','Close-up'],Number(draft.close));
      footer=`<div class="game-actions">${sceneButton('Take Photo','photo-shutter')}</div>`;
    } else if(series && selected){
      if(screen==='photo-result'){
        body=title('Three shots captured!')+filmstrip(series)+printPhoto(selected)+coach('Three views of one little street. Let’s see what develops.')+sceneButton('Take Them to the Darkroom','photo-lab-open');
      } else if(screen==='photo-lab'){
        body=title('Coach’s Darkroom')+filmstrip(series)+`<figure class="photo-print">${printPhoto(selected)}<figcaption>${esc(selected.title||photoScenes[selected.subject].name)}</figcaption></figure>`+choices('filter',Object.keys(filters),Object.keys(filters).indexOf(selected.filter))+sceneButton('Title & Caption','photo-caption')+sceneButton('Reflect on This Series','photo-reflect',true)+(series.story?sceneButton('Continue Photo Story','photo-story',true):'');
      } else if(screen==='photo-caption'){
        body=title('Give this photo a story')+filmstrip(series)+printPhoto(selected)+`<div class="paper-panel"><label class="field">Photo title<input class="input" data-photo-field="title" maxlength="60" value="${esc(selected.title)}"></label><p>What’s happening here?</p>${choices('idea',photoScenes[selected.subject].ideas,-1)}<label class="field">Caption<textarea data-photo-field="caption" maxlength="160">${esc(selected.caption)}</textarea></label></div>`+sceneButton('Save to My Gallery','photo-reflect');
      } else if(screen==='photo-reflect'){
        const options=['Finding a frame','Trying filters','Imagining a story'];
        body=title('What did you enjoy?')+printPhoto(selected)+choices('enjoy',options,options.indexOf(series.reflection))+sceneButton(series.reflection===options[0]?'Shoot Another Series':series.reflection===options[1]?'Experiment in the Darkroom':'Explore Writing','photo-next')+sceneButton('Keep My Series in Passport','photo-passport',true);
      } else if(screen==='photo-story'){
        body=title('Story Factory')+filmstrip(series)+printPhoto(selected)+`<div class="story-paper"><p class="scene-copy">${esc(selected.caption||selected.title||photoScenes[selected.subject].name)} · What happened after the shutter clicked?</p><label class="field">Your short photo story<textarea data-photo-field="story" maxlength="900">${esc(series.story)}</textarea></label></div>`+sceneButton('Save Story to Passport','photo-passport');
      }
    }
    return {html:back+'<section class="photo-page '+screen+'">'+body+'</section>',footer};
  }
  function action(key) {
    if(key==='photo-start'){data.photoDraft??={subject:0,close:false,filter:'Original',shots:[]};persist();go('photo-camera');return}
    if(key==='photo-shutter' && draft){
      draft.shots.push({subject:draft.subject,close:draft.close,filter:'Original',title:'',caption:''});
      if(draft.shots.length===3){
        const id=crypto.randomUUID();data.photoSeries.push({id,shots:draft.shots,selected:0,reflection:'',story:''});data.photoId=id;data.photoDraft=null;persist();go('photo-result');
      }else{draft.subject=(draft.subject+1)%photoScenes.length;persist();render();toast('Photo captured. Choose your next frame.')}return;
    }
    if(key==='photo-next'){go(series.reflection==='Finding a frame'?'photo-intro':series.reflection==='Trying filters'?'photo-lab':'photo-story');return}
    if(key==='photo-lab-open'){data.photoLabBack='photo-result';go('photo-lab');return}
    const [kind,index]=key.split('-');const i=Number(index);
    if(kind==='view')draft.subject=i;
    else if(kind==='zoom')draft.close=Boolean(i);
    else if(kind==='shot')series.selected=i;
    else if(kind==='filter')selected.filter=Object.keys(filters)[i];
    else if(kind==='idea')selected.caption=photoScenes[selected.subject].ideas[i];
    else if(kind==='enjoy')series.reflection=['Finding a frame','Trying filters','Imagining a story'][i];
    else return;
    persist();render();
  }
  return {page,action};
}
