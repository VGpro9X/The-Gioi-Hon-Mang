import test from "node:test";
import assert from "node:assert/strict";
import {CARDS,CARD_POOL,createGame,queueCard,unqueueCard,queuedCost,playCard,finishTurn,chooseReward,chooseNode,availableNodes} from "../src/core.mjs";
const card=(id,uid=9999)=>({id,uid});
const battle=()=>{const g=createGame();assert.ok(chooseNode(g,availableNodes(g)[0].id));return g;};
test("70 thẻ có metadata đầy đủ",()=>{
 assert.equal(CARD_POOL.length,70);
 for(const id of CARD_POOL){assert.ok(CARDS[id].name);assert.ok(CARDS[id].desc);assert.ok(Number.isInteger(CARDS[id].cost));}
});
test("hành trình khởi đầu có 14 lá, bắt đầu chiến đấu rút 5 lá và có 3 năng lượng",()=>{
 const g=createGame();assert.equal(g.stage,0);assert.equal(g.phase,"map");
 assert.equal(g.hp,90);assert.equal(g.gold,35);assert.equal(g.draw.length,14);
 chooseNode(g,availableNodes(g)[0].id);assert.equal(g.stage,1);
 assert.equal(g.hand.length,5);assert.equal(g.energy,3);
});
test("không xếp thẻ trùng hoặc vượt năng lượng",()=>{
 const g=battle();g.hand=[card("meteor",1),card("storm",2),card("blade",3)];
 assert.equal(queueCard(g,1),true);assert.equal(queueCard(g,1),false);
 assert.equal(queueCard(g,2),false);assert.equal(queueCard(g,3),false);
 assert.equal(queuedCost(g),3);assert.equal(unqueueCard(g,1),true);
 assert.equal(queueCard(g,3),true);assert.equal(queuedCost(g),1);
});
test("Lôi Ấn và Lôi Bạo cộng hưởng",()=>{
 const g=battle();g.enemy.hp=100;g.enemy.maxHp=100;g.enemy.shield=0;
 g.hand=[card("spark",11),card("chain",12)];g.selected=[11,12];
 assert.equal(playCard(g,11),true);assert.equal(g.enemy.mark,2);
 assert.equal(playCard(g,12),true);assert.equal(g.enemy.mark,0);
 assert.equal(g.enemy.hp,72);assert.equal(g.energy,0);
});
test("Băng Giá giảm sát thương, Thiêu Đốt gây sát thương theo lượt",()=>{
 const g=battle();g.hand=[card("frost",21),card("ember",22)];g.selected=[21,22];
 playCard(g,21);playCard(g,22);const before=g.enemy.hp,health=g.hp;
 g.phase="animating";finishTurn(g);assert.ok(g.enemy.hp<before);assert.equal(g.enemy.burn,1);
 assert.ok(g.hp>health-g.enemy.attack);assert.equal(g.turn,2);
});
test("thắng trận nhận vàng, ba thẻ và hồi máu khi nhận thưởng",()=>{
 const g=battle();g.hp=50;g.enemy.hp=1;g.hand=[card("blade",31)];g.selected=[31];
 playCard(g,31);assert.equal(g.phase,"reward");assert.equal(g.reward.length,3);assert.equal(g.gold,59);
 const reward=g.reward[0];assert.equal(chooseReward(g,reward),true);
 assert.equal(g.stage,1);assert.equal(g.hp,56);assert.equal(g.phase,"map");
 assert.ok(g.draw.concat(g.discard,g.hand).some(c=>c.id===reward));
});
test("hạ Boss chuyển trạng thái chiến thắng",()=>{
 const g=battle();g.stage=6;g.currentNode.kind="boss";
 g.enemy.hp=1;g.hand=[card("blade",41)];g.selected=[41];
 playCard(g,41);assert.equal(g.phase,"won");
});
test("khi máu bằng 0 chuyển trạng thái thất bại",()=>{
 const g=battle();g.hp=1;g.hand=[];g.selected=[];
 g.phase="animating";finishTurn(g);assert.equal(g.hp,0);assert.equal(g.phase,"lost");
});
