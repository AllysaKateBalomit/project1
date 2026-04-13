// Properties page carousel, filtering, and product detail view
document.addEventListener('DOMContentLoaded', function(){
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const propertyItems = document.querySelectorAll('.property-item');
  const categoryFilters = document.querySelectorAll('.cat-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const thumbPrevBtn = document.getElementById('thumbPrevBtn');
  const thumbNextBtn = document.getElementById('thumbNextBtn');
  const productDetail = document.getElementById('productDetail');
  const closeDetailBtn = document.getElementById('closeDetail');
  const imageLightbox = document.getElementById('imageLightbox');
  const closeLightboxBtn = document.getElementById('closeLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const mainProductImg = document.getElementById('mainProductImg');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const wishlistModal = document.getElementById('wishlistModal');
  const closeWishlistBtn = document.getElementById('closeWishlist');
  const wishlistToggle = document.getElementById('wishlistToggle');
  
  // Mapping of property IDs to folder names
  const propertyFolders = {
    'la_alegria': 'La_Alegria',
    'sitari': 'Sitari',
    'northfield': 'Northfield_Subdivision',
    'st_francis': 'Natures_Village',
    'centerville': 'Housing/Centville',
    'centerpoint': 'Housing/Centerpoint'
  };
  
  let currentIndex = 0;
  let allItems = Array.from(propertyItems);
  let visibleItems = [...allItems];
  let currentFilter = 'all';
  let thumbCarouselIndex = 0; // Track thumbnail carousel position
  let currentPropertyId = null; // Track current property in modal
  
  // Wishlist functionality
  let wishlist = JSON.parse(localStorage.getItem('propertyWishlist')) || [];
  
  function saveWishlist() {
    localStorage.setItem('propertyWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }
  
  function toggleWishlist(propertyId) {
    const index = wishlist.findIndex(item => item.id === propertyId);
    if(index > -1) {
      wishlist.splice(index, 1);
    } else {
      // Get property details from current item
      const propertyElement = Array.from(propertyItems).find(item => item.dataset.id === propertyId);
      if(propertyElement) {
        const propertyData = {
          id: propertyId,
          name: propertyElement.dataset.name,
          price: propertyElement.dataset.price,
          image: propertyElement.querySelector('img').src,
          category: propertyElement.dataset.category
        };
        wishlist.push(propertyData);
      }
    }
    saveWishlist();
    updateHeartIcon();
  }
  
  function updateWishlistUI() {
    const container = document.getElementById('wishlistItems');
    if(wishlist.length === 0) {
      container.innerHTML = '<div class="empty-wishlist"><h3>Your wishlist is empty</h3><p>Click the ❤️ heart icon on any property to add it to your wishlist.</p></div>';
    } else {
      container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
          <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
          <div class="wishlist-item-name">${item.name}</div>
          <div class="wishlist-item-price">₱${item.price}</div>
          <div class="wishlist-item-actions">
            <button class="wishlist-item-view" onclick="scrollToProperty('${item.id}')">View Property</button>
            <button class="wishlist-item-remove" onclick="removeFromWishlist('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('');
    }
  }
  
  function updateHeartIcon() {
    if(wishlistToggle && currentPropertyId) {
      const isInWishlist = wishlist.some(item => item.id === currentPropertyId);
      const heartImg = wishlistToggle.querySelector('img');
      if(heartImg) {
        heartImg.src = isInWishlist ? '../images/heart-full.png' : '../images/heart-hollow.png';
        heartImg.alt = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
      }
      wishlistToggle.classList.toggle('added', isInWishlist);
    }
  }
  
  // Make these functions global so they can be called from onclick attributes
  window.removeFromWishlist = function(propertyId) {
    wishlist = wishlist.filter(item => item.id !== propertyId);
    saveWishlist();
  };
  
  window.scrollToProperty = function(propertyId) {
    wishlistModal.classList.remove('show');
    wishlistModal.classList.add('hidden');
    // Click the property in the carousel
    const propertyElement = Array.from(propertyItems).find(item => item.dataset.id === propertyId);
    if(propertyElement && !propertyElement.classList.contains('hidden')) {
      propertyElement.click();
    }
  };
  
  // Wishlist button click handlers
  wishlistBtn && wishlistBtn.addEventListener('click', () => {
    updateWishlistUI();
    wishlistModal.classList.remove('hidden');
    wishlistModal.classList.add('show');
  });
  
  closeWishlistBtn && closeWishlistBtn.addEventListener('click', () => {
    wishlistModal.classList.remove('show');
    wishlistModal.classList.add('hidden');
  });
  
  wishlistModal && wishlistModal.addEventListener('click', (e) => {
    if(e.target === wishlistModal) {
      wishlistModal.classList.remove('show');
      wishlistModal.classList.add('hidden');
    }
  });
  
  wishlistToggle && wishlistToggle.addEventListener('click', () => {
    if(currentPropertyId) {
      toggleWishlist(currentPropertyId);
    }
  });
  

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

  // Lightbox functionality - Robust version
  if(mainProductImg) {
    mainProductImg.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Lightbox clicked - showing image');
      if(lightboxImg && imageLightbox) {
        lightboxImg.src = this.src;
        // Force display
        imageLightbox.style.cssText = 'display: flex !important; visibility: visible !important; z-index: 99999 !important;';
        imageLightbox.classList.remove('hidden');
        imageLightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
      return false;
    });
  }

  if(closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close button clicked');
      if(imageLightbox) {
        imageLightbox.style.cssText = 'display: none !important; visibility: hidden !important;';
        imageLightbox.classList.add('hidden');
        imageLightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
      return false;
    });
  }

  if(imageLightbox) {
    imageLightbox.addEventListener('click', function(e) {
      if(e.target === imageLightbox) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Background clicked');
        this.style.cssText = 'display: none !important; visibility: hidden !important;';
        this.classList.add('hidden');
        this.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
    });
  }

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
    const propertyId = item.dataset.id;
    const folderName = propertyFolders[propertyId];
    const fileFormat = item.dataset.format || 'jpg';
    const imageCount = parseInt(item.dataset.count) || 4;

    // Set current property ID for wishlist
    currentPropertyId = propertyId;

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

    // Load thumbnail images from property folder with correct format
    const thumbImages = document.querySelectorAll('.thumb-img');
    if(folderName) {
      thumbImages.forEach((thumb, index) => {
        if(index < imageCount) {
          const imgNum = index + 1;
          const imagePath = `../images/propertiesImages/${folderName}/${imgNum}.${fileFormat}`;
          thumb.src = imagePath;
          thumb.dataset.full = imagePath;
          thumb.alt = `${name} - Angle ${imgNum}`;
        } else {
          thumb.style.display = 'none';
        }
      });
    }

    // Show product detail section
    productDetail.classList.remove('hidden');
    productDetail.classList.add('show');
    
    // Update heart icon state
    updateHeartIcon();
    
    // Reset thumbnail carousel position
    thumbCarouselIndex = 0;
    updateThumbCarousel();
  }

  // Thumbnail gallery click
  const thumbImages = document.querySelectorAll('.thumb-img');
  thumbImages.forEach(thumb => {
    thumb.addEventListener('click', function(){
      document.getElementById('mainProductImg').src = this.dataset.full;
    });
  });

  // Thumbnail carousel functions
  function updateThumbCarousel() {
    const gallery = document.querySelector('.thumbnail-gallery');
    const thumbImages = document.querySelectorAll('.thumb-img:not([style*="display: none"])');
    
    // Hide/show carousel buttons based on image count
    if(thumbImages.length <= 4) {
      thumbPrevBtn.style.display = 'none';
      thumbNextBtn.style.display = 'none';
    } else {
      thumbPrevBtn.style.display = 'flex';
      thumbNextBtn.style.display = 'flex';
      gallery.style.transform = `translateX(-${thumbCarouselIndex * 110}px)`;
      
      // Disable/enable buttons based on position
      thumbPrevBtn.disabled = thumbCarouselIndex === 0;
      thumbNextBtn.disabled = thumbCarouselIndex >= thumbImages.length - 4;
    }
  }

  thumbPrevBtn && thumbPrevBtn.addEventListener('click', () => {
    if(thumbCarouselIndex > 0) {
      thumbCarouselIndex--;
      updateThumbCarousel();
    }
  });

  thumbNextBtn && thumbNextBtn.addEventListener('click', () => {
    const thumbImages = document.querySelectorAll('.thumb-img:not([style*="display: none"])');
    if(thumbCarouselIndex < thumbImages.length - 4) {
      thumbCarouselIndex++;
      updateThumbCarousel();
    }
  });

  // Set initial state
  categoryFilters[0].classList.add('active');
});
