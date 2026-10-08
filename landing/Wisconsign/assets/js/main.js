// ============================================================
// INTERNATIONALIZATION
// ============================================================
if (typeof I18n !== "undefined") {
    I18n.init();
}

// ============================================================
// NAVBAR
// ============================================================
const navbar = document.querySelector(".navbar");
const navbarToggle = document.getElementById("navbar-toggle");
const mainNavigation = document.getElementById("main-navigation");
const navigationLinks = document.querySelectorAll(".navbar__link");

const handleNavbarScroll = () => {
    if (!navbar) {
        return;
    }

    if (window.scrollY > 20) {
        navbar.classList.add("is-scrolled");
    } else {
        navbar.classList.remove("is-scrolled");
    }
};

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();

const closeMobileMenu = () => {
    if (!navbarToggle || !mainNavigation) {
        return;
    }

    mainNavigation.classList.remove("is-open");
    navbarToggle.setAttribute("aria-expanded", "false");
    navbarToggle.setAttribute("aria-label", "Open navigation menu");
};


const openMobileMenu = () => {
    if (!navbarToggle || !mainNavigation) {
        return;
    }

    mainNavigation.classList.add("is-open");
    navbarToggle.setAttribute("aria-expanded", "true");
    navbarToggle.setAttribute("aria-label", "Close navigation menu");
};

if (navbarToggle && mainNavigation) {
    navbarToggle.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => { closeMobileMenu(); });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

document.addEventListener("click", (event) => {
    if (!mainNavigation || !navbarToggle || !mainNavigation.classList.contains("is-open")) {
        return;
    }

    const clickedInsideNavigation = mainNavigation.contains(event.target);
    const clickedToggle = navbarToggle.contains(event.target);

    if (!clickedInsideNavigation && !clickedToggle) {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
        closeMobileMenu();
    }
});

// ============================================================
// HERO CONTACT
// ============================================================
const heroContactButton = document.getElementById("nav-contact-button");

if (heroContactButton) {
    heroContactButton.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            const vCard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "FN:WisconSign",
                "ORG:WisconSign",
                "TEL;TYPE=WORK,VOICE:+16787446947",
                "END:VCARD"
            ].join("\r\n");

            const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "WisconSign.vcf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    );
}

// ============================================================
// FAQ ACCORDION
// ============================================================
const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");

    if (!question || !answer) {
        return;
    }

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Close every other FAQ item
        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
                const otherQuestion = otherItem.querySelector(".faq__question");
                const otherAnswer = otherItem.querySelector(".faq__answer");
                otherItem.classList.remove("is-open");

                if (otherQuestion) {
                    otherQuestion.setAttribute("aria-expanded", "false");
                }

                if (otherAnswer) {
                    otherAnswer.setAttribute("aria-hidden", "true");
                }
            }
        });

        // Toggle current item
        if (isOpen) {
            item.classList.remove("is-open");
            question.setAttribute("aria-expanded", "false");
            answer.setAttribute("aria-hidden", "true");
        } else {
            item.classList.add("is-open");
            question.setAttribute("aria-expanded", "true");
            answer.setAttribute("aria-hidden", "false");
        }
    });
});

// ============================================================
// FOOTER YEAR
// ============================================================
const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}