/* =========================================
   AIRPURE HEADER JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       PRODUCTS SHOWCASE FILTERING
    ===================================== */
    const showcase = document.querySelector(".airpure-products-showcase-section");
    if (showcase) {
        const names = ["AirPure Mini S1", "AirPure Mini S2", "AirPure Mini Carbon", "AirPure Mini Pro", "AirPure Home S1", "AirPure Home S2", "AirPure Home Carbon", "AirPure Home Pro", "AirPure Living S1", "AirPure Living S2", "AirPure Living Pro", "AirPure Living Max", "AirPure Clean S1", "AirPure Clean S2", "AirPure Clean Carbon", "AirPure Clean Pro", "AirPure Max S1", "AirPure Max S2", "AirPure Max Carbon", "AirPure Max Pro", "AirPure Max Ultra", "AirPure Office Pro", "AirPure Family Max", "AirPure Space Max"];
        const techs = ["HEPA", "UV", "Activated Carbon", "Multi-Stage"];
        const rooms = ["Small Room", "Medium Room", "Large Room", "Open Space"];
        const coverages = ["Up to 200 sq ft", "201\u2013400 sq ft", "401\u2013700 sq ft", "700+ sq ft"];
        const needs = ["Dust & Fine Particles", "Allergens", "Odours", "General Indoor Air Quality"];
        const usages = ["Bedroom", "Living Room", "Workspace", "Family Space", "Large Area"];
        const cares = ["Standard Filter Care", "Extended Filter Care", "Easy Replacement"];
        const products = names.map((name, i) => {
            let technology = techs[i % techs.length];
            if (name.includes("Carbon")) technology = "Activated Carbon";
            if ([3, 7, 10, 11, 15, 19, 20, 21, 22, 23].includes(i)) technology = "Multi-Stage";
            const roomIndex = i < 4 ? 0 : i < 8 ? 1 : i < 16 ? 2 : 3;
            const productType = roomIndex === 0 ? "Compact" : (roomIndex === 3 || /Pro|Max|Ultra/.test(name) ? "Performance" : "Standard");
            const stage = technology === "Multi-Stage" ? "Multi Stage" : (technology === "HEPA" ? "Single Stage" : "Dual Stage");
            const descriptionPrefix = i === 9 ? "more " : i === 13 ? "full " : i === 17 ? "your " : "";
            return { id: i + 1, name, technology, room: rooms[roomIndex], productType, coverage: coverages[roomIndex], need: needs[i % needs.length], usage: usages[i % usages.length], care: cares[i % cares.length], stage, description: `${technology} purification designed for ${descriptionPrefix}${usages[i % usages.length].toLowerCase()} comfort.` };
        });
        const grid = document.getElementById("airpure-products-showcase-grid");
        const search = document.getElementById("airpure-products-showcase-search");
        const sort = document.getElementById("airpure-products-showcase-sort");
        const filters = [...showcase.querySelectorAll("[data-filter]")];
        const selected = new Set();
        const coverageRank = { "Up to 200 sq ft": 200, "201\u2013400 sq ft": 400, "401\u2013700 sq ft": 700, "700+ sq ft": 1000 };
        const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
        const render = () => {
            let list = products.filter(product => filters.every(control => !control.value || (control.dataset.filter === "technology" ? product.technology : control.dataset.filter === "room" ? product.room : control.dataset.filter === "type" ? product.productType : control.dataset.filter === "stage" ? product.stage : product[control.dataset.filter]) === control.value) && product.name.toLowerCase().includes(search.value.trim().toLowerCase()));
            if (sort.value === "coverage") list.sort((a, b) => coverageRank[b.coverage] - coverageRank[a.coverage]);
            if (sort.value === "compact") list.sort((a, b) => Number(b.productType === "Compact") - Number(a.productType === "Compact"));
            if (sort.value === "multi") list.sort((a, b) => Number(b.stage === "Multi Stage") - Number(a.stage === "Multi Stage"));
            document.getElementById("airpure-products-showcase-result-count").textContent = `${list.length} ${list.length === 1 ? "Product" : "Products"}`;
            document.getElementById("airpure-products-showcase-filter-count").textContent = `${list.length} products`;
            document.getElementById("airpure-products-showcase-active-summary").textContent = filters.some(f => f.value) || search.value ? "Filtered to match your selection" : "Showing all AirPure models";
            const active = filters.filter(f => f.value).map(f => ({ key: f.dataset.filter, value: f.options[f.selectedIndex].text }));
            if (search.value) active.push({ key: "search", value: search.value });
            document.getElementById("airpure-products-showcase-chips").innerHTML = active.map(chip => `<span class="airpure-products-showcase-chip">${escapeHTML(chip.value)}<button type="button" data-remove-filter="${chip.key}" aria-label="Remove ${escapeHTML(chip.value)}">&times;</button></span>`).join("") + (active.length ? `<button type="button" class="airpure-products-showcase-clear" data-showcase-reset>Clear All</button>` : "");
            grid.innerHTML = list.map(product => `<article class="airpure-products-showcase-card"><div class="airpure-products-showcase-image"><img src="images/product-${String(product.id).padStart(2, "0")}.jpg" alt="${product.name} air purifier" loading="lazy" onerror="this.onerror=null;this.src='images/hero-purifier.jpg'"><span class="airpure-products-showcase-badge">${product.technology}</span></div><div class="airpure-products-showcase-card-content"><h3>${product.name}</h3><p>${product.description}</p><div class="airpure-products-showcase-specs"><span>Room <strong>${product.room}</strong></span><span>Filtration <strong>${product.stage}</strong></span><span>Coverage <strong>${product.coverage}</strong></span></div><div class="airpure-products-showcase-card-footer"><label class="airpure-products-showcase-compare"><input type="checkbox" data-compare="${product.id}" ${selected.has(product.id) ? "checked" : ""}> Add to Compare</label><a class="airpure-products-showcase-detail" href="#room-comparison">View Details <i class="fa-solid fa-arrow-right"></i></a></div></div></article>`).join("");
            document.getElementById("airpure-products-showcase-empty").hidden = list.length > 0;
            grid.hidden = list.length === 0;
            grid.classList.toggle("compact", showcase.querySelector('[data-view="compact"]').classList.contains("active"));
            const bar = document.getElementById("airpure-products-showcase-compare-bar");
            bar.hidden = selected.size === 0;
            document.getElementById("airpure-products-showcase-compare-count").textContent = `${selected.size} ${selected.size === 1 ? "product" : "products"} selected`;
        };
        const reset = () => { filters.forEach(f => f.value = ""); search.value = ""; sort.value = "recommended"; render(); };
        showcase.addEventListener("click", event => {
            if (event.target.closest("[data-showcase-reset]")) reset();
            if (event.target.closest("[data-showcase-apply]")) { const advanced = showcase.querySelector(".airpure-products-showcase-advanced"); if (advanced) advanced.open = false; }
            const remove = event.target.closest("[data-remove-filter]");
            if (remove) { if (remove.dataset.removeFilter === "search") search.value = ""; else showcase.querySelector(`[data-filter="${remove.dataset.removeFilter}"]`).value = ""; render(); }
            const view = event.target.closest("[data-view]");
            if (view) { showcase.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button === view)); render(); }
        });
        showcase.addEventListener("change", event => {
            if (event.target.matches("[data-filter], #airpure-products-showcase-sort")) render();
            if (event.target.matches("[data-compare]")) {
                const id = Number(event.target.dataset.compare);
                const message = document.getElementById("airpure-products-showcase-compare-message");
                if (event.target.checked && selected.size >= 3) { event.target.checked = false; message.textContent = "You can compare up to 3 products."; return; }
                if (event.target.checked) selected.add(id); else selected.delete(id);
                message.textContent = ""; render();
            }
        });
        search.addEventListener("input", render);
        render();
    }
    /* =====================================
       ROOM SIZE COMPARISON
    ===================================== */
    const roomSection = document.querySelector(".airpure-room-comparison-section");
    if (roomSection) {
        const roomData = {
            small: { name: "Small Room", coverage: "Up to 200 sq ft", spaces: "Bedroom · Study Room · Small Personal Space", range: [0, 3] },
            medium: { name: "Medium Room", coverage: "201–400 sq ft", spaces: "Living Room · Bedroom · Family Room · Workspace", range: [4, 7] },
            large: { name: "Large Room", coverage: "401–700 sq ft", spaces: "Large Living Room · Family Space · Large Workspace", range: [8, 15] },
            open: { name: "Open Space", coverage: "700+ sq ft", spaces: "Open-plan Space · Large Indoor Area · Commercial-style Indoor Space", range: [16, 23] }
        };
        const names = ["AirPure Mini S1", "AirPure Mini S2", "AirPure Mini Carbon", "AirPure Mini Pro", "AirPure Home S1", "AirPure Home S2", "AirPure Home Carbon", "AirPure Home Pro", "AirPure Living S1", "AirPure Living S2", "AirPure Living Pro", "AirPure Living Max", "AirPure Clean S1", "AirPure Clean S2", "AirPure Clean Carbon", "AirPure Clean Pro", "AirPure Max S1", "AirPure Max S2", "AirPure Max Carbon", "AirPure Max Pro", "AirPure Max Ultra", "AirPure Office Pro", "AirPure Family Max", "AirPure Space Max"];
        const techs = ["HEPA", "UV", "Activated Carbon", "Multi-Stage"], uses = ["Bedroom", "Living Room", "Workspace", "Family Space", "Large Area"], needs = ["Dust & Fine Particles", "Allergens", "Odours", "General Indoor Air Quality"], cares = ["Standard Filter Care", "Extended Filter Care", "Easy Replacement"];
        const products = names.map((name, i) => {
            let technology = techs[i % 4]; if (name.includes("Carbon")) technology = "Activated Carbon"; if ([3, 7, 10, 11, 15, 19, 20, 21, 22, 23].includes(i)) technology = "Multi-Stage";
            const tier = i < 4 ? 0 : i < 8 ? 1 : i < 16 ? 2 : 3, roomKey = ["small", "medium", "large", "open"][tier], room = roomData[roomKey];
            return { id: i + 1, name, image: `images/product-${String(i + 1).padStart(2, "0")}.jpg`, technology, roomSize: room.name, coverage: room.coverage, filtration: technology === "Multi-Stage" ? "HEPA + Carbon" : technology === "HEPA" ? "HEPA" : "Carbon + UV", primaryUse: uses[i % uses.length], productType: tier === 0 ? "Compact" : (tier === 3 || /Pro|Max|Ultra/.test(name) ? "Performance" : "Standard"), purificationStage: technology === "Multi-Stage" ? "Multi Stage" : technology === "HEPA" ? "Single Stage" : "Dual Stage", filterCare: cares[i % cares.length], everydayUsage: needs[i % needs.length], roomKey };
        });
        const selected = new Set(); let currentRoom = "small", page = 0;
        const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
        const render = () => {
            const config = roomData[currentRoom], suitable = products.filter(p => p.roomKey === currentRoom), pages = Math.max(1, Math.ceil(suitable.length / 3)); page = Math.min(page, pages - 1);
            document.getElementById("airpureRoomName").textContent = config.name; document.getElementById("airpureRoomCoverage").textContent = config.coverage;
            document.getElementById("airpureRoomCount").textContent = suitable.length; document.getElementById("airpureRoomPage").textContent = `${page + 1} / ${pages}`;
            document.querySelector("[data-room-prev]").disabled = page === 0; document.querySelector("[data-room-next]").disabled = page >= pages - 1;
            document.getElementById("airpureRoomRecommendation").textContent = config.name;
            document.getElementById("airpureRoomRecommendationText").textContent = `A purifier in the ${config.coverage} range may be suitable for your selected space (${config.spaces}). Review individual model specifications before making a final choice.`;
            document.getElementById("airpureRoomViewModels").innerHTML = `View All ${escapeHTML(config.name)} Models <i class="fa-solid fa-arrow-right"></i>`;
            document.getElementById("airpureRoomProducts").innerHTML = suitable.slice(page * 3, page * 3 + 3).map(p => `<article class="airpure-room-comparison-card ${selected.has(p.id) ? "selected" : ""}"><div class="airpure-room-comparison-image"><img src="${p.image}" alt="${escapeHTML(p.name)} air purifier" loading="lazy"><span class="airpure-room-comparison-badge">${escapeHTML(p.technology)}</span></div><div class="airpure-room-comparison-details"><h4>${escapeHTML(p.name)}</h4><div class="airpure-room-comparison-specs"><div><span>Coverage</span><strong>${p.coverage}</strong></div><div><span>Room Type</span><strong>${p.roomSize}</strong></div><div><span>Filtration</span><strong>${p.filtration}</strong></div><div><span>Best For</span><strong>${p.primaryUse}</strong></div><div><span>Filter Care</span><strong>${p.filterCare.replace(" Filter Care", "")}</strong></div><div><span>Product Type</span><strong>${p.productType}</strong></div></div><div class="airpure-room-comparison-card-actions"><label class="airpure-room-comparison-select"><input type="checkbox" data-room-compare="${p.id}" ${selected.has(p.id) ? "checked" : ""}> Add to Compare</label>${selected.has(p.id) ? '<span class="airpure-room-comparison-selected-label">Selected</span>' : ""}<a class="airpure-room-comparison-view" href="#product-showcase">View Product <i class="fa-solid fa-arrow-right"></i></a></div></div></article>`).join("");
            document.querySelectorAll(".airpure-room-comparison-option").forEach(b => { b.classList.toggle("active", b.dataset.room === currentRoom); b.setAttribute("aria-pressed", b.dataset.room === currentRoom) });
            document.getElementById("airpureCompareCount").textContent = `${selected.size} of 3 models selected`;
            const result = document.getElementById("airpureComparisonResults"); result.hidden = selected.size < 2;
            if (selected.size >= 2) { const rows = [["Technology", "technology"], ["Room Size", "roomSize"], ["Coverage", "coverage"], ["Filtration", "filtration"], ["Primary Use", "primaryUse"], ["Product Type", "productType"], ["Purification Stage", "purificationStage"], ["Filter Care", "filterCare"], ["Everyday Usage", "everydayUsage"], ["Recommended Space", "roomSize"]], chosen = products.filter(p => selected.has(p.id)); document.getElementById("airpureComparisonTable").innerHTML = `<thead><tr><th>FEATURE</th>${chosen.map(p => `<th>${escapeHTML(p.name)}<button type="button" class="airpure-room-comparison-remove" data-remove-product="${p.id}">Remove</button></th>`).join("")}</tr></thead><tbody>${rows.map(([label, key]) => `<tr><td>${label}</td>${chosen.map(p => `<td>${escapeHTML(p[key])}</td>`).join("")}</tr>`).join("")}</tbody>`; }
        };
        roomSection.addEventListener("click", event => {
            const option = event.target.closest("[data-room]"); if (option) { currentRoom = option.dataset.room; page = 0; document.getElementById("airpureRoomLimit").textContent = ""; render(); }
            if (event.target.closest("[data-change-room]")) { document.getElementById("airpureRoomSelector").scrollIntoView({ behavior: "smooth", block: "center" }); }
            if (event.target.closest("[data-room-prev]")) { page = Math.max(0, page - 1); render(); } if (event.target.closest("[data-room-next]")) { page++; render(); }
            if (event.target.closest("[data-clear-compare]")) { selected.clear(); render(); }
            const remove = event.target.closest("[data-remove-product]"); if (remove) { selected.delete(Number(remove.dataset.removeProduct)); render(); }
        });
        roomSection.addEventListener("change", event => { if (!event.target.matches("[data-room-compare]")) return; const id = Number(event.target.dataset.roomCompare), message = document.getElementById("airpureRoomLimit"); if (event.target.checked && selected.size >= 3) { event.target.checked = false; message.textContent = "You can compare up to 3 products."; return; } message.textContent = ""; if (event.target.checked) selected.add(id); else selected.delete(id); render(); if (selected.size >= 2) document.getElementById("airpureComparisonResults").scrollIntoView({ behavior: "smooth", block: "nearest" }); });
        render();
    }

    /* =====================================
       MENU TOGGLE
    ===================================== */

    const menuToggle = document.getElementById("airpureMenuToggle");
    const navigation = document.getElementById("airpureNavigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            navigation.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const isOpen = navigation.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        });
    }


    /* =====================================
       HOME DROPDOWN - MOBILE / TABLET
    ===================================== */

    const homeDropdown = document.querySelector(
        ".airpure-home-dropdown"
    );

    const homeDropdownLink = document.querySelector(
        ".airpure-home-dropdown > .airpure-menu-link"
    );

    if (homeDropdown && homeDropdownLink) {

        homeDropdownLink.addEventListener("click", function (event) {

            /*
             * Only use click dropdown behavior
             * when navigation is in tablet/mobile mode.
             */

            if (window.innerWidth <= 1200) {

                event.preventDefault();

                homeDropdown.classList.toggle("open");

            }
        });
    }


    /* =====================================
       DARK MODE
    ===================================== */

    const themeToggleDesktop = document.getElementById(
        "airpureThemeToggleDesktop"
    );

    const themeToggleMobile = document.getElementById(
        "airpureThemeToggle"
    );


    function toggleAirPureTheme() {

        document.documentElement.classList.toggle("airpure-dark-mode");

        const isDark = document.documentElement.classList.contains(
            "airpure-dark-mode"
        );

        localStorage.setItem(
            "airpure-theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcons(isDark);
    }


    function updateThemeIcons(isDark) {

        const icons = [
            themeToggleDesktop,
            themeToggleMobile
        ];

        icons.forEach(function (button) {

            if (!button) return;

            const icon = button.querySelector("i");

            if (!icon) return;

            if (isDark) {

                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");

            } else {

                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            }
        });
    }


    if (themeToggleDesktop) {

        themeToggleDesktop.addEventListener(
            "click",
            toggleAirPureTheme
        );
    }


    if (themeToggleMobile) {

        themeToggleMobile.addEventListener(
            "click",
            toggleAirPureTheme
        );
    }


    /* Load Saved Theme */

    const savedTheme = localStorage.getItem("airpure-theme");

    if (savedTheme === "dark") {

        document.documentElement.classList.add(
            "airpure-dark-mode"
        );

        updateThemeIcons(true);
    }


    /* =====================================
       RTL MODE
    ===================================== */

    const rtlToggleDesktop = document.getElementById(
        "airpureRtlToggleDesktop"
    );

    const rtlToggleMobile = document.getElementById(
        "airpureRtlToggle"
    );


    function toggleAirPureRTL() {

        const htmlElement = document.documentElement;

        const isRTL = htmlElement.getAttribute("dir") === "rtl";

        htmlElement.setAttribute(
            "dir",
            isRTL ? "ltr" : "rtl"
        );

        localStorage.setItem(
            "airpure-direction",
            isRTL ? "ltr" : "rtl"
        );
    }


    if (rtlToggleDesktop) {

        rtlToggleDesktop.addEventListener(
            "click",
            toggleAirPureRTL
        );
    }


    if (rtlToggleMobile) {

        rtlToggleMobile.addEventListener(
            "click",
            toggleAirPureRTL
        );
    }


    /* Load Saved Direction */

    const savedDirection = localStorage.getItem(
        "airpure-direction"
    );

    if (savedDirection) {

        document.documentElement.setAttribute(
            "dir",
            savedDirection
        );
    }


    /* =====================================
       CLOSE MENU WHEN LINK IS CLICKED
    ===================================== */

    const navigationLinks = document.querySelectorAll(
        ".airpure-navigation a:not(.airpure-menu-link)"
    );

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 1200) {

                navigation.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );
            }
        });
    });


    /* =====================================
       CLOSE MENU ON RESIZE
    ===================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 1200) {

            navigation.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            homeDropdown.classList.remove("open");
        }
    });

});

/* =========================================
   ACTIVE NAVIGATION
========================================= */

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

const navigationLinks = document.querySelectorAll(
    ".airpure-navigation .airpure-menu-link, .airpure-dropdown-menu a"
);

navigationLinks.forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (!linkPage || linkPage === "#") {
        return;
    }

    const cleanLinkPage = linkPage
        .split("/")
        .pop()
        .split("#")[0]
        .toLowerCase();

    if (cleanLinkPage === currentPage) {

        link.classList.add("active");

        const homeDropdown = link.closest(
            ".airpure-home-dropdown"
        );

        if (homeDropdown) {

            homeDropdown.classList.add("active-parent");

            /* Add active state to Home parent */
            const homeParentLink = homeDropdown.querySelector(
                ":scope > .airpure-menu-link"
            );

            if (homeParentLink) {
                homeParentLink.classList.add("active");
            }
        }
    }
});


/* =========================================
   HOME PAGE ACTIVE STATE
========================================= */

if (
    currentPage === "" ||
    currentPage === "index.html" ||
    currentPage === "home-1.html"
) {

    const homeDropdown = document.querySelector(
        ".airpure-home-dropdown"
    );

    if (homeDropdown) {

        homeDropdown.classList.add("active-parent");

        const homeParentLink = homeDropdown.querySelector(
            ":scope > .airpure-menu-link"
        );

        if (homeParentLink) {
            homeParentLink.classList.add("active");
        }
    }
}

/* =========================================
   SCROLL TO TOP
========================================= */

const scrollTopButton = document.getElementById(
    "airpureScrollTop"
);

if (scrollTopButton) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 300) {

            scrollTopButton.classList.add("show");

        } else {

            scrollTopButton.classList.remove("show");

        }

    });


    scrollTopButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    const passwordInput = document.getElementById("loginPassword");
    const passwordToggle = document.getElementById("airpurePasswordToggle");

    if (passwordInput && passwordToggle) {

        passwordToggle.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                this.setAttribute("aria-label", "Hide password");

            } else {

                passwordInput.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                this.setAttribute("aria-label", "Show password");
            }
        });
    }


    /* =========================================
       DARK MODE
    ========================================= */

    const themeToggle = document.getElementById("airpureThemeToggle");

    if (themeToggle) {

        const savedTheme = localStorage.getItem("airpure-theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark-mode");
        }

        updateThemeIcon();

        themeToggle.addEventListener("click", function () {

            document.documentElement.classList.toggle("dark-mode");

            const isDark =
                document.documentElement.classList.contains("dark-mode");

            localStorage.setItem(
                "airpure-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }


    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (
            document.documentElement.classList.contains("dark-mode")
        ) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }


    /* =========================================
       RTL
    ========================================= */

    const rtlToggle = document.getElementById("airpureRtlToggle");

    if (rtlToggle) {

        const savedDirection =
            localStorage.getItem("airpure-direction");

        if (savedDirection === "rtl") {
            document.documentElement.setAttribute("dir", "rtl");
        }

        rtlToggle.addEventListener("click", function () {

            const currentDirection =
                document.documentElement.getAttribute("dir");

            if (currentDirection === "rtl") {

                document.documentElement.setAttribute("dir", "ltr");

                localStorage.setItem(
                    "airpure-direction",
                    "ltr"
                );

            } else {

                document.documentElement.setAttribute("dir", "rtl");

                localStorage.setItem(
                    "airpure-direction",
                    "rtl"
                );
            }
        });
    }


    /* =========================================
       LOGIN FORM
    ========================================= */

    const loginForm = document.querySelector(".airpure-login-form");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Backend / authentication can be connected later.

        });
    }

});

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       PASSWORD TOGGLE FUNCTION
    ========================================= */

    function setupPasswordToggle(inputId, buttonId) {

        const passwordInput = document.getElementById(inputId);
        const passwordToggle = document.getElementById(buttonId);

        if (!passwordInput || !passwordToggle) return;

        passwordToggle.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                this.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                this.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        });
    }


    setupPasswordToggle(
        "registerPassword",
        "registerPasswordToggle"
    );

    setupPasswordToggle(
        "confirmPassword",
        "confirmPasswordToggle"
    );


    /* =========================================
       DARK MODE
    ========================================= */

    const themeToggle =
        document.getElementById("airpureThemeToggle");

    if (themeToggle) {

        const savedTheme =
            localStorage.getItem("airpure-theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark-mode");
        }

        updateThemeIcon();

        themeToggle.addEventListener("click", function () {

            document.documentElement.classList.toggle("dark-mode");

            const isDark =
                document.documentElement.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "airpure-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }


    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (
            document.documentElement.classList.contains(
                "dark-mode"
            )
        ) {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

        } else {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }


    /* =========================================
       RTL
    ========================================= */

    const rtlToggle =
        document.getElementById("airpureRtlToggle");

    if (rtlToggle) {

        const savedDirection =
            localStorage.getItem("airpure-direction");

        if (savedDirection === "rtl") {

            document.documentElement.setAttribute(
                "dir",
                "rtl"
            );
        }

        rtlToggle.addEventListener("click", function () {

            const currentDirection =
                document.documentElement.getAttribute("dir");

            if (currentDirection === "rtl") {

                document.documentElement.setAttribute(
                    "dir",
                    "ltr"
                );

                localStorage.setItem(
                    "airpure-direction",
                    "ltr"
                );

            } else {

                document.documentElement.setAttribute(
                    "dir",
                    "rtl"
                );

                localStorage.setItem(
                    "airpure-direction",
                    "rtl"
                );
            }
        });
    }


    /* =========================================
       REGISTER FORM
    ========================================= */

    const registerForm =
        document.querySelector(".airpure-register-form");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const password =
                    document.getElementById(
                        "registerPassword"
                    ).value;

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    ).value;

                if (password !== confirmPassword) {

                    alert("Passwords do not match.");

                    return;
                }

                // Backend / registration
                // can be connected later.
            }
        );
    }

});

/* =========================================
   HOME 2 - AIRPURE MATCH TABS
========================================= */

const airpureMatchTabs = document.querySelectorAll(
    ".airpure-home2-match-tab"
);

const airpureMatchImage = document.querySelector(
    ".airpure-home2-match-image img"
);

const airpureMatchNumber = document.querySelector(
    ".airpure-home2-match-number"
);

const airpureMatchTitle = document.querySelector(
    ".airpure-home2-match-info h3"
);

const airpureMatchDescription = document.querySelector(
    ".airpure-home2-match-info > p"
);

const airpureMatchSpecs = document.querySelectorAll(
    ".airpure-home2-match-specs strong"
);


const airpureMatchData = [
    {
        image: "images/bedroom-purifier.jpg",
        alt: "AirPure purifier for a bedroom",

        number: "01 / BEDROOM",

        title: "Quiet purification for your personal space.",

        description:
            "A compact solution can help support cleaner air in bedrooms and other personal spaces while fitting naturally into your everyday routine.",

        specs: [
            "Bedrooms",
            "Quiet Comfort",
            "Everyday Air"
        ]
    },

    {
        image: "images/living-space-purifier.jpg",
        alt: "AirPure purifier for a living space",

        number: "02 / LIVING SPACE",

        title: "Cleaner air for the spaces you share.",

        description:
            "Choose a solution designed to support comfortable indoor air in living rooms and shared family spaces throughout the day.",

        specs: [
            "Living Rooms",
            "Air Circulation",
            "Shared Spaces"
        ]
    },

    {
        image: "images/workspace-purifier.jpg",
        alt: "AirPure purifier for a workspace",

        number: "03 / WORKSPACE",

        title: "A cleaner environment for focused work.",

        description:
            "Support indoor air quality in offices, study areas and everyday workspaces with a purifier suited to your environment.",

        specs: [
            "Workspaces",
            "Daily Use",
            "Focused Comfort"
        ]
    },

    {
        image: "images/large-space-purifier.jpg",
        alt: "AirPure purifier for a larger indoor space",

        number: "04 / LARGER SPACE",

        title: "More coverage for larger indoor spaces.",

        description:
            "For larger rooms and open areas, consider purifier coverage and airflow requirements when choosing the right solution.",

        specs: [
            "Large Rooms",
            "Broader Coverage",
            "Open Spaces"
        ]
    }
];


airpureMatchTabs.forEach((tab, index) => {

    tab.addEventListener("click", () => {

        /* Remove active state */
        airpureMatchTabs.forEach((item) => {
            item.classList.remove("active");
        });

        /* Add active state */
        tab.classList.add("active");


        const data = airpureMatchData[index];

        if (!data) return;


        /* Update image */
        if (airpureMatchImage) {
            airpureMatchImage.src = data.image;
            airpureMatchImage.alt = data.alt;
        }


        /* Update content */
        if (airpureMatchNumber) {
            airpureMatchNumber.textContent = data.number;
        }

        if (airpureMatchTitle) {
            airpureMatchTitle.textContent = data.title;
        }

        if (airpureMatchDescription) {
            airpureMatchDescription.textContent = data.description;
        }


        /* Update specifications */
        airpureMatchSpecs.forEach((spec, specIndex) => {

            if (data.specs[specIndex]) {
                spec.textContent = data.specs[specIndex];
            }

        });

    });

});

/* =========================================================
   HOME 2 — FAQ ACCORDION
========================================================= */

const airpureFaqItems = document.querySelectorAll(
    ".airpure-home2-faq-item"
);

airpureFaqItems.forEach((item) => {

    const question = item.querySelector(
        ".airpure-home2-faq-question"
    );

    const icon = question.querySelector("i");

    question.addEventListener("click", () => {

        const isActive = item.classList.contains("active");


        // Close all
        airpureFaqItems.forEach((faqItem) => {

            faqItem.classList.remove("active");

            const faqIcon = faqItem.querySelector(
                ".airpure-home2-faq-question i"
            );

            if (faqIcon) {
                faqIcon.classList.remove("fa-minus");
                faqIcon.classList.add("fa-plus");
            }

        });


        // Open selected
        if (!isActive) {

            item.classList.add("active");

            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");

        }

    });

});
