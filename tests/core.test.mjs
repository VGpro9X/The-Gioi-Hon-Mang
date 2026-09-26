import test from "node:test";
import assert from "node:assert/strict";
import {CARDS, CARD_POOL, createGame, queueCard, unqueueCard, queuedCost, playCard, finishTurn, chooseReward} from "../src/core.mjs";
const item=(id,uid=9999)=>({id,uid});
test("thư viện có 20 thẻ độc lập và dữ liệu đầy đủ",()=>{
 assert.equal(CARD_POOL.length,20);
 for(const id of CARD_POOL){assert.ok(CARDS[id].name);assert.ok(CARDS[id].desc);assert.ok(Number.isInteger(CARDS[id].cost));}
});
test("tạo trận có bộ bài 14 lá, 5 lá trên tay, 3 năng lượng",()=>{
 const g=createGame();
 assert.equal(g.stage,1);assert.equal(g.hp,90);assert.equal(g.energy,3);assert.equal(g.hand.length,5);
 assert.equal(g.draw.length+g.hand.length+g.discard.length,14);
});
test("không được đưa một thẻ hai lần hoặc vượt năng lượng",()=>{
 const g=createGame();
 g.hand=[item("meteor",1),item("storm",2),item("blade",3)];
 assert.equal(queueCard(g,1),true);assert.equal(queueCard(g,1),false);
 assert.equal(queueCard(g,2),false);assert.equal(queueCard(g,3),false);
 assert.equal(queuedCost(g),3);assert.equal(unqueueCard(g,1),true);
 assert.equal(queueCard(g,3),true);assert.equal(queuedCost(g),1);
});
test("Lôi Ấn và Lôi Bạo kích hoạt sát thương dây chuyền",()=>{
 const g=createGame();g.enemy.hp=100;g.enemy.maxHp=100;g.enemy.shield=0;
 g.hand=[item("spark",11),item("chain",12)];g.selected=[11,12];
 assert.equal(playCard(g,11),true);assert.equal(g.enemy.mark,2);
 assert.equal(playCard(g,12),true);assert.equal(g.enemy.mark,0);
 assert.equal(g.enemy.hp,72);assert.equal(g.energy,0);
});
test("Băng Giá giảm sát thương và Thiêu Đốt gây sát thương theo lượt",()=>{
 const g=createGame();g.hand=[item("frost",21),item("ember",22)];g.selected=[21,22];
 playCard(g,21);playCard(g,22);
 const enemyBefore=g.enemy.hp;const hpBefore=g.hp;
 g.phase="animating";finishTurn(g);
 assert.ok(g.enemy.hp<enemyBefore);assert.equal(g.enemy.burn,1);
 assert.ok(g.hp>hpBefore-g.enemy.attack);assert.equal(g.turn,2);
});
test("thắng ải trao 3 lựa chọn và tiến ải, hồi máu",()=>{
 const g=createGame();g.hp=50;g.enemy.hp=1;g.hand=[item("blade",31)];g.selected=[31];
 playCard(g,31);assert.equal(g.phase,"reward");assert.equal(g.reward.length,3);
 const chosen=g.reward[0];assert.equal(chooseReward(g,chosen),true);
 assert.equal(g.stage,2);assert.equal(g.hp,63);assert.equal(g.phase,"planning");
 assert.ok(g.draw.concat(g.discard,g.hand).some(c=>c.id===chosen));
});
test("hoàn thành 3 ải chuyển trạng thái chiến thắng",()=>{
 const g=createGame();g.stage=3;g.enemy.hp=1;g.hand=[item("blade",41)];g.selected=[41];
 playCard(g,41);assert.equal(g.phase,"won");
});
test("khi máu bằng 0 phải dừng trận",()=>{
 const g=createGame();g.hp=1;g.hand=[];g.selected=[];
 g.phase="animating";finishTurn(g);
 assert.equal(g.hp,0);assert.equal(g.phase,"lost");
});
