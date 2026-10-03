/* Offres reprises des publications Instagram d'Evaneos Travel (été 2026) — tarifs à valider */
window.EVA = {
  destinations: [
    { id:"sharm", code:"SSH", city:"Sharm El Sheikh", country:"Égypte", img:"sharm.webp",
      pitch:"Mer Rouge, hôtels all inclusive et deux visites incluses.", duration:"9 jours / 8 nuits",
      from:214000, basis:"par personne", hours:"≈ 4 h de vol direct", x:735, y:300 },
    { id:"djerba", code:"DJE", city:"Djerba", country:"Tunisie", img:"djerba.webp",
      pitch:"Vol direct, all inclusive, départ chaque vendredi.", duration:"8 jours / 7 nuits",
      from:160000, basis:"par personne, chambre triple", hours:"≈ 1 h 30 de vol direct", x:560, y:238 },
    { id:"hurghada", code:"HRG", city:"Hurghada", country:"Égypte", img:"hurghada.webp",
      pitch:"Plages de rêve, lagons et activités nautiques.", duration:"Durée au choix",
      from:null, basis:"", hours:"Vol via Le Caire ou direct selon saison", x:722, y:286 },
    { id:"turquie", code:"IST", city:"Turquie", country:"Istanbul, Cappadoce, Pamukkale", img:"turquie.webp",
      pitch:"Montgolfières, vasques blanches et bazars.", duration:"Durée au choix",
      from:null, basis:"", hours:"≈ 3 h 30 de vol direct", x:700, y:170 },
    { id:"malaisie", code:"KUL", city:"Malaisie", country:"Kuala Lumpur, Langkawi, Penang", img:"kuala.webp",
      pitch:"Trois étapes, vols internes et city tours inclus.", duration:"10 jours / 9 nuits",
      from:184000, basis:"par personne, chambre triple", hours:"Vol avec escale", x:1060, y:420 },
    { id:"chrea", code:"CHR", city:"Chréa", country:"Blida, Algérie", img:"chrea.webp",
      pitch:"Cèdres, neige et sorties en groupe au départ d'Alger.", duration:"Sortie à la journée",
      from:null, basis:"", hours:"En autocar depuis Alger", x:520, y:232 }
  ],
  djerbaHotels: [
    ["Djerba Resort",3,160000],["Hôtel Quatres Saison",4,165000],["Palm Beach Club",4,175000],
    ["Fiesta Beach",4,200000],["Palm Azur",4,200000],["TUI Magic Life Pénélope",5,228000]
  ],
  fmt(n){ return n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," "); }
};
