import test from "node:test";
import assert from "node:assert/strict";

test("UI smoke: route screen renders, selecting route starts combat and autosaves",async()=>{
 const storage=new Map(),handlers={};
 globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
 globalThis.window={addEventListener:()=>{},confirm:()=>true};
 const app={innerHTML:"",querySelector:()=>null,addEventListener:(type,fn)=>{handlers[type]=fn;}};
 globalThis.document={querySelector:()=>app};
 await import("../src/main.mjs");
 assert.match(app.innerHTML,/route-map/);
 const match=app.innerHTML.match(/class="route-node [^"]*is-available[^"]*" data-node="([^"]+)"/);
 assert.ok(match,"Initial route must expose selectable nodes");
 const button={
  getAttribute:name=>name==="data-node"?match[1]:null,
  dataset:{}
 };
 handlers.click({target:{closest:()=>button}});
 assert.match(app.innerHTML,/class="arena"/);
 assert.match(app.innerHTML,/BỘ BÀI TRÊN TAY/);
 const saved=JSON.parse(storage.get("tghm-v02-save"));
 assert.equal(saved.stage,1);assert.equal(saved.phase,"planning");
});
