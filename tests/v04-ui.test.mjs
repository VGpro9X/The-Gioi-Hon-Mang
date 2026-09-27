import test from "node:test";
import assert from "node:assert/strict";
import {createGame,chooseNode,availableNodes,playCard,chooseReward,serializeGame} from "../src/core.mjs";

test("rest forge UI: select real card, save upgrade and return to map",async()=>{
 const g=createGame();chooseNode(g,availableNodes(g).find(n=>n.col===1).id);
 g.enemy.hp=1;g.hand=[{id:"blade",uid:880001,level:0}];g.selected=[880001];
 assert.ok(playCard(g,880001));assert.ok(chooseReward(g,g.reward[0]));
 const rest=availableNodes(g).find(n=>n.kind==="rest");assert.ok(chooseNode(g,rest.id));
 const storage=new Map([["tghm-v06-save",serializeGame(g)]]);
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 globalThis.window={addEventListener:()=>{},confirm:()=>true};
 const events={};
 const app={innerHTML:"",querySelector:()=>null,addEventListener:(type,callback)=>events[type]=callback};
 globalThis.document={querySelector:()=>app};
 await import("../src/main.mjs");
 assert.match(app.innerHTML,/data-rest="upgrade"/);
 assert.match(app.innerHTML,/DI VẬT ĐANG SỞ HỮU/);
 const click=attributes=>{
   const btn={getAttribute:name=>attributes[name]??null,dataset:{action:attributes["data-action"]}};
   events.click({target:{closest:()=>btn}});
 };
 click({"data-rest":"upgrade"});
 assert.match(app.innerHTML,/data-upgrade="\d+"/);
 const selected=app.innerHTML.match(/data-upgrade="(\d+)"/);assert.ok(selected);
 click({"data-upgrade":selected[1]});
 assert.match(app.innerHTML,/route-map/);
 const saved=JSON.parse(storage.get("tghm-v06-save"));
 assert.equal(saved.version,"0.6.0");assert.equal(saved.phase,"map");
 assert.equal([...saved.draw,...saved.hand,...saved.discard].filter(c=>c.level===1).length,1);
});
