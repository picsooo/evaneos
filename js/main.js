(function(){
  const E = window.EVA, $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* menu mobile */
  const bg = $(".burger"), mn = $(".mnav");
  if (bg) bg.addEventListener("click", ()=>{ const o = mn.classList.toggle("open"); bg.setAttribute("aria-expanded", o); });

  /* cartes-billets */
  $$("[data-tickets]").forEach(box=>{
    const lim = +box.dataset.tickets || 99;
    box.innerHTML = E.destinations.slice(0,lim).map(d=>`
      <a class="ticket" href="${d.id==='sharm'?'sejour-sharm-el-sheikh.html':'devis.html?dest='+d.id}">
        <div class="ph"><img src="img/${d.img}" alt="${d.city}" loading="lazy"><span class="code">ALG → ${d.code}</span></div>
        <div class="tb"><h3>${d.city}</h3><p>${d.country} · ${d.duration}</p><p>${d.pitch}</p></div>
        <div class="tf"><div class="price">${d.from?`<small>À partir de</small><b>${E.fmt(d.from)}</b> <i>DZD</i>`:`<small>Tarif</small><b>Sur devis</b>`}</div><span class="go" aria-hidden="true">${arrow}</span></div>
      </a>`).join("");
  });

  /* recherche hero -> devis */
  const fd = $("#finder");
  if (fd) fd.addEventListener("submit", e=>{ e.preventDefault();
    const q = new URLSearchParams(new FormData(fd)); location.href = "devis.html?" + q.toString(); });

  /* formulaires factices */
  $$("form[data-fake]").forEach(f=>f.addEventListener("submit", e=>{
    e.preventDefault(); const ok = $(".ok", f.parentNode) || $(".ok");
    f.reset(); if (ok){ ok.classList.add("show"); ok.scrollIntoView({behavior:"smooth",block:"center"}); }
  }));

  /* simulateur de séjour */
  const sim = $("#sim");
  if (sim){
    const params = new URLSearchParams(location.search);
    const sel = $("#s-dest"), opt = $("#s-opt"), optWrap = $("#s-opt-wrap");
    sel.innerHTML = E.destinations.map(d=>`<option value="${d.id}">${d.city} (${d.country})</option>`).join("");
    if (params.get("dest")) sel.value = params.get("dest");
    const cnt = {ad: Math.max(1, +params.get("adultes")||2), en: +params.get("enfants")||0};
    const malaisie = [["Chambre triple",184000],["Chambre double",194000],["Chambre single",293000]];

    function fillOpt(){
      const id = sel.value;
      let list = id==="djerba" ? E.djerbaHotels.map(h=>[`${h[0]} ${"★".repeat(h[1])}`,h[2]]) : id==="malaisie" ? malaisie : null;
      optWrap.style.display = list ? "" : "none";
      if (list) opt.innerHTML = list.map((h,i)=>`<option value="${h[1]}">${h[0]} · dès ${E.fmt(h[1])} DZD</option>`).join("");
      $("#s-opt-label").textContent = id==="djerba" ? "Hôtel" : "Type de chambre";
    }
    function render(){
      const d = E.destinations.find(x=>x.id===sel.value);
      $("#ad-out").value = cnt.ad; $("#en-out").value = cnt.en;
      const unit = optWrap.style.display==="none" ? d.from : +opt.value;
      $("#p-code").textContent = d.code; $("#p-city").textContent = d.city;
      $("#p-dur").textContent = d.duration; $("#p-pax").textContent = cnt.ad + " ad." + (cnt.en? " + " + cnt.en + " enf." : "");
      $("#p-month").textContent = $("#s-month").value;
      const tot = $("#s-total"), note = $("#s-note");
      if (unit){
        tot.textContent = E.fmt(unit*cnt.ad) + " DZD";
        note.textContent = `Estimation pour ${cnt.ad} adulte${cnt.ad>1?"s":""} sur la base de « à partir de ${E.fmt(unit)} DZD ${d.basis} ».` + (cnt.en? " Le tarif enfant est communiqué par l'agence." : "");
      } else { tot.textContent = "Sur devis"; note.textContent = "Cette destination est chiffrée à la demande selon vos dates et l'hôtel choisi."; }
      $("#f-recap").value = `${d.city} · ${$("#s-month").value} · ${cnt.ad} adulte(s), ${cnt.en} enfant(s)`;
    }
    $$(".counter button").forEach(b=>b.addEventListener("click",()=>{
      const k=b.dataset.k, s=+b.dataset.s; cnt[k]=Math.min(9,Math.max(k==="ad"?1:0,cnt[k]+s)); render(); }));
    sel.addEventListener("change", ()=>{ fillOpt(); render(); });
    opt.addEventListener("change", render); $("#s-month").addEventListener("change", render);
    if (params.get("mois")) $("#s-month").value = params.get("mois");
    fillOpt(); render();
  }
})();
