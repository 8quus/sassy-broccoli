function createCarousel(images, selector, options = {}) {
    const defaults = {
      interval: 3000,
      autoplay: true
    };
    const settings = {...defaults, ...options};
    
    const container = document.querySelector(selector);
    if (!container) return;
    
    container.innerHTML = `
      <div class="carousel-slide">
        ${images.map(img => `<img src="${img}" class="carousel-image">`).join('')}
      </div>
      <button class="carousel-btn prev">❮</button>
      <button class="carousel-btn next">❯</button>
      <div class="carousel-indicators">
        ${images.map((_, i) => `<div class="carousel-indicator" data-index="${i}"></div>`).join('')}
      </div>
    `;

    const slide = container.querySelector('.carousel-slide');
    const indicators = container.querySelectorAll('.carousel-indicator');
    let currentIndex = 0;
    let intervalId;
    let isManualNavigation = false; // Флаг ручного переключения
  
    function goToSlide(index) {
      if (index < 0) index = images.length - 1;
      else if (index >= images.length) index = 0;
      
      slide.style.transform = `translateX(-${index * 100}%)`;
      indicators.forEach(ind => ind.classList.remove('active'));
      indicators[index].classList.add('active');
      currentIndex = index;
    }
  
    function startAutoplay() {
      if (settings.autoplay && !isManualNavigation) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, settings.interval);
      }
    }
  
    function stopAutoplay() {
      clearInterval(intervalId);
    }
  
    function handleManualNavigation() {
        isManualNavigation = true; // Ставим флажок "Пользователь листает!"
        stopAutoplay(); // Выключаем автопрокрутку
          // Через 6 сек снимаем флажок и включаем автопрокрутку снова
        setTimeout(() => {
        isManualNavigation = false;
        startAutoplay();
      }, settings.interval * 2); // Даем задержку перед возобновлением
    }

    container.querySelector('.prev').addEventListener('click', () => {
      handleManualNavigation();
      goToSlide(currentIndex - 1);
    });
  
    container.querySelector('.next').addEventListener('click', () => {
      handleManualNavigation();
      goToSlide(currentIndex + 1);
    });
  
    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        handleManualNavigation();
        goToSlide(parseInt(indicator.dataset.index));
      });
    });

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  
    goToSlide(0);
    startAutoplay();
  }