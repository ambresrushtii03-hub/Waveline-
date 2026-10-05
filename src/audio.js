/* ---------- procedural audio (no external files) ---------- */
export function makeWav(t){
const sr=11025,dur=40,n=sr*dur,d=new Float32Array(n),beat=60/t.bpm;
let seed=t.id*7919;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const sc=t.minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11],prog=t.minor?[0,5,3,4]:[0,4,5,3];
const note=(st,len,f,a,k)=>{for(let s=Math.floor(st*sr);s<Math.min(n,Math.floor((st+len)*sr));s++){const x=s/sr-st,w=2*Math.PI*f*x;
const env=Math.exp(-x*k)*Math.min(1,x*90);d[s]+=(Math.sin(w)+.35*Math.sin(2*w)+.15*Math.sin(3*w))*env*a}};
let deg=2;
for(let i=0;i<dur/(beat/2);i++){const tm=i*beat/2,ch=Math.floor(i/8)%4,r=t.root*Math.pow(2,sc[prog[ch]%7]/12);
if(i%8===0)[0,2,4].forEach(o=>note(tm,beat*3.6,r*2*Math.pow(2,sc[o]/12),.07,.8));
if(i%4===0)note(tm,beat*1.8,r/2,.3,2.2);
if(i%2===0){for(let s=Math.floor(tm*sr);s<Math.min(n,Math.floor((tm+.12)*sr));s++){const x=s/sr-tm;d[s]+=Math.sin(2*Math.PI*(120*Math.exp(-x*22)+40)*x)*Math.exp(-x*20)*.5}}
if(rnd()>.28){deg=Math.max(0,Math.min(13,deg+Math.round((rnd()-.5)*4)));note(tm,beat*.9,r*2*Math.pow(2,(sc[deg%7]+12*Math.floor(deg/7))/12),.16,3.2)}}
const buf=new ArrayBuffer(44+n*2),v=new DataView(buf),ws=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
ws(0,'RIFF');v.setUint32(4,36+n*2,true);ws(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,n*2,true);
for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,d[i]*.8))*32000,true);
return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));}
