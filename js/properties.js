// Properties page carousel and filtering
document.addEventListener('DOMContentLoaded', function(){
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const propertyItems = document.querySelectorAll('.property-item');
  const categoryFilters = document.querySelectorAll('.cat-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
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

  function updateCarousel() {
    carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Set initial state
  categoryFilters[0].classList.add('active');
});
