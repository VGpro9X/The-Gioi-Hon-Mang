// V0.5. Special cards can ONLY be acquired from elite Ascension; evolutions
// replace one existing card in the deck, preserving its unique ID and forge rank.
export const GOD_CARDS={
  god_thunder:{name:"Cửu Thiên Lôi Kiếp",cost:3,school:"Lôi",kind:"magic",rarity:"divine",icon:"bolt",desc:"Gây 24 sát thương +4 mỗi Lôi Ấn. Đặt 3 Lôi Ấn. Hai cuối lượt kế tiếp giáng thêm 7 sát thương."},
  god_flame:{name:"Thiên Hỏa Phượng Hoàng",cost:3,school:"Hỏa",kind:"magic",rarity:"divine",icon:"flame",desc:"Gây 24 sát thương, đặt 5 Thiêu Đốt và hồi 9 Máu."},
  god_frost:{name:"Vĩnh Hằng Băng Ngục",cost:2,school:"Băng",kind:"magic",rarity:"divine",icon:"snow",desc:"Gây 15 sát thương, đặt 5 Băng Giá và nhận 15 Khiên."},
  god_blood:{name:"Huyết Thần Giáng Thế",cost:2,school:"Huyết",kind:"attack",rarity:"divine",icon:"blood",desc:"Hiến 6 Máu nếu có thể, gây 23 sát thương +4 mỗi Xuất Huyết; thêm 3 Xuất Huyết và hồi 10 Máu."},
  god_venom:{name:"Vạn Độc Quy Tông",cost:3,school:"Độc",kind:"magic",rarity:"divine",icon:"poison",desc:"Đặt 8 Độc rồi kích hoạt tức thời sát thương bằng 3 lần tổng Độc hiện có."},
  god_time:{name:"Thiên Luân Hồi",cost:2,school:"Thời Không",kind:"magic",rarity:"divine",icon:"clock",desc:"Rút thêm 2 thẻ, nhận 1 năng lượng và 8 Khiên. Có thể chọn chuỗi tiếp cùng lượt."},
  god_summon:{name:"Thiên Binh Lệnh",cost:2,school:"Triệu Hồi",kind:"summon",rarity:"divine",icon:"summon",desc:"Triệu hồi 2 Linh Hồn và 1 Thạch Vệ (theo giới hạn hiện có), nhận 8 Khiên."},
  god_cosmos:{name:"Thái Sơ Kiếm Ấn",cost:3,school:"Hỗn Mang",kind:"attack",rarity:"divine",icon:"star",desc:"Gây 16 sát thương +6 mỗi loại hiệu ứng xấu khác nhau trên địch, sau đó thêm 1 tầng của cả 5 loại."}
};
export const MYSTERY_CARDS={
  mystery_void:{name:"Vô Tướng Vô Hình",cost:3,school:"Hỗn Mang",kind:"magic",rarity:"mystery",icon:"star",desc:"Tiêu thụ mọi hiệu ứng xấu hiện có: gây 12 sát thương mỗi loại và nhận 5 Khiên mỗi loại; nếu không có nhận 15 Khiên."},
  mystery_immortal:{name:"Bất Diệt Thần Hồn",cost:2,school:"Huyết",kind:"passive",rarity:"mystery",icon:"blood",desc:"Mỗi trận chuẩn bị một lần hồi sinh khi chịu đòn chí mạng: hồi 35 Máu, không cộng dồn."},
  mystery_paradox:{name:"Thời Không Nghịch Lý",cost:1,school:"Thời Không",kind:"magic",rarity:"mystery",icon:"clock",desc:"Gây 14 sát thương dư âm nếu đã dùng chiêu khác; rút 1 thẻ và nhận 1 năng lượng, mở thêm lượt chọn bài."},
  mystery_eclipse:{name:"Nhật Nguyệt Song Sinh",cost:3,school:"Hỗn Mang",kind:"magic",rarity:"mystery",icon:"star",desc:"Gây 18 sát thương; nếu địch vừa có Thiêu Đốt vừa có Băng Giá, gây thêm 18. Sau đó đặt 3 tầng mỗi loại."},
  mystery_genesis:{name:"Hỗn Nguyên Khai Thiên",cost:3,school:"Hỗn Mang",kind:"magic",rarity:"mystery",icon:"star",desc:"Gây 18 sát thương, gấp đôi nếu địch đang có đủ 5 loại trạng thái; tiếp tục đặt thêm 2 tầng mỗi loại."}
};
export const EVOLUTIONS={
  blade:{id:"evo_blade",name:"Vạn Kiếm Quy Tông",cost:2,school:"Kiếm Đạo",kind:"attack",rarity:"evolved",icon:"sword",desc:"Chém 3 lần mỗi lần 9 sát thương; mỗi Kiếm Ý tăng sát thương từng nhát."},
  spark:{id:"evo_spark",name:"Thiên Lôi Liên Trảm",cost:1,school:"Lôi",kind:"magic",rarity:"evolved",icon:"bolt",desc:"Gây 12 sát thương và đặt 4 Lôi Ấn."},
  ember:{id:"evo_ember",name:"Hỏa Liên Táng",cost:1,school:"Hỏa",kind:"magic",rarity:"evolved",icon:"flame",desc:"Gây 9 sát thương và đặt 4 Thiêu Đốt."},
  frost:{id:"evo_frost",name:"Băng Hà Liệt Phá",cost:1,school:"Băng",kind:"magic",rarity:"evolved",icon:"snow",desc:"Gây 9 sát thương, đặt 4 Băng Giá và nhận 5 Khiên."},
  bleed:{id:"evo_bleed",name:"Huyết Nguyệt Trảm",cost:1,school:"Huyết",kind:"attack",rarity:"evolved",icon:"blood",desc:"Gây 9 sát thương, đặt 4 Xuất Huyết và hồi 4 Máu."},
  venom:{id:"evo_venom",name:"Độc Long Nha",cost:1,school:"Độc",kind:"magic",rarity:"evolved",icon:"poison",desc:"Gây 8 sát thương và đặt 5 Độc."},
  wisp:{id:"evo_wisp",name:"Thiên Linh Triệu Hoán",cost:1,school:"Triệu Hồi",kind:"summon",rarity:"evolved",icon:"summon",desc:"Triệu hồi 2 Linh Hồn và 1 Thạch Vệ, không vượt quá giới hạn triệu hồi."}
};
export const EVOLVED_CARDS=Object.fromEntries(Object.values(EVOLUTIONS).map(({id,...card})=>[id,card]));
export const SPECIAL_CARDS={...GOD_CARDS,...MYSTERY_CARDS,...EVOLVED_CARDS};
export const GOD_IDS=Object.keys(GOD_CARDS);
export const MYSTERY_IDS=Object.keys(MYSTERY_CARDS);
export const EVOLVED_IDS=Object.keys(EVOLVED_CARDS);

// Elite stage three: 15% chance for one secret choice; elite stage five: 35%.
// This is an offer probability, not a guarantee to acquire, and caps at 35%.
export const mysteryRate=stage=>stage>=5?.35:stage>=3?.15:0;
export function ascensionOffers(stage,random=Math.random){
 const shuffled=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
 }return a;};
 const gods=shuffled(GOD_IDS).slice(0,3);
 if(random()<mysteryRate(stage))gods[2]=shuffled(MYSTERY_IDS)[0];
 return gods;
}
