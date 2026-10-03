(function(){
  const E = window.EVA, $ = s=>document.querySelector(s);
  const geo = { ALG:[3.06,36.75], sharm:[34.3,27.9], djerba:[10.9,33.8], hurghada:[33.8,27.3], turquie:[29,41], malaisie:[101.7,3.1], chrea:[2.88,36.43] };
  const P = ([lon,lat]) => [Math.round(lon<=40 ? 60+(lon+2)*19 : 858+(lon-40)*4.8), Math.round(lat>=25 ? (44-lat)*20+40 : 420+(25-lat)*6)];
  const status = { sharm:["Dernières places",1], djerba:["Chaque vendredi",0], hurghada:["Sur demande",0], turquie:["Sur demande",0], malaisie:["Circuit 3 étapes",0], chrea:["Sortie en groupe",0] };
  const who = { couple:["sharm","djerba","hurghada","turquie","malaisie"], famille:["sharm","djerba","hurghada","chrea"], solo:["turquie","malaisie","chrea","sharm"] };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CH = "ABCDEFGHIJKLMNOPRSTUVWXYZ";

  /* tableau des départs */
  const board = $("#board");
  const cells = s => [...s].map(c=>`<span data-c="${c===" "?"&nbsp;":c}">${c===" "?"&nbsp;":c}</span>`).join("");
  board.innerHTML = E.destinations.map(d=>`
    <button class="brow" role="listitem" data-id="${d.id}">
      <span class="code"><span class="flap">${cells(d.code)}</span></span>
      <span class="dest"><span class="flap">${cells(d.city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""))}</span></span>
      <span class="dur">${d.duration}</span>
      <span class="st ${status[d.id][1]?"warn":""}">${status[d.id][0]}</span>
    </button>`).join("");

  function flip(root, delay=0){
    if (reduce) return;
    root.querySelectorAll(".flap span").forEach((sp,i)=>{
      const fin = sp.dataset.c; if (fin==="&nbsp;") return;
      let n = 4 + Math.floor(Math.random()*8);
      setTimeout(function tick(){
        sp.textContent = n-- > 0 ? CH[Math.floor(Math.random()*CH.length)] : fin;
        if (n >= 0) setTimeout(tick, 55);
      }, delay + i*22);
    });
  }
  flip(board, 300);

  document.querySelectorAll(".who button").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".who button").forEach(x=>x.classList.toggle("on", x===b));
    const list = who[b.dataset.who];
    board.querySelectorAll(".brow").forEach(r=>{
      const off = list && !list.includes(r.dataset.id);
      r.classList.toggle("off", !!off);
      if (!off) flip(r);
    });
  }));

  /* carte */
  const svgNS = "http://www.w3.org/2000/svg", pins = $("#pins"), [ax,ay] = P(geo.ALG);
  const lab = { hurghada:[-18,30,"end"], sharm:[18,-8,"start"], chrea:[-6,40,"middle"], djerba:[18,8,"start"], turquie:[18,8,"start"], malaisie:[-20,8,"end"] };
  function pin(x,y,txt,cls,l){ const g=document.createElementNS(svgNS,"g"); g.setAttribute("class","pin "+cls);
    g.innerHTML=`<circle cx="${x}" cy="${y}" r="10"/><text x="${x+(l?l[0]:14)}" y="${y+(l?l[1]:-12)}" text-anchor="${l?l[2]:"start"}">${txt}</text>`; pins.appendChild(g); return g; }
  pin(ax,ay,"Alger","home",[0,-20,"middle"]);
  const pinEls = {};
  E.destinations.forEach(d=>{ const [x,y]=P(geo[d.id]); pinEls[d.id]=pin(x,y,d.city,"",lab[d.id]); });

  const route = $("#route"), plane = $("#plane"), bp = $("#bp");
  let raf, current;
  function fly(id){
    const d = E.destinations.find(x=>x.id===id); current = d;
    Object.entries(pinEls).forEach(([k,g])=>g.classList.toggle("act",k===id));
    const [bx,by] = P(geo[id]);
    const dist = Math.hypot(bx-ax,by-ay), cx=(ax+bx)/2, cy=Math.min(ay,by) - Math.max(40, dist*.35);
    route.setAttribute("d", `M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`);
    $("#fi-to").textContent = d.code; $("#fi-h").textContent = d.hours;
    const L = route.getTotalLength(); cancelAnimationFrame(raf);
    route.style.strokeDasharray = `${L}`; route.style.strokeDashoffset = `${L}`;
    bp.classList.remove("out","torn");
    const t0 = performance.now(), dur = reduce ? 1 : Math.min(2600, 900 + L*2.2);
    (function step(t){
      const k = Math.min(1,(t-t0)/dur), e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
      const p = route.getPointAtLength(L*e), p2 = route.getPointAtLength(Math.min(L, L*e+1));
      const ang = Math.atan2(p2.y-p.y, p2.x-p.x)*180/Math.PI;
      plane.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${ang}) scale(1.7)`);
      route.style.strokeDashoffset = `${L*(1-e)}`;
      if (k<1) raf = requestAnimationFrame(step); else { route.style.strokeDasharray = "6 9"; route.style.strokeDashoffset = 0; printPass(d); }
    })(t0);
  }
  function printPass(d){
    $("#bp-code").textContent = d.code; $("#bp-city").textContent = d.city;
    $("#bp-dur").textContent = d.duration; $("#bp-h").textContent = d.hours;
    $("#bp-price").textContent = d.from ? "dès " + E.fmt(d.from) + " DZD" : "Sur devis";
    $("#bp-pitch").textContent = d.pitch + (d.basis ? " Tarif " + d.basis + "." : "");
    const w = document.querySelector(".who .on").dataset.who;
    $("#bp-who").textContent = {tous:"2 adultes",couple:"2 adultes",famille:"2 adultes, 2 enfants",solo:"1 adulte"}[w];
    requestAnimationFrame(()=>bp.classList.add("out"));
  }

  board.addEventListener("click", e=>{
    const r = e.target.closest(".brow"); if (!r) return;
    board.querySelectorAll(".brow").forEach(x=>x.classList.toggle("sel",x===r));
    $("#flight").scrollIntoView({behavior: reduce?"auto":"smooth", block:"start"});
    setTimeout(()=>fly(r.dataset.id), reduce?0:650);
  });

  /* premier vol automatique quand la carte apparaît */
  const io = new IntersectionObserver(es=>{ if (es[0].isIntersecting && !current){ fly("sharm"); io.disconnect(); } }, {threshold:.35});
  io.observe($("#map"));

  /* détacher le billet -> réservation */
  const dlg = $("#book");
  $("#tear").addEventListener("click", ()=>{
    bp.classList.add("torn");
    setTimeout(()=>{ $("#book-dest").textContent = current ? current.city : ""; $("#bookf").hidden=false; $("#done").hidden=true;
      dlg.showModal ? dlg.showModal() : dlg.setAttribute("open",""); }, reduce?0:650);
  });
  $("#bookf").addEventListener("submit", e=>{ e.preventDefault(); e.target.reset(); e.target.hidden=true; $("#done").hidden=false; });

  /* hôtels de Djerba */
  const tints = ["#7fe3e9","#01C1CC","#4fd3db","#9ee9ed","#3cc7cf","#F7C948"];
  $("#rail").innerHTML = E.djerbaHotels.map((h,i)=>`<article class="hcard" style="background:${tints[i]}">
    <div><span class="s">${"★".repeat(h[1])}</span><h3>${h[0]}</h3></div>
    <div class="p"><small>À partir de, par personne en triple</small><b>${E.fmt(h[2])} DZD</b></div></article>`).join("");
})();
