// Thẻ Giới: Hỗn Mang — V0.3. Combat and journey rules.
import {EXTRA_CARDS} from './expansion.mjs';
import {MAP_ROWS,generateMap,availableNodes,mapIsValid} from "./journey.mjs";
export {NODE_INFO,availableNodes} from "./journey.mjs";
export const CARDS = {
  blade:   {name:"Kiếm Kích",cost:1,school:"Kiếm Đạo",kind:"attack",rarity:"common",desc:"Gây 9 sát thương.",icon:"sword"},
  guard:   {name:"Hộ Thể",cost:1,school:"Phòng Ngự",kind:"guard",rarity:"common",desc:"Nhận 10 Khiên.",icon:"shield"},
  twin:    {name:"Song Kiếm",cost:1,school:"Kiếm Đạo",kind:"attack",rarity:"common",desc:"Tấn công 2 lần, mỗi lần 5 sát thương.",icon:"sword"},
  spark:   {name:"Lôi Kiếm",cost:1,school:"Lôi",kind:"magic",rarity:"common",desc:"Gây 6 sát thương và đặt 2 Lôi Ấn.",icon:"bolt"},
  ember:   {name:"Hỏa Cầu",cost:1,school:"Hỏa",kind:"magic",rarity:"common",desc:"Gây 6 sát thương, thêm 2 Thiêu Đốt.",icon:"flame"},
  frost:   {name:"Băng Trảm",cost:1,school:"Băng",kind:"magic",rarity:"common",desc:"Gây 6 sát thương, thêm 2 Băng Giá.",icon:"snow"},
  bleed:   {name:"Huyết Nhận",cost:1,school:"Huyết",kind:"attack",rarity:"common",desc:"Gây 6 sát thương, thêm 2 Xuất Huyết.",icon:"blood"},
  leech:   {name:"Hút Sinh Mệnh",cost:1,school:"Huyết",kind:"magic",rarity:"uncommon",desc:"Gây 5 sát thương và hồi 5 Máu.",icon:"blood"},
  shatter: {name:"Băng Toái",cost:2,school:"Băng",kind:"magic",rarity:"uncommon",desc:"Gây 11 sát thương; +5 cho mỗi Băng Giá, xóa Băng Giá.",icon:"snow"},
  surge:   {name:"Tụ Khí",cost:0,school:"Nội Công",kind:"power",rarity:"common",desc:"Nhận 5 Khiên và 1 Kiếm Ý (tăng 2 sát thương đòn đánh).",icon:"star"},
  chain:   {name:"Lôi Bạo",cost:2,school:"Lôi",kind:"magic",rarity:"uncommon",desc:"Gây 12 sát thương; +5 cho mỗi Lôi Ấn, tiêu hao Lôi Ấn.",icon:"bolt"},
  ignite:  {name:"Bộc Viêm",cost:2,school:"Hỏa",kind:"magic",rarity:"uncommon",desc:"Gây 10 sát thương; kích nổ Thiêu Đốt (+5 mỗi tầng).",icon:"flame"},
  reap:    {name:"Huyết Tế",cost:2,school:"Huyết",kind:"attack",rarity:"uncommon",desc:"Gây 10 sát thương; +4 mỗi Xuất Huyết và hồi 4 Máu.",icon:"blood"},
  bulwark: {name:"Thiết Bích",cost:2,school:"Phòng Ngự",kind:"guard",rarity:"uncommon",desc:"Nhận 22 Khiên và 1 Kiếm Ý.",icon:"shield"},
  storm:   {name:"Thiên Lôi",cost:3,school:"Lôi",kind:"magic",rarity:"rare",desc:"Gây 22 sát thương và đặt 3 Lôi Ấn.",icon:"bolt"},
  meteor:  {name:"Thiên Thạch",cost:3,school:"Hỏa",kind:"magic",rarity:"rare",desc:"Gây 25 sát thương, thêm 4 Thiêu Đốt.",icon:"flame"},
  glacier: {name:"Băng Phong",cost:2,school:"Băng",kind:"magic",rarity:"rare",desc:"Gây 8 sát thương, thêm 4 Băng Giá và nhận 8 Khiên.",icon:"snow"},
  phoenix: {name:"Phượng Huyết",cost:2,school:"Huyết",kind:"power",rarity:"rare",desc:"Hồi 12 Máu, nhận 10 Khiên và đặt 2 Xuất Huyết.",icon:"blood"},
  cosmos:  {name:"Tinh Vân Kiếm",cost:3,school:"Hỗn Mang",kind:"attack",rarity:"rare",desc:"Chém 3 lần, mỗi lần 10 sát thương. Mỗi Kiếm Ý tăng 2 sát thương.",icon:"star"},
  riposte: {name:"Phản Chấn",cost:1,school:"Phòng Ngự",kind:"guard",rarity:"uncommon",desc:"Nhận 8 Khiên, gây sát thương bằng nửa số Khiên đang có.",icon:"shield"},
  ...EXTRA_CARDS
};
export const CARD_POOL = Object.keys(CARDS);
const START_DECK = ["blade","blade","guard","guard","twin","spark","ember","frost","bleed","surge","leech","shatter"];
const BONUS_POOL = CARD_POOL.filter(id => !START_DECK.includes(id));
const ENEMIES = [
  {name:"Ảnh Lang",subtitle:"Tinh thú từ vùng rìa tinh vân",hp:66,attack:9,defend:12,className:"wolf"},
  {name:"Kỵ Sĩ Vực Sâu",subtitle:"Kẻ canh giữ khe nứt hỗn mang",hp:96,attack:12,defend:16,className:"knight"},
  {name:"Tinh Giới Thủ Vệ",subtitle:"BOSS • Ý chí của vùng sao chết",hp:135,attack:15,defend:19,className:"boss"}
];
let nextUid=1;
const clone = x => JSON.parse(JSON.stringify(x));
const makeCard = id => ({id,uid:nextUid++});
const shuffled = arr => {const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const msg = (g,s) => {g.log.unshift(s); g.log.length=Math.min(g.log.length,20); g.lastMessage=s;};
export function getIntent(g) {
  const cycle = (g.turn-1)%4, e=g.enemy;
  if(cycle===1) return {kind:"shield",value:e.defend,label:"Dựng kết giới",hint:"Nhận "+e.defend+" Khiên"};
  if(cycle===3) return {kind:"heavy",value:e.attack+8,label:"Tuyệt kỹ",hint:"Gây "+(e.attack+8)+" sát thương"};
  return {kind:"attack",value:e.attack+(cycle===2?3:0),label:cycle===2?"Cuồng kích":"Tấn công",hint:"Gây "+(e.attack+(cycle===2?3:0))+" sát thương"};
}
function draw(g,n) {
  while(n-->0) {
    if(!g.draw.length) {
      if(!g.discard.length) break;
      g.draw=shuffled(g.discard);
      g.discard=[];
      msg(g,"Bộ bài được xáo trộn.");
    }
    g.hand.push(g.draw.pop());
  }
}
const enemyTemplate=(stage,kind="battle")=>{
 const base=kind==="boss"?ENEMIES[2]:kind==="elite"?ENEMIES[1]:ENEMIES[stage%2===0?1:0];
 const hp=base.hp+(stage-1)*7+(kind==="boss"?40:kind==="elite"?18:0);
 return {...clone(base),name:kind==="elite"?"Tinh Anh: "+base.name:base.name,
   hp,maxHp:hp,poison:0,attack:base.attack+Math.floor((stage-1)*1.5)+(kind==="elite"?2:0),
   defend:base.defend+stage-1,shield:0,burn:0,bleed:0,frost:0,mark:0};
};
export function createGame(){
 const additions=shuffled(BONUS_POOL).slice(0,2);
 const g={
  version:"0.3.0",stage:0,totalStages:MAP_ROWS.length,turn:1,maxHp:90,hp:90,block:0,
  energy:3,maxEnergy:3,power:0,gold:35,route:[],position:1,map:generateMap(),
  summons:{wisp:0,golem:0},passives:{},reactions:{},lastOffensive:null,lastSwordTurn:0,
  currentNode:null,shopStock:[],eventId:null,phase:"map",enemy:enemyTemplate(1),
  draw:shuffled([...START_DECK,...additions].map(makeCard)),discard:[],hand:[],selected:[],
  reward:[],log:[],lastMessage:"",stats:{damage:0,played:0,turns:0},lastEvent:null
 };
 msg(g,"Hành trình bắt đầu. Chọn điểm đến đầu tiên.");return g;
}

export function queueCard(g,uid){
  if(g.phase!=="planning" || g.selected.includes(uid))return false;
  const c=g.hand.find(x=>x.uid===uid);
  if(!c)return false;
  const spent=g.selected.reduce((s,id)=>s+CARDS[g.hand.find(x=>x.uid===id)?.id]?.cost,0);
  if(spent+CARDS[c.id].cost>g.energy)return false;
  g.selected.push(uid);return true;
}
export function unqueueCard(g,uid){
  if(g.phase!=="planning")return false;
  const index=g.selected.indexOf(uid);
  if(index<0)return false;
  g.selected.splice(index,1);return true;
}
export function queuedCost(g){return g.selected.reduce((s,uid)=>s+(CARDS[g.hand.find(c=>c.uid===uid)?.id]?.cost||0),0);}
const attack = (g,amount,note) => {
  if(g.enemy.hp<=0)return 0;
  const shieldUsed=Math.min(g.enemy.shield,Math.max(0,amount));
  g.enemy.shield-=shieldUsed;
  const dealt=Math.min(g.enemy.hp,Math.max(0,amount-shieldUsed));
  g.enemy.hp-=dealt;
  g.stats.damage+=dealt;
  msg(g,note+": "+(dealt?dealt+" sát thương":"bị chặn")+(shieldUsed?" ("+shieldUsed+" Khiên)":""));
  g.lastEvent={kind:"hit",amount:dealt,school:note};
  return dealt;
};
const hit = (g,base,note,boost=true) => attack(g,base+(boost?g.power*2:0),note);
const heal = (g,n) => {const restored=Math.min(g.maxHp-g.hp,n);g.hp+=restored; if(restored)msg(g,"Hồi phục "+restored+" Máu.");};
const block = (g,n) => {g.block+=n;msg(g,"Nhận "+n+" Khiên.");g.lastEvent={kind:"shield",amount:n};};
const addStatus=(g,kind,amount)=>{g.enemy[kind]=Math.min(99,(g.enemy[kind]||0)+amount);};
const summonCount=g=>g.summons.wisp+g.summons.golem;
const gainPassive=(g,id)=>{
 const current=g.passives[id]||0;
 if(current<2){g.passives[id]=current+1;msg(g,CARDS[id].name+" kích hoạt (tầng "+(current+1)+"/2).");}
 else{block(g,6);msg(g,CARDS[id].name+" đã tối đa, chuyển thành 6 Khiên.");}
};
const readyReaction=(g,id)=>{
 g.reactions[id]=Math.min(2,(g.reactions[id]||0)+1);
 msg(g,CARDS[id].name+" sẵn sàng ("+g.reactions[id]+").");
};

export function playCard(g,uid){
  if(g.phase!=="animating" && g.phase!=="planning")return false;
  const at=g.hand.findIndex(x=>x.uid===uid);
  if(at<0 || !g.selected.includes(uid))return false;
  const c=g.hand[at], info=CARDS[c.id];
  if(info.cost>g.energy)return false;
  g.hand.splice(at,1);
  g.selected.splice(g.selected.indexOf(uid),1);
  g.energy-=info.cost;g.discard.push(c);g.stats.played++;
  msg(g,"Thi triển "+info.name+".");
  g.lastEvent={kind:info.kind,school:info.school};
  const e=g.enemy;
  if(info.school==="Kiếm Đạo"&&info.kind==="attack"&&g.passives.swordmaster&&g.lastSwordTurn!==g.turn){
    g.power+=g.passives.swordmaster;g.lastSwordTurn=g.turn;
    msg(g,"Kiếm Tâm: +"+g.passives.swordmaster+" Kiếm Ý.");
  }
  switch(c.id){
    case "blade":hit(g,9,info.name);break;
    case "guard":block(g,10);break;
    case "twin":hit(g,5,info.name);hit(g,5,info.name);break;
    case "spark":hit(g,6,info.name);e.mark+=2;msg(g,"Đặt 2 Lôi Ấn.");break;
    case "ember":hit(g,6,info.name);e.burn+=2;msg(g,"Đặt 2 Thiêu Đốt.");break;
    case "frost":hit(g,6,info.name);e.frost+=2;msg(g,"Đặt 2 Băng Giá.");break;
    case "bleed":hit(g,6,info.name);e.bleed+=2;msg(g,"Đặt 2 Xuất Huyết.");break;
    case "leech":hit(g,5,info.name);heal(g,5);break;
    case "shatter":hit(g,11+e.frost*5,info.name);e.frost=0;break;
    case "surge":block(g,5);g.power++;msg(g,"Kiếm Ý +1.");break;
    case "chain":hit(g,12+e.mark*5,info.name);e.mark=0;break;
    case "ignite":hit(g,10+e.burn*5,info.name);e.burn=0;break;
    case "reap":hit(g,10+e.bleed*4,info.name);heal(g,4);break;
    case "bulwark":block(g,22);g.power++;break;
    case "storm":hit(g,22,info.name);e.mark+=3;break;
    case "meteor":hit(g,25,info.name);e.burn+=4;break;
    case "glacier":hit(g,8,info.name);e.frost+=4;block(g,8);break;
    case "phoenix":heal(g,12);block(g,10);e.bleed+=2;break;
    case "cosmos":for(let i=0;i<3;i++)hit(g,10,info.name);break;
    case "riposte":block(g,8);hit(g,Math.floor(g.block/2),info.name,false);break;
  }
  if(g.enemy.hp<=0)wonFight(g);
  return true;
}
function wonFight(g){
 msg(g,"Chiến thắng "+g.enemy.name+"!");
 if(g.currentNode?.kind==="boss"){g.phase="won";g.reward=[];return;}
 const coins=g.currentNode?.kind==="elite"?43:24;
 g.gold+=coins;msg(g,"Nhận "+coins+" vàng chiến lợi phẩm.");
 g.phase="reward";g.reward=shuffled(CARD_POOL.filter(id=>!["blade","guard"].includes(id))).slice(0,3);
}

function applyDamage(g,n){
  const absorb=Math.min(g.block,n);
  g.block-=absorb; const real=Math.max(0,n-absorb);
  g.hp=Math.max(0,g.hp-real);
  msg(g,"Kẻ địch đánh "+n+" sát thương"+(absorb?" • Khiên đỡ "+absorb:"")+".");
  g.lastEvent={kind:"enemy",amount:real};
}
export function finishTurn(g){
  if(g.phase==="reward"||g.phase==="won"||g.phase==="lost")return g.phase;
  if(g.phase!=="animating"&&g.phase!=="planning")return g.phase;
  g.selected=[];g.stats.turns++;
  const e=g.enemy;
  if(e.burn){attack(g,e.burn*3,"Thiêu Đốt");e.burn=Math.max(0,e.burn-1);}
  if(e.hp>0 && e.bleed){attack(g,e.bleed*2,"Xuất Huyết");e.bleed=Math.max(0,e.bleed-1);}
  if(e.hp<=0){wonFight(g);return g.phase;}
  const action=getIntent(g);
  if(action.kind==="shield"){e.shield+=action.value;msg(g,e.name+" nhận "+action.value+" Khiên.");}
  else {
    const reduction=e.frost>0?Math.min(action.value,e.frost*2):0;
    if(reduction)msg(g,"Băng Giá giảm "+reduction+" sát thương địch.");
    applyDamage(g,action.value-reduction);
  }
  e.frost=Math.max(0,e.frost-1);
  e.mark=Math.max(0,e.mark-1);
  if(g.hp<=0){g.phase="lost";msg(g,"Hành trình kết thúc ở ải "+g.stage+".");return g.phase;}
  g.block=0;
  g.turn++;g.energy=g.maxEnergy;
  g.discard.push(...g.hand.splice(0));draw(g,5);
  g.phase="planning";
  return g.phase;
}
export function chooseReward(g,id){
 if(g.phase!=="reward"||!g.reward.includes(id))return false;
 g.discard.push(makeCard(id));
 const recovery=g.currentNode?.kind==="elite"?9:6;
 g.hp=Math.min(g.maxHp,g.hp+recovery);
 g.reward=[];g.phase="map";
 msg(g,"Nhận "+CARDS[id].name+", hồi "+recovery+" Máu. Chọn nhánh tiếp theo.");
 return true;
}
export function chooseNode(g,id){
 if(g.phase!=="map")return false;
 const node=availableNodes(g).find(n=>n.id===id);
 if(!node)return false;
 g.route.push(node.id);g.position=node.col;g.stage=node.row+1;
 g.currentNode={...node};g.eventId=null;g.shopStock=[];
 g.selected=[];g.block=0;g.power=0;
 if(["battle","elite","boss"].includes(node.kind)){
   g.turn=1;g.enemy=enemyTemplate(g.stage,node.kind);
   g.draw=shuffled([...g.draw,...g.discard,...g.hand]);g.hand=[];g.discard=[];
   g.energy=g.maxEnergy;draw(g,5);g.phase="planning";
   msg(g,"Tiến vào "+(node.kind==="boss"?"trận Boss":node.kind==="elite"?"trận Tinh Anh":"trận chiến")+" tầng "+g.stage+".");
 }else if(node.kind==="shop"){
   const picks=shuffled(CARD_POOL.filter(c=>!["blade","guard"].includes(c))).slice(0,3);
   g.shopStock=picks.map(id=>({id,price:CARDS[id].rarity==="rare"?64:CARDS[id].rarity==="uncommon"?43:32,sold:false}));
   g.phase="shop";msg(g,"Ghé thăm thương nhân tinh giới.");
 }else if(node.kind==="rest"){g.phase="rest";msg(g,"Một vùng sao yên bình để nghỉ ngơi.");}
 else{g.eventId=["rift","meteor","echo"][Math.floor(Math.random()*3)];g.phase="event";msg(g,"Phát hiện một sự kiện bất ngờ.");}
 return true;
}
export function buyCard(g,id){
 if(g.phase!=="shop")return false;
 const item=g.shopStock.find(x=>x.id===id&&!x.sold);
 if(!item||g.gold<item.price)return false;
 g.gold-=item.price;item.sold=true;g.discard.push(makeCard(id));
 msg(g,"Mua "+CARDS[id].name+" với "+item.price+" vàng.");return true;
}
export function buyPotion(g){
 if(g.phase!=="shop"||g.gold<24||g.hp===g.maxHp)return false;
 g.gold-=24;const healed=Math.min(22,g.maxHp-g.hp);g.hp+=healed;
 msg(g,"Mua thuốc: hồi "+healed+" Máu.");return true;
}
export function leaveShop(g){
 if(g.phase!=="shop")return false;
 g.shopStock=[];g.phase="map";msg(g,"Rời cửa hàng. Chọn nhánh tiếp theo.");return true;
}
export function takeRest(g,choice){
 if(g.phase!=="rest"||!["heal","vitality"].includes(choice))return false;
 if(choice==="heal"){const healed=Math.min(25,g.maxHp-g.hp);g.hp+=healed;msg(g,"Nghỉ ngơi, hồi "+healed+" Máu.");}
 else{g.maxHp+=8;g.hp=Math.min(g.maxHp,g.hp+8);msg(g,"Tu luyện: +8 Máu tối đa và hồi 8 Máu.");}
 g.phase="map";return true;
}
export const EVENTS={
 rift:{title:"Khe Nứt Nguyên Sơ",desc:"Một lá bài hiếm nằm sâu trong khe nứt. Bạn có dám đánh đổi sinh lực?",choices:[
  {id:"risk",text:"Mất 12 Máu, nhận 1 thẻ hiếm"},{id:"safe",text:"Bỏ qua, nhặt 14 vàng"}]},
 meteor:{title:"Thiên Thạch Vàng",desc:"Thiên thạch nóng rực chứa vàng và tinh khí để hồi phục.",choices:[
  {id:"risk",text:"Mất 9 Máu, thu 40 vàng"},{id:"safe",text:"Hấp thu tinh khí, hồi 10 Máu"}]},
 echo:{title:"Tiếng Vọng Cổ Xưa",desc:"Một linh hồn đề nghị truyền thụ kỹ năng để đổi lấy sinh mệnh tối đa.",choices:[
  {id:"risk",text:"Mất 5 Máu tối đa, nhận thẻ bất thường"},{id:"safe",text:"Từ chối và nhận 17 vàng"}]}
};
export function chooseEvent(g,choice){
 if(g.phase!=="event"||!EVENTS[g.eventId]||!["risk","safe"].includes(choice))return false;
 if(choice==="risk"){
  if(g.eventId==="rift"){
   if(g.hp<=12)return false;
   g.hp-=12;const pool=CARD_POOL.filter(id=>CARDS[id].rarity==="rare");
   const id=shuffled(pool)[0];g.discard.push(makeCard(id));msg(g,"Nhận "+CARDS[id].name+", mất 12 Máu.");
  }else if(g.eventId==="meteor"){
   if(g.hp<=9)return false;
   g.hp-=9;g.gold+=40;msg(g,"Nhận 40 vàng, mất 9 Máu.");
  }else{
   if(g.maxHp<=40)return false;
   g.maxHp-=5;g.hp=Math.min(g.maxHp,g.hp);
   const pool=CARD_POOL.filter(id=>CARDS[id].rarity==="uncommon");
   const id=shuffled(pool)[0];g.discard.push(makeCard(id));msg(g,"Nhận "+CARDS[id].name+", mất 5 Máu tối đa.");
  }
 }else if(g.eventId==="meteor"){g.hp=Math.min(g.maxHp,g.hp+10);msg(g,"Hồi phục 10 Máu.");}
 else{const coins=g.eventId==="rift"?14:17;g.gold+=coins;msg(g,"Nhận "+coins+" vàng.");}
 g.eventId=null;g.phase="map";return true;
}
export const serializeGame=g=>JSON.stringify(g);
export function restoreGame(raw){
 try{
  const g=typeof raw==="string"?JSON.parse(raw):raw;
  if(!g||g.version!=="0.2.0"||!["map","planning","reward","shop","rest","event","won","lost"].includes(g.phase))return null;
  if(!mapIsValid(g.map)||!Array.isArray(g.route)||g.route.length>6||
   !g.route.every((id,i)=>typeof id==="string"&&g.map.some(n=>n.id===id&&n.row===i)))return null;
  if(!Number.isInteger(g.stage)||g.stage!==g.route.length||g.stage<0||g.stage>6)return null;
  if(![g.hp,g.maxHp,g.gold,g.energy,g.maxEnergy,g.position].every(Number.isFinite)||
   g.maxHp<1||g.maxHp>1000||g.hp<0||g.hp>g.maxHp||g.gold<0||g.gold>100000||
   ![0,1,2].includes(g.position)||g.energy<0||g.maxEnergy!==3)return null;
  const piles=[g.draw,g.hand,g.discard];
  if(piles.some(p=>!Array.isArray(p)||p.length>300))return null;
  const all=piles.flat();
  if(!all.every(c=>c&&CARDS[c.id]&&Number.isSafeInteger(c.uid)&&c.uid>0)||
   new Set(all.map(c=>c.uid)).size!==all.length)return null;
  if(!Array.isArray(g.selected)||!g.selected.every(uid=>g.hand.some(c=>c.uid===uid))||
   !Array.isArray(g.reward)||!g.reward.every(id=>CARDS[id])||
   !Array.isArray(g.shopStock)||g.shopStock.length>3||!g.shopStock.every(x=>CARDS[x.id]&&Number.isInteger(x.price)&&typeof x.sold==="boolean")||
   !Array.isArray(g.log)||!g.log.every(x=>typeof x==="string"&&x.length<400)||
   typeof g.lastMessage!=="string"||g.lastMessage.length>400||
   !g.stats||!["damage","played","turns"].every(key=>Number.isFinite(g.stats[key])))return null;
  if(g.phase==="event"&&!EVENTS[g.eventId])return null;
  if(g.stage>0&&(!g.currentNode||!g.map.some(n=>n.id===g.currentNode.id)))return null;
  if(["planning","reward","lost","won"].includes(g.phase)&&(!g.enemy||!Number.isFinite(g.enemy.hp)||g.enemy.hp<0))return null;
  nextUid=Math.max(nextUid,...all.map(c=>c.uid+1));return g;
 }catch{return null;}
}
