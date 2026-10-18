/* Demo listings for the concept. Replace with the agency's real CMS data. */
window.U = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 1200}&q=72`;
window.LISTINGS = [
  {id:'pechersk-penthouse', title:'Penthouse with terrace', city:'Kyiv', district:'Pechersk', deal:'buy', type:'Apartment', price:385000, beds:3, baths:2, area:148, floor:'12 of 12', year:2021,
   img:['1682184805271-11671b7ecf4c','1628592102751-ba83b0314276','1662454419716-c4c504728811','1738168279272-c08d6dd22002'],
   tags:['Terrace','Parking','Concierge'], text:'A top-floor home with a 40 m² terrace, open-plan living and kitchen, and views over the Dnipro. Two parking spaces and a storage room are included.'},
  {id:'lviv-villa', title:'Modern villa with pool', city:'Lviv', district:'Briukhovychi', deal:'buy', type:'House', price:520000, beds:5, baths:4, area:320, floor:'2 floors', year:2022,
   img:['1613977257363-707ba9348227','1642976975710-1d8890dbf5ab','1666282167632-c613fbeb163c','1603072845032-7b5bd641a82a'],
   tags:['Pool','Garden','Smart home'], text:'A family villa in a pine-forest suburb, 15 minutes from the old town. Heated pool, landscaped garden, home office and a two-car garage.'},
  {id:'odesa-sea-view', title:'Apartment with sea view', city:'Odesa', district:'Arcadia', deal:'buy', type:'Apartment', price:210000, beds:2, baths:2, area:86, floor:'9 of 16', year:2019,
   img:['1628012209120-d9db7abf7eab','1737233459465-8eaf6c7d8856','1663756915304-40b7eda63e41','1662454419716-c4c504728811'],
   tags:['Sea view','Balcony','Security'], text:'Bright two-bedroom apartment a short walk from the beach, with a glazed balcony facing the sea and a renovated kitchen.'},
  {id:'poltava-family-house', title:'Family house near the park', city:'Poltava', district:'Podil', deal:'buy', type:'House', price:148000, beds:4, baths:2, area:190, floor:'2 floors', year:2017,
   img:['1580587771525-78b9dba3b914','1666282167632-c613fbeb163c','1603072845032-7b5bd641a82a','1738168279272-c08d6dd22002'],
   tags:['Garden','Garage','Quiet street'], text:'A warm family house on a quiet street next to the park, with a fireplace, a large kitchen-dining room and a private garden.'},
  {id:'kyiv-loft', title:'Loft in a converted factory', city:'Kyiv', district:'Podil', deal:'rent', type:'Apartment', price:1900, beds:1, baths:1, area:74, floor:'4 of 5', year:2018,
   img:['1757524492552-d47a66a2b63e','1628592102751-ba83b0314276','1682184805271-11671b7ecf4c','1662454419716-c4c504728811'],
   tags:['High ceilings','Furnished','Pets allowed'], text:'Brick walls, 4.2 m ceilings and big factory windows. Fully furnished, ready to move in, minutes from the riverside.'},
  {id:'lviv-townhouse', title:'Townhouse with private yard', city:'Lviv', district:'Sykhiv', deal:'rent', type:'Townhouse', price:1400, beds:3, baths:2, area:132, floor:'3 floors', year:2020,
   img:['1721815693498-cc28507c0ba2','1738168279272-c08d6dd22002','1666282167632-c613fbeb163c','1603072845032-7b5bd641a82a'],
   tags:['Yard','Parking','Unfurnished'], text:'A three-level townhouse with a private yard and parking, close to schools and the ring road.'},
  {id:'kyiv-office', title:'Office floor in a business centre', city:'Kyiv', district:'Obolon', deal:'invest', type:'Commercial', price:690000, beds:0, baths:4, area:540, floor:'7 of 14', year:2016,
   img:['1600596542815-ffad4c1539a9','1594873604892-b599f847e859','1682184805271-11671b7ecf4c','1628592102751-ba83b0314276'],
   tags:['Leased','Class B+','Metro 5 min'], text:'A fully leased office floor with a long-term tenant in place. Open-plan space, two meeting rooms and dedicated parking.'},
  {id:'odesa-villa', title:'Villa by the coast', city:'Odesa', district:'Fontan', deal:'invest', type:'House', price:445000, beds:4, baths:3, area:260, floor:'2 floors', year:2015,
   img:['1706808849780-7a04fbac83ef','1642976975710-1d8890dbf5ab','1737233459465-8eaf6c7d8856','1666282167632-c613fbeb163c'],
   tags:['Pool','Seasonal rental','Coast 300 m'], text:'A coastal villa with a strong seasonal rental history, a pool and an outdoor kitchen, 300 m from the shore.'},
  {id:'kyiv-new-build', title:'New-build apartment', city:'Kyiv', district:'Osokorky', deal:'buy', type:'Apartment', price:96000, beds:2, baths:1, area:64, floor:'15 of 25', year:2026,
   img:['1748063578185-3d68121b11ff','1663756915304-40b7eda63e41','1662454419716-c4c504728811','1603072845032-7b5bd641a82a'],
   tags:['New build','Installments','Underground parking'], text:'A two-bedroom apartment in a new residential complex with installments available, a courtyard without cars and underground parking.'}
];
window.money = (p, deal) => '$' + p.toLocaleString('en-US') + (deal === 'rent' ? ' / mo' : '');
window.cardHTML = l => `
  <article class="card" data-reveal>
    <a class="card__img" href="property.html?id=${l.id}"><img src="${U(l.img[0], 800)}" alt="${l.title} in ${l.city}" loading="lazy" width="800" height="560"><span class="card__deal">${{buy:'For sale', rent:'For rent', invest:'Investment'}[l.deal]}</span></a>
    <div class="card__body">
      <p class="card__price">${money(l.price, l.deal)}</p>
      <h3><a href="property.html?id=${l.id}">${l.title}</a></h3>
      <p class="card__loc">${l.district}, ${l.city}</p>
      <ul class="card__specs">${l.beds ? `<li><b>${l.beds}</b> bed${l.beds > 1 ? 's' : ''}</li>` : ''}<li><b>${l.baths}</b> bath${l.baths > 1 ? 's' : ''}</li><li><b>${l.area}</b> m²</li></ul>
    </div>
  </article>`;
