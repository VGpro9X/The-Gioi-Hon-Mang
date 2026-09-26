// V0.4 collectible run-long relics. No external artwork or dependencies.
export const RELICS={
  thunderseal:{name:"Lôi Ấn Cổ",icon:"bolt",tone:"electric",price:68,desc:"Mỗi lá thuộc hệ Lôi đặt thêm 1 Lôi Ấn."},
  embercore:{name:"Hỏa Chủng",icon:"flame",tone:"fire",price:68,desc:"Mỗi lá thuộc hệ Hỏa đặt thêm 1 Thiêu Đốt."},
  toxincore:{name:"Độc Tinh",icon:"poison",tone:"poison",price:68,desc:"Mỗi lá thuộc hệ Độc đặt thêm 1 Độc."},
  starward:{name:"Tinh Thuẫn",icon:"shield",tone:"shield",price:75,desc:"Mỗi khi bước vào trận mới, nhận ngay 10 Khiên."},
  spiritbell:{name:"Chuông Triệu Linh",icon:"summon",tone:"summon",price:78,desc:"Cuối lượt, mỗi Linh Hồn gây thêm 2 sát thương."},
  bloodchalice:{name:"Huyết Ngọc",icon:"blood",tone:"blood",price:72,desc:"Sau khi thắng trận thường hoặc Tinh Anh, hồi thêm 5 Máu."}
};
export const RELIC_IDS=Object.keys(RELICS);
export const hasRelic=(g,id)=>Array.isArray(g.relics)&&g.relics.includes(id);
export const availableRelics=g=>RELIC_IDS.filter(id=>!hasRelic(g,id));
export const relicOffer=g=>{const choices=availableRelics(g);return choices.length?choices[Math.floor(Math.random()*choices.length)]:null;};
