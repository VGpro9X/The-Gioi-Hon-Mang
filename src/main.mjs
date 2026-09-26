import {CARDS, CARD_POOL, createGame, queueCard, unqueueCard, queuedCost, playCard, finishTurn, chooseReward, getIntent, chooseNode, availableNodes, buyCard, buyPotion, leaveShop, takeRest, chooseEvent, EVENTS, serializeGame, restoreGame, RELICS, buyRelic, upgradableCards, startShopUpgrade, upgradeCard, cancelUpgrade} from "./core.mjs";
import {effectMarkup} from "./effects.mjs";
import {MAP_ROWS,NODE_INFO} from "./journey.mjs";
const app=document.querySelector("#app");
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const icons={
  poison:'<path d="M20 14h24m-19 0v14L12 49a7 7 0 0 0 6 10h28a7 7 0 0 0 6-10L39 28V14M18 43h28M26 50h1m9-2h1"/>',
  clock:'<circle cx="32" cy="32" r="25"/><path d="M32 17v16l11 9M20 8l5 6M44 8l-5 6M32 4v6"/>',
  summon:'<circle cx="32" cy="28" r="13"/><path d="M20 27q-8 7-3 17 5 13 15 15 10-2 15-15 5-10-3-17M26 26h1m10 0h1M27 36q5 4 10 0M13 53l-6 4m44-4 6 4"/>',
  sword:'<path d="M45 7 21 34l-5-5-6 6 9 9 6-6-5-5L49 11zM17 41l-7 9m5-5 5 5"/>',
  shield:'<path d="m32 5 21 8v17c0 14-9 22-21 28-12-6-21-14-21-28V13zM32 15v30M20 30h24"/>',
  bolt:'<path d="M36 5 15 34h16l-3 25 22-33H35z"/>',
  flame:'<path d="M31 5c7 11 0 17 9 25 3-6 3-10 3-14 14 17 11 28 5 36-9 11-28 11-37 0-9-12-1-27 10-37 0 10 3 15 7 18 3-8 1-19 3-28z"/>',
  snow:'<path d="M32 5v54M9 18l46 28M55 18 9 46M23 13l9 9 9-9M23 51l9-9 9 9M9 29l13-3-2-12M55 35l-13 3 2 12M9 35l13 3-2 12M55 29l-13-3 2-12"/>',
  blood:'<path d="M32 5C26 16 13 29 13 40a19 19 0 0 0 38 0C51 29 38 16 32 5zM24 42c0 5 4 9 9 9"/>',
  star:'<path d="m32 5 6 19 21 8-21 7-6 20-7-20-20-7 20-8zM50 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>'
};
const icon=(name,cls="")=>'<svg class="'+cls+'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(icons[name]||icons.star)+"</svg>";
const enemyArt={
 wolf:'<svg viewBox="0 0 230 250" class="actor-svg" aria-hidden="true"><defs><linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7284b0"/><stop offset="1" stop-color="#273455"/></linearGradient></defs><path d="m31 208 23-72 45-20 70 7 30 74-53 23H83z" fill="#253759" stroke="#90a5df" stroke-width="3"/><path d="m55 117 1-80 51 41 39-1 45-42-1 84-28 47-39 28-41-29z" fill="url(#fur)" stroke="#adc5ff" stroke-width="4"/><path d="m56 38 38 47-21 27M190 38l-38 47 21 27" fill="none" stroke="#7287b5" stroke-width="6"/><path d="m83 117 25 7-9 9-19-3M149 124l25-7 3 13-19 3" fill="#f7a7c4" stroke="#ef6d92" stroke-width="3"/><path d="m116 148 17 0-9 10z" fill="#f1e5e8"/><path d="m99 163 25 23 26-23" fill="none" stroke="#dbe3ff" stroke-width="3"/><path d="m50 210-19 31h53M175 213l20 28h-55" fill="#40527a" stroke="#a7b8ef" stroke-width="3"/></svg>',
 knight:'<svg viewBox="0 0 230 250" class="actor-svg" aria-hidden="true"><path d="m40 216 21-103 48-21h19l47 21 19 103z" fill="#2a304c" stroke="#9c87c7" stroke-width="4"/><path d="M69 115 88 60l40-21 38 24 16 54-51 43z" fill="#586283" stroke="#c5abef" stroke-width="4"/><path d="m84 75 37-14 39 14-8 45-32 21-29-21z" fill="#192239" stroke="#a7b2d1" stroke-width="3"/><path d="m90 97 28 5 33-5" stroke="#e786ff" stroke-width="9" stroke-linecap="round"/><path d="m121 25 0 51M54 157l-25 65M178 155l23 67M116 150v81" stroke="#978bad" stroke-width="8"/><path d="m92 146 26 20 28-20-7 80H99z" fill="#3c3f5b" stroke="#9a9ccf" stroke-width="3"/><path d="M195 30v175M181 59h28" stroke="#c7a3fa" stroke-width="7" stroke-linecap="round"/></svg>',
 boss:'<svg viewBox="0 0 230 250" class="actor-svg" aria-hidden="true"><defs><linearGradient id="bossGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ae83ed"/><stop offset="1" stop-color="#3d367c"/></linearGradient></defs><path d="M42 212 65 97 112 72 169 96l22 117-73 19z" fill="#222445" stroke="#bc94ef" stroke-width="4"/><path d="M71 91 47 23l55 30 19-36 20 36 46-29-17 67-34 58H97z" fill="url(#bossGrad)" stroke="#efd1ff" stroke-width="4"/><path d="m84 102 25 8 11-6 13 6 25-8-18 29h-37z" fill="#271c43" stroke="#ed7df9" stroke-width="4"/><circle cx="121" cy="83" r="8" fill="#f1cbff"/><path d="M60 160 15 211m157-51 43 51" stroke="#cdb5ff" stroke-width="9"/><path d="m121 147 20 42-20 48-20-48z" fill="#d19fff" stroke="#fee3ff" stroke-width="3"/><path d="M54 22 24 12m151 11 30-11" stroke="#f0d8ff" stroke-width="5"/></svg>'
};
const heroArt='<svg viewBox="0 0 230 250" class="actor-svg" aria-hidden="true"><defs><linearGradient id="robe" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5c70ab"/><stop offset="1" stop-color="#252943"/></linearGradient></defs><path d="m54 217 15-104 44-25 46 23 20 106z" fill="url(#robe)" stroke="#a0b4f1" stroke-width="4"/><path d="m73 112-26 18-17 89 41-21M166 113l22 18 11 88-40-18" fill="#343e65" stroke="#9cacf1" stroke-width="4"/><path d="m80 92 10-49 26-23 27 19 14 56-22 32H98z" fill="#7982a8" stroke="#c2d6fa" stroke-width="4"/><path d="m91 69 27-13 27 11-7 33-18 14-21-14z" fill="#111c38"/><path d="m99 86 15 4 17-4" stroke="#8fe7ff" stroke-width="5" stroke-linecap="round"/><path d="m114 125 0 93M72 195h96" stroke="#8ba4df" stroke-width="4"/><path d="M186 31 99 189m-14 18 22-26m-31 3 26 26" stroke="#b6ddff" stroke-width="7" stroke-linecap="round"/><path d="m186 31-12 48-19-12z" fill="#92dfff" stroke="#e3f7ff" stroke-width="3"/><path d="m33 215 20-28 26 29M153 217l25-29 24 28" fill="#2a385f" stroke="#a6b4ea" stroke-width="4"/></svg>';
const SAVE_KEY="tghm-v04-save";
const loadSaved=()=>{try{return restoreGame(localStorage.getItem(SAVE_KEY))||restoreGame(localStorage.getItem("tghm-v03-save"))||restoreGame(localStorage.getItem("tghm-v02-save"));}catch{return null;}};
let game=loadSaved()||createGame(),busy=false,showHelp=false,showCollection=false,showLog=false,effectTimer=null,collectionFilter="all";
const persist=()=>{if(busy||game.phase==="animating")return;try{localStorage.setItem(SAVE_KEY,serializeGame(game));}catch{}};
function restart(){if(busy||!window.confirm("Bắt đầu hành trình mới? Tiến trình hiện tại trên thiết bị này sẽ bị thay thế."))return;
  game=createGame();showHelp=false;showCollection=false;showLog=false;render();}

const safe=n=>Math.max(0,Math.round(n));
const ratio=(value,max)=>Math.max(0,Math.min(100,(value/max)*100));
const saveWin=()=>{try{const best=Number(localStorage.getItem("tghm-v01-clears")||0);localStorage.setItem("tghm-v01-clears",String(best+1));}catch{}};
const getWins=()=>{try{return Number(localStorage.getItem("tghm-v01-clears")||0);}catch{return 0;}};
const CARD_FILTERS=[
 {value:"all",label:"Tất cả"},{value:"passive",label:"Thiên Phú"},{value:"reaction",label:"Phản Ứng"},
 ...[...new Set(CARD_POOL.map(id=>CARDS[id].school))].map(school=>({value:school,label:school}))
];
const kindLabel=kind=>kind==="passive"?"THIÊN PHÚ":kind==="reaction"?"PHẢN ỨNG":kind==="summon"?"TRIỆU HỒI":"KỸ NĂNG";
const relicIcon=id=>RELICS[id]?icon(RELICS[id].icon):"";
function relicStrip(){
 return '<div class="relic-strip">'+((game.relics||[]).length?game.relics.map(id=>RELICS[id]?
  '<span class="relic-tag relic-'+RELICS[id].tone+'" title="'+RELICS[id].desc+'">'+relicIcon(id)+
  '<b>'+RELICS[id].name+'</b></span>':'').join(""):'<span class="muted">Chưa có di vật</span>')+'</div>';
}
function cardView(c,compact=false){
  const d=CARDS[c.id],sel=game.selected.includes(c.uid),disabled=game.phase!=="planning"||(!sel&&queuedCost(game)+d.cost>game.energy);
  return '<button class="card skill-'+d.icon+' rarity-'+d.rarity+(sel?' selected':'')+(c.level===1?' upgraded':'')+'" data-card="'+c.uid+'" aria-label="'+d.name+', '+d.cost+' năng lượng, '+d.desc+'" aria-pressed="'+sel+'" '+(disabled?'disabled':'')+'>'+
      '<span class="card-cost">'+d.cost+'</span><div class="card-art">'+icon(d.icon)+'</div>'+
      '<span class="card-school">'+d.school+'</span><strong class="card-name">'+d.name+(c.level===1?' ✦ +1':'')+'</strong>'+
      (!compact?'<span class="card-desc">'+d.desc+(c.level===1?' · Cường hóa: +5 sát thương hoặc Khiên.':'')+'</span>':'')+'<span class="card-state">'+(sel?'ĐÃ CHỌN':kindLabel(d.kind))+'</span></button>';
}
function status(name,n,color){return n?'<span class="status '+color+'">'+name+' <b>'+n+'</b></span>':'';}
function statsBlock(){
 const e=game.enemy,passive=game.passives||{},reactions=game.reactions||{};
 const active=Object.entries(passive).filter(([id,n])=>CARDS[id]&&n>0);
 const armed=Object.entries(reactions).filter(([id,n])=>CARDS[id]&&n>0);
 const badges=entries=>entries.map(([id,n])=>status(CARDS[id].name,n,"power")).join("");
 return '<div class="side-title">TRẠNG THÁI ĐỐI THỦ</div><div class="status-row">'+
  (status("Thiêu Đốt",e.burn,"fire")+status("Lôi Ấn",e.mark,"electric")+status("Băng Giá",e.frost,"ice")+
  status("Xuất Huyết",e.bleed,"blood")+status("Độc",e.poison,"poison")+status("Khiên",e.shield,"plain")||
   '<span class="muted">Chưa có hiệu ứng</span>')+'</div>'+
  '<div class="side-title">NHÂN VẬT</div><div class="status-row">'+
  (status("Kiếm Ý",game.power,"power")+status("Khiên",game.block,"plain")||
   '<span class="muted">Chưa có hiệu ứng</span>')+'</div>'+
  '<div class="side-title">TRIỆU HỒI</div><div class="status-row">'+
  (status("Linh Hồn",game.summons?.wisp,"summon")+status("Thạch Vệ",game.summons?.golem,"summon")||
   '<span class="muted">Chưa triệu hồi</span>')+'</div>'+
  '<div class="side-title">THIÊN PHÚ</div><div class="status-row">'+
  (badges(active)||'<span class="muted">Chưa kích hoạt</span>')+'</div>'+
  '<div class="side-title">PHẢN ỨNG ĐÃ CHUẨN BỊ</div><div class="status-row">'+
  (badges(armed)||'<span class="muted">Chưa chuẩn bị</span>')+'</div>'+
  '<div class="side-title">DI VẬT</div>'+relicStrip()+
  '<div class="side-title combat-log-title">NHẬT KÝ</div><div class="log-list">'+
  game.log.slice(0,5).map((line,i)=>'<p class="'+(i===0?'latest':'')+'">'+line+'</p>').join("")+'</div>';
}
function journeyScreen(){
 const header='<header class="topbar"><div class="brand"><span class="brand-mark">✧</span><div><b>THẺ GIỚI</b><small>HỖN MANG <i>V0.4</i></small></div></div>'+
 '<div class="top-meta"><span class="meta-pill">MÁU <b>'+game.hp+'/'+game.maxHp+'</b></span><span class="meta-pill">VÀNG <b>'+game.gold+'</b></span></div>'+
 '<div class="top-actions"><button class="text-btn" data-action="collection">Bộ thẻ</button><button class="icon-btn" data-action="help" aria-label="Hướng dẫn">?</button></div></header>';
 const title=game.phase==="map"?"Chọn nhánh tiếp theo":game.phase==="shop"?"Thương nhân tinh giới":game.phase==="rest"?"Điểm nghỉ giữa các vì sao":"Sự kiện bí ẩn";
 let body="";
 if(game.phase==="map"){
   const active=availableNodes(game).map(n=>n.id),past=game.route;
   body='<p class="journey-hint">Đi từ dưới lên. Mỗi tầng chỉ có thể chọn điểm cùng cột hoặc cột kế bên vị trí vừa đi. Mỗi lượt chơi có sơ đồ khác nhau.</p><div class="route-map">'+
   MAP_ROWS.map((_,i)=>MAP_ROWS.length-1-i).map(row=>'<div class="route-row"><span class="route-floor">TẦNG '+(row+1)+'</span><div class="route-nodes">'+
     [0,1,2].map(col=>{const n=game.map.find(x=>x.row===row&&x.col===col);
       if(!n)return '<span class="route-empty"></span>';
       const selectable=active.includes(n.id),done=past.includes(n.id);
       return '<button class="route-node route-'+n.kind+(selectable?' is-available':'')+(done?' is-past':'')+'" data-node="'+n.id+'" '+(selectable?'':'disabled')+'>'+
         '<span class="route-symbol">'+NODE_INFO[n.kind].symbol+'</span><strong>'+NODE_INFO[n.kind].name+'</strong><small>'+
         (done?'Đã đi qua':selectable?'CHỌN ĐIỂM NÀY':row<game.route.length?'Nhánh khác':NODE_INFO[n.kind].detail)+'</small></button>';
     }).join('')+'</div></div>').join('<div class="route-link">↑</div>')+'</div>';
 }else if(game.phase==="shop"){
   body='<p class="journey-hint">Vàng giữ lại giữa các tầng. Mỗi lá ở cửa hàng chỉ mua được một lần.</p><div class="journey-items">'+
   game.shopStock.map(item=>{const card=CARDS[item.id];
     return '<div class="journey-item"><div class="journey-item-icon">'+icon(card.icon)+'</div><div><h3>'+card.name+'</h3><p>'+card.desc+'</p><small>'+card.school+' · '+card.rarity+'</small></div>'+
      '<button data-buy="'+item.id+'" '+(item.sold||game.gold<item.price?'disabled':'')+'>'+(item.sold?'ĐÃ MUA':item.price+' vàng')+'</button></div>';
   }).join('')+
   '<div class="journey-item"><div class="journey-item-icon">'+icon("blood")+'</div><div><h3>Thuốc Hồi Phục</h3><p>Hồi tối đa 22 Máu.</p></div>'+
   '<button data-action="potion" '+(game.gold<24||game.hp===game.maxHp?'disabled':'')+'>24 vàng</button></div></div>'+
   '<button class="play-button journey-continue" data-action="leave-shop">RỜI CỬA HÀNG →</button>';
 }else if(game.phase==="rest"){
   body='<p class="journey-hint">Chỉ chọn một hình thức nghỉ ngơi.</p><div class="journey-choice-grid">'+
   '<button class="journey-choice" data-rest="heal"><span class="choice-icon">☘</span><strong>Tĩnh Dưỡng</strong><small>Hồi tối đa 25 Máu.</small></button>'+
   '<button class="journey-choice" data-rest="vitality"><span class="choice-icon">✧</span><strong>Rèn Luyện Thể Phách</strong><small>Tăng 8 Máu tối đa và hồi 8 Máu.</small></button></div>';
 }else{
   const event=EVENTS[game.eventId];
   body='<div class="journey-event"><div class="event-sigil">◈</div><h2>'+event.title+'</h2><p>'+event.desc+'</p></div>'+
     '<div class="journey-choice-grid">'+event.choices.map(choice=>{
       const unavailable=choice.id==="risk"&&(game.eventId==="rift"&&game.hp<=12||game.eventId==="meteor"&&game.hp<=9||game.eventId==="echo"&&game.maxHp<=40);
       return '<button class="journey-choice" data-event="'+choice.id+'" '+(unavailable?'disabled':'')+'><strong>'+choice.text+'</strong>'+
        (unavailable?'<small>Không đủ sinh lực để lựa chọn</small>':'')+'</button>';
     }).join('')+'</div>';
 }
 return '<div class="shell journey-shell">'+header+'<div class="journey-top"><div><span class="eyebrow">HÀNH TRÌNH TINH GIỚI</span><h1>'+title+'</h1><p class="muted">'+game.lastMessage+'</p></div>'+
   '<button class="ghost-btn" data-action="restart">Chơi mới</button></div>'+body+
   '<div class="journey-bottom"><span>✦ Tiến trình tự động lưu trên trình duyệt này.</span><span>Đã đi '+game.route.length+' / 6 tầng</span></div></div>'+
   (showHelp||showCollection||showLog?overlay():'');
}

function render(){
  if(["map","shop","rest","event"].includes(game.phase)){app.innerHTML=journeyScreen();persist();return;}
  const oldScroll=app.querySelector(".hand-scroll")?.scrollLeft||0;
  const e=game.enemy,intent=getIntent(game),cost=queuedCost(game),queue=game.selected.map(uid=>game.hand.find(x=>x.uid===uid)).filter(Boolean);
  app.innerHTML='<div class="shell">'+
    '<header class="topbar"><div class="brand"><span class="brand-mark">✧</span><div><b>THẺ GIỚI</b><small>HỖN MANG <i>V0.4</i></small></div></div>'+
    '<div class="top-meta"><span class="meta-pill">ẢI <b>'+game.stage+' / '+game.totalStages+'</b></span><span class="meta-pill">LƯỢT <b>'+game.turn+'</b></span><span class="meta-pill">VÀNG <b>'+game.gold+'</b></span><span class="meta-pill desktop-only">HOÀN THÀNH <b>'+getWins()+'</b></span></div>'+
    '<div class="top-actions"><button class="icon-btn" data-action="help" aria-label="Hướng dẫn">?</button><button class="text-btn" data-action="collection">Bộ thẻ</button></div></header>'+
    '<div class="game-layout"><section class="main-column"><div class="arena">'+
    '<div class="arena-heading"><span class="arena-kicker">✦ VỰC SAO HỖN MANG ✦</span><span class="arena-message">'+game.lastMessage+'</span></div>'+
    '<div class="fighters"><div class="fighter player"><div class="fighter-label">LỮ KHÁCH TINH GIỚI</div><div class="actor-wrap"><div class="actor-glow"></div>'+heroArt+'</div>'+
    '<div class="bar-label"><b>SINH MỆNH</b><strong>'+safe(game.hp)+' / '+game.maxHp+'</strong></div><div class="healthbar"><i style="width:'+ratio(game.hp,game.maxHp)+'%"></i></div>'+
    '<div class="minor-stat">KHIÊN <b>'+game.block+'</b> · KIẾM Ý <b>'+game.power+'</b></div></div>'+
    '<div class="versus" aria-hidden="true"><span>VS</span><div class="versus-line"></div></div>'+
    '<div class="fighter enemy"><div class="fighter-label">'+e.name.toUpperCase()+'</div><div class="actor-wrap enemy-actor '+e.className+'"><div class="actor-glow"></div>'+enemyArt[e.className]+'</div>'+
    '<div class="bar-label"><b>SINH MỆNH</b><strong>'+safe(e.hp)+' / '+e.maxHp+'</strong></div><div class="healthbar enemy-health"><i style="width:'+ratio(e.hp,e.maxHp)+'%"></i></div>'+
    '<div class="minor-stat">'+(e.shield?'KHIÊN '+e.shield+' · ':'')+e.subtitle+'</div></div></div>'+
    '<div class="intent"><span>DỰ ĐỊNH CỦA ĐỊCH</span><strong>'+intent.label+'</strong><em>'+intent.hint+'</em></div>'+
    '<div id="effect-layer" class="effect-layer" aria-hidden="true"></div></div>'+
    '<div class="command"><div class="command-head"><div><span class="eyebrow">CHUỖI THI TRIỂN</span><h2>Chọn bài theo thứ tự</h2></div>'+
    '<div class="energy"><span>NĂNG LƯỢNG</span><div class="energy-orbs">'+Array.from({length:game.maxEnergy},(_,i)=>'<i class="'+(i<game.energy-cost?'full':'')+'"></i>').join('')+'</div><b>'+(game.energy-cost)+' / '+game.maxEnergy+'</b></div></div>'+
    '<div class="queue">'+(queue.length?queue.map((c,i)=>'<button class="queued" data-unqueue="'+c.uid+'" title="Bỏ '+CARDS[c.id].name+'" '+(busy?'disabled':'')+'><b>'+(i+1)+'</b>'+icon(CARDS[c.id].icon)+'<span>'+CARDS[c.id].name+'</span><small>×</small></button>').join(''):'<span class="queue-placeholder">Chạm vào thẻ bên dưới để lập combo. Chạm thẻ đã chọn để bỏ chọn.</span>')+'</div>'+
    '<div class="command-bottom"><span class="muted">'+(queue.length?'Đã chọn '+queue.length+' thẻ • Tốn '+cost+' năng lượng':'Bạn có thể kết thúc lượt mà không dùng bài.')+'</span>'+
    '<button class="play-button" data-action="play" '+(busy||!["planning"].includes(game.phase)?'disabled':'')+'>'+ (queue.length?'THI TRIỂN':'KẾT THÚC LƯỢT')+'<span>→</span></button></div></div>'+
    '<section class="hand-panel"><div class="hand-head"><div><span class="eyebrow">BỘ BÀI TRÊN TAY</span><h2>Chọn kỹ năng</h2></div><div class="pile-info"><span>BỘ BÀI <b>'+game.draw.length+'</b></span><span>BÀI BỎ <b>'+game.discard.length+'</b></span></div></div>'+
    '<div class="hand-scroll">'+game.hand.map(c=>cardView(c)).join('')+'</div><p class="mobile-hint">Vuốt ngang để xem hết bài. Nhấn một lá bài để thêm hoặc bỏ khỏi chuỗi.</p></section></section>'+
    '<aside class="sidebar">'+statsBlock()+'<div class="sidebar-footer"><button class="ghost-btn" data-action="log">Xem toàn bộ nhật ký</button><button class="ghost-btn" data-action="restart">Chơi lại</button></div></aside></div>'+
    '<footer class="footer">THẺ GIỚI: HỖN MANG · V0.4 · TỰ ĐỘNG LƯU TRÊN TRÌNH DUYỆT</footer>'+
    '</div>'+overlay();
  persist();
  const scroll=app.querySelector(".hand-scroll");if(scroll)scroll.scrollLeft=oldScroll;
}
function choiceCard(id){
  const d=CARDS[id];
  return '<button class="reward-card rarity-'+d.rarity+' skill-'+d.icon+'" data-reward="'+id+'"><div class="reward-art">'+icon(d.icon)+'</div><span>'+d.school+' · '+d.rarity+' · '+kindLabel(d.kind)+'</span><h3>'+d.name+'</h3><p>'+d.desc+'</p><strong>NHẬN THẺ →</strong></button>';
}
function overlay(){
 if(showHelp)return '<div class="modal-wrap"><div class="modal-backdrop" data-action="close"></div><section class="modal help"><button class="modal-close" data-action="close">×</button><span class="eyebrow">HƯỚNG DẪN</span><h2>Ghép thẻ, tạo chuỗi, giải phóng kỹ năng</h2><p>Chọn các lá bài từ trái sang phải trong giới hạn 3 Năng Lượng. Nhấn <b>Thi Triển</b> để nhân vật tự sử dụng từng chiêu và kẻ địch hành động cuối lượt.</p><p><b>Kết hợp:</b> Lôi Kiếm đặt Lôi Ấn để Lôi Bạo khuếch đại sát thương. Băng Trảm đặt Băng Giá để Băng Toái kích nổ. Hỏa Cầu kết hợp Bộc Viêm; Huyết Nhận kết hợp Huyết Tế.</p><p><b>Hệ mới:</b> Độc gây sát thương cuối lượt; Linh Hồn tấn công và Thạch Vệ che chắn mỗi lượt. Thiên Phú tồn tại trong trận (tối đa 2 tầng); Phản Ứng kích hoạt một lần khi địch tấn công, không tiêu hao nếu địch dựng Khiên. Gia Tốc, Hồi Tố và Thời Bộ có thể cho phép chọn thêm bài trong cùng lượt sau chuỗi đầu tiên.</p><p><b>Hành trình:</b> Bản đồ 6 tầng, cửa hàng, sự kiện, Boss. Tiến trình V0.2 tự nâng cấp khi mở V0.4.</p><button class="play-button" data-action="close">ĐÃ HIỂU →</button></section></div>';
 if(showCollection){
   const filtered=CARD_POOL.filter(id=>collectionFilter==="all"||
     CARDS[id].kind===collectionFilter||CARDS[id].school===collectionFilter);
   return '<div class="modal-wrap"><div class="modal-backdrop" data-action="close"></div><section class="modal collection">'+
     '<button class="modal-close" data-action="close">×</button><span class="eyebrow">'+CARD_POOL.length+
     ' KỸ NĂNG</span><h2>Thư viện thẻ V0.4</h2>'+
     '<p class="muted">30 thẻ mới thuộc Độc, Thời Không, Triệu Hồi, Hỗn Mang, Thiên Phú và Phản Ứng. Chọn nhóm để tìm thẻ phù hợp.</p>'+
     '<div class="library-filters">'+CARD_FILTERS.map(f=>'<button class="'+(collectionFilter===f.value?'active':'')+
       '" data-filter="'+f.value+'">'+f.label+'</button>').join('')+'</div>'+
     '<div class="library-count">Đang hiển thị '+filtered.length+' / '+CARD_POOL.length+' thẻ</div>'+
     '<div class="library-grid">'+filtered.map(id=>{const d=CARDS[id];return '<div class="library-item skill-'+d.icon+'">'+
      icon(d.icon)+'<div><b>'+d.name+'</b><small>'+d.school+' · '+kindLabel(d.kind)+' · '+d.cost+
      ' năng lượng</small><p>'+d.desc+'</p></div></div>';}).join('')+'</div></section></div>';
 }
 if(showLog)return '<div class="modal-wrap"><div class="modal-backdrop" data-action="close"></div><section class="modal help"><button class="modal-close" data-action="close">×</button><span class="eyebrow">CHIẾN BÁO</span><h2>Nhật ký chiến đấu</h2><div class="full-log">'+game.log.map(s=>'<p>'+s+'</p>').join('')+'</div></section></div>';
 if(game.phase==="reward")return '<div class="modal-wrap"><div class="modal-backdrop lock"></div><section class="modal reward"><span class="eyebrow">CHÚC MỪNG CHIẾN THẮNG</span><h2>Chọn một kỹ năng</h2><p>Hồi một ít Máu và trở về bản đồ sau khi chọn một thẻ thưởng.</p><div class="reward-grid">'+game.reward.map(choiceCard).join('')+'</div></section></div>';
 if(game.phase==="won"||game.phase==="lost")return '<div class="modal-wrap"><div class="modal-backdrop lock"></div><section class="modal finish">'+icon(game.phase==="won"?"star":"shield","end-icon")+'<span class="eyebrow">'+(game.phase==="won"?"HÀNH TRÌNH HOÀN THÀNH":"HÀNH TRÌNH KẾT THÚC")+'</span><h2>'+(game.phase==="won"?"Tinh giới đã được giải phóng":"Hẹn gặp lại tại Tinh Giới")+'</h2><p>'+(game.phase==="won"?"Bạn đã vượt 6 tầng và đánh bại Thủ Vệ Tinh Giới.":"Bạn đã đi tới ải "+game.stage+". Hãy thử một bộ bài và chuỗi kỹ năng mới.")+'</p><div class="finish-stats"><span>ẢI <b>'+game.stage+' / 6</b></span><span>LƯỢT <b>'+game.stats.turns+'</b></span><span>SÁT THƯƠNG <b>'+game.stats.damage+'</b></span><span>THẺ ĐÃ DÙNG <b>'+game.stats.played+'</b></span></div><button class="play-button" data-action="restart">BẮT ĐẦU LƯỢT MỚI →</button></section></div>';
 return '';
}
function fx(card){
  const layer=app.querySelector("#effect-layer");if(!layer)return;
  const type=card?.icon||"sword",name=card?.name||"HIT";
  layer.innerHTML='<div class="fx fx-'+type+'">'+icon(type)+'<span>'+name+'</span></div>';
  layer.classList.add("active");clearTimeout(effectTimer);
  effectTimer=setTimeout(()=>{layer.classList.remove("active");layer.innerHTML="";},540);
}
async function run(){
  if(busy || game.phase!=="planning")return;
  busy=true;const chosen=[...game.selected];game.phase="animating";render();
  for(const uid of chosen){
    const c=game.hand.find(x=>x.uid===uid);
    if(!c)continue;
    fx(CARDS[c.id]);await wait(310);playCard(game,uid);render();await wait(370);
    if(game.phase!=="animating")break;
  }
  if(game.phase==="animating"&&game.extraPlanning){
    const canContinue=game.hand.some(c=>CARDS[c.id].cost<=game.energy);
    game.extraPlanning=false;
    if(canContinue){
      game.phase="planning";game.selected=[];
      game.lastMessage="Rút / hoàn lại thẻ thành công. Bạn có thể lập thêm một chuỗi trong cùng lượt.";
      game.log.unshift(game.lastMessage);game.log.length=Math.min(game.log.length,20);
      busy=false;render();return;
    }
  }
  if(game.phase==="animating"){
    await wait(240);finishTurn(game);render();
    const event=game.lastEvent;
    if(event?.kind==="enemy") {const hero=app.querySelector(".player .actor-wrap");if(hero){hero.classList.add("hurt");setTimeout(()=>hero.classList.remove("hurt"),440);}}
  }
  if(game.phase==="won")saveWin();
  busy=false;render();
}
app.addEventListener("click",event=>{
  const b=event.target.closest("button,[data-action]");
  if(!b)return;
  const uid=b.getAttribute("data-card");
  if(uid!==null){const id=Number(uid);if(game.selected.includes(id))unqueueCard(game,id);else queueCard(game,id);render();return;}
  const unqueue=b.getAttribute("data-unqueue");if(unqueue!==null){unqueueCard(game,Number(unqueue));render();return;}
  const filter=b.getAttribute("data-filter");if(filter!==null){if(CARD_FILTERS.some(f=>f.value===filter)){collectionFilter=filter;render();}return;}
  const reward=b.getAttribute("data-reward");if(reward){if(chooseReward(game,reward))render();return;}
  const node=b.getAttribute("data-node");if(node!==null){if(chooseNode(game,node))render();return;}
  const buy=b.getAttribute("data-buy");if(buy!==null){if(buyCard(game,buy))render();return;}
  const rest=b.getAttribute("data-rest");if(rest!==null){if(takeRest(game,rest))render();return;}
  const eventChoice=b.getAttribute("data-event");if(eventChoice!==null){if(chooseEvent(game,eventChoice))render();return;}
  switch(b.dataset.action){
    case "play":run();break;
    case "restart":restart();break;
    case "potion":if(buyPotion(game))render();break;
    case "leave-shop":if(leaveShop(game))render();break;
    case "help":showHelp=true;render();break;
    case "collection":collectionFilter="all";showCollection=true;render();break;
    case "log":showLog=true;render();break;
    case "close":showHelp=false;showCollection=false;showLog=false;render();break;
  }
});
window.addEventListener("keydown",event=>{if(event.key==="Escape"&&(showHelp||showCollection||showLog)){showHelp=false;showCollection=false;showLog=false;render();}});
render();
