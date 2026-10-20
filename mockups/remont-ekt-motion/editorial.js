'use strict';
// Ordinary contacts remain available without JS; enhance entry to the main form.
document.querySelectorAll('a[data-request-link]').forEach(link=>{link.hash='request'});
const filters=document.querySelector('.editorial-filters');
if(filters){
 const buttons=[...filters.querySelectorAll('[data-editorial-filter]')],cards=[...document.querySelectorAll('.editorial-card[data-category]')],count=document.querySelector('.editorial-count');
 filters.hidden=false;
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.editorialFilter;
  buttons.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});
  let visible=0;cards.forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)visible++});
  count.textContent=`Материалов: ${visible}`;
 }));
}
