document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  const modal = document.getElementById("projectModal");
  const close = document.querySelector(".modal-close");
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!modal) return;
      const selected = document.getElementById("selectedPackage");
      if (selected) selected.value = btn.dataset.package || "";
      modal.classList.add("show");
      document.body.classList.add("no-scroll");
    });
  });
  if (close) close.addEventListener("click", () => { modal.classList.remove("show"); document.body.classList.remove("no-scroll"); });
  if (modal) modal.addEventListener("click", e => { if (e.target === modal) { modal.classList.remove("show"); document.body.classList.remove("no-scroll"); } });

  document.querySelectorAll("form#projectForm").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      const get = key => data.get(key) || "Not provided";
      const message = `Hello Design Dazzle Studio!%0A%0A*Project Enquiry*%0AName: ${encodeURIComponent(get("name"))}%0AWebsite purpose: ${encodeURIComponent(get("purpose"))}%0AWebsite type: ${encodeURIComponent(get("type"))}%0ANumber of pages: ${encodeURIComponent(get("pages"))}%0AProject/package: ${encodeURIComponent(get("package") || document.getElementById("selectedPackage")?.value || "Not specified")}%0ABudget: ${encodeURIComponent(get("budget"))}%0A%0A*Details about my project:*%0A${encodeURIComponent(get("details"))}`;
      const whatsappNumber = "923158510693"; // Replace with country code + number, without + or spaces.
      if (whatsappNumber === "03158510693") {
        
        return;
      }
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    });
  });
});

/* =========================================
   DESIGN DAZZLE STUDIO - PAGE LOADER
   ========================================= */

window.addEventListener("load", function () {
    const pageLoader = document.getElementById("pageLoader");

    if (pageLoader) {
        setTimeout(function () {
            pageLoader.classList.add("loader-hidden");
        }, 600);
    }
});