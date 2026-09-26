// Distinct lightweight procedural VFX for all 50 cards. CSS owns animation; the
// renderer is deterministic and safe to call repeatedly on modest mobile devices.
const fx=(form,tone,sparks=5,twist=0)=>Object.freeze({form,tone,sparks,twist});
export const CARD_FX={
 blade:fx("slash","steel",3),guard:fx("dome","aegis",5),
 twin:fx("cross-slash","steel",5),spark:fx("fork","lightning",5),
 ember:fx("fireball","fire",7),frost:fx("shards","frost",6),
 bleed:fx("crescent","blood",5),leech:fx("spiral","blood",4),
 shatter:fx("shatter","frost",9),surge:fx("rune","arcane",5),
 chain:fx("storm","lightning",8),ignite:fx("eruption","fire",9),
 reap:fx("scythe","blood",7),bulwark:fx("bastion","aegis",6),
 storm:fx("thunderbolt","lightning",10),meteor:fx("meteor","fire",10),
 glacier:fx("icewall","frost",9),phoenix:fx("phoenix","blood",7),
 cosmos:fx("cosmos","cosmic",11),riposte:fx("reflect","aegis",6),
 venom:fx("needle","poison",5),toxinburst:fx("venomnova","poison",9),
 plague:fx("mist","poison",9),serpent:fx("serpent","poison",7),
 antivenom:fx("elixir","poison",5),quicken:fx("clock","time",5),
 rewind:fx("reverse-clock","time",7),chronostep:fx("portal","time",7),
 timecut:fx("rift","time",7),timeloop:fx("hourglass","time",10),
 wisp:fx("summon","spirit",5),golem:fx("monolith","spirit",8),
 swarm:fx("swarm","spirit",10),sacrifice:fx("sacrifice","spirit",9),
 spiritbond:fx("constellation","spirit",7),steam:fx("steam","cosmic",8),
 thunderfire:fx("dual-storm","cosmic",11),crystalbolt:fx("crystalbolt","cosmic",9),
 bloodflame:fx("bloodflame","cosmic",9),entropy:fx("entropynova","cosmic",12),
 stormheart:fx("sigil","lightning",5),pyromancer:fx("sigil","fire",5),
 venomheart:fx("sigil","poison",5),swordmaster:fx("sigil","steel",5),
 spiritwell:fx("sigil","spirit",5),mirrorward:fx("reflect","aegis",6),
 thornmail:fx("thorns","aegis",7),frostward:fx("icewall","frost",7),
 bloodpact:fx("bloodrune","blood",7),counterstrike:fx("counter","steel",10),
 god_thunder:fx("divine-thunder","lightning",12),god_flame:fx("divine-phoenix","fire",12),
 god_frost:fx("divine-prism","frost",11),god_blood:fx("divine-blood","blood",11),
 god_venom:fx("divine-serpent","poison",12),god_time:fx("divine-orbit","time",10),
 god_summon:fx("divine-sigil","spirit",11),god_cosmos:fx("divine-cosmos","cosmic",12),
 mystery_void:fx("secret-void","cosmic",12),mystery_immortal:fx("secret-immortal","blood",11),
 mystery_paradox:fx("secret-paradox","time",12),mystery_eclipse:fx("secret-eclipse","cosmic",12),
 mystery_genesis:fx("secret-genesis","cosmic",12),
 evo_blade:fx("evolution-sword","steel",10),evo_spark:fx("evolution-lightning","lightning",10),
 evo_ember:fx("evolution-flame","fire",10),evo_frost:fx("evolution-ice","frost",10),
 evo_bleed:fx("evolution-blood","blood",10),evo_venom:fx("evolution-venom","poison",10),
 evo_wisp:fx("evolution-spirit","spirit",10)
};
const SAFE_NAME=/^[\p{L}\p{N} \-+]+$/u;
export function effectPreset(id){return CARD_FX[id]||fx("rune","arcane",4);}
export function effectMarkup(id,name="Kỹ năng",upgraded=false){
 const p=effectPreset(id),display=SAFE_NAME.test(name)?name:"Kỹ năng";
 const particles=Array.from({length:p.sparks},(_,i)=>'<i class="skill-particle" style="--i:'+i+';--count:'+p.sparks+'"></i>').join("");
 return '<div class="skill-fx skill-fx-'+p.tone+' shape-'+p.form+'" data-skill-fx="'+id+'" aria-hidden="true">'+
  '<span class="skill-fx-halo"></span><span class="skill-fx-trace"></span>'+
  '<span class="skill-fx-core"></span><span class="skill-fx-particles">'+particles+'</span>'+
  '<span class="skill-fx-label">'+display+(upgraded?' ✦':'')+'</span></div>';
}
