// Thẻ Giới: Hỗn Mang — V0.1. Pure gameplay rules, independent of the interface.
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
  riposte: {name:"Phản Chấn",cost:1,school:"Phòng Ngự",kind:"guard",rarity:"uncommon",desc:"Nhận 8 Khiên, gây sát thương bằng nửa số Khiên đang có.",icon:"shield"}
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
const enemyTemplate = stage => ({...clone(ENEMIES[stage-1]),maxHp:ENEMIES[stage-1].hp,shield:0,burn:0,bleed:0,frost:0,mark:0});
export function createGame(){
  const additions=shuffled(BONUS_POOL).slice(0,2);
  const g={
    version:"0.1.0",stage:1,totalStages:3,turn:1,maxHp:90,hp:90,block:0,
    energy:3,maxEnergy:3,power:0,
    enemy:enemyTemplate(1),phase:"planning",
    draw:shuffled([...START_DECK,...additions].map(makeCard)),discard:[],hand:[],selected:[],
    reward:[],log:[],lastMessage:"",stats:{damage:0,played:0,turns:0},lastEvent:null
  };
  draw(g,5);
  msg(g,"Hành trình bắt đầu. Chọn các thẻ để lập chuỗi chiêu.");
  return g;
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
export function playCard(g,uid){
  if(g.phase!=="animating" && g.phase!=="planning")return false;
  const at=g.hand.findIndex(x=>x.uid===uid);
  if(at<0 || !g.selected.includes(uid))return false;
  const c=g.hand.splice(at,1)[0], info=CARDS[c.id];
  g.selected.splice(g.selected.indexOf(uid),1);
  g.energy-=info.cost;g.discard.push(c);g.stats.played++;
  msg(g,"Thi triển "+info.name+".");
  g.lastEvent={kind:info.kind,school:info.school};
  const e=g.enemy;
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
  g.stats.turns+=1;
  if(g.stage===g.totalStages){g.phase="won";g.reward=[];return;}
  g.phase="reward";
  g.reward=shuffled(CARD_POOL.filter(id=>!["blade","guard"].includes(id))).slice(0,3);
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
  if(g.phase!=="reward" || !g.reward.includes(id))return false;
  g.discard.push(makeCard(id));
  g.stage++;g.turn=1;g.enemy=enemyTemplate(g.stage);
  g.block=0;g.power=0;g.energy=g.maxEnergy;
  g.hp=Math.min(g.maxHp,g.hp+13);
  g.discard.push(...g.hand.splice(0));
  g.selected=[];g.reward=[];g.phase="planning";
  draw(g,5);
  msg(g,"Nhận "+CARDS[id].name+". Tiến vào ải "+g.stage+" và hồi 13 Máu.");
  return true;
}
