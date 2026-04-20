{
  const body = document.body;

  // helper functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  // get the pointer position (handles both mouse and touch)
  const getPointerPos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (ev.touches && ev.touches.length > 0) {
      // For touch events
      posx = ev.touches[0].clientX;
      posy = ev.touches[0].clientY;
    } else if (ev.pageX || ev.pageY) {
      // For mouse events
      posx = ev.pageX;
      posy = ev.pageY;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
      posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return { x: posx, y: posy };
  };

  let pointerPos = (lastPointerPos = cachePointerPos = { x: 0, y: 0 });

  // Update the pointer position for both mouse and touch
  const updatePointerPos = (ev) => {
    pointerPos = getPointerPos(ev);
  };

  window.addEventListener("mousemove", updatePointerPos);
  window.addEventListener("touchmove", updatePointerPos, { passive: false });

  const getPointerDistance = () =>
    MathUtils.distance(
      pointerPos.x,
      pointerPos.y,
      lastPointerPos.x,
      lastPointerPos.y
    );

  class Image {
    constructor(el) {
      this.DOM = { el: el };
      this.defaultStyle = {
        scale: 1,
        x: 0,
        y: 0,
        opacity: 0,
      };
      this.getRect();
    }

    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
    isActive() {
      return TweenMax.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
    }
  }

  class ImageTrail {
    constructor() {
      this.DOM = { content: document.querySelector(".content") };
      this.images = [];
      [...this.DOM.content.querySelectorAll("img")].forEach((img) =>
        this.images.push(new Image(img))
      );
      this.imagesTotal = this.images.length;
      this.imgPosition = 0;
      this.zIndexVal = 1;
      this.threshold = 100;
      requestAnimationFrame(() => this.render());
    }
    render() {
      let distance = getPointerDistance();
      cachePointerPos.x = MathUtils.lerp(
        cachePointerPos.x || pointerPos.x,
        pointerPos.x,
        0.1
      );
      cachePointerPos.y = MathUtils.lerp(
        cachePointerPos.y || pointerPos.y,
        pointerPos.y,
        0.1
      );

      if (distance > this.threshold) {
        this.showNextImage();

        ++this.zIndexVal;
        this.imgPosition =
          this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

        lastPointerPos = pointerPos;
      }

      let isIdle = true;
      for (let img of this.images) {
        if (img.isActive()) {
          isIdle = false;
          break;
        }
      }
      if (isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }

      requestAnimationFrame(() => this.render());
    }
    showNextImage() {
      const img = this.images[this.imgPosition];
      TweenMax.killTweensOf(img.DOM.el);

      new TimelineMax()
        .set(
          img.DOM.el,
          {
            startAt: { opacity: 0, scale: 1 },
            opacity: 1,
            scale: 1,
            zIndex: this.zIndexVal,
            x: cachePointerPos.x - img.rect.width / 2,
            y: cachePointerPos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          0.9,
          {
            ease: Expo.easeOut,
            x: pointerPos.x - img.rect.width / 2,
            y: pointerPos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: Power1.easeOut,
            opacity: 0,
          },
          0.4
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: Quint.easeOut,
            scale: 0.2,
          },
          0.4
        );
    }
  }

  // preload images
  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll(".content__img"), resolve);
    });
  };

  preloadImages().then(() => {
    new ImageTrail();
  });
}
