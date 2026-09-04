(() => {
  const grid = document.querySelector("[data-resource-grid]");
  const status = document.querySelector("[data-resource-status]");
  const title = document.querySelector("[data-results-title]");
  const kicker = document.querySelector("[data-results-kicker]");
  const count = document.querySelector("[data-results-count]");
  const form = document.querySelector("[data-resource-search]");
  const input = document.querySelector("#resource-query");
  const placeholder = "/resources/assets/resource-placeholder.svg";
  let controller;

  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  };

  const formatPrice = price => {
    if (!price || !Number.isFinite(Number(price.amount))) return null;
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: price.currency || "USD" }).format(price.amount); }
    catch { return `${price.currency || "USD"} ${price.amount}`; }
  };

  function setStatus(heading, message, isError = false) {
    status.hidden = false;
    status.classList.toggle("is-error", isError);
    status.querySelector("strong").textContent = heading;
    status.querySelector("p").textContent = message;
  }

  function addFact(container, text) {
    if (text) container.append(node("span", "", text));
  }

  function productCard(item) {
    const card = node("article", "resource-card");
    card.dataset.resourceItemId = item.id;
    card.dataset.resourceCategory = item.cholbeiGroup || item.category || "resource";

    const media = node("div", "resource-image");
    const image = node("img");
    image.src = /^https:\/\//i.test(item.thumbnail || "") ? item.thumbnail : placeholder;
    image.alt = `${item.name || "Resource"} preview`;
    image.width = 800; image.height = 500; image.loading = "lazy";
    image.addEventListener("error", () => { if (!image.src.endsWith("resource-placeholder.svg")) image.src = placeholder; }, { once: true });
    media.append(image, node("span", "resource-source", item.market || "Envato"));
    if (item.rank) media.append(node("span", "resource-rank", `#${item.rank} in this category`));

    const body = node("div", "resource-card-body");
    body.append(node("div", "resource-meta", item.category || item.cholbeiGroup || "Digital resource"));
    body.append(node("h3", "", item.name || "Untitled resource"));
    if (item.author) body.append(node("p", "author", `By ${item.author}`));
    const facts = node("div", "resource-facts");
    addFact(facts, formatPrice(item.price));
    addFact(facts, item.rating ? `${item.rating} rating` : null);
    addFact(facts, Number.isFinite(item.reviews) && item.reviews > 0 ? `${item.reviews.toLocaleString()} reviews` : null);
    addFact(facts, Number.isFinite(item.sales) ? `${item.sales.toLocaleString()} sales` : null);
    if (facts.childElementCount) body.append(facts);

    const actions = node("div", "resource-actions");
    const details = node("a", "", "View details");
    details.href = `/resources/?item=${encodeURIComponent(item.id)}`;
    const affiliate = node("a", "affiliate-link", "View on Envato →");
    affiliate.href = `/resources/go/${encodeURIComponent(item.id)}/`;
    affiliate.target = "_blank";
    affiliate.rel = "sponsored noopener noreferrer";
    affiliate.dataset.resourceAction = "affiliate-click";
    affiliate.dataset.resourceItemId = item.id;
    affiliate.dataset.resourceCategory = item.cholbeiGroup || item.category || "resource";
    actions.append(details, affiliate);
    body.append(actions);
    card.append(media, body);
    return card;
  }

  function render(items, options = {}) {
    grid.replaceChildren();
    status.hidden = true;
    title.textContent = options.title || "Resources";
    kicker.textContent = options.kicker || "Live Envato results";
    count.textContent = items.length ? `${items.length} relevant ${items.length === 1 ? "resource" : "resources"}` : "";
    if (!items.length) {
      const empty = node("div", "resource-empty");
      empty.append(node("h3", "", options.emptyTitle || "Start with a search"), node("p", "", options.emptyText || "Search for an ecommerce template, dashboard UI, or another complementary web resource."));
      grid.append(empty);
      return;
    }
    items.forEach(item => grid.append(productCard(item)));
  }

  function renderGroups(groups, options = {}) {
    grid.replaceChildren();
    status.hidden = true;
    title.textContent = options.title || "Top resources right now";
    kicker.textContent = options.kicker || "Automated live rankings";
    const total = groups.reduce((sum, group) => sum + group.items.length, 0);
    count.textContent = `${total} ranked resources · refreshed from Envato`;
    groups.forEach(group => {
      const section = node("section", "resource-group");
      const heading = node("div", "resource-group-heading");
      const copy = node("div");
      copy.append(node("h3", "", group.label), node("p", "", group.description));
      const more = node("a", "", "Explore category →");
      more.href = `/resources/${group.slug}/`;
      heading.append(copy, more);
      const cards = node("div", "resource-group-grid");
      group.items.forEach(item => cards.append(productCard(item)));
      section.append(heading, cards);
      grid.append(section);
    });
  }
  async function request(url, options = {}) {
    controller?.abort();
    controller = new AbortController();
    setStatus("Finding useful resources…", "Live product information is being requested securely from Envato.");
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Resources are temporarily unavailable.");
      if (Array.isArray(data.groups)) renderGroups(data.groups, options);
      else render(data.items || (data.item ? [data.item] : []), options);
    } catch (error) {
      if (error.name === "AbortError") return;
      grid.replaceChildren(); count.textContent = "";
      setStatus("Resources are temporarily unavailable.", error.message || "Please try again later.", true);
    }
  }

  form?.addEventListener("submit", event => {
    event.preventDefault();
    const query = input.value.trim();
    if (query.length < 2) return input.focus();
    document.querySelectorAll("[data-category]").forEach(button => button.classList.remove("active"));
    request(`/api/resources/search?q=${encodeURIComponent(query)}`, { title: `Results for “${query}”`, kicker: "Search results", emptyTitle: "No relevant resources found", emptyText: "Try a more specific template, UI, or dashboard search." });
  });

  document.querySelectorAll("button[data-category]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("button[data-category]").forEach(item => item.classList.toggle("active", item === button));
    input.value = button.dataset.query;
    request(`/api/resources/search?q=${encodeURIComponent(button.dataset.query)}&category=${encodeURIComponent(button.dataset.category)}`, { title: button.textContent, kicker: "Browse by category", emptyTitle: "No relevant resources found" });
  }));

  document.addEventListener("click", event => {
    const link = event.target.closest("[data-resource-action='affiliate-click']");
    if (!link || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({ event: "resource_affiliate_click", item_id: link.dataset.resourceItemId, category: link.dataset.resourceCategory, placement: "resource-card" });
  });

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  const itemId = new URLSearchParams(location.search).get("item");
  if (/^[1-9]\d{0,11}$/.test(itemId || "")) request(`/api/resources/item/${itemId}`, { title: "Resource details", kicker: "Selected resource" });
  else request("/api/resources/featured", { title: "Top resources right now", kicker: "Automated live rankings" });
})();
