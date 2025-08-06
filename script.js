document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded. Script is running.");

  // 1. Sticky Header
  const mainHeader = document.getElementById("main-header");
  let contentOffset = document.querySelector(".main-content-wrapper").offsetTop;

  function updateStickyHeader() {
    if (window.pageYOffset > contentOffset) {
      mainHeader.classList.add("sticky");
      document.body.style.paddingTop = mainHeader.offsetHeight + "px";
    } else {
      mainHeader.classList.remove("sticky");
      document.body.style.paddingTop = "0";
    }
  }

  updateStickyHeader();
  window.addEventListener("scroll", updateStickyHeader);
  window.addEventListener("resize", () => {
    contentOffset = document.querySelector(".main-content-wrapper").offsetTop;
    updateStickyHeader();
  });

  // 2. Dynamic Table of Contents (TOC) Generation and ScrollSpy
  const tocList = document.getElementById("toc-list");
  const articleContent = document.querySelector("main article");
  const articleHeadings = articleContent.querySelectorAll("h1, h2, h3");

  const tocLinks = [];

  articleHeadings.forEach((heading) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    let id = heading.id;

    if (!id) {
      id = heading.textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      heading.id = id;
    }

    link.href = `#${id}`;
    link.textContent = heading.textContent;

    if (heading.tagName === "H3") {
      listItem.style.marginLeft = "20px";
      listItem.style.fontSize = "0.9em";
    } else if (heading.tagName === "H1") {
      listItem.style.fontWeight = "bold";
    }

    listItem.appendChild(link);
    tocList.appendChild(listItem);
    tocLinks.push({ link: link, target: heading });

    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetElement = document.getElementById(id);
      const headerHeight = mainHeader.offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
      history.pushState(null, null, `#${id}`);
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: `-${mainHeader.offsetHeight + 10}px 0px -50% 0px`,
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const targetId = entry.target.id;
      const correspondingLink = document.querySelector(`#toc-list a[href="#${targetId}"]`);

      if (correspondingLink) {
        if (entry.isIntersecting) {
          tocLinks.forEach(item => item.link.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      }
    });
  }, observerOptions);

  articleHeadings.forEach(heading => {
    observer.observe(heading);
  });

  // 3. TOC Toggle Button for Mobile
  const tocToggleButton = document.getElementById("toc-toggle-button");
  const tocSidebar = document.getElementById("toc-sidebar");
  if (tocToggleButton && tocSidebar) {
    tocToggleButton.addEventListener("click", () => {
      tocSidebar.classList.toggle("active");
      tocList.classList.toggle("active");
      const icon = tocToggleButton.querySelector('i');
      if (tocSidebar.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // 4. Image Lightbox
  const lightbox = document.getElementById("article-lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const galleryItems = document.querySelectorAll(".gallery-item img");

  console.log("Lightbox element:", lightbox);
  console.log("Lightbox close button:", lightboxClose);
  console.log("Gallery items found:", galleryItems.length);

  galleryItems.forEach((img) => {
    img.addEventListener("click", function () {
      console.log("Image clicked, opening lightbox.");
      lightbox.classList.add("active");
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      document.body.style.overflow = "hidden";
    });
  });

  if (lightboxClose) { // Check if close button exists before adding listener
    lightboxClose.addEventListener("click", () => {
      console.log("Lightbox close button clicked.");
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    });
  } else {
    console.error("Error: Lightbox close button not found!");
  }

  if (lightbox) { // Check if lightbox exists before adding listener
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        console.log("Clicked outside lightbox image, closing.");
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  } else {
    console.error("Error: Lightbox element not found!");
  }


  // 5. Scroll Animations (Fade-in-section)
  const fadeInSections = document.querySelectorAll(".fade-in-section");
  const fadeInObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, fadeInObserverOptions);

  fadeInSections.forEach((section) => {
    fadeInObserver.observe(section);
  });

  // 6. Interactive Glossary (Accordion)
  const glossaryHeaders = document.querySelectorAll(".glossary-header");
  glossaryHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      header.classList.toggle("active");
      content.classList.toggle("active");

      if (content.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });

  // 7. Back to Top Button
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});