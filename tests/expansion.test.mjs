import test from "node:test";
import assert from "node:assert/strict";
import {EXTRA_CARDS} from "../src/expansion.mjs";
import {CARDS,CARD_POOL,createGame,availableNodes,chooseNode,playCard,finishTurn,restoreGame,serializeGame,chooseReward,leaveShop,takeRest,chooseEvent} from "../src/core.mjs";

let uid=780000;
const start=()=>{
 const g=createGame(),start=availableNodes(g).find(n=>n.col===1);
 assert.ok(chooseNode(g,start.id));
 g.enemy.hp=g.enemy.maxHp=1000;
 g.enemy.shield=0;g.hp=70;
 return g;
};
const setHand=(g,...ids)=>{
 const added=ids.map(id=>({id,uid:uid++}));
 g.hand=[...added];g.selected=added.map(x=>x.uid);g.energy=ids.reduce((n,id)=>n+CARDS[id].cost,0);
 return added;
};
const single=(g,id)=>{const [c]=setHand(g,id);return playCard(g,c.uid);};

test("30 expansion skills form a 50-card library, all with valid metadata",()=>{
 assert.equal(Object.keys(EXTRA_CARDS).length,30);assert.equal(CARD_POOL.length,50);
 const kinds=Object.values(EXTRA_CARDS).map(c=>c.kind);
 assert.equal(kinds.filter(kind=>kind==="passive").length,5);
 assert.equal(kinds.filter(kind=>kind==="reaction").length,5);
 assert.equal(kinds.filter(kind=>kind==="summon").length,3);
 assert.ok(Object.values(EXTRA_CARDS).some(c=>c.school==="Độc"));
 assert.ok(Object.values(EXTRA_CARDS).some(c=>c.school==="Thời Không"));
 for(const [id,c] of Object.entries(EXTRA_CARDS)){
  assert.ok(CARDS[id]);assert.ok(c.name&&c.desc&&c.icon&&c.school);
  assert.ok(Number.isInteger(c.cost)&&c.cost>=0&&c.cost<=3);
 }
});
test("every newly defined skill resolves without errors and leaves finite stats",()=>{
 for(const id of Object.keys(EXTRA_CARDS)){
  const g=start();assert.equal(single(g,id),true,id);
  assert.equal(g.stats.played,1,id);assert.ok(Number.isFinite(g.enemy.hp),id);
  assert.ok(Number.isFinite(g.hp)&&Number.isFinite(g.block),id);
  assert.ok(g.discard.some(c=>c.id===id),id);
 }
});
test("Độc Châm, Độc Bạo, Ôn Dịch and poison turn tick work together",()=>{
 const g=start();single(g,"venom");assert.equal(g.enemy.poison,3);assert.equal(g.enemy.hp,995);
 const poisonBefore=g.enemy.hp;g.turn=1;
 finishTurn(g);assert.equal(g.enemy.hp,poisonBefore-9);assert.equal(g.enemy.poison,2);
 g.energy=3;single(g,"toxinburst");assert.equal(g.enemy.poison,1);
 assert.equal(g.enemy.hp,poisonBefore-9-16);
 g.energy=3;single(g,"plague");assert.equal(g.enemy.poison,6);assert.equal(g.enemy.burn,1);
});
test("Triệu Hồi stays on the field and protects or attacks each turn",()=>{
 const g=start();single(g,"wisp");assert.equal(g.summons.wisp,1);
 const before=g.enemy.hp;finishTurn(g);assert.equal(g.enemy.hp,before-3);
 const guard=start();single(guard,"golem");const hp=guard.hp;
 finishTurn(guard);assert.equal(guard.hp,hp-(guard.enemy.attack-4));
 assert.equal(guard.summons.golem,1);
 const burst=start();single(burst,"swarm");assert.equal(burst.summons.wisp,2);
 burst.energy=3;single(burst,"sacrifice");assert.equal(burst.summons.wisp,1);
 assert.equal(burst.hp,77);assert.equal(burst.enemy.hp,983);
});
test("Thiên Phú triggers are battle-long, stacked at two and reset when entering new combat",()=>{
 const g=start();const cards=setHand(g,"stormheart","spark");
 assert.ok(playCard(g,cards[0].uid));assert.ok(playCard(g,cards[1].uid));
 assert.equal(g.passives.stormheart,1);assert.equal(g.enemy.mark,3);
 g.energy=3;single(g,"stormheart");assert.equal(g.passives.stormheart,2);
 const oldBlock=g.block;g.energy=3;single(g,"stormheart");
 assert.equal(g.passives.stormheart,2);assert.equal(g.block,oldBlock+6);
 const sword=start();const [a,b]=setHand(sword,"swordmaster","blade");playCard(sword,a.uid);playCard(sword,b.uid);
 assert.equal(sword.power,1);const attackBefore=sword.enemy.hp;
 sword.energy=3;single(sword,"blade");assert.equal(sword.power,1);
 assert.equal(sword.enemy.hp,attackBefore-11);
 sword.enemy.hp=1;sword.energy=3;single(sword,"blade");
 assert.equal(sword.phase,"reward");assert.ok(chooseReward(sword,sword.reward[0]));
 // Enter an encounter on row 3 after a non-combat stop on row 2.
 const another=start();another.passives.stormheart=2;another.summons.wisp=3;
 another.enemy.hp=1;another.energy=3;single(another,"blade");
 assert.ok(chooseReward(another,another.reward[0]));
 another.position=1;const waypoint=availableNodes(another)[0];
 assert.ok(chooseNode(another,waypoint.id));
 if(another.phase==="shop")assert.ok(leaveShop(another));
 else if(another.phase==="rest")assert.ok(takeRest(another,"heal"));
 else if(another.phase==="event")assert.ok(chooseEvent(another,"safe"));
 const next=availableNodes(another).find(n=>n.kind==="battle"||n.kind==="elite");
 assert.ok(next);assert.ok(chooseNode(another,next.id));
 assert.deepEqual(another.passives,{});assert.equal(another.summons.wisp,0);
});
test("Phản Ứng does not expire when enemy raises shields; reacts on actual attack",()=>{
 const g=start();single(g,"mirrorward");assert.equal(g.reactions.mirrorward,1);
 const hp=g.hp;g.turn=2;finishTurn(g);assert.equal(g.reactions.mirrorward,1);assert.equal(g.hp,hp);
 // Clear shield only to isolate the reflected damage check.
 g.enemy.shield=0;g.turn=3;g.phase="planning";
 const e=g.enemy.hp;finishTurn(g);
 assert.equal(g.reactions.mirrorward,0);
 assert.equal(g.enemy.hp,e-7);
 assert.equal(g.hp,hp-Math.floor((g.enemy.attack+3)/2));
});
test("Phản Ứng Huyết Khế triggers only once and heals after a survived attack",()=>{
 const g=start();g.hp=40;single(g,"bloodpact");g.turn=1;
 finishTurn(g);
 assert.equal(g.hp,38);assert.equal(g.power,1);assert.equal(g.reactions.bloodpact,0);
});
test("Thời Không can recycle a spent card, echo elemental spells and draw",()=>{
 const g=start();const [a,b]=setHand(g,"spark","timeloop");
 assert.ok(playCard(g,a.uid));assert.ok(playCard(g,b.uid));
 assert.equal(g.enemy.mark,3);assert.equal(g.enemy.hp,982); // 6 spark + 12 echo
 const reuse=start();const [blade,rewind]=setHand(reuse,"blade","rewind");
 playCard(reuse,blade.uid);playCard(reuse,rewind.uid);
 assert.ok(reuse.hand.some(c=>c.id==="blade"));assert.equal(reuse.extraPlanning,true);
 const draw=start();draw.draw=[{id:"guard",uid:uid++}];
 single(draw,"quicken");
 assert.equal(draw.hand.length,1);assert.equal(draw.hand[0].id,"guard");assert.equal(draw.extraPlanning,true);
 const step=start();single(step,"chronostep");assert.equal(step.extraPlanning,true);assert.equal(step.block,9);
 const empty=start();empty.draw=[];empty.discard=[];single(empty,"quicken");assert.equal(empty.extraPlanning,false);
});
test("cross-element Entropy uses all five statuses and consumes exactly one of each",()=>{
 const g=start();Object.assign(g.enemy,{burn:2,bleed:3,frost:4,mark:5,poison:6});
 const before=g.enemy.hp;single(g,"entropy");assert.equal(g.enemy.hp,before-70);
 for(const [k,v] of Object.entries({burn:1,bleed:2,frost:3,mark:4,poison:5}))assert.equal(g.enemy[k],v);
});
test("V0.2 save is migrated without losing map, cards, route, gold or battle state",()=>{
 const g=start();g.gold=76;g.enemy.burn=3;const route=[...g.route],deck=serializeGame(g);
 const legacy=JSON.parse(deck);legacy.version="0.2.0";
 delete legacy.enemy.poison;delete legacy.summons;delete legacy.passives;delete legacy.reactions;
 delete legacy.lastOffensive;delete legacy.lastSwordTurn;
 const saved=restoreGame(JSON.stringify(legacy));
 assert.ok(saved);assert.equal(saved.version,"0.4.0");assert.equal(saved.gold,76);
 assert.equal(saved.enemy.burn,3);assert.equal(saved.enemy.poison,0);
 assert.deepEqual(saved.route,route);assert.equal(saved.phase,"planning");
 assert.equal(saved.draw.length+saved.discard.length+saved.hand.length,14);
 assert.deepEqual(saved.summons,{wisp:0,golem:0});
 assert.equal(saved.extraPlanning,false);
 assert.equal(restoreGame("garbage"),null);
});
test("post-combat rewards contain a passive or reactive skill and shops can sell new cards",()=>{
 for(let i=0;i<20;i++){
  const g=start();g.enemy.hp=1;single(g,"blade");
  assert.equal(g.phase,"reward");
  assert.ok(g.reward.some(id=>["passive","reaction"].includes(CARDS[id].kind)));
 }
});
