/* Demo projects. On the real site these come from the CMS. */
window.IMG = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 1200}&q=75`;
window.BASE_PROJECTS = [
  {id:'type-in-motion', title:'Type in Motion', year:2026, kind:'Digital', tools:['After Effects','Figma'], cover:'1543487945-139a97f387d5',
   imgs:['1543487945-139a97f387d5','1618331833071-ce81bd50d300'], text:'A series of kinetic type posters exploring how rhythm and spacing change the meaning of a single word. Shown as looping screens in the school foyer.'},
  {id:'riso-zine', title:'Riso Zine No. 3', year:2026, kind:'Print', tools:['InDesign','Risograph'], cover:'1632062549850-44a0a6eede16',
   imgs:['1632062549850-44a0a6eede16','1673297180075-411992cad941'], text:'A 24-page risograph zine about the city at night, printed in two spot colours: blue and fluorescent orange.'},
  {id:'museum-wayfinding', title:'Museum Wayfinding', year:2025, kind:'Digital', tools:['Figma','Illustrator'], cover:'1636247498175-d2a8d052c2b0',
   imgs:['1636247498175-d2a8d052c2b0','1636247497842-81ee9c80f9df'], text:'A concept app and signage system that helps first-time visitors find their way and plan a 45-minute route.'},
  {id:'bakery-identity', title:'Bakery Identity', year:2025, kind:'Print', tools:['Illustrator','InDesign'], cover:'1636247499180-13285c86be9b',
   imgs:['1636247499180-13285c86be9b','1707214520073-1665e417be6f'], text:'Logo, packaging and menu cards for a neighbourhood bakery, built around a hand-drawn wordmark.'},
  {id:'architecture-brochure', title:'Architecture Brochure', year:2025, kind:'Print', tools:['InDesign','Photoshop'], cover:'1636247499734-893da2bcfc1c',
   imgs:['1636247499734-893da2bcfc1c','1636247498840-693054bb4bcc'], text:'A folded brochure for an architecture festival, with a grid that echoes the floor plans of the featured buildings.'},
  {id:'street-posters', title:'Street Poster Campaign', year:2024, kind:'Print', tools:['Photoshop','Illustrator'], cover:'1762365189058-7be5b07e038b',
   imgs:['1762365189058-7be5b07e038b','1533319417894-6fbb331e5513'], text:'A poster campaign for a student film night, designed to be read from across the street.'}
];
window.getProjects = () => {
  let extra = [];
  try { extra = JSON.parse(localStorage.getItem('folio-demo-projects') || '[]'); } catch (e) {}
  return extra.concat(BASE_PROJECTS);
};
window.projSrc = (p, w) => p.coverUrl || IMG(p.cover, w);
