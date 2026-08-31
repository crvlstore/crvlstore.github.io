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
      <img src="assets/images/${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <div class="price">R$ ${p.price.toFixed(2)}</div>
      <div class="meta">${p.description}</div>
      <a class="btn-link" href="#">Ver detalhes</a>
    `;
    container.appendChild(el);
  })
}

// init
loadProducts();
