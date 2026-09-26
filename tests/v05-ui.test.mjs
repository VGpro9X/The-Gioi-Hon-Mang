import test from "node:test";
import assert from "node:assert/strict";
import {createGame,serializeGame,restoreGame} from "../src/core.mjs";

test("Divine altar renders all three offers and transforms a real card after a click",async()=>{
  const game=createGame();game.phase="ascend";game.divineOffers=["god_thunder","god_frost","mystery_void"];
  game.ascensionPending=true;
  const storage=new Map([["tghm-v05-save",serializeGame(game)]]),handlers={};
  globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
  globalThis.window={addEventListener:()=>{},confirm:()=>true};
  const app={innerHTML:"",querySelector:()=>null,addEventListener:(key,handler)=>handlers[key]=handler};
  globalThis.document={querySelector:()=>app};
  await import("../src/main.mjs");
  assert.match(app.innerHTML,/THẦN ĐÀN · THỨC TỈNH/);
  assert.match(app.innerHTML,/data-divine="god_thunder"/);
  assert.match(app.innerHTML,/data-divine="mystery_void"/);
  const match=app.innerHTML.match(/data-evolve="(\d+)"/);
  assert.ok(match,"Initial deck includes at least one evolvable physical card");
  const button={getAttribute:name=>name==="data-evolve"?match[1]:null,dataset:{}};
  handlers.click({target:{closest:()=>button}});
  assert.match(app.innerHTML,/route-map/);
  const saved=restoreGame(storage.get("tghm-v05-save"));
  assert.ok(saved);
  assert.equal(saved.phase,"map");assert.equal(saved.ascensionsTaken,1);
  assert.ok([...saved.draw,...saved.hand,...saved.discard].some(c=>c.id.startsWith("evo_")));
  assert.equal(saved.ascensionPending,false);
});
