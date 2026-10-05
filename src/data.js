/* ---------- data ---------- */
export const ARTISTS=[
{id:1,name:'Nova Reyes',genre:'Synthwave',hue:285},{id:2,name:'The Midnight Owls',genre:'Lo-fi',hue:205},
{id:3,name:'Kira Vale',genre:'Pop',hue:335},{id:4,name:'Atlas Drift',genre:'Electronic',hue:165},
{id:5,name:'Mara Lune',genre:'Indie',hue:30},{id:6,name:'Echo District',genre:'Hip-Hop',hue:0}];
export const ALBUMS=[
{id:1,title:'Neon Horizons',artist:1,year:2025,hue:285},{id:2,title:'Rainy Window Tapes',artist:2,year:2024,hue:205},
{id:3,title:'Glasshouse',artist:3,year:2026,hue:335},{id:4,title:'Orbit Theory',artist:4,year:2025,hue:165},
{id:5,title:'Golden Hour Letters',artist:5,year:2023,hue:30},{id:6,title:'Concrete Gardens',artist:6,year:2026,hue:350}];
export const S=(id,title,artist,album,root,bpm,minor)=>({id,title,artist,album,root,bpm,minor,genre:ARTISTS[artist-1].genre});
export const SONGS=[
S(1,'Midnight Chrome',1,1,110,100,1),S(2,'Laser Palms',1,1,123.5,118,0),S(3,'Study Session 3AM',2,2,98,76,1),
S(4,'Coffee Steam',2,2,110,82,0),S(5,'Paper Hearts',3,3,146.8,112,0),S(6,'Glass Houses',3,3,130.8,124,1),
S(7,'Gravity Well',4,4,82.4,128,1),S(8,'Signal Fade',4,4,92.5,122,1),S(9,'Honey Light',5,5,130.8,96,0),
S(10,'Porch Swing',5,5,116.5,88,0),S(11,'Overpass',6,6,87.3,90,1),S(12,'Night Shift',6,6,98,94,1)];
export const GENRES=['All',...new Set(ARTISTS.map(a=>a.genre))];
export const art=id=>ARTISTS[id-1],alb=id=>ALBUMS[id-1];
export const trackHue=s=>alb(s.album).hue;
