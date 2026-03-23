// Properties page carousel, filtering, and product detail view
document.addEventListener('DOMContentLoaded', function(){
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const propertyItems = document.querySelectorAll('.property-item');
  const categoryFilters = document.querySelectorAll('.cat-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const productDetail = document.getElementById('productDetail');
  const closeDetailBtn = document.getElementById('closeDetail');
  
  let currentIndex = 0;
  let allItems = Array.from(propertyItems);
  let visibleItems = [...allItems];
  let currentFilter = 'all';

  // Filter functionality
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function(){
      currentFilter = this.dataset.filter;
      
      // Update active state
      categoryFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      
      // Filter properties
      visibleItems = currentFilter === 'all' 
        ? [...allItems] 
        : allItems.filter(item => item.dataset.category === currentFilter);
      
      // Show/hide items
      allItems.forEach(item => {
        item.classList.add('hidden');
      });
      visibleItems.forEach(item => {
        item.classList.remove('hidden');
      });
      
      currentIndex = 0;
      updateCarousel();
    });
  });

  // Carousel navigation
  prevBtn && prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateCarousel();
  });

  nextBtn && nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateCarousel();
  });

  // Click on property item to view details
  propertyItems.forEach(item => {
    item.addEventListener('click', function(e){
      if(!this.classList.contains('hidden')){
        showProductDetail(this);
      }
    });
  });

  // Close product detail
  closeDetailBtn && closeDetailBtn.addEventListener('click', () => {
    productDetail.classList.remove('show');
    productDetail.classList.add('hidden');
  });

  // Close modal when clicking on the overlay (outside the modal)
  productDetail && productDetail.addEventListener('click', (e) => {
    if(e.target === productDetail){
      productDetail.classList.remove('show');
      productDetail.classList.add('hidden');
    }
  });

  function updateCarousel() {
    carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function showProductDetail(item) {
    const name = item.dataset.name;
    const price = item.dataset.price;
    const sku = item.dataset.sku;
    const status = item.dataset.status;
    const description = item.dataset.description;
    const variations = item.dataset.variations.split('|');
    const img = item.querySelector('img').src;

    // Populate product detail
    document.getElementById('productName').textContent = name;
    document.getElementById('productPrice').textContent = '₱' + price;
    document.getElementById('productSKU').textContent = sku;
    
    const statusEl = document.getElementById('productStatus');
    statusEl.textContent = status;
    statusEl.classList.remove('limited');
    if(status.includes('Limited')) {
      statusEl.classList.add('limited');
    }

    document.getElementById('productDescription').textContent = description;
    document.getElementById('mainProductImg').src = img;

    // Populate variations
    const variationsList = document.getElementById('variationsList');
    variationsList.innerHTML = '';
    variations.forEach(v => {
      const tag = document.createElement('span');
      tag.className = 'variation-tag';
      tag.textContent = v.trim();
      variationsList.appendChild(tag);
    });

    // Show product detail section
    productDetail.classList.remove('hidden');
    productDetail.classList.add('show');
  }

  // Thumbnail gallery click
  const thumbImages = document.querySelectorAll('.thumb-img');
  thumbImages.forEach(thumb => {
    thumb.addEventListener('click', function(){
      document.getElementById('mainProductImg').src = this.dataset.full;
    });
  });

  // Set initial state
  categoryFilters[0].classList.add('active');
});
