import test from "node:test";
import assert from "node:assert/strict";
import {CARD_FX,effectPreset,effectMarkup} from "../src/effects.mjs";
import {RELICS,RELIC_IDS} from "../src/relics.mjs";
import {CARDS,CARD_POOL,createGame,availableNodes,chooseNode,playCard,finishTurn,
 chooseReward,takeRest,startShopUpgrade,upgradableCards,upgradeCard,cancelUpgrade,buyRelic,
 leaveShop,chooseEvent,getIntent,restoreGame,serializeGame} from "../src/core.mjs";

let next=970000;
const start=()=>{
 const g=createGame();assert.ok(chooseNode(g,availableNodes(g).find(n=>n.col===1).id));
 g.enemy.hp=g.enemy.maxHp=1000;g.enemy.shield=0;return g;
};
const play=(g,id,level=0)=>{
 const card={id,uid:next++,level};g.hand=[card];g.selected=[card.uid];g.energy=3;
 assert.equal(playCard(g,card.uid),true,id);return card;
};
const beat=g=>{
 g.enemy.hp=1;play(g,"blade");assert.equal(g.phase,"reward");
 assert.ok(chooseReward(g,g.reward[0]));assert.equal(g.phase,"map");
};
test("each of 50 cards has a bounded, deterministic, independently keyed VFX preset",()=>{
 assert.equal(CARD_POOL.length,50);
 assert.equal(Object.keys(CARD_FX).length,50);
 for(const id of CARD_POOL){
   assert.deepEqual(effectPreset(id),CARD_FX[id]);
   assert.ok(CARD_FX[id].form);assert.ok(CARD_FX[id].tone);
   assert.ok(CARD_FX[id].sparks>=3&&CARD_FX[id].sparks<=12);
   const html=effectMarkup(id,CARDS[id].name);
   assert.match(html,new RegExp('data-skill-fx="'+id+'"'));
   assert.equal((html.match(/class="skill-particle"/g)||[]).length,CARD_FX[id].sparks);
 }
 assert.ok(new Set(Object.values(CARD_FX).map(p=>p.form)).size>=30);
 assert.match(effectMarkup("spark","Lôi Kiếm",true),/Lôi Kiếm ✦/);
 assert.doesNotMatch(effectMarkup("spark","<img src=x>"),/<img/);
});
test("forge at rest upgrades one real owned card, carries through combat, never upgrades twice",()=>{
 const g=start();beat(g);const rest=availableNodes(g).find(n=>n.kind==="rest");assert.ok(rest);
 assert.ok(chooseNode(g,rest.id));assert.equal(g.phase,"rest");
 assert.ok(takeRest(g,"upgrade"));assert.equal(g.phase,"upgrade");
 const target=upgradableCards(g).find(c=>c.id==="blade");assert.ok(target);
 assert.ok(upgradeCard(g,target.uid));assert.equal(target.level,1);assert.equal(g.phase,"map");
 assert.equal(upgradeCard(g,target.uid),false);
 const node=availableNodes(g).find(n=>["battle","elite"].includes(n.kind));
 assert.ok(node);assert.ok(chooseNode(g,node.id));
 g.enemy.hp=g.enemy.maxHp=1000;g.enemy.shield=0;g.hand=[target];g.selected=[target.uid];g.energy=3;
 const hp=g.enemy.hp;assert.ok(playCard(g,target.uid));assert.equal(g.enemy.hp,hp-14);
});
test("forge at shop costs 45 gold once, can cancel before payment",()=>{
 const g=start();beat(g);assert.ok(chooseNode(g,availableNodes(g).find(n=>n.kind==="shop").id));
 g.gold=100;
 assert.ok(startShopUpgrade(g));assert.equal(g.phase,"upgrade");assert.ok(cancelUpgrade(g));
 assert.equal(g.phase,"shop");assert.equal(g.gold,100);
 assert.ok(startShopUpgrade(g));
 const target=upgradableCards(g)[0];assert.ok(target);
 assert.ok(upgradeCard(g,target.uid));assert.equal(g.gold,55);assert.equal(g.phase,"shop");
 assert.equal(g.shopUpgradeUsed,true);assert.equal(startShopUpgrade(g),false);
});
test("relic purchase is priced, owned permanently and starts protection in the next encounter",()=>{
 const g=start();beat(g);assert.ok(chooseNode(g,availableNodes(g).find(n=>n.kind==="shop").id));
 assert.ok(RELIC_IDS.includes(g.shopRelic));const id=g.shopRelic;g.gold=200;
 assert.equal(buyRelic(g,"invalid"),false);
 assert.ok(buyRelic(g,id));assert.ok(g.relics.includes(id));assert.equal(g.gold,200-RELICS[id].price);
 assert.equal(buyRelic(g,id),false);assert.ok(leaveShop(g));
 g.relics=["starward"];
 assert.ok(chooseNode(g,availableNodes(g).find(n=>["elite","battle"].includes(n.kind)).id));
 assert.equal(g.block,10);
 const copy=restoreGame(serializeGame(g));assert.deepEqual(copy.relics,["starward"]);
});
test("defeating a mid-route elite always grants one unowned relic and names it on reward screen",()=>{
 const g=start();beat(g);
 const eliteNode=g.map.find(n=>n.row===2&&n.kind==="elite");
 assert.ok(eliteNode);
 const waypoint=availableNodes(g).find(n=>n.col===eliteNode.col);
 assert.ok(chooseNode(g,waypoint.id));
 if(waypoint.kind==="rest")assert.ok(takeRest(g,"heal"));
 else if(waypoint.kind==="shop")assert.ok(leaveShop(g));
 else assert.ok(chooseEvent(g,"safe"));
 assert.equal(g.phase,"map");
 assert.ok(chooseNode(g,availableNodes(g).find(n=>n.id===eliteNode.id).id));
 g.enemy.hp=1;play(g,"blade");
 assert.equal(g.phase,"reward");assert.equal(g.relics.length,1);
 assert.ok(RELICS[g.lastRelic]);assert.ok(g.relics.includes(g.lastRelic));
 assert.ok(chooseReward(g,g.reward[0]));assert.equal(g.lastRelic,null);
});
test("elemental and summoning relics trigger independently without infinite loops",()=>{
 const thunder=start();thunder.relics=["thunderseal"];play(thunder,"spark");assert.equal(thunder.enemy.mark,3);
 const fire=start();fire.relics=["embercore"];play(fire,"ember");assert.equal(fire.enemy.burn,3);
 const toxic=start();toxic.relics=["toxincore"];play(toxic,"venom");assert.equal(toxic.enemy.poison,4);
 const spirit=start();spirit.relics=["spiritbell"];play(spirit,"wisp");const hp=spirit.enemy.hp;
 finishTurn(spirit);assert.equal(spirit.enemy.hp,hp-5);
 const blood=start();blood.hp=55;blood.relics=["bloodchalice"];blood.enemy.hp=1;play(blood,"blade");
 assert.equal(blood.hp,60);assert.equal(blood.phase,"reward");
});
test("elite piercing telegraph and enraged boss have distinct deterministic actions",()=>{
 const elite=start();elite.enemy.kind="elite";elite.turn=3;
 let intent=getIntent(elite);assert.equal(intent.kind,"pierce");
 const hp=elite.hp;elite.block=100;finishTurn(elite);
 assert.equal(elite.hp,hp-Math.floor(intent.value*.5));
 const boss=start();boss.enemy.kind="boss";boss.enemy.hp=40;boss.enemy.maxHp=100;
 boss.turn=2;intent=getIntent(boss);assert.equal(intent.kind,"fortify");
 const before=boss.enemy.hp;finishTurn(boss);
 assert.equal(boss.enemy.hp,before+6);assert.ok(boss.enemy.shield>=intent.value);
 boss.turn=4;boss.phase="planning";boss.enemy.shield=0;boss.block=100;
 intent=getIntent(boss);assert.equal(intent.kind,"nova");
 const playerHp=boss.hp;finishTurn(boss);
 assert.equal(boss.hp,playerHp-Math.floor(intent.value*.25));
});
test("both 0.2 and 0.3 save snapshots migrate with new fields and upgraded levels",()=>{
 const base=start();
 for(const version of ["0.2.0","0.3.0"]){
   const old=JSON.parse(serializeGame(base));old.version=version;
   delete old.relics;delete old.shopRelic;delete old.shopUpgradeUsed;delete old.lastRelic;delete old.upgradeFrom;
   for(const pile of [old.draw,old.hand,old.discard])for(const c of pile)delete c.level;
   const result=restoreGame(JSON.stringify(old));
   assert.ok(result);assert.equal(result.version,"0.4.0");
   assert.deepEqual(result.relics,[]);assert.ok(result.draw.every(c=>c.level===0));
   assert.deepEqual(result.route,base.route);
 }
 const invalid=JSON.parse(serializeGame(base));invalid.relics=["starward","starward"];
 assert.equal(restoreGame(JSON.stringify(invalid)),null);
});
