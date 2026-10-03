(function(){
  const E = window.EVA, $ = s=>document.querySelector(s), $$ = s=>[...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* passeport qui s'ouvre */
  setTimeout(()=>$("#passport").classList.add("open"), reduce ? 0 : 900);
  $("#passport").addEventListener("click", e=>e.currentTarget.classList.toggle("open"));

  const state = { envie:[], qui:null, duree:null, budget:null, hotel:null };
  const labels = { mer:"Mer", culture:"Culture", aventure:"Aventure", neige:"Neige", shopping:"Shopping",
    couple:"En couple", famille:"En famille", solo:"En solo", groupe:"Entre amis",
    all:"All inclusive", pdj:"Petit déj.", "5":"5 étoiles", libre:"Au choix" };
  const tags = { sharm:["mer","aventure"], hurghada:["mer","aventure"], djerba:["mer"], turquie:["culture","shopping","aventure"], malaisie:["culture","shopping","mer"], chrea:["neige","aventure"] };
  const pos = { envie:[0,0,-12,"var(--deep)",""], qui:[46,14,9,"var(--stamp-red)",""], hotel:[18,78,14,"var(--stamp-red)",""], duree:[2,150,6,"#000","rect"], budget:[50,140,-8,"var(--deep)","rect"] };
  const city = () => "ALGER";

  function stamp(q, text){
    const old = document.querySelector(`.stamp[data-q="${q}"]`); if (old) old.remove();
    if (!text) return;
    const p = pos[q], s = document.createElement("div");
    s.className = "stamp " + p[4]; s.dataset.q = q;
    s.style.cssText = `left:${p[0]}%;top:${p[1]}px;--r:${p[2]}deg;color:${p[3]}`;
    s.innerHTML = `<span>${text}<small>${city()} · 2026</small></span>`;
    $("#stamps").appendChild(s);
  }

  /* choix */
  $$(".q").forEach(fs=>{
    const q = fs.dataset.q, multi = fs.querySelector(".multi");
    fs.querySelectorAll(".opts button").forEach(b=>b.addEventListener("click",()=>{
      if (multi){
        const on = b.getAttribute("aria-pressed")!=="true"; b.setAttribute("aria-pressed", on);
        state.envie = [...fs.querySelectorAll('[aria-pressed="true"]')].map(x=>x.dataset.v);
        stamp(q, state.envie.slice(0,2).map(v=>labels[v]).join(" + "));
      } else {
        fs.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", x===b));
        state[q] = b.dataset.v; stamp(q, labels[b.dataset.v]);
      }
      fs.classList.toggle("done", multi ? state.envie.length>0 : true);
      update();
    }));
  });
  const n = $("#nuits"), bu = $("#budget");
  n.addEventListener("input", ()=>{ state.duree=+n.value; $("#nuits-o").textContent = n.value + (n.value==="1"?" nuit":" nuits"); stamp("duree", $("#nuits-o").textContent); n.closest(".q").classList.add("done"); update(); });
  bu.addEventListener("input", ()=>{ state.budget=+bu.value; $("#budget-o").textContent = E.fmt(+bu.value) + " DZD"; stamp("budget", E.fmt(+bu.value)+" DA"); bu.closest(".q").classList.add("done"); update(); });

  /* carnet : destinations qui correspondent */
  function update(){
    const nb = $$(".stamp").length; cnt.textContent = nb + (nb>1?" tampons":" tampon") + " · voir mon carnet"; cnt.classList.toggle("show", nb>0);
    let list = E.destinations.map(d=>{
      let score = state.envie.length ? state.envie.filter(v=>tags[d.id].includes(v)).length : 1;
      if (state.duree && d.id==="chrea" && state.duree>3) score -= 1;
      if (state.duree && d.id==="malaisie" && state.duree<6) score -= 1;
      if (state.budget && d.from && d.from > state.budget) score = -1;
      return [d,score];
    }).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
    const c = $("#carnet");
    if (!list.length){ c.innerHTML = `<p class="empty">Aucun séjour publié ne colle exactement : c’est justement le cas où l’agence construit une proposition sur mesure.</p>`; return; }
    c.innerHTML = list.map(d=>`<div class="match"><img src="../img/${d.img}" alt=""><div><b>${d.city}</b><span>${d.country} · ${d.from ? "dès "+E.fmt(d.from)+" DZD" : "prix sur mesure"}</span></div></div>`).join("");
  }

  /* compteur mobile */
  const cnt = document.createElement("a"); cnt.className="count"; cnt.href="#visa"; document.body.appendChild(cnt);

  /* brief */
  const dlg = $("#brief");
  $("#send").addEventListener("click", ()=>{
    const r = [];
    if (state.envie.length) r.push("Envie : " + state.envie.map(v=>labels[v]).join(", "));
    if (state.qui) r.push("Voyageurs : " + labels[state.qui]);
    if (state.duree) r.push("Durée : " + $("#nuits-o").textContent);
    if (state.budget) r.push("Budget : " + $("#budget-o").textContent + " par personne");
    if (state.hotel) r.push("Confort : " + labels[state.hotel]);
    $$("#carnet .match b").length && r.push("Pistes : " + $$("#carnet .match b").map(b=>b.textContent).join(", "));
    $("#brief-recap").innerHTML = (r.length ? r : ["Pas encore de choix : le conseiller vous posera les questions."]).map(x=>`<li>${x}</li>`).join("");
    $("#bf").hidden=false; $("#done").hidden=true; dlg.showModal ? dlg.showModal() : dlg.setAttribute("open","");
  });
  $("#bf").addEventListener("submit", e=>{ e.preventDefault(); e.target.reset(); e.target.hidden=true; $("#done").hidden=false; });

  /* mosaïque */
  const tiles = [["djerba-hotel.webp","Djerba","All inclusive, chaque vendredi","big"],["sharm.webp","Sharm El Sheikh","Mer Rouge et désert",""],["turquie.webp","Turquie","Cappadoce et Pamukkale",""],
    ["kuala.webp","Kuala Lumpur","Malaisie, étape 1",""],["chrea.webp","Chréa","Sortie en groupe",""]];
  $("#mosaic").innerHTML = tiles.map(t=>`<div class="tile ${t[3]}"><img src="../img/${t[0]}" alt="${t[1]}" loading="lazy"><div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join("");
})();
