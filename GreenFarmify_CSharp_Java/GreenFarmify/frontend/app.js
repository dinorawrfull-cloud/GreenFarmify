const API_BASE = "http://localhost:5080/api";
const demoMunicipios = {
  merida:{id:"merida",nombre:"Mérida",latitud:20.9674,longitud:-89.5926,temperatura:30.2,humedadSuelo:67,humedadAmbiente:72,ph:6.8,precipitacion:12},
  tizimin:{id:"tizimin",nombre:"Tizimín",latitud:21.1428,longitud:-88.1512,temperatura:29.1,humedadSuelo:61,humedadAmbiente:76,ph:7.1,precipitacion:18},
  valladolid:{id:"valladolid",nombre:"Valladolid",latitud:20.6896,longitud:-88.2010,temperatura:28.7,humedadSuelo:70,humedadAmbiente:79,ph:6.5,precipitacion:22},
  tekax:{id:"tekax",nombre:"Tekax",latitud:20.2028,longitud:-89.2847,temperatura:29.8,humedadSuelo:58,humedadAmbiente:68,ph:7.0,precipitacion:8},
  muna:{id:"muna",nombre:"Muna",latitud:20.4830,longitud:-89.7130,temperatura:29.5,humedadSuelo:65,humedadAmbiente:71,ph:6.7,precipitacion:10},
  motul:{id:"motul",nombre:"Motul",latitud:21.0960,longitud:-89.2830,temperatura:30.0,humedadSuelo:63,humedadAmbiente:74,ph:6.9,precipitacion:16}
};
let selectedMunicipio = "merida";
let currentMonth = 10;
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const rainfall = [35,22,18,20,55,145,160,155,190,125,48,30];

function showView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(`view-${name}`)?.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  const labels={inicio:"Inicio",calendario:"Calendario agroclimático",cultivos:"Recomendaciones de cultivos",sostenible:"Agricultura sostenible",general:"Panel general"};
  document.getElementById("crumb").textContent=labels[name]||"Inicio";
  document.getElementById("sidebar").classList.remove("open");
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.goto)));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

function renderMunicipio(m){
  selectedMunicipio=m.id;
  document.querySelectorAll(".map-pin").forEach(p=>p.classList.toggle("selected",p.dataset.municipio===m.id));
  document.getElementById("zoneName").textContent=m.nombre;
  document.getElementById("zoneLocation").textContent=`${m.latitud.toFixed(4)}° N · ${Math.abs(m.longitud).toFixed(4)}° O`;
  document.getElementById("zoneTemp").textContent=`${m.temperatura.toFixed(1)}°`;
  document.getElementById("zoneSoil").textContent=`${m.humedadSuelo}%`;
  document.getElementById("zoneAir").textContent=`${m.humedadAmbiente}%`;
  document.getElementById("zonePh").textContent=m.ph.toFixed(1);
  document.getElementById("zoneRain").textContent=`${m.precipitacion} mm`;
  document.querySelectorAll(".sensor .meter i").forEach((el,i)=>el.style.width=[m.humedadSuelo,m.humedadAmbiente][i]+"%");
}
document.querySelectorAll(".map-pin").forEach(pin=>pin.addEventListener("click",async()=>{
  const id=pin.dataset.municipio;
  let m=demoMunicipios[id];
  try{const r=await fetch(`${API_BASE}/municipios/${id}`);if(r.ok)m=await r.json();}catch(e){}
  renderMunicipio({...demoMunicipios[id],...m});
}));
document.getElementById("zoneDetails").addEventListener("click",()=>showView("cultivos"));
document.getElementById("refreshBtn").addEventListener("click",async()=>{
  const btn=document.getElementById("refreshBtn");btn.textContent="↻ Consultando…";
  try{const r=await fetch(`${API_BASE}/dashboard`);if(r.ok){const d=await r.json();document.getElementById("statMunicipios").textContent=String(d.municipiosMonitoreados).padStart(2,"0");document.getElementById("statSensores").textContent=String(d.sensoresInstalados).padStart(2,"0");}}
  catch(e){}
  renderMunicipio(demoMunicipios[selectedMunicipio]);btn.textContent="✓ Datos actualizados";setTimeout(()=>btn.textContent="↻ Actualizar datos",1400);
});
async function initApi(){
  try{const r=await fetch(`${API_BASE}/dashboard`);if(r.ok){const d=await r.json();document.getElementById("statMunicipios").textContent=String(d.municipiosMonitoreados).padStart(2,"0");document.getElementById("statSensores").textContent=String(d.sensoresInstalados).padStart(2,"0");document.getElementById("statTemp").innerHTML=`${Number(d.temperaturaPromedio).toFixed(1)}°<small>C</small>`;document.getElementById("statHumedad").innerHTML=`${d.humedadPromedioSuelo}<small>%</small>`;}}
  catch(e){console.info("API no disponible: se muestran datos de prueba.");}
}
function drawRain(){const chart=document.getElementById("rainChart");if(!chart)return;chart.innerHTML="";rainfall.forEach((v,i)=>{const col=document.createElement("div");col.className="bar-col";col.innerHTML=`<i style="height:${Math.max(4,v/200*100)}%"></i><span>${monthNames[i].slice(0,1)}</span>`;chart.appendChild(col);});}
function renderCalendar(){
  const grid=document.getElementById("monthGrid");if(!grid)return;
  const year=2026,first=new Date(year,currentMonth,1).getDay(),days=new Date(year,currentMonth+1,0).getDate();
  document.getElementById("monthTitle").textContent=`${monthNames[currentMonth]} ${year}`;
  grid.innerHTML=["D","L","M","M","J","V","S"].map(d=>`<div class="day-head">${d}</div>`).join("");
  for(let i=0;i<first;i++)grid.insertAdjacentHTML("beforeend",'<div class="day-cell muted"></div>');
  for(let d=1;d<=days;d++){let cls="",tag="";if([5,6,7,8,9].includes(currentMonth)){cls="plant";tag="Lluvias";}else if([2,3,4].includes(currentMonth)){cls="risk";tag="Vigilar agua";}else if([10,11].includes(currentMonth)){cls="harvest";tag="Cosecha";}grid.insertAdjacentHTML("beforeend",`<div class="day-cell ${cls}"><b>${d}</b>${d%5===0?`<small>${tag}</small>`:""}</div>`);}
  const advice=["Planifica el ciclo y revisa humedad disponible antes de establecer el cultivo.","La disponibilidad de agua puede ser limitada; programa riego eficiente según el cultivo.","Vigila el estrés hídrico y prepara el terreno con conservación de humedad.","Revisa pronósticos y condiciones del suelo antes de la siembra.","Ajusta fechas a las primeras lluvias efectivas y evita sembrar solo por calendario.","Ventana de lluvias: monitorea drenaje, malezas y enfermedades.","Mantén vigilancia de exceso de humedad y sanidad del cultivo.","Evalúa humedad y desarrollo del cultivo; planifica labores oportunas.","Atiende drenaje y presión de enfermedades en periodos lluviosos.","Monitorea madurez y programa cosecha según el cultivo.","Considera cosecha y preparación del siguiente ciclo; revisa humedad residual.","Conserva humedad del suelo y planifica riego suplementario cuando sea necesario."];
  document.getElementById("monthAdviceTitle").textContent=`Recomendaciones para ${monthNames[currentMonth].toLowerCase()}`;
  document.getElementById("monthAdvice").textContent=advice[currentMonth];
}
document.getElementById("prevMonth").addEventListener("click",()=>{currentMonth=(currentMonth+11)%12;renderCalendar();});
document.getElementById("nextMonth").addEventListener("click",()=>{currentMonth=(currentMonth+1)%12;renderCalendar();});
document.querySelectorAll(".compare-btn").forEach(b=>b.addEventListener("click",()=>document.getElementById("compareModal").classList.add("open")));
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("compareModal").classList.remove("open"));
document.getElementById("compareModal").addEventListener("click",e=>{if(e.target.id==="compareModal")e.currentTarget.classList.remove("open");});
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
  const eco=document.getElementById("ecoGrid");
  if(tab.dataset.tab==="biologicos"){eco.querySelectorAll(".eco-card").forEach((c,i)=>c.style.display=i<3?"none":"block");}
  else eco.querySelectorAll(".eco-card").forEach(c=>c.style.display="block");
}));
document.getElementById("cropSearch").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();document.querySelectorAll(".recommend-card").forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?"flex":"none");
});
drawRain();renderCalendar();renderMunicipio(demoMunicipios.merida);initApi();
