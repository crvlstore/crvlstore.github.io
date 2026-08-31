// app.js: carregamento de produtos, carrinho e checkout
const API_BASE = window.APP_CONFIG && window.APP_CONFIG.API_BASE ? window.APP_CONFIG.API_BASE : '';
const PRODUCTS_URL = 'products.json';
let products = []
let cart = JSON.parse(localStorage.getItem('crvl_cart')||'[]')

function saveCart(){ localStorage.setItem('crvl_cart', JSON.stringify(cart)); renderCartCount(); }
function renderCartCount(){ document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0) }

async function loadProducts(){
  const res = await fetch(PRODUCTS_URL);
  products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <div class="price">R$ ${p.price.toFixed(2)}</div>
      <p>${p.description}</p>
      <button data-id="${p.id}" class="add">Adicionar ao carrinho</button>
    `;
    container.appendChild(el);
  })
}

function addEvents(){
  document.body.addEventListener('click',e=>{
    if(e.target.matches('.add')){
      const id = e.target.dataset.id; const prod = products.find(p=>p.id==id);
      const found = cart.find(c=>c.id==id);
      if(found) found.qty++; else cart.push({id:prod.id,title:prod.title,price:prod.price,qty:1});
      saveCart(); renderCartPanel();
    }
    if(e.target.id==='cart-btn'){ document.getElementById('cart-panel').classList.toggle('hidden') }
    if(e.target.id==='cart-clear'){ cart=[]; saveCart(); renderCartPanel(); }
    if(e.target.id==='checkout-open'){ document.getElementById('checkout').classList.remove('hidden') }
    if(e.target.id==='close-checkout'){ document.getElementById('checkout').classList.add('hidden') }
  })

  document.getElementById('checkout-form').addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const form = ev.target; const data = Object.fromEntries(new FormData(form).entries());
    const order = { customer: data, items: cart, total: cart.reduce((s,i)=>s+i.price*i.qty,0), createdAt: new Date().toISOString() }
    try{
      const url = (API_BASE||'') + '/api/orders';
      const res = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(order)});
      const json = await res.json();
      if(res.ok){ document.getElementById('checkout-result').innerText = 'Pedido enviado! ID: '+json.id; cart=[]; saveCart(); renderCartPanel(); }
      else document.getElementById('checkout-result').innerText = 'Erro: '+(json.message||res.statusText);
    }catch(err){ document.getElementById('checkout-result').innerText = 'Erro ao enviar pedido: '+err.message }
  })
}

function renderCartPanel(){
  const el = document.getElementById('cart-items'); const totalEl = document.getElementById('cart-total');
  el.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    const div = document.createElement('div'); div.innerHTML = `${item.title} x ${item.qty} — R$ ${(item.price*item.qty).toFixed(2)}`;
    el.appendChild(div);
    total += item.price*item.qty;
  })
  totalEl.textContent = total.toFixed(2);
  renderCartCount();
}

// init
loadProducts().then(()=>{ addEvents(); renderCartPanel(); saveCart(); }).catch(err=>console.error(err));
