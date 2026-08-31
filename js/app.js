// app.js: catálogo estático — sistema de compras removido
const PRODUCTS_URL = 'products.json';

async function loadProducts(){
  try{
    const res = await fetch(PRODUCTS_URL);
    if(!res.ok) throw new Error('Falha ao carregar produtos');
    const products = await res.json();
    renderProducts(products);
  }catch(err){
    console.error(err);
    document.getElementById('products').innerText = 'Não foi possível carregar os produtos.';
  }
}

function renderProducts(products){
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <img src="assets/images/${p.image}" alt="${p.title}" loading="lazy" />
      <h4>${p.title}</h4>
      <div class="price">R$ ${p.price.toFixed(2)}</div>
      <div class="meta">${p.description}</div>
      <a class="btn-link" href="#">Ver detalhes</a>
    `;
    container.appendChild(el);
  })
}

// Lightbox for posts gallery
function initGalleryLightbox(){
  const modal = document.getElementById('lightbox');
  if(!modal) return;
  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');

  function open(src, caption){
    modalImg.src = src;
    modalImg.alt = caption || '';
    modalCaption.textContent = caption || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  // Attach click handlers to gallery images
  document.querySelectorAll('.posts-gallery .post img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e=>{
      open(e.currentTarget.src, e.currentTarget.getAttribute('data-caption') || e.currentTarget.alt);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e=>{
    if(e.target === modal) close();
  });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') close();
  });
}

// init
loadProducts();
// init lightbox after DOM is ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initGalleryLightbox);
} else {
  initGalleryLightbox();
}
