const fields={
 household:"name locality other adults youth kids",
 guardians:"mobile guardian guardianPhone pickup pickupPhone",
 trip:"tripCity tripAdults tripChildren",
 children:"first last gender age grade notes meetings pickupOverride",
 rooms:"guest number arrival departure"
};
const groups=["household","guardians","trip"];
const collections=["children","rooms"];
const numbers=new Set(["age","adults","kids","youth","tripAdults","tripChildren"]);
const empty=()=>({household:{},guardians:{},trip:{},children:{},rooms:{},childrenOrder:[],roomsOrder:[]});
export function form(record=empty()){
 const stringify=obj=>Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,typeof v==="number"?String(v):v]));
 const result=Object.assign({},...groups.map(g=>stringify(record[g])));
 for(const g of collections)result[g]=record[g+"Order"].map(id=>({id,...stringify(record[g][id]),...(g==="children"?{meetings:record[g][id].meetings||[]}: {})}));
 return result;
}
export function changes(before,after){
 const ops=[];
 function compare(group,id,a,b){
  for(const k of fields[group].split(" ")){
   const fallback=k==="meetings"?[]:"";
   if(JSON.stringify(a[k]??fallback)!==JSON.stringify(b[k]??fallback))ops.push({group,id,field:k,value:b[k]??fallback});
  }
 }
 for(const group of groups)compare(group,undefined,before,after);
 for(const group of collections){
  const previous=new Map(before[group].map(v=>[v.id,v]));
  for(const row of after[group]){
   if(!previous.has(row.id))ops.push({group,id:row.id,action:"add"});
   compare(group,row.id,previous.get(row.id)||{},row);
   previous.delete(row.id);
  }
  for(const id of previous.keys())ops.push({group,id,action:"remove"});
 }
 return ops;
}
export function applyChanges(old,ops){
 if(!Array.isArray(ops)||!ops.length||ops.length>256)throw Error("Invalid changes.");
 const record=old?structuredClone(old):empty();
 for(const {group,id,field,value,action} of ops){
  if(!Object.hasOwn(fields,group))throw Error("Unknown section.");
  let target=record[group];
  if(collections.includes(group)){
   if(typeof id!=="string"||!/^[a-f0-9-]{36}$/i.test(id))throw Error("Invalid entry ID.");
   if(action==="add" && !target[id]){if(record[group+"Order"].length>=30)throw Error("Too many entries.");target[id]={};record[group+"Order"].push(id);continue;}
   if(action==="remove" && target[id]){delete target[id];record[group+"Order"]=record[group+"Order"].filter(v=>v!==id);continue;}
   target=target[id];
  }
  if(!target||action||!fields[group].split(" ").includes(field))throw Error("Invalid field.");
  if(field==="meetings"){
   if(!Array.isArray(value)||value.length>3||!value.every(v=>["satAM","satPM","sunAM"].includes(v)))throw Error("Invalid meetings.");
   target[field]=value;
  }else{
   if(typeof value!=="string"||value.length>4000)throw Error("Invalid field value.");
   if(value==="")delete target[field];
   else if(numbers.has(field)){if(!/^\d{1,3}$/.test(value))throw Error("Enter a whole number from 0 to 999.");target[field]=Number(value);}
   else target[field]=value;
  }
 }
 return record;
}
// Diff native documents into non-overlapping DynamoDB paths. New maps are set as a unit.
export function paths(a,b,path=[],out=[]){
 for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
  const x=a[k],y=b[k],p=[...path,k];
  if(x && y && typeof x==="object" && typeof y==="object" && !Array.isArray(x)&&!Array.isArray(y))paths(x,y,p,out);
  else if(JSON.stringify(x)!==JSON.stringify(y))out.push([p,y]);
 }
 return out;
}
