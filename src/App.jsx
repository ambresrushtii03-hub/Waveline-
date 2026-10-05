import React,{useState,useEffect,useRef,useMemo,useContext,createContext} from 'react';
import {ARTISTS,ALBUMS,SONGS,GENRES,art,alb,trackHue} from './data';
import {makeWav} from './audio';

const C=createContext();

/* ---------- helpers ---------- */
function useStore(key,init){
const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init}catch(e){return init}});
useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}},[key,v]);return [v,setV]}
const fmt=s=>!isFinite(s)?'0:00':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const P={home:'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',lib:'M4 6h16M4 12h16M4 18h10',
heart:'M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
chart:'M5 20V10M12 20V4M19 20v-7',play:'M8 5v14l11-7z',pause:'M6 5h4v14H6zM14 5h4v14h-4z',next:'M6 5v14l9-7zM18 5v14',prev:'M18 5v14l-9-7zM6 5v14',
shuffle:'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',repeat:'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
vol:'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7',mute:'M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6',queue:'M3 6h13M3 12h13M3 18h7M18 14v6l4-3z',
plus:'M12 5v14M5 12h14',trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',x:'M6 6l12 12M18 6 6 18',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'};
const Ic=({n,f,c='w-5 h-5'})=><svg viewBox="0 0 24 24" className={c} fill={f?'currentColor':'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={P[n]}/></svg>;

/* generated cover art: layered gradients, sun, waves, grain */
function Cover({hue,seed=0,round,cls=''}){
const id='g'+hue+'_'+seed,k=seed%3,h2=(hue+50)%360;
return <svg viewBox="0 0 100 100" className={cls+' '+(round?'rounded-full':'rounded-xl')+' block w-full h-full object-cover'} preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={`hsl(${hue} 85% 58%)`}/><stop offset="1" stopColor={`hsl(${h2} 80% 22%)`}/></linearGradient>
<radialGradient id={id+'s'}><stop offset="0" stopColor={`hsl(${(hue+30)%360} 100% 82%)`}/><stop offset="1" stopColor={`hsl(${hue} 100% 60%)`}/></radialGradient></defs>
<rect width="100" height="100" fill={`url(#${id})`}/>
{k===0&&<><circle cx="50" cy="42" r="22" fill={`url(#${id}s)`}/>{[58,66,74,82].map((y,i)=><rect key={y} x="0" y={y} width="100" height={2+i} fill={`hsl(${hue} 70% 12%)`} opacity=".7"/>)}</>}
{k===1&&<><circle cx="30" cy="70" r="46" fill={`hsl(${h2} 90% 65%)`} opacity=".35"/><circle cx="72" cy="30" r="30" fill={`url(#${id}s)`} opacity=".9"/><circle cx="72" cy="30" r="14" fill={`hsl(${hue} 70% 15%)`} opacity=".5"/></>}
{k===2&&<><path d="M0 70Q25 45 50 65T100 55V100H0z" fill={`hsl(${h2} 80% 18%)`} opacity=".8"/><path d="M0 82Q30 62 60 80T100 72V100H0z" fill={`hsl(${hue} 70% 10%)`}/><circle cx="68" cy="30" r="12" fill={`url(#${id}s)`}/></>}
<rect width="100" height="100" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1"/></svg>}

/* ---------- track row ---------- */
function Row({id,i,list}){
const {cur,playing,favs,toggleFav,play,playlists,addTo,stats}=useContext(C),s=SONGS[id-1],[m,setM]=useState(false),on=cur===id;
return <div className={'group relative flex items-center gap-3 px-3 py-2 rounded-xl transition hover:bg-white/10 '+(on?'bg-white/10':'')}>
<button onClick={()=>play(id,list)} className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden" aria-label={'Play '+s.title}>
<Cover hue={trackHue(s)} seed={id}/><span className={'absolute inset-0 flex items-center justify-center bg-black/50 transition '+(on?'opacity-100':'opacity-0 group-hover:opacity-100')}>
{on&&playing?<span className="eq flex items-end gap-0.5 h-4"><i/><i/><i/></span>:<Ic n="play" f c="w-4 h-4"/>}</span></button>
<div className="min-w-0 flex-1"><div className={'truncate text-sm font-semibold '+(on?'text-violet-300':'')}>{s.title}</div>
<div className="truncate text-xs text-white/55">{art(s.artist).name}</div></div>
<div className="hidden md:block w-44 truncate text-xs text-white/50">{alb(s.album).title}</div>
<div className="hidden sm:block text-xs text-white/40 w-16">{s.genre}</div>
{stats.plays[id]>0&&<div className="hidden lg:block text-xs text-white/40 w-14">{stats.plays[id]} plays</div>}
<button onClick={()=>toggleFav(id)} className={'p-1.5 transition active:scale-125 '+(favs.includes(id)?'text-pink-400':'text-white/40 hover:text-white')} aria-label="Favorite"><Ic n="heart" f={favs.includes(id)}/></button>
<div className="relative"><button onClick={()=>setM(!m)} className="p-1.5 text-white/40 hover:text-white" aria-label="Add to playlist"><Ic n="plus"/></button>
{m&&<div className="glass-d absolute right-0 bottom-9 z-20 w-48 rounded-xl p-1 view">
{playlists.length===0&&<div className="p-2 text-xs text-white/50">Create a playlist in Library first.</div>}
{playlists.map(p=><button key={p.id} onClick={()=>{addTo(p.id,id);setM(false)}} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/10 truncate">{p.ids.includes(id)?'✓ ':''}{p.name}</button>)}</div>}</div>
</div>}
const List=({ids,empty})=>ids.length?<div className="space-y-0.5">{ids.map((id,i)=><Row key={id+'-'+i} id={id} i={i} list={ids}/>)}</div>:<div className="glass rounded-2xl p-8 text-center text-white/60">{empty}</div>;

const Head=({t,sub,right})=><div className="flex items-end justify-between mb-4 mt-8 first:mt-0"><div><h2 className="text-2xl font-bold">{t}</h2>{sub&&<p className="text-sm text-white/50">{sub}</p>}</div>{right}</div>;

/* ---------- views ---------- */
function Home(){
const {go,play,recent,stats}=useContext(C),top=[...SONGS].sort((a,b)=>(stats.plays[b.id]||0)-(stats.plays[a.id]||0)).slice(0,6),f=SONGS[0];
return <div className="view">
<div className="glass relative overflow-hidden rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center">
<div className="w-44 h-44 md:w-56 md:h-56 shrink-0 rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/60 rotate-2 hover:rotate-0 transition duration-500"><Cover hue={285} seed={1}/></div>
<div><p className="text-sm text-violet-300 font-semibold">Featured album</p>
<h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-1">Neon Horizons</h1>
<p className="text-white/65 mt-2 max-w-md">Nova Reyes returns with chrome basslines and late-night drive synths.</p>
<div className="flex gap-3 mt-5"><button onClick={()=>play(f.id,[1,2])} className="px-6 py-2.5 rounded-full bg-violet-500 hover:bg-violet-400 font-bold transition hover:scale-105 active:scale-95 flex items-center gap-2"><Ic n="play" f/>Play album</button>
<button onClick={()=>go('search',{q:'Nova Reyes'})} className="px-5 py-2.5 rounded-full glass font-semibold hover:bg-white/15 transition">View artist</button></div></div></div>
<Head t="Trending songs" sub="Most played on your device"/><List ids={top.map(s=>s.id)}/>
<Head t="Artists"/><div className="flex gap-5 overflow-x-auto pb-2">{ARTISTS.map(a=>
<button key={a.id} onClick={()=>go('search',{q:a.name})} className="group shrink-0 w-28 text-center"><div className="w-28 h-28 overflow-hidden rounded-full ring-2 ring-white/10 group-hover:ring-violet-400 transition group-hover:scale-105"><Cover hue={a.hue} seed={a.id+1} round/></div>
<div className="mt-2 text-sm font-semibold truncate">{a.name}</div><div className="text-xs text-white/50">{a.genre}</div></button>)}</div>
<Head t="Albums"/><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">{ALBUMS.map(a=>
<button key={a.id} onClick={()=>play(SONGS.find(s=>s.album===a.id).id,SONGS.filter(s=>s.album===a.id).map(s=>s.id))} className="group glass rounded-2xl p-3 text-left transition hover:-translate-y-1 hover:bg-white/10">
<div className="relative aspect-square rounded-xl overflow-hidden"><Cover hue={a.hue} seed={a.id}/><span className="absolute right-2 bottom-2 w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition"><Ic n="play" f c="w-4 h-4"/></span></div>
<div className="mt-2 text-sm font-semibold truncate">{a.title}</div><div className="text-xs text-white/50 truncate">{art(a.artist).name} · {a.year}</div></button>)}</div>
{recent.length>0&&<><Head t="Recently played" right={<button onClick={()=>go('recent')} className="text-sm text-violet-300 hover:underline">See all</button>}/><List ids={recent.slice(0,3)}/></>}
</div>}

function Search({init}){
const [q,setQ]=useState(init||''),[g,setG]=useState('All'),[sort,setSort]=useState('title');
useEffect(()=>setQ(init||''),[init]);
const ids=useMemo(()=>{const t=q.toLowerCase();return SONGS.filter(s=>(g==='All'||s.genre===g)&&(!t||[s.title,art(s.artist).name,alb(s.album).title,s.genre].join(' ').toLowerCase().includes(t)))
.sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):sort==='artist'?art(a.artist).name.localeCompare(art(b.artist).name):alb(b.album).year-alb(a.album).year).map(s=>s.id)},[q,g,sort]);
const ar=ARTISTS.filter(a=>q&&a.name.toLowerCase().includes(q.toLowerCase()));
return <div className="view"><div className="glass rounded-2xl flex items-center gap-3 px-4 py-3"><Ic n="search" c="w-5 h-5 text-white/50"/>
<input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search songs, artists, albums or genres" className="flex-1 bg-transparent outline-none placeholder:text-white/40"/>
{q&&<button onClick={()=>setQ('')} aria-label="Clear"><Ic n="x" c="w-4 h-4"/></button>}</div>
<div className="flex flex-wrap items-center gap-2 mt-4">{GENRES.map(x=><button key={x} onClick={()=>setG(x)} className={'px-4 py-1.5 rounded-full text-sm transition '+(g===x?'bg-violet-500 font-bold':'glass hover:bg-white/15')}>{x}</button>)}
<select value={sort} onChange={e=>setSort(e.target.value)} className="ml-auto glass rounded-full px-3 py-1.5 text-sm bg-transparent"><option value="title" className="bg-zinc-900">Sort: Title</option><option value="artist" className="bg-zinc-900">Sort: Artist</option><option value="year" className="bg-zinc-900">Sort: Newest</option></select></div>
{ar.length>0&&<div className="flex gap-3 mt-5">{ar.map(a=><div key={a.id} className="glass rounded-full pr-5 flex items-center gap-3"><div className="w-12 h-12 rounded-full overflow-hidden"><Cover hue={a.hue} seed={a.id+1} round/></div><span className="text-sm font-semibold">{a.name}</span></div>)}</div>}
<Head t={ids.length+' songs'}/><List ids={ids} empty="No songs match. Try another word or genre."/></div>}

function Library(){
const {playlists,setPlaylists,play}=useContext(C),[name,setName]=useState(''),[open,setOpen]=useState(null);
const pl=playlists.find(p=>p.id===open);
const create=()=>{if(!name.trim())return;setPlaylists([...playlists,{id:Date.now(),name:name.trim(),ids:[]}]);setName('')};
if(pl)return <div className="view"><button onClick={()=>setOpen(null)} className="text-sm text-violet-300 mb-3">‹ All playlists</button>
<div className="flex items-end gap-5 mb-6"><div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl"><Cover hue={(pl.id%360)} seed={pl.id}/></div><div><h1 className="text-4xl font-extrabold">{pl.name}</h1><p className="text-white/55 text-sm">{pl.ids.length} songs</p>
<div className="flex gap-2 mt-3"><button disabled={!pl.ids.length} onClick={()=>play(pl.ids[0],pl.ids)} className="px-5 py-2 rounded-full bg-violet-500 font-bold disabled:opacity-40 flex items-center gap-2"><Ic n="play" f c="w-4 h-4"/>Play</button>
<button onClick={()=>{setPlaylists(playlists.filter(p=>p.id!==pl.id));setOpen(null)}} className="px-4 py-2 rounded-full glass text-sm flex items-center gap-2 hover:text-red-300"><Ic n="trash" c="w-4 h-4"/>Delete</button></div></div></div>
<div className="space-y-0.5">{pl.ids.map(id=><div key={id} className="flex items-center"><div className="flex-1 min-w-0"><Row id={id} list={pl.ids}/></div>
<button onClick={()=>setPlaylists(playlists.map(p=>p.id===pl.id?{...p,ids:p.ids.filter(x=>x!==id)}:p))} className="p-2 text-white/40 hover:text-red-300" aria-label="Remove"><Ic n="x" c="w-4 h-4"/></button></div>)}
{!pl.ids.length&&<div className="glass rounded-2xl p-8 text-center text-white/60">Empty playlist. Use the + button on any song to add it here.</div>}</div></div>;
return <div className="view"><Head t="Your playlists" sub="Saved in this browser"/>
<div className="glass rounded-2xl flex gap-2 p-2 mb-5 max-w-lg"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()} placeholder="New playlist name" className="flex-1 bg-transparent px-3 outline-none placeholder:text-white/40"/>
<button onClick={create} className="px-4 py-2 rounded-xl bg-violet-500 font-bold text-sm flex items-center gap-1 hover:bg-violet-400 transition"><Ic n="plus" c="w-4 h-4"/>Create</button></div>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{playlists.map(p=><button key={p.id} onClick={()=>setOpen(p.id)} className="glass rounded-2xl p-3 text-left transition hover:-translate-y-1 hover:bg-white/10">
<div className="aspect-square rounded-xl overflow-hidden"><Cover hue={p.id%360} seed={p.id}/></div><div className="mt-2 font-semibold truncate">{p.name}</div><div className="text-xs text-white/50">{p.ids.length} songs</div></button>)}</div></div>}

function Dash(){
const {stats,favs,playlists,recent}=useContext(C),mins=Math.round(stats.secs/60),tot=Object.values(stats.plays).reduce((a,b)=>a+b,0);
const byG={};SONGS.forEach(s=>byG[s.genre]=(byG[s.genre]||0)+(stats.plays[s.id]||0));
const max=Math.max(1,...Object.values(byG)),topG=Object.entries(byG).sort((a,b)=>b[1]-a[1])[0];
const top=[...SONGS].filter(s=>stats.plays[s.id]).sort((a,b)=>stats.plays[b.id]-stats.plays[a.id]).slice(0,5);
const Stat=({l,v})=><div className="glass rounded-2xl p-5"><div className="text-3xl font-extrabold disp">{v}</div><div className="text-sm text-white/55">{l}</div></div>;
return <div className="view"><Head t="Your dashboard" sub="Based on listening on this device"/>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><Stat l="Minutes listened" v={mins}/><Stat l="Songs played" v={tot}/><Stat l="Favorites" v={favs.length}/><Stat l="Playlists" v={playlists.length}/></div>
<div className="grid lg:grid-cols-2 gap-4 mt-4"><div className="glass rounded-2xl p-5"><h3 className="font-bold mb-4">Plays by genre</h3>
{tot===0?<p className="text-white/55 text-sm">Play a song to see your genre mix here.</p>:Object.entries(byG).map(([g,n])=><div key={g} className="flex items-center gap-3 mb-2 text-sm"><span className="w-20 text-white/60">{g}</span>
<div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400 transition-all duration-700" style={{width:(n/max*100)+'%'}}/></div><span className="w-6 text-right text-white/60">{n}</span></div>)}
{topG&&topG[1]>0&&<p className="text-sm mt-3 text-violet-300">Top genre: {topG[0]}</p>}</div>
<div className="glass rounded-2xl p-5"><h3 className="font-bold mb-2">Most played</h3>{top.length?<List ids={top.map(s=>s.id)}/>:<p className="text-white/55 text-sm">Nothing yet.</p>}</div></div></div>}

/* ---------- player ---------- */
function Player(){
const {cur,playing,toggle,next,prev,time,dur,seek,vol,setVol,shuffle,setShuffle,rep,setRep,favs,toggleFav,qOpen,setQOpen}=useContext(C),s=cur&&SONGS[cur-1];
const pct=dur?time/dur*100:0;
return <div className="glass-d fixed z-30 inset-x-2 bottom-16 md:bottom-3 md:left-[15.5rem] md:right-3 rounded-2xl px-3 py-2.5 md:px-5">
<div className="flex items-center gap-3 md:gap-6">
<div className="flex items-center gap-3 min-w-0 md:w-1/4 flex-1 md:flex-none">
<div className={'w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full overflow-hidden ring-2 ring-white/20 '+(playing?'vinyl':'')} style={{animationPlayState:playing?'running':'paused'}}>{s?<Cover hue={trackHue(s)} seed={s.id} round/>:<div className="w-full h-full bg-white/10"/>}</div>
<div className="min-w-0"><div className="truncate text-sm font-bold">{s?s.title:'Pick a song'}</div><div className="truncate text-xs text-white/55">{s?art(s.artist).name:'Nothing playing'}</div></div>
{s&&<button onClick={()=>toggleFav(cur)} className={'p-1 '+(favs.includes(cur)?'text-pink-400':'text-white/40')} aria-label="Favorite"><Ic n="heart" f={favs.includes(cur)} c="w-4 h-4"/></button>}</div>
<div className="md:flex-1 flex flex-col items-center">
<div className="flex items-center gap-3 md:gap-5">
<button onClick={()=>setShuffle(!shuffle)} className={'hidden sm:block '+(shuffle?'text-violet-300':'text-white/45')} aria-label="Shuffle"><Ic n="shuffle" c="w-4 h-4"/></button>
<button onClick={prev} className="text-white/80 hover:text-white" aria-label="Previous"><Ic n="prev" f/></button>
<button onClick={toggle} className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center transition hover:scale-110 active:scale-95" aria-label={playing?'Pause':'Play'}><Ic n={playing?'pause':'play'} f/></button>
<button onClick={next} className="text-white/80 hover:text-white" aria-label="Next"><Ic n="next" f/></button>
<button onClick={()=>setRep((rep+1)%3)} className={'relative hidden sm:block '+(rep?'text-violet-300':'text-white/45')} aria-label="Repeat"><Ic n="repeat" c="w-4 h-4"/>{rep===2&&<span className="absolute -top-1.5 -right-2 text-[9px] font-bold">1</span>}</button></div>
<div className="hidden md:flex items-center gap-2 w-full max-w-xl mt-1.5 text-[11px] text-white/50"><span className="w-8 text-right">{fmt(time)}</span>
<input type="range" min="0" max={dur||1} step="0.1" value={time} onChange={e=>seek(+e.target.value)} style={{'--p':pct+'%'}} className="flex-1" aria-label="Seek"/><span className="w-8">{fmt(dur)}</span></div></div>
<div className="flex items-center gap-3 md:w-1/4 justify-end">
<div className="hidden md:flex items-center gap-2"><button onClick={()=>setVol(vol?0:.7)} aria-label="Mute"><Ic n={vol?'vol':'mute'} c="w-4 h-4 text-white/60"/></button>
<input type="range" min="0" max="1" step="0.01" value={vol} onChange={e=>setVol(+e.target.value)} style={{'--p':vol*100+'%'}} className="w-24" aria-label="Volume"/></div>
<button onClick={()=>setQOpen(!qOpen)} className={qOpen?'text-violet-300':'text-white/60 hover:text-white'} aria-label="Queue"><Ic n="queue"/></button></div></div>
<input type="range" min="0" max={dur||1} step="0.1" value={time} onChange={e=>seek(+e.target.value)} style={{'--p':pct+'%'}} className="md:hidden w-full mt-2" aria-label="Seek"/></div>}

function Queue(){
const {queue,qi,cur,setQi,setQueue,setQOpen,qOpen}=useContext(C);
return <aside className={'glass-d fixed z-40 right-2 top-2 bottom-36 md:bottom-28 w-[calc(100%-1rem)] sm:w-80 rounded-2xl p-4 flex flex-col transition-transform duration-500 '+(qOpen?'translate-x-0':'translate-x-[110%]')}>
<div className="flex justify-between items-center mb-3"><h3 className="font-bold text-lg">Queue</h3><div className="flex gap-3 text-sm"><button className="text-white/50 hover:text-white" onClick={()=>{setQueue(cur?[cur]:[]);setQi(0)}}>Clear</button><button onClick={()=>setQOpen(false)} aria-label="Close"><Ic n="x" c="w-4 h-4"/></button></div></div>
<div className="overflow-y-auto flex-1 space-y-1">{queue.length===0&&<p className="text-sm text-white/50">Your queue is empty. Play a song to start.</p>}
{queue.map((id,i)=>{const s=SONGS[id-1];return <div key={i} className={'flex items-center gap-2 p-1.5 rounded-lg '+(i===qi?'bg-white/12':'hover:bg-white/8')}>
<button onClick={()=>setQi(i)} className="flex items-center gap-2 flex-1 min-w-0 text-left"><div className="w-9 h-9 rounded-md overflow-hidden shrink-0"><Cover hue={trackHue(s)} seed={id}/></div>
<div className="min-w-0"><div className={'text-sm truncate '+(i===qi?'text-violet-300 font-semibold':'')}>{s.title}</div><div className="text-xs text-white/50 truncate">{art(s.artist).name}</div></div></button>
{i!==qi&&<button onClick={()=>{setQueue(queue.filter((_,j)=>j!==i));if(i<qi)setQi(qi-1)}} className="p-1 text-white/40 hover:text-red-300" aria-label="Remove"><Ic n="x" c="w-3.5 h-3.5"/></button>}</div>})}</div></aside>}

/* ---------- app ---------- */
const NAV=[['home','Home','home'],['search','Search','search'],['lib','Library','lib'],['favs','Favorites','heart'],['recent','Recent','clock'],['dash','Dashboard','chart']];
function App(){
const [view,setView]=useState({n:'home'}),[favs,setFavs]=useStore('wl_favs',[3,7]),[recent,setRecent]=useStore('wl_recent',[]);
const [playlists,setPlaylists]=useStore('wl_playlists',[{id:101,name:'Late Night Drive',ids:[1,7,11]}]);
const [stats,setStats]=useStore('wl_stats',{plays:{},secs:0});
const [queue,setQueue]=useState([]),[qi,setQi]=useState(0),[playing,setPlaying]=useState(false),[time,setTime]=useState(0),[dur,setDur]=useState(0);
const [vol,setVol]=useState(.7),[shuffle,setShuffle]=useState(false),[rep,setRep]=useState(0),[qOpen,setQOpen]=useState(false);
const au=useRef(null),urls=useRef({}),secs=useRef(0),last=useRef(0),mainRef=useRef(null);
const cur=queue[qi]||null;

const go=(n,p={})=>{setView({n,...p});setQOpen(false);mainRef.current&&mainRef.current.scrollTo({top:0,behavior:'smooth'})};
const toggleFav=id=>setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[id,...f]);
const addTo=(pid,id)=>setPlaylists(ps=>ps.map(p=>p.id===pid?{...p,ids:p.ids.includes(id)?p.ids.filter(x=>x!==id):[...p.ids,id]}:p));
const play=(id,list)=>{const l=list&&list.length?list:[id];setQueue(l);const i=l.indexOf(id);if(i===qi&&cur===id){au.current.currentTime=0;au.current.play();setPlaying(true)}setQi(i<0?0:i);setPlaying(true)};

useEffect(()=>{if(!cur)return;const a=au.current;
if(!urls.current[cur])urls.current[cur]=makeWav(SONGS[cur-1]);
a.src=urls.current[cur];a.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));last.current=0;
setRecent(r=>[cur,...r.filter(x=>x!==cur)].slice(0,12));
setStats(s=>({...s,plays:{...s.plays,[cur]:(s.plays[cur]||0)+1}}));
if('mediaSession' in navigator){const s=SONGS[cur-1];navigator.mediaSession.metadata=new MediaMetadata({title:s.title,artist:art(s.artist).name,album:alb(s.album).title})}
},[cur,qi,queue.length&&queue[qi]]);
useEffect(()=>{au.current.volume=vol},[vol]);
useEffect(()=>{const t=setInterval(()=>{if(secs.current>0){const x=secs.current;secs.current=0;setStats(s=>({...s,secs:s.secs+x}))}},5000);return()=>clearInterval(t)},[]);

const toggle=()=>{const a=au.current;if(!cur){play(SONGS[0].id,SONGS.map(s=>s.id));return}if(a.paused){a.play();setPlaying(true)}else{a.pause();setPlaying(false)}};
const next=()=>{if(!queue.length)return;if(shuffle&&queue.length>1){let j;do{j=Math.floor(Math.random()*queue.length)}while(j===qi);setQi(j)}else if(qi<queue.length-1)setQi(qi+1);else if(rep===1)setQi(0);else{setPlaying(false);au.current.pause()}};
const prev=()=>{if(au.current.currentTime>3||qi===0){au.current.currentTime=0}else setQi(qi-1)};
const seek=t=>{au.current.currentTime=t;setTime(t)};
const onEnd=()=>{if(rep===2){au.current.currentTime=0;au.current.play()}else{const a=au.current;if(qi>=queue.length-1&&rep===0&&!shuffle){setPlaying(false)}else next()}};
const onTime=()=>{const a=au.current,d=a.currentTime-last.current;if(d>0&&d<1.5)secs.current+=d;last.current=a.currentTime;setTime(a.currentTime)};

const ctx={cur,playing,favs,toggleFav,play,playlists,setPlaylists,addTo,stats,go,recent,queue,qi,setQi,setQueue,qOpen,setQOpen,toggle,next,prev,time,dur,seek,vol,setVol,shuffle,setShuffle,rep,setRep};
const page=view.n==='home'?<Home/>:view.n==='search'?<Search init={view.q}/>:view.n==='lib'?<Library/>:view.n==='dash'?<Dash/>:
view.n==='favs'?<div className="view"><Head t="Favorites" sub={favs.length+' songs you love'}/><List ids={favs} empty="Tap the heart on any song to save it here."/></div>:
<div className="view"><Head t="Recently played" right={recent.length>0&&<button onClick={()=>setRecent([])} className="text-sm text-white/50 hover:text-white">Clear history</button>}/><List ids={recent} empty="Songs you play will show up here."/></div>;
return <C.Provider value={ctx}>
<audio ref={au} onTimeUpdate={onTime} onLoadedMetadata={e=>setDur(e.target.duration)} onEnded={onEnd} onPause={()=>setPlaying(false)} onPlay={()=>setPlaying(true)}/>
<div className="blob w-96 h-96 bg-violet-600 -top-20 -left-20"/><div className="blob w-80 h-80 bg-pink-600 top-1/3 right-0" style={{animationDelay:'-6s'}}/><div className="blob w-96 h-96 bg-cyan-600 -bottom-32 left-1/3" style={{animationDelay:'-12s'}}/>
<aside className="hidden md:flex glass-d fixed z-20 left-3 top-3 bottom-3 w-56 rounded-2xl p-5 flex-col">
<div className="flex items-center gap-2 mb-8"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><Ic n="play" f c="w-4 h-4"/></div><span className="disp text-2xl font-extrabold">Waveline</span></div>
<nav className="space-y-1">{NAV.map(([k,l,i])=><button key={k} onClick={()=>go(k)} className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition '+(view.n===k?'bg-white/15 text-white':'text-white/55 hover:text-white hover:bg-white/8')}><Ic n={i}/>{l}</button>)}</nav>
<div className="mt-auto glass rounded-xl p-3 text-xs text-white/55">Tracks are synthesized in your browser, so it works offline.</div></aside>
<main ref={mainRef} className="relative z-10 h-full overflow-y-auto md:ml-[15.5rem] px-4 md:px-8 pt-5 pb-56 md:pb-40">
<div className="md:hidden flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><Ic n="play" f c="w-3.5 h-3.5"/></div><span className="disp text-xl font-extrabold">Waveline</span></div>
<div key={view.n+(view.q||'')}>{page}</div></main>
<Queue/><Player/>
<nav className="md:hidden glass-d fixed z-30 bottom-0 inset-x-0 h-14 flex justify-around items-center" style={{paddingBottom:'env(safe-area-inset-bottom,0px)',height:'calc(3.5rem + env(safe-area-inset-bottom,0px))'}}>
{NAV.map(([k,l,i])=><button key={k} onClick={()=>go(k)} className={'flex flex-col items-center gap-0.5 text-[10px] transition '+(view.n===k?'text-violet-300':'text-white/50')}><Ic n={i} c="w-5 h-5"/>{l}</button>)}</nav>
</C.Provider>}

export default App;
