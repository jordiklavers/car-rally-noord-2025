// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on("scroll", ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("main", "M0,0 C0.65,0.01 0.05,0.99 1,1");

initSplitType();
initCheckSectionThemeScroll();
initLoader();
daysCounter();
initVimeoBGVideo();
initMarqueeScrollDirection();
initTabSystem();
initAccordion();
initSwipers();
initScrollTriggerAnimations();
initModalBasic();

gsap.defaults({
  ease: "main",
  duration: 0.4,
});

//

function initSplitType() {
  var splitTextWords = new SplitText("[data-split-words='']", {
    type: "words",
    wordsClass: "single-word",
  });
  $("[data-split-words=''] .single-word").wrapInner(
    "<div class='single-word-inner'>"
  );
}

function initCheckSectionThemeScroll() {
  // Get detection offset, in this case the navbar
  const navBarHeight = document.querySelector("[data-nav-bar-height]");
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function (themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      // If the offset is between the top & bottom of the current section
      if (
        themeSectionTop <= themeObserverOffset &&
        themeSectionBottom >= themeObserverOffset
      ) {
        // Check [data-theme-section]
        const themeSectionActive =
          themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        // Check [data-bg-section]
        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-bg-nav") !== bgSectionActive) {
            elem.setAttribute("data-bg-nav", bgSectionActive);
          }
        });
      }
    });
  }

  function startThemeCheck() {
    document.addEventListener("scroll", checkThemeSection);
  }

  // Initial check and start listening for scroll
  checkThemeSection();
  startThemeCheck();
}

//

function initLoader() {
  let loadWrap = $(".loader");
  let logo = loadWrap.find(".loader_logo-svg");
  let bg = loadWrap.find(".loader_bg");
  let firstPanel = loadWrap.find(".loader_bg-panel-1");
  let secondPanel = loadWrap.find(".loader_bg-panel-2");

  // Timeline for the loader animation
  let tl = gsap.timeline();

  gsap.defaults({
    ease: "main",
  });

  tl.call(() => lenis.stop());

  tl.set("html", {
    cursor: "wait",
  });

  // Animate the second panel with an offset
  tl.to(secondPanel, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    rotate: "0.001deg",
    duration: 1,
  }); // Offset by 0.5 seconds

  // Move the logo up to 0%
  tl.to(
    logo,
    {
      y: "0%",
      rotate: "0.001deg",
      duration: 0.5,
    },
    "-=0.5"
  );

  // Wait for 1 second
  tl.to({}, { duration: 1.5 });

  // Move the logo up to -100% and animate the panels out
  tl.to(logo, {
    y: "-100%",
    rotate: "0.001deg",
    duration: 0.7,
  });

  tl.to(
    bg,
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% -5%, 0% 0%)",
      rotate: "0.001deg",
      duration: 0.75,
    },
    "<"
  );

  // Hide the loader
  tl.set(loadWrap, {
    display: "none",
    visibility: "hidden",
  });

  tl.call(() => lenis.start());

  tl.set(
    "html",
    {
      cursor: "auto",
    },
    "<"
  );

  tl.from(
    ".header_title-col",
    {
      y: 100,
      rotate: "0.001deg",
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
    },
    "<-0.6"
  );
}

function initVimeoBGVideo() {
  // Select all elements that have [data-vimeo-bg-init]
  const vimeoPlayers = document.querySelectorAll("[data-vimeo-bg-init]");

  vimeoPlayers.forEach(function (vimeoElement, index) {
    // Add Vimeo URL ID to the iframe [src]
    // Looks like: https://player.vimeo.com/video/1019191082
    const vimeoVideoID = vimeoElement.getAttribute("data-vimeo-video-id");
    if (!vimeoVideoID) return;
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=1&muted=1`;
    vimeoElement.querySelector("iframe").setAttribute("src", vimeoVideoURL);

    // Assign an ID to each element
    const videoIndexID = "vimeo-player-index-" + index;
    vimeoElement.setAttribute("id", videoIndexID);

    const iframeID = vimeoElement.id;
    const player = new Vimeo.Player(iframeID);

    let videoAspectRatio;

    // Mute
    player.setVolume(0);

    // Update Aspect Ratio if [data-vimeo-update-size="true"]
    if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
      player.getVideoWidth().then(function (width) {
        player.getVideoHeight().then(function (height) {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector(".vimeo-player__before");
          if (beforeEl) {
            beforeEl.style.paddingTop = videoAspectRatio * 100 + "%";
          }
        });
      });
    }

    // Function to adjust video sizing
    function adjustVideoSizing() {
      const containerAspectRatio =
        (vimeoElement.offsetHeight / vimeoElement.offsetWidth) * 100;

      const iframeWrapper = vimeoElement.querySelector(
        ".vimeo-bg__iframe-wrapper"
      );
      if (iframeWrapper && videoAspectRatio) {
        if (containerAspectRatio > videoAspectRatio * 100) {
          iframeWrapper.style.width = `${
            (containerAspectRatio / (videoAspectRatio * 100)) * 100
          }%`;
        } else {
          iframeWrapper.style.width = "";
        }
      }
    }

    // Adjust video sizing initially
    if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
      adjustVideoSizing();
      player.getVideoWidth().then(function () {
        player.getVideoHeight().then(function () {
          adjustVideoSizing();
        });
      });
    } else {
      adjustVideoSizing();
    }

    // Adjust video sizing on resize
    window.addEventListener("resize", adjustVideoSizing);

    // Loaded
    player.on("play", function () {
      vimeoElement.setAttribute("data-vimeo-loaded", "true");
    });

    // Autoplay
    if (vimeoElement.getAttribute("data-vimeo-autoplay") === "false") {
      // Autoplay = false
      player.pause();
    } else {
      // Autoplay = true
      // If paused-by-user === false, do scroll-based autoplay
      if (vimeoElement.getAttribute("data-vimeo-paused-by-user") === "false") {
        function checkVisibility() {
          const rect = vimeoElement.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          inView ? vimeoPlayerPlay() : vimeoPlayerPause();
        }

        // Initial check
        checkVisibility();

        // Handle scroll
        window.addEventListener("scroll", checkVisibility);
      }
    }

    // Function: Play Video
    function vimeoPlayerPlay() {
      vimeoElement.setAttribute("data-vimeo-activated", "true");
      vimeoElement.setAttribute("data-vimeo-playing", "true");
      player.play();
    }

    // Function: Pause Video
    function vimeoPlayerPause() {
      vimeoElement.setAttribute("data-vimeo-playing", "false");
      player.pause();
    }

    // Click: Play
    const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        vimeoPlayerPlay();
      });
    }

    // Click: Pause
    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        vimeoPlayerPause();
        // If paused by user => kill the scroll-based autoplay
        if (vimeoElement.getAttribute("data-vimeo-autoplay") === "true") {
          vimeoElement.setAttribute("data-vimeo-paused-by-user", "true");
          // Removing scroll listener (if you’d like)
          window.removeEventListener("scroll", checkVisibility);
        }
      });
    }
  });
}

function initMarqueeScrollDirection() {
  document
    .querySelectorAll("[data-marquee-scroll-direction-target]")
    .forEach((marquee) => {
      // Query marquee elements
      const marqueeContent = marquee.querySelector(
        "[data-marquee-collection-target]"
      );
      const marqueeScroll = marquee.querySelector(
        "[data-marquee-scroll-target]"
      );
      if (!marqueeContent || !marqueeScroll) return;

      // Get data attributes
      const {
        marqueeSpeed: speed,
        marqueeDirection: direction,
        marqueeDuplicate: duplicate,
        marqueeScrollSpeed: scrollSpeed,
      } = marquee.dataset;

      // Convert data attributes to usable types
      const marqueeSpeedAttr = parseFloat(speed);
      const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
      const duplicateAmount = parseInt(duplicate || 0);
      const scrollSpeedAttr = parseFloat(scrollSpeed);
      const speedMultiplier =
        window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

      let marqueeSpeed =
        marqueeSpeedAttr *
        (marqueeContent.offsetWidth / window.innerWidth) *
        speedMultiplier;

      // Precompute styles for the scroll container
      marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
      marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

      // Duplicate marquee content
      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }

      // GSAP animation for marquee content
      const marqueeItems = marquee.querySelectorAll(
        "[data-marquee-collection-target]"
      );
      const animation = gsap
        .to(marqueeItems, {
          xPercent: -100, // Move completely out of view
          repeat: -1,
          duration: marqueeSpeed,
          ease: "linear",
        })
        .totalProgress(0.5);

      // Initialize marquee in the correct direction
      gsap.set(marqueeItems, {
        xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
      });
      animation.timeScale(marqueeDirectionAttr); // Set correct direction
      animation.play(); // Start animation immediately

      // Set initial marquee status
      marquee.setAttribute("data-marquee-status", "normal");

      // ScrollTrigger logic for direction inversion
      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const isInverted = self.direction === 1; // Scrolling down
          const currentDirection = isInverted
            ? -marqueeDirectionAttr
            : marqueeDirectionAttr;

          // Update animation direction and marquee status
          animation.timeScale(currentDirection);
          marquee.setAttribute(
            "data-marquee-status",
            isInverted ? "normal" : "inverted"
          );
        },
      });

      // Extra speed effect on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: "0% 100%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      const scrollStart =
        marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
      const scrollEnd = -scrollStart;

      tl.fromTo(
        marqueeScroll,
        { x: `${scrollStart}vw` },
        {
          x: `${scrollEnd}vw`,
          ease: "none",
        }
      );
    });
}

function daysCounter() {
  $("[data-counter-span]").each(function () {
    let targetWord = $(this).find(".single-word-inner")[0]; // Correct de eerste element selecteren

    const targetDate = new Date(Date.UTC(2025, 9, 26, 22, 0, 0)); // Doeldatum
    const now = new Date(); // Huidige datum en tijd

    // Bepaal verschil in milliseconden
    const diff = targetDate - now;

    if (diff <= 0) {
      // Als de doeldatum is bereikt of verstreken, toon 0 dagen
      if (targetWord) {
        targetWord.textContent = "0";
      }
      return;
    }

    // Bereken resterende dagen
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));

    // Schrijf de resterende dagen naar het .single-word-inner-element
    if (targetWord) {
      targetWord.textContent = `${days}`;
    }
  });
}

function initTabSystem() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');

    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;

    let activeContent = null; // keep track of active item/link
    let activeVisual = null;
    let isAnimating = false;
    let progressBarTween = null; // to stop/start the progress bar

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector(
        '[data-tabs="item-progress"]'
      );
      if (!bar) return;

      // In this function, you can basically do anything you want, that should happen as a tab is active
      // Maybe you have a circle filling, some other element growing, you name it.
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "power1.inOut",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length;
            switchTab(nextIndex); // once bar is full, set next to active – this is important
          }
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;

      isAnimating = true;
      if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here

      const outgoingContent = activeContent;
      const outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector(
        '[data-tabs="item-progress"]'
      );

      const incomingContent = contentItems[index];
      const incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector(
        '[data-tabs="item-progress"]'
      );

      outgoingContent?.classList.remove("active");
      outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");

      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "main" },
        onComplete: () => {
          activeContent = incomingContent;
          activeVisual = incomingVisual;
          isAnimating = false;
          if (autoplay) startProgressBar(index); // Start autoplay bar here
        },
      });

      // Wrap 'outgoing' in a check to prevent warnings on first run of the function
      // Of course, during first run (on page load), there's no 'outgoing' tab yet!
      if (outgoingContent) {
        outgoingContent.classList.remove("active");
        outgoingVisual?.classList.remove("active");
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
          .to(
            outgoingVisual,
            {
              autoAlpha: 0,
              //xPercent: 3
            },
            0
          )
          .to(
            outgoingContent.querySelector('[data-tabs="item-details"]'),
            { height: 0 },
            0
          );
      }

      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");
      tl.fromTo(
        incomingVisual,
        {
          autoAlpha: 0,
          //xPercent: 3,
          clipPath: "polygon(120% 0%, 100% 0%, 100% 100%, 100% 100%)",
        },
        {
          autoAlpha: 1,
          //xPercent: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        0.3
      )
        .fromTo(
          incomingContent.querySelector('[data-tabs="item-details"]'),
          { height: 0 },
          { height: "auto" },
          0
        )
        .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    // on page load, set first to active
    // idea: you could wrap this in a scrollTrigger
    // so it will only start once a user reaches this section
    switchTab(0);

    // switch tabs on click
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // ignore click if current one is already active
        switchTab(i);
      })
    );
  });
}

function initAccordion() {
  const faqItems = $(".faq_item");
  let currentOpenItem = null;

  faqItems.each(function () {
    const item = $(this);
    const title = item.find(".faq_title");
    const answer = item.find(".faq_answer-wrap");
    const icon = title.find("svg");

    // Set initial states
    answer.height(0);
    item.attr("data-open", "false");

    title.on("click", function () {
      const isOpen = item.attr("data-open") === "true";

      if (currentOpenItem && !currentOpenItem.is(item)) {
        // Close the previously open item
        toggleItem(currentOpenItem, false);
      }

      // Toggle the clicked item
      toggleItem(item, !isOpen);

      currentOpenItem = isOpen ? null : item;
    });
  });

  function toggleItem(item, open) {
    const answer = item.find(".faq_answer-wrap");
    const icon = item.find(".faq_title svg");

    item.attr("data-open", open.toString());

    //gsap.to(icon[0], { rotation: open ? 45 : 0, duration: 0.7 });
    gsap.to(answer[0], { height: open ? "auto" : 0, duration: 0.9 });
  }
}

function initSwipers() {
  if (".swiper.is-team") {
    let swiper = new Swiper(".swiper.is-team", {
      direction: "horizontal",
      loop: true,
      centeredSlides: true,
      // centeredSlidesBounds: true,
      autoplay: {
        delay: 4000,
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 4.5,
          spaceBetween: 16,
        },
      },
    });
  }

  if (".swiper.is-terugblikken") {
    let terugblikkenSwiper = new Swiper(".swiper.is-terugblikken", {
      direction: "horizontal",
      loop: true,
      speed: 700,

      navigation: {
        nextEl: ".terugblikken_nav.is-next",
        prevEl: ".terugblikken_nav.is-prev",
      },

      autoplay: {
        delay: 4000,
      },

      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 1.5,
          spaceBetween: -2,
        },
      },
    });
  }
}

function initScrollTriggerAnimations() {
  // Standardized on data attribute

  $("[data-animate-words]").each(function () {
    let triggerElement = $(this);
    let targetElement = $(this).find(".single-word-inner");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 75%",
        end: "100% 0%",
        toggleActions: "play none none none",
        markers: false,
        scrub: false,
      },
    });

    gsap.set(targetElement, {
      yPercent: 140,
      rotate: 0.001,
    });

    tl.to(targetElement, {
      yPercent: 0,
      stagger: 0.05,
      ease: "main",
      duration: 0.5,
      clearProps: "all",
    });
  });

  // Home Hero Header
  $(".section_header").each(function () {
    gsap.defaults({
      ease: "linear",
    });
    // Declare Variables for ScrollTrigger
    let triggerEl = $(this);
    let targetEl = triggerEl.find(".header_title-row");

    // Init ScrollTrigger
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl[0], // Use the DOM element, not jQuery object
        start: "0% 0%",
        end: "100% 0",
        scrub: 1,
        markers: false,
      },
    });

    // GSAP Animation
    tl.to(
      targetEl,
      {
        // Assuming you want to animate the target element
        y: "-100",
        opacity: 1,
      },
      0
    ).to(
      triggerEl,
      {
        // Corrected to use triggerEl for clipPath animation
        clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 0% 75%)",
      },
      0
    );
  });

  $(".footer").each(function () {
    gsap.defaults({
      ease: "linear",
    });
    // Declare Variables for ScrollTrigger
    let triggerEl = $(this);
    let targetEl = triggerEl.find(".header_title-row");

    // Init ScrollTrigger
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl[0], // Use the DOM element, not jQuery object
        start: "20% bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
      },
    });

    tl.from(
      triggerEl,
      {
        // Corrected to use triggerEl for clipPath animation
        clipPath: "polygon(0% 25%, 100% 15%, 100% 100%, 0% 100%)",
      },
      0
    );
  });
}

function initModalBasic() {
  // Groep waarbinnen de modals zitten (optioneel)
  const $modalGroup = $("[data-modal-group-status]");
  // Alle modals
  const $modals = $("[data-modal-name]");
  // Alle klikbare elementen die een modal openen
  const $modalTargets = $("[data-modal-target]");
  // Overlay voor als de modal opent
  const $modalOverlay = $(".modal_overlay");

  // Timeline die gebruikt wordt voor het sluiten van de modal
  // We maken 'm hier aan zodat we hem kunnen hergebruiken.
  const closeModalTl = gsap.timeline({
    paused: true,
    onComplete: closeAllModals, // wordt aangeroepen na de animatie
  });

  let $lastOpenedModal = null; // Hier houden we de laatst geopende modal bij

  // ================
  // OPEN MODAL
  // ================
  $modalTargets.on("click", function () {
    // Haal de naam van de modal op uit het geklikte element
    const modalTargetName = $(this).attr("data-modal-target");

    // Alle triggers en modals naar "not-active"
    $modalTargets.attr("data-modal-status", "not-active");
    $modals.attr("data-modal-status", "not-active");

    // Zet alleen de geklikte trigger op "active"
    $(this).attr("data-modal-status", "active");

    // Zoek de bijbehorende modal en zet op "active"
    const $currentModal = $('[data-modal-name="' + modalTargetName + '"]');
    $currentModal.attr("data-modal-status", "active");

    // Indien gewenst ook de groep op "active"
    if ($modalGroup.length) {
      $modalGroup.attr("data-modal-group-status", "active");
    }

    // Sla de laatst geopende modal op in de variabele
    $lastOpenedModal = $currentModal;

    // Timeline voor het OPENEN van de modal
    const openModalTl = gsap.timeline();
    openModalTl.call(() => lenis.stop());
    // Fade/slide-in de modal
    openModalTl.fromTo(
      $currentModal,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
      }
    );
    // Fade-in de overlay
    openModalTl.fromTo(
      $modalOverlay,
      { opacity: 0 },
      { opacity: 0.8, duration: 0.25 },
      0 // start tegelijk met de vorige animatie
    );
    // Eventueel extra animatie voor de close-knop
    openModalTl.fromTo(
      $currentModal.find(".modal_close"),
      {
        opacity: 0,
        scale: 0.75,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.675,
      },
      "<+0.2" // start iets later (relatief aan vorige animatie)
    );
  });

  // ================
  // SLUITEN VAN DE MODAL
  // ================

  // Functie die de sluit-timeline afspeelt
  function animateCloseModal() {
    // Als er geen geopende modal is, doe dan niets
    if (!$lastOpenedModal) return;

    // Leeg eerst de timeline voordat je deze opnieuw opbouwt
    closeModalTl.clear();

    // Bouw de sluit-animatie in de timeline
    closeModalTl.to($lastOpenedModal, {
      opacity: 0,
      y: 100,
      duration: 0.5,
    });
    // Overlay weer wegfaden
    closeModalTl.to(
      $modalOverlay,
      {
        opacity: 0,
        duration: 0.5,
      },
      "<"
    );

    closeModalTl.call(() => lenis.start());

    // Speel hem vanaf het begin af
    closeModalTl.restart();
  }

  // Functie om alles te resetten NA sluit-animatie
  function closeAllModals() {
    // Zet alle triggers en modals op not-active
    $modalTargets.attr("data-modal-status", "not-active");
    $modals.attr("data-modal-status", "not-active");

    // Zet de groep weer terug op 'not-active' (optioneel)
    if ($modalGroup.length) {
      $modalGroup.attr("data-modal-group-status", "not-active");
    }

    // Vergeet de laatst geopende modal
    $lastOpenedModal = null;
  }

  // Sluitmodal via close-button
  $("[data-modal-close]").on("click", function () {
    animateCloseModal();
  });

  // Sluitmodal via ESC-toets
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $lastOpenedModal) {
      animateCloseModal();
    }
  });
}
