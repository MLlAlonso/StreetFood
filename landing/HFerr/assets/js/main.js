document.addEventListener("DOMContentLoaded", () => {
    I18n.init();

    // ========================================================
    // ELEMENTS
    // ========================================================
    const navbar = document.querySelector(".navbar");
    const navbarToggle = document.querySelector("#navbar-toggle");
    const navigation = document.querySelector("#main-navigation");
    const navigationLinks = document.querySelectorAll(".navbar__link");

    // ========================================================
    // SCROLL STATE
    // ========================================================
    const handleNavbarScroll = () => {
        if (!navbar) {
            return;
        }

        const scrollPosition = window.scrollY;

        if (scrollPosition > 20) {
            navbar.classList.add("is-scrolled");
        } else {
            navbar.classList.remove("is-scrolled");
        }
    };

    handleNavbarScroll();
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });

    // ========================================================
    // MOBILE MENU
    // ========================================================
    const closeMobileMenu = () => {
        if (!navbarToggle || !navigation) {
            return;
        }

        navigation.classList.remove("is-open");
        navbarToggle.setAttribute("aria-expanded", "false");
        navbarToggle.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("menu-open");
    };

    const openMobileMenu = () => {
        if (!navbarToggle || !navigation) {
            return;
        }

        navigation.classList.add("is-open");
        navbarToggle.setAttribute("aria-expanded", "true");
        navbarToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    };

    const toggleMobileMenu = () => {
        if (!navigation) {
            return;
        }
        const isOpen = navigation.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    if (navbarToggle) {
        navbarToggle.addEventListener("click", toggleMobileMenu);
    }

    navigationLinks.forEach((link) => { link.addEventListener("click", () => { closeMobileMenu(); }); });

    // ========================================================
    // ESCAPE KEY
    // ========================================================
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // ========================================================
    // CLICK OUTSIDE
    // ========================================================
    document.addEventListener("click", (event) => {
        if (!navigation || !navbarToggle) {
            return;
        }

        const clickedInsideNavigation = navigation.contains(event.target);
        const clickedToggle = navbarToggle.contains(event.target);

        if (!clickedInsideNavigation && !clickedToggle) {
            closeMobileMenu();
        }
    });

    // ========================================================
    // CLOSE MENU WHEN RESIZING TO DESKTOP
    // ========================================================
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });

    // ============================================================
    // DOWNLOAD H.FERR CONTACT
    // ============================================================
    const downloadContact = document.getElementById("download-contact");

    if (downloadContact) {
        downloadContact.addEventListener("click", function (event) {
            event.preventDefault();

            const vCard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "FN:H.Ferr Consulting",
                "ORG:H.Ferr Consulting",
                "TEL;TYPE=WORK,VOICE:+14142614337",
                "END:VCARD"
            ].join("\r\n");

            const blob = new Blob(
                [vCard],
                { type: "text/vcard;charset=utf-8" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "H-Ferr-Consulting.vcf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // ============================================================
    // CLIENTS CAROUSEL
    // ============================================================
    const clientsCarousel = document.querySelector(".clients__carousel");

    if (clientsCarousel) {
        const track = clientsCarousel.querySelector(".clients__track");
        const slides = clientsCarousel.querySelectorAll(".clients__slide");
        const prevButton = clientsCarousel.querySelector(".clients__arrow--prev");
        const nextButton = clientsCarousel.querySelector(".clients__arrow--next");
        const dots = clientsCarousel.querySelectorAll(".clients__dot");
        let currentSlide = 0;

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, index) => {
                const isActive = index === currentSlide;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", String(isActive));
            });
        };

        const goToSlide = (index) => {
            if (index < 0) {
                currentSlide = slides.length - 1;
            } else if (index >= slides.length) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }

            updateCarousel();
        };

        prevButton?.addEventListener("click", () => {
            goToSlide(currentSlide - 1);
        });

        nextButton?.addEventListener("click", () => {
            goToSlide(currentSlide + 1);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goToSlide(index);
            });
        });

        // --------------------------------------------------------
        // AUTO PLAY
        // --------------------------------------------------------
        const autoPlayInterval = 30000; // 30 segundos
        
        setInterval(() => {
            goToSlide(currentSlide + 1);
        }, autoPlayInterval);

        updateCarousel();
    }

    // ============================================================
    // OPEN LOCATION IN MAPS
    // ============================================================
    const openMapButton = document.getElementById("open-map");

    if (openMapButton) {
        openMapButton.addEventListener("click", function () {
            const latitude = 43.040511;
            const longitude = -87.905438;
            const googleMapsUrl = "https://www.google.com/maps/dir/?api=1" + `&destination=${latitude},${longitude}`;
            const appleMapsUrl = `https://maps.apple.com/?ll=${latitude},${longitude}` + "&q=H.Ferr%20Consulting";

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

            if (isIOS) {
                window.open(appleMapsUrl, "_blank");
            } else {
                window.open(googleMapsUrl, "_blank");
            }
        });
    }

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        const submitButton = contactForm.querySelector(".location__submit");
        const submitText = submitButton.querySelector("span");
        const formMessage = document.getElementById("contact-form-message");

        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const originalText = submitText.textContent;
            submitButton.disabled = true;
            submitText.textContent = "Sending...";
            formMessage.textContent = "";
            formMessage.className = "location__form-message";

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: { Accept: "application/json" }
                });

                if (!response.ok) {
                    throw new Error("Unable to send message.");
                }

                contactForm.reset();
                submitText.textContent = "Message Sent";
                formMessage.textContent = "Thanks! Your message has been sent successfully.";
                formMessage.classList.add("location__form-message--success");

                setTimeout(() => {
                    submitText.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);

            } catch (error) {
                console.error("Contact form error:", error);
                submitText.textContent = "Try Again";
                formMessage.textContent = "Something went wrong. Please try again.";
                formMessage.classList.add("location__form-message--error");
                submitButton.disabled = false;
            }
        });
    }

    // ============================================================
    // FOOTER PHONE CONTACT
    // ============================================================
    const footerPhone = document.getElementById("footer-phone");

    if (footerPhone) {
        footerPhone.addEventListener("click", function (event) {
            event.preventDefault();

            const vCard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "FN:H.Ferr Consulting",
                "ORG:H.Ferr Consulting",
                "TEL;TYPE=WORK,VOICE:+14142614337",
                "END:VCARD"
            ].join("\r\n");

            const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "H-Ferr-Consulting.vcf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});