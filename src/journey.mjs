// V0.2 branch layout; shuffled for each fresh run and saved with progress.
export const MAP_ROWS=[
 ["battle","battle","battle"],["shop","rest","event"],
 ["battle","elite","battle"],["rest","event","shop"],
 ["elite","battle","elite"],[null,"boss",null]
];
export const NODE_INFO={
 battle:{name:"Chiến đấu",symbol:"⚔",detail:"Vàng và thẻ thưởng"},
 elite:{name:"Tinh Anh",symbol:"✦",detail:"Kẻ địch mạnh, nhiều vàng"},
 shop:{name:"Cửa hàng",symbol:"◆",detail:"Mua thẻ và hồi máu"},
 rest:{name:"Điểm nghỉ",symbol:"☘",detail:"Hồi máu hay tu luyện"},
 event:{name:"Sự kiện",symbol:"◈",detail:"Phần thưởng và đánh đổi"},
 boss:{name:"Thủ Vệ Tinh Giới",symbol:"♛",detail:"Trận Boss cuối"}
};
const shuffled=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const generateMap=()=>MAP_ROWS.flatMap((types,row)=>
 (row===0||row===5?types:shuffled(types)).map((kind,col)=>kind?{id:row+"-"+col,row,col,kind}:null).filter(Boolean));
export const availableNodes=g=>g.phase!=="map"?[]:
 g.map.filter(n=>n.row===g.route.length&&(g.route.length===0||Math.abs(n.col-g.position)<=1));
export const mapIsValid=map=>Array.isArray(map)&&map.length===16&&
 map.every(n=>n&&Number.isInteger(n.row)&&Number.isInteger(n.col)&&n.row>=0&&n.row<6&&n.col>=0&&n.col<3&&n.id===n.row+"-"+n.col&&MAP_ROWS[n.row].includes(n.kind))&&
 new Set(map.map(n=>n.id)).size===16&&MAP_ROWS.every((row,i)=>map.filter(n=>n.row===i).length===row.filter(Boolean).length);
