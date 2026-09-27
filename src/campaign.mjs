// V0.6: Three region campaign + persistent, strictly local achievements.
export const REALMS=[
 {id:"nebula",name:"Tinh Vân Khởi Nguyên",short:"Tinh Vân",subtitle:"Ánh sao và vết nứt đầu tiên",
  boss:"Thủ Vệ Tinh Giới",enemy:"Ảnh Lang",elite:"Kỵ Sĩ Vực Sâu",tone:"nebula",hpScale:1,attackBonus:0,defenseBonus:0},
 {id:"void",name:"Vực Sâu Hư Không",short:"Hư Không",subtitle:"Bóng tối đang nuốt chửng các vì sao",
  boss:"Chúa Tể Hư Không",enemy:"Ảnh Ma Hư Vô",elite:"Kỵ Sĩ Hắc Tinh",tone:"void",hpScale:1.23,attackBonus:3,defenseBonus:3},
 {id:"chaos",name:"Long Mạch Hỗn Mang",short:"Hỗn Mang",subtitle:"Nơi nguyên tố hòa làm một",
  boss:"Hỗn Mang Thần Long",enemy:"Hỗn Mang Thú",elite:"Long Vệ Hỗn Mang",tone:"chaos",hpScale:1.53,attackBonus:5,defenseBonus:6}
];
export const ACT_BOONS={
  vitality:{id:"vitality",name:"Tẩy Tủy Tinh Quang",icon:"blood",desc:"Tăng 12 Máu tối đa, hồi 24 Máu."},
  riches:{id:"riches",name:"Tinh Vân Tài Khố",icon:"star",desc:"Nhận 90 vàng để chuẩn bị cho khu vực mới."},
  blessing:{id:"blessing",name:"Linh Hồn Chúc Phúc",icon:"summon",desc:"Nhận một Di Vật chưa sở hữu, nếu đã đủ sẽ nhận 60 vàng; đồng thời hồi 12 Máu."}
};
export const ACHIEVEMENTS={
 first_boss:{name:"Vượt Ngưỡng Tinh Vân",desc:"Đánh bại Boss khu vực I.",unlock:"Lượt chơi mới bắt đầu với +8 Máu tối đa."},
 first_divine:{name:"Chạm Tới Thần Đạo",desc:"Sở hữu ít nhất một Thần Kỹ hoặc Thần Bí Kỹ.",unlock:"Thành tích bộ sưu tập."},
 relic_hunter:{name:"Kẻ Sưu Tầm Di Vật",desc:"Sở hữu từ 3 Di Vật trong một lượt chơi.",unlock:"Thành tích bộ sưu tập."},
 master_smith:{name:"Thợ Rèn Tinh Giới",desc:"Có 3 thẻ nâng cấp +1 trong bộ bài.",unlock:"Thành tích bộ sưu tập."},
 void_breaker:{name:"Phá Giới Hư Không",desc:"Đánh bại Boss khu vực II.",unlock:"Thành tích hành trình."},
 three_realms:{name:"Thống Nhất Tam Giới",desc:"Hoàn thành ba khu vực trong một lượt chơi.",unlock:"Lượt chơi mới nhận thêm 1 thẻ phổ thông cấp hiếm Uncommon."},
 rich_victor:{name:"Chiến Thắng Sung Túc",desc:"Hoàn thành ba khu vực với ít nhất 150 vàng.",unlock:"Thành tích thử thách."},
 survivor:{name:"Sinh Tồn Bất Khuất",desc:"Hoàn thành ba khu vực với ít nhất 40 Máu còn lại.",unlock:"Thành tích thử thách."}
};
export const ACHIEVEMENT_IDS=Object.keys(ACHIEVEMENTS);
export const newProfile=()=>({version:1,runs:0,wins:0,bestRealm:0,bestTurns:null,unlocked:[]});
export function restoreProfile(raw){
 try{
  if(raw==null)return newProfile();
  const p=typeof raw==="string"?JSON.parse(raw):raw;
  if(!p||p.version!==1||!Number.isSafeInteger(p.runs)||p.runs<0||p.runs>1e7||
     !Number.isSafeInteger(p.wins)||p.wins<0||p.wins>p.runs||
     !Number.isSafeInteger(p.bestRealm)||p.bestRealm<0||p.bestRealm>3||
     !(p.bestTurns===null||(Number.isSafeInteger(p.bestTurns)&&p.bestTurns>0&&p.bestTurns<1e6))||
     !Array.isArray(p.unlocked)||p.unlocked.length>ACHIEVEMENT_IDS.length||
     !p.unlocked.every(id=>ACHIEVEMENTS[id])||new Set(p.unlocked).size!==p.unlocked.length)return newProfile();
  return {version:1,runs:p.runs,wins:p.wins,bestRealm:p.bestRealm,bestTurns:p.bestTurns,unlocked:[...p.unlocked]};
 }catch{return newProfile();}
}
export const profileBonuses=p=>({
 maxHp:p?.unlocked?.includes("first_boss")?8:0,
 bonusUncommon:!!p?.unlocked?.includes("three_realms")
});
export const isSpecial=id=>typeof id==="string"&&(id.startsWith("god_")||id.startsWith("mystery_"));
export function eligibleAchievements(game){
 const totalCards=[...(game.draw||[]),...(game.hand||[]),...(game.discard||[])];
 const bosses=game.bossesDefeated||0;
 const result=[];
 if(bosses>=1)result.push("first_boss");
 if(totalCards.some(c=>isSpecial(c.id)))result.push("first_divine");
 if((game.relics||[]).length>=3)result.push("relic_hunter");
 if(totalCards.filter(c=>(c.level||0)===1).length>=3)result.push("master_smith");
 if(bosses>=2)result.push("void_breaker");
 if(bosses>=3&&game.phase==="won"){
  result.push("three_realms");
  if(game.gold>=150)result.push("rich_victor");
  if(game.hp>=40)result.push("survivor");
 }
 return result;
}
// Caller invokes this on a checkpoint or ending; ending is idempotent per run.
export function recordProfile(profile,game){
 const fresh=eligibleAchievements(game).filter(id=>!profile.unlocked.includes(id));
 profile.unlocked.push(...fresh);
 profile.bestRealm=Math.max(profile.bestRealm,Math.min(3,game.bossesDefeated||0));
 if(["won","lost"].includes(game.phase)&&!game.profileRecorded){
  profile.runs++;
  if(game.phase==="won"){
   profile.wins++;
   const turns=game.stats?.turns||0;
   if(turns>0&&(profile.bestTurns===null||turns<profile.bestTurns))profile.bestTurns=turns;
  }
  game.profileRecorded=true;
 }
 return fresh;
}
