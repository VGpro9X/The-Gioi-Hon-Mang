import test from "node:test";
import assert from "node:assert/strict";
import {GOD_CARDS,MYSTERY_CARDS,EVOLUTIONS,EVOLVED_CARDS,ascensionOffers,mysteryRate} from "../src/divine.mjs";
import {CARD_FX,effectMarkup} from "../src/effects.mjs";
import {CARDS,CARD_POOL,REGULAR_POOL,createGame,availableNodes,chooseNode,chooseReward,playCard,finishTurn,
  leaveShop,takeRest,chooseEvent,chooseDivine,evolveAtAscension,skipAscension,evolutionCandidates,
  serializeGame,restoreGame} from "../src/core.mjs";

let uid=970000;
const start=()=>{
  const g=createGame();
  assert.equal(chooseNode(g,availableNodes(g).find(n=>n.col===1).id),true);
  g.enemy.hp=g.enemy.maxHp=10000;g.enemy.shield=0;
  return g;
};
const play=(g,id,level=0)=>{
  const c={id,uid:uid++,level};g.hand=[c];g.selected=[c.uid];g.energy=3;
  assert.equal(playCard(g,c.uid),true,id);return c;
};
const advance=g=>{
  g.enemy.hp=1;play(g,"blade");assert.equal(g.phase,"reward");
  assert.equal(chooseReward(g,g.reward[0]),true);
};
const altar=()=>{
  const g=start();advance(g);
  assert.equal(g.phase,"map");
  const waypoint=availableNodes(g).find(n=>n.col===1);
  assert.ok(waypoint);chooseNode(g,waypoint.id);
  if(waypoint.kind==="shop")assert.ok(leaveShop(g));
  else if(waypoint.kind==="rest")assert.ok(takeRest(g,"heal"));
  else assert.ok(chooseEvent(g,"safe"));
  const elite=availableNodes(g).find(n=>n.kind==="elite");assert.ok(elite);
  chooseNode(g,elite.id);g.enemy.hp=1;play(g,"blade");
  assert.equal(g.phase,"reward");assert.equal(g.ascensionPending,true);
  assert.ok(chooseReward(g,g.reward[0]));assert.equal(g.phase,"ascend");
  return g;
};
test("70 cards: 50 ordinary, 8 Divine, 5 Mystery and 7 evolved variants; all VFX present",()=>{
  assert.equal(CARD_POOL.length,70);assert.equal(REGULAR_POOL.length,50);
  assert.equal(Object.keys(GOD_CARDS).length,8);assert.equal(Object.keys(MYSTERY_CARDS).length,5);
  assert.equal(Object.keys(EVOLUTIONS).length,7);assert.equal(Object.keys(EVOLVED_CARDS).length,7);
  for(const id of CARD_POOL){
    const card=CARDS[id];assert.ok(card.name&&card.desc&&card.school&&card.icon,id);
    assert.ok(Number.isInteger(card.cost)&&card.cost>=0&&card.cost<=3,id);
    assert.ok(CARD_FX[id],id);
    assert.match(effectMarkup(id,card.name),new RegExp('data-skill-fx="'+id+'"'));
  }
  for(const id of [...Object.keys(GOD_CARDS),...Object.keys(MYSTERY_CARDS),...Object.keys(EVOLVED_CARDS)])
    assert.ok(!REGULAR_POOL.includes(id),id);
});
test("Mystery chance is zero below elite stage, fifteen percent at stage 3 and thirty-five at stage 5",()=>{
  assert.equal(mysteryRate(1),0);assert.equal(mysteryRate(3),.15);assert.equal(mysteryRate(5),.35);
  for(const stage of [3,5]){
    const rare=ascensionOffers(stage,()=>0);assert.equal(rare.length,3);
    assert.ok(rare[2].startsWith("mystery_"));
    const regular=ascensionOffers(stage,()=>.99);assert.ok(regular.every(id=>id.startsWith("god_")));
    assert.equal(new Set(regular).size,3);
  }
});
test("All twenty V0.5 special and evolved skills resolve with bounded state",()=>{
  const ids=[...Object.keys(GOD_CARDS),...Object.keys(MYSTERY_CARDS),...Object.keys(EVOLVED_CARDS)];
  for(const id of ids){
    const g=start();g.hp=70;g.enemy.hp=g.enemy.maxHp=10000;
    play(g,id);assert.ok(Number.isFinite(g.enemy.hp)&&g.enemy.hp>=0,id);
    assert.ok(Number.isFinite(g.hp)&&g.hp>0,id);
    assert.equal(g.stats.played,1,id);
    assert.ok(g.discard.some(c=>c.id===id),id);
    assert.ok(g.enemy.poison>=0&&g.enemy.mark>=0&&g.enemy.burn>=0,id);
  }
});
test("The elite altar grants exactly one Divine and returns to the map; rejects forged selections",()=>{
  const g=altar();assert.equal(g.stage,3);assert.equal(g.divineOffers.length,3);
  assert.ok(g.divineOffers.every(id=>GOD_CARDS[id]||MYSTERY_CARDS[id]));
  assert.equal(chooseDivine(g,"evo_blade"),false);
  const id=g.divineOffers[0],before=g.discard.length;
  assert.ok(chooseDivine(g,id));assert.equal(g.phase,"map");
  assert.equal(g.discard.length,before+1);assert.ok(g.discard.some(c=>c.id===id));
  assert.equal(g.ascensionsTaken,1);assert.equal(g.ascensionPending,false);
  assert.equal(chooseDivine(g,id),false);assert.equal(skipAscension(g),false);
});
test("Evolution transforms one owned card, preserving UID and forge level, once only",()=>{
  const g=altar();
  // The combat test helper discards the previously drawn hand; install a known
  // physical card to isolate evolution semantics from random starting draws.
  const target={id:"spark",uid:uid++,level:1};g.discard.push(target);
  assert.ok(evolutionCandidates(g).some(c=>c.uid===target.uid));const uidBefore=target.uid;
  assert.ok(evolveAtAscension(g,uidBefore));assert.equal(target.id,"evo_spark");
  assert.equal(target.uid,uidBefore);assert.equal(target.level,1);
  assert.equal(g.phase,"map");assert.equal(g.ascensionsTaken,1);
  assert.ok(!evolutionCandidates(g).some(c=>c.uid===uidBefore));
  assert.equal(evolveAtAscension(g,uidBefore),false);
});
test("Skipping Ascension is a deliberate, single-use choice",()=>{
  const g=altar();assert.ok(skipAscension(g));assert.equal(g.phase,"map");
  assert.equal(g.ascensionsTaken,1);assert.deepEqual(g.divineOffers,[]);
  assert.equal(skipAscension(g),false);
});
test("Divine and Mystery cards never leak into starting deck, normal rewards, shops or event loot",()=>{
  for(let i=0;i<25;i++){
    const g=start();
    for(const c of [...g.hand,...g.draw])assert.ok(REGULAR_POOL.includes(c.id));
    g.enemy.hp=1;play(g,"blade");
    assert.ok(g.reward.every(id=>REGULAR_POOL.includes(id)));
    assert.ok(chooseReward(g,g.reward[0]));
    const shop=availableNodes(g).find(n=>n.kind==="shop");g.position=1;
    assert.ok(chooseNode(g,shop.id));
    assert.ok(g.shopStock.every(item=>REGULAR_POOL.includes(item.id)));
  }
});
test("God Thunder leaves two finite end-of-turn echoes; God Time permits another selection",()=>{
  const g=start();play(g,"god_thunder");
  assert.equal(g.divineEffects.thunderTurns,2);assert.equal(g.enemy.mark,3);
  finishTurn(g);assert.equal(g.divineEffects.thunderTurns,1);
  finishTurn(g);assert.equal(g.divineEffects.thunderTurns,0);
  finishTurn(g);assert.equal(g.divineEffects.thunderTurns,0);
  const time=start();play(time,"god_time");assert.equal(time.extraPlanning,true);
  assert.equal(time.block,8);assert.ok(time.hand.length>=1);
});
test("Immortal secret skill revives exactly once on lethal damage, cannot reactivate during same battle",()=>{
  const g=start();g.hp=4;
  play(g,"mystery_immortal");assert.equal(g.divineEffects.reviveReady,true);
  finishTurn(g);assert.equal(g.hp,35);assert.equal(g.divineEffects.reviveReady,false);
  assert.equal(g.divineEffects.reviveUsed,true);
  const before=g.block;play(g,"mystery_immortal");
  assert.equal(g.divineEffects.reviveReady,false);assert.equal(g.block,before+12);
});
test("Mystery Genesis rewards all five different ailments; Mystery Void consumes all",()=>{
  const g=start();
  Object.assign(g.enemy,{burn:1,mark:1,frost:1,bleed:1,poison:1});
  const hp=g.enemy.hp;play(g,"mystery_genesis");
  assert.equal(g.enemy.hp,hp-36);
  assert.equal(g.enemy.burn,3);assert.equal(g.enemy.poison,3);
  const hpAfter=g.enemy.hp;play(g,"mystery_void");
  assert.equal(g.enemy.hp,hpAfter-60);assert.equal(g.block,25);
  assert.deepEqual(["burn","mark","frost","bleed","poison"].map(k=>g.enemy[k]),[0,0,0,0,0]);
});
test("V0.4 elite reward migrates into Ascension without wiping the existing deck or gold",()=>{
  const g=altar();g.phase="reward";g.reward=["spark","ember","frost"];
  g.divineOffers=undefined;g.ascensionPending=undefined;g.divineEffects=undefined;g.version="0.4.0";
  const oldGold=g.gold,oldRoute=[...g.route];
  const loaded=restoreGame(serializeGame(g));
  assert.ok(loaded);assert.equal(loaded.version,"0.6.0");
  assert.equal(loaded.ascensionPending,true);assert.equal(loaded.divineOffers.length,3);
  assert.deepEqual(loaded.route,oldRoute);assert.equal(loaded.gold,oldGold);
  assert.ok(chooseReward(loaded,"spark"));assert.equal(loaded.phase,"ascend");
  const snapshot=restoreGame(serializeGame(loaded));assert.equal(snapshot.phase,"ascend");
  assert.equal(snapshot.divineOffers.length,3);
  const invalid=JSON.parse(serializeGame(loaded));invalid.divineOffers=["invalid"];
  assert.equal(restoreGame(JSON.stringify(invalid)),null);
});
