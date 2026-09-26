import test from "node:test";
import assert from "node:assert/strict";

test("UI smoke: 50-card library filters, map route, autosave and battle render",async()=>{
 const storage=new Map(),handlers={};
 globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
 globalThis.window={addEventListener:()=>{},confirm:()=>true};
 const app={innerHTML:"",querySelector:()=>null,addEventListener:(type,fn)=>{handlers[type]=fn;}};
 globalThis.document={querySelector:()=>app};
 await import("../src/main.mjs");
 assert.match(app.innerHTML,/route-map/);
 const click=(attributes={})=>{
  const button={getAttribute:name=>attributes[name]??null,dataset:{action:attributes["data-action"]}};
  handlers.click({target:{closest:()=>button}});
 };
 click({"data-action":"collection"});
 assert.match(app.innerHTML,/50 KỸ NĂNG/);
 assert.match(app.innerHTML,/data-filter="passive"/);
 click({"data-filter":"passive"});
 assert.match(app.innerHTML,/Đang hiển thị 5 \/ 50 thẻ/);
 click({"data-filter":"reaction"});
 assert.match(app.innerHTML,/Đang hiển thị 5 \/ 50 thẻ/);
 click({"data-action":"close"});
 assert.match(app.innerHTML,/route-map/);
 const match=app.innerHTML.match(/class="route-node [^"]*is-available[^"]*" data-node="([^"]+)"/);
 assert.ok(match,"Initial route must expose selectable nodes");
 click({"data-node":match[1]});
 assert.match(app.innerHTML,/class="arena"/);
 assert.match(app.innerHTML,/BỘ BÀI TRÊN TAY/);
 assert.match(app.innerHTML,/THIÊN PHÚ/);
 assert.match(app.innerHTML,/PHẢN ỨNG ĐÃ CHUẨN BỊ/);
 assert.match(app.innerHTML,/DI VẬT/);
 const saved=JSON.parse(storage.get("tghm-v04-save"));
 assert.equal(saved.stage,1);assert.equal(saved.version,"0.4.0");
 assert.equal(saved.phase,"planning");
});
