// category-render.js
(() => {
  const listEl = document.getElementById("archiveList");
  if (!listEl) return;

  const category = document.body.getAttribute("data-category");
  const all = (window.LYME_ARTICLES || []).slice();

  const filtered = all
    .filter(a => a.category === category)
    .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO)); // recente -> vecchio

  const formatDateIT = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
  };

  const escapeHtml = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[c]));

  listEl.innerHTML = filtered.map((a, idx) => `
    <article class="archiveItem">
      <div class="archiveItem__kicker">${escapeHtml(a.label)}</div>

      <a class="archiveItem__title" href="${escapeHtml(a.href)}">
        ${escapeHtml(a.title)}
      </a>

      <div class="archiveItem__meta">
        <div class="archiveItem__avatar">${escapeHtml(a.authorInitials || "LY")}</div>
        <div class="archiveItem__metaText">
          <span class="archiveItem__author">${escapeHtml(a.author)}</span>
          <span class="archiveItem__dot">•</span>
          <span class="archiveItem__date">${escapeHtml(formatDateIT(a.dateISO))}</span>
          <span class="archiveItem__dot">•</span>
          <span class="archiveItem__read">${escapeHtml(a.readMin)} min</span>
        </div>
      </div>

      ${
        a.image
          ? `<a class="archiveItem__media" href="${escapeHtml(a.href)}" aria-label="Apri articolo: ${escapeHtml(a.title)}">
               <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" loading="lazy" />
             </a>`
          : ``
      }

      <p class="archiveItem__excerpt">${escapeHtml(a.excerpt)}</p>

      ${idx !== filtered.length - 1 ? `<div class="archiveItem__divider" aria-hidden="true"></div>` : ``}
    </article>
  `).join("");
})();