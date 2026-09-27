import test from "node:test";
import assert from "node:assert/strict";
import {REALMS,ACT_BOONS,ACHIEVEMENTS,newProfile,restoreProfile,profileBonuses,
 eligibleAchievements,recordProfile} from "../src/campaign.mjs";
import {createGame,enemyTemplate,availableNodes,chooseNode,playCard,chooseReward,chooseDivine,skipAscension,
 leaveShop,takeRest,chooseEvent,chooseActBoon,getIntent,serializeGame,restoreGame} from "../src/core.mjs";

let uid=2000000;
function playEasy(g){
 g.enemy.hp=1;g.enemy.shield=0;const c={id:"blade",uid:uid++,level:0};
 g.hand.push(c);g.selected=[c.uid];g.energy=3;
 assert.equal(playCard(g,c.uid),true);
}
function progress(g,stop="act-clear"){
 let ticks=0;
 while(g.phase!==stop&&g.phase!=="won"&&g.phase!=="lost"&&ticks++<50){
   switch(g.phase){
    case "map":{const available=availableNodes(g),node=available.find(n=>n.col===1)||available[0];
      assert.ok(node);assert.ok(chooseNode(g,node.id));break;}
    case "planning":playEasy(g);break;
    case "reward":assert.ok(chooseReward(g,g.reward[0]));break;
    case "ascend":assert.ok(skipAscension(g));break;
    case "shop":assert.ok(leaveShop(g));break;
    case "rest":assert.ok(takeRest(g,"vitality"));break;
    case "event":assert.ok(chooseEvent(g,"safe"));break;
    default:assert.fail("Unexpected campaign phase: "+g.phase);
   }
 }
 assert.ok(ticks<50,"Campaign must terminate each act within finite actions");
 return g;
}
test("three regions have different enemy identities, increasing threat and visible themes",()=>{
 assert.equal(REALMS.length,3);
 assert.deepEqual(REALMS.map(r=>r.tone),["nebula","void","chaos"]);
 const b=REALMS.map((_,i)=>enemyTemplate(6,"boss",i+1));
 assert.equal(new Set(b.map(x=>x.name)).size,3);
 assert.ok(b[0].maxHp<b[1].maxHp&&b[1].maxHp<b[2].maxHp);
 assert.ok(b[0].attack<b[1].attack&&b[1].attack<b[2].attack);
 assert.equal(b[0].act,1);assert.equal(b[2].act,3);
 const v=createGame();v.enemy=enemyTemplate(3,"battle",2);v.turn=5;
 assert.equal(getIntent(v).kind,"drain");
 v.enemy=enemyTemplate(3,"battle",3);v.turn=4;
 assert.equal(getIntent(v).kind,"rupture");
});
test("first Boss opens blessings; vitality keeps all cards and starts region II",()=>{
 const g=progress(createGame());assert.equal(g.phase,"act-clear");
 assert.equal(g.act,1);assert.equal(g.stage,6);assert.equal(g.bossesDefeated,1);
 assert.deepEqual(g.actReward,Object.keys(ACT_BOONS));
 assert.equal(chooseActBoon(g,"fake"),false);
 const owned=[...g.draw,...g.discard,...g.hand].map(c=>c.uid).sort((a,b)=>a-b);
 const previousMax=g.maxHp;
 assert.ok(chooseActBoon(g,"vitality"));
 assert.equal(g.act,2);assert.equal(g.phase,"map");
 assert.equal(g.maxHp,previousMax+12);assert.equal(g.stage,0);
 assert.equal(g.route.length,0);assert.equal(g.actHistory.length,1);
 assert.equal(g.actBoons[0],"vitality");
 assert.deepEqual([...g.draw,...g.discard,...g.hand].map(c=>c.uid).sort((a,b)=>a-b),owned);
 assert.equal(chooseActBoon(g,"vitality"),false);
 const restored=restoreGame(serializeGame(g));
 assert.ok(restored);assert.equal(restored.act,2);assert.equal(restored.stage,0);
 assert.deepEqual(restored.actHistory,g.actHistory);
 assert.ok(availableNodes(restored).length===3);
});
test("each inter-realm boon is exclusive; treasure and relic options apply different resources",()=>{
 const gold=progress(createGame()),before=gold.gold;
 assert.ok(chooseActBoon(gold,"riches"));assert.equal(gold.gold,before+90);
 assert.equal(gold.actBoons.length,1);
 const relic=progress(createGame()),hp=relic.hp,count=relic.relics.length;
 assert.ok(chooseActBoon(relic,"blessing"));assert.equal(relic.act,2);
 assert.equal(relic.hp,Math.min(relic.maxHp,hp+12));
 assert.equal(relic.relics.length,count+1);
});
test("campaign moves across all eighteen floors, preserves cards and ends only on region III Boss",()=>{
 const g=createGame();const profile=newProfile();
 progress(g);assert.equal(g.act,1);
 let fresh=recordProfile(profile,g);
 assert.deepEqual(fresh,["first_boss"]);assert.equal(profile.runs,0);
 assert.ok(chooseActBoon(g,"riches"));assert.equal(g.act,2);
 progress(g);assert.equal(g.phase,"act-clear");assert.equal(g.act,2);
 fresh=recordProfile(profile,g);assert.ok(fresh.includes("void_breaker"));
 assert.ok(chooseActBoon(g,"vitality"));assert.equal(g.act,3);
 progress(g,"won");
 assert.equal(g.phase,"won");assert.equal(g.bossesDefeated,3);
 assert.equal(g.actHistory.length,2);assert.equal(g.route.length,6);
 assert.equal(g.actBoons.length,2);assert.equal(g.stage,6);
 assert.equal(availableNodes(g).length,0);
 fresh=recordProfile(profile,g);
 assert.ok(fresh.includes("three_realms"));
 assert.equal(profile.runs,1);assert.equal(profile.wins,1);
 assert.equal(profile.bestRealm,3);assert.ok(profile.bestTurns>0);
 const stored=restoreGame(serializeGame(g));assert.ok(stored);
 assert.equal(stored.phase,"won");assert.equal(stored.act,3);
 recordProfile(profile,g);assert.equal(profile.runs,1);
});
test("previously won V0.5 save converts to first-area blessing rather than losing progress",()=>{
 const g=progress(createGame());g.version="0.5.0";g.phase="won";
 for(const key of ["act","totalActs","bossesDefeated","actHistory","actBoons","actReward","profileRecorded"])delete g[key];
 const previous=[...g.draw,...g.discard,...g.hand].map(c=>c.uid).sort((a,b)=>a-b);
 const migrated=restoreGame(serializeGame(g));
 assert.ok(migrated);assert.equal(migrated.phase,"act-clear");
 assert.equal(migrated.act,1);assert.equal(migrated.bossesDefeated,1);
 assert.deepEqual(migrated.actReward,Object.keys(ACT_BOONS));
 assert.ok(chooseActBoon(migrated,"riches"));
 assert.equal(migrated.act,2);assert.equal(migrated.stage,0);
 assert.deepEqual([...migrated.draw,...migrated.discard,...migrated.hand].map(c=>c.uid).sort((a,b)=>a-b),previous);
});
test("persistent profile validates corrupt data, unlocks next-run perks and has eight goals",()=>{
 assert.equal(Object.keys(ACHIEVEMENTS).length,8);
 assert.deepEqual(restoreProfile("not JSON"),newProfile());
 assert.deepEqual(restoreProfile('{"version":1,"runs":-5}'),newProfile());
 const g=progress(createGame()),profile=newProfile();
 let earned=recordProfile(profile,g);assert.ok(earned.includes("first_boss"));
 assert.equal(profileBonuses(profile).maxHp,8);
 const buffed=createGame(profile);assert.equal(buffed.maxHp,98);assert.equal(buffed.hp,98);
 assert.equal(buffed.draw.length,14);
 assert.deepEqual(recordProfile(profile,g),[]);
 profile.unlocked.push("three_realms");
 const fullyBuffed=createGame(profile);
 assert.equal(fullyBuffed.maxHp,98);assert.equal(fullyBuffed.draw.length,15);
 assert.equal(fullyBuffed.draw.filter(c=>c.id&&typeof c.id==="string").length,15);
});
test("profile records a lost attempt exactly once and saves progress independently of winning",()=>{
 const p=newProfile(),g=createGame();g.phase="lost";g.hp=0;
 recordProfile(p,g);recordProfile(p,g);
 assert.equal(p.runs,1);assert.equal(p.wins,0);
 assert.equal(g.profileRecorded,true);assert.equal(p.bestRealm,0);
});
test("all eight achievements evaluate from actual run stats, without duplicate unlocks",()=>{
 const g=createGame();
 const cards=[...g.draw,...g.discard,...g.hand];for(const c of cards.slice(0,3))c.level=1;
 cards[3].id="god_thunder";
 g.relics=["thunderseal","embercore","toxincore"];
 g.bossesDefeated=3;g.act=3;g.phase="won";g.stage=6;g.gold=200;g.hp=70;g.stats.turns=28;
 const eligible=eligibleAchievements(g);
 assert.deepEqual(new Set(eligible),new Set(Object.keys(ACHIEVEMENTS)));
 const p=newProfile();assert.equal(recordProfile(p,g).length,8);
 assert.equal(p.runs,1);assert.equal(p.wins,1);
 assert.equal(recordProfile(p,g).length,0);assert.equal(p.runs,1);
 assert.deepEqual(profileBonuses(p),{maxHp:8,bonusUncommon:true});
});
test("Void and Chaos intentions represent different threat patterns in late regions",()=>{
 const game=createGame();assert.ok(chooseNode(game,availableNodes(game)[1].id));
 game.enemy=enemyTemplate(3,"battle",2);game.turn=5;
 const drain=getIntent(game);assert.equal(drain.kind,"drain");assert.match(drain.hint,/hút 4 Máu/);
 game.enemy=enemyTemplate(3,"battle",3);game.turn=4;
 const rupture=getIntent(game);assert.equal(rupture.kind,"rupture");assert.match(rupture.hint,/30% Khiên/);
});
test("invalid next-realm progress and impossible act rewards cannot be restored",()=>{
 const g=progress(createGame());assert.equal(g.phase,"act-clear");
 const absent=JSON.parse(serializeGame(g));absent.actReward=[];
 assert.equal(restoreGame(JSON.stringify(absent)),null);
 const wrong=JSON.parse(serializeGame(g));wrong.bossesDefeated=3;
 assert.equal(restoreGame(JSON.stringify(wrong)),null);
 assert.ok(chooseActBoon(g,"vitality"));
 const mangled=JSON.parse(serializeGame(g));mangled.actHistory=[];
 assert.equal(restoreGame(JSON.stringify(mangled)),null);
 const duplicate=JSON.parse(serializeGame(g));duplicate.actBoons=["vitality","vitality"];
 assert.equal(restoreGame(JSON.stringify(duplicate)),null);
});
