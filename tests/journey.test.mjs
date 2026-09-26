import test from "node:test";
import assert from "node:assert/strict";
import {createGame,availableNodes,chooseNode,chooseReward,playCard,buyCard,buyPotion,leaveShop,takeRest,chooseEvent,restoreGame,serializeGame} from "../src/core.mjs";
const enterFirstBattle=()=>{
 const g=createGame(),node=availableNodes(g).find(n=>n.col===1);
 assert.ok(chooseNode(g,node.id));return g;
};
const winFirstBattle=g=>{
 g.enemy.hp=1;g.hand=[{id:"blade",uid:550000}];g.selected=[550000];
 assert.ok(playCard(g,550000));assert.equal(g.phase,"reward");
 assert.ok(chooseReward(g,g.reward[0]));assert.equal(g.phase,"map");
};
test("map có 16 nút, chỉ mở nhánh liền kề và boss cuối cố định",()=>{
 for(let i=0;i<10;i++){
  const g=createGame();assert.equal(g.map.length,16);assert.equal(availableNodes(g).length,3);
  assert.deepEqual(g.map.filter(n=>n.row===5).map(n=>n.kind),["boss"]);
  const left=availableNodes(g).find(n=>n.col===0);assert.ok(chooseNode(g,left.id));
  assert.equal(chooseNode(g,left.id),false);
  winFirstBattle(g);
  assert.ok(availableNodes(g).every(n=>n.row===1&&n.col<=1));
 }
});
test("cửa hàng bán mỗi thẻ một lần và thuốc hồi máu tiêu tốn vàng",()=>{
 const g=enterFirstBattle();winFirstBattle(g);
 const shop=availableNodes(g).find(n=>n.kind==="shop");assert.ok(shop);assert.ok(chooseNode(g,shop.id));
 assert.equal(g.shopStock.length,3);g.gold=100;g.hp=40;
 const item=g.shopStock[0],gold=g.gold;
 assert.ok(buyCard(g,item.id));assert.equal(g.gold,gold-item.price);
 assert.equal(buyCard(g,item.id),false);assert.ok(buyPotion(g));assert.equal(g.hp,62);
 assert.ok(leaveShop(g));assert.equal(g.phase,"map");
});
test("điểm nghỉ chỉ cho phép chọn một lần",()=>{
 const g=enterFirstBattle();winFirstBattle(g);
 const rest=availableNodes(g).find(n=>n.kind==="rest");assert.ok(chooseNode(g,rest.id));g.hp=30;
 assert.equal(takeRest(g,"vitality"),true);assert.equal(g.hp,38);assert.equal(g.maxHp,98);
 assert.equal(takeRest(g,"heal"),false);
});
test("sự kiện ngăn tự đánh đổi đến tử vong và có phương án an toàn",()=>{
 const g=enterFirstBattle();winFirstBattle(g);
 const event=availableNodes(g).find(n=>n.kind==="event");assert.ok(chooseNode(g,event.id));
 g.eventId="rift";g.hp=10;const gold=g.gold;
 assert.equal(chooseEvent(g,"risk"),false);assert.equal(chooseEvent(g,"safe"),true);
 assert.equal(g.gold,gold+14);assert.equal(g.phase,"map");
});
test("khôi phục tiến trình cùng phase thưởng và không trùng UID thẻ mới",()=>{
 const g=enterFirstBattle();g.enemy.hp=1;g.hand=[{id:"blade",uid:550000}];g.selected=[550000];
 playCard(g,550000);const copy=restoreGame(serializeGame(g));
 assert.ok(copy);assert.equal(copy.phase,"reward");assert.deepEqual(copy.route,g.route);
 const highest=Math.max(...copy.draw.concat(copy.hand,copy.discard).map(c=>c.uid));
 assert.ok(chooseReward(copy,copy.reward[0]));assert.ok(copy.discard.some(c=>c.uid>highest));
 assert.equal(restoreGame("invalid JSON"),null);
 assert.equal(restoreGame('{"version":"0.1.0"}'),null);
});
test("không thể đi nhánh không tồn tại và không thể tự ý nhận vàng từ shop",()=>{
 const g=createGame();assert.equal(chooseNode(g,"9-9"),false);assert.equal(buyPotion(g),false);
 assert.equal(takeRest(g,"heal"),false);assert.equal(chooseEvent(g,"safe"),false);
});
