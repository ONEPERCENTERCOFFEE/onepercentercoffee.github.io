// One Percenter: yayın öncesi sayfa üretici (GitHub Actions içinde çalışır)
import fs from "node:fs";
import path from "node:path";
const SRC = process.env.SRC || ".", OUT = process.env.OUT || "_site";
const SITE = "https://onepercenter.com.tr";
const SU = "https://ojfmpnqyrdfybbmchbvq.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZm1wbnF5cmRmeWJibWNoYnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTgwNTYsImV4cCI6MjEwODQzNDA1Nn0.OtORGCZVBLmLodt30C6Sw5LkjEoZWYRSmYsXITaNqeI";
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tl = n => Number(n).toLocaleString("tr-TR") + "₺";
async function q(t, s) {
  const r = await fetch(`${SU}/rest/v1/${t}?${s}`, { headers: { apikey: KEY, Authorization: "Bearer " + KEY } });
  if (!r.ok) throw new Error(`${t}: ${r.status} ${await r.text()}`);
  return r.json();
}
const rd = f => fs.readFileSync(path.join(OUT, f), "utf8");
const wr = (f, c) => { fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true }); fs.writeFileSync(path.join(OUT, f), c); };
const clean = h => String(h || "").replace(/<(script|iframe|object|embed|style|form)[\s\S]*?<\/\1>/gi, "").replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, "");
function head(html, { title, desc, url, image, type, ld }) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`);
  const extra = `<link rel="canonical" href="${url}"><meta property="og:type" content="${type}"><meta property="og:site_name" content="One Percenter"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">`
    + (ld ? `<script type="application/ld+json" id="ld">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>` : "");
  return html.replace(/<head>/, `<head><base href="/">`).replace(/<meta name="description"[^>]*>/, m => m + extra);
}
const withMain = (html, inner) => html.replace(/(<main[^>]*id="app"[^>]*>)[\s\S]*?(<\/main>)/, `$1${inner}$2`);
async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(SRC, OUT, { recursive: true, filter: s => !/(^|[\\/])(\.git|\.github|build|_site|node_modules|workflow)([\\/]|$)/.test(path.relative(SRC, s)) });
  const now = new Date().toISOString();
  const [prods, posts, cats] = await Promise.all([
    q("retail_products", "select=*&visible=eq.true&order=sort,id"),
    q("blog_posts", `select=*&published=eq.true&published_at=lte.${now}&order=published_at.desc`),
    q("site_categories", "select=id,name&scope=eq.retail")
  ]);
  const catName = Object.fromEntries(cats.map(c => [c.id, c.name]));
  const urls = [["/", "weekly"], ["/kavurmahane.html", "monthly"], ["/op-cafe.html", "monthly"], ["/magaza.html", "weekly"], ["/toptan.html", "weekly"], ["/blog.html", "weekly"], ["/gizlilik-kvkk.html", "yearly"], ["/mesafeli-satis.html", "yearly"], ["/iade-iptal.html", "yearly"]].map(([u, f]) => ({ loc: SITE + u, freq: f }));
  const SZ = ["100 g", "250 g", "1 kg"];
  // ürün sayfaları
  if (fs.existsSync(path.join(OUT, "urun.html"))) {
    const tpl = rd("urun.html");
    for (const p of prods) {
      const url = `${SITE}/magaza/${p.slug}/`, prices = [p.price_100, p.price_250, p.price_1000];
      const title = p.seo_title || `${p.name} Çekirdek Kahve${p.origin ? " (" + String(p.origin).split(" · ")[0] + ")" : ""} | One Percenter`;
      const desc = p.seo_desc || `${p.name}: ${(p.notes || []).join(", ")} notalı${p.process ? ", " + String(p.process).toLowerCase() + " işlemli" : ""} çekirdek kahve. 100 g, 250 g ve 1 kg seçenekleri.`;
      const img = (p.images || [])[0] || SITE + "/og.png";
      const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name + " Çekirdek Kahve", description: desc, image: (p.images || []).slice(0, 5), brand: { "@type": "Brand", name: "One Percenter" }, offers: SZ.map((z, i) => ({ "@type": "Offer", name: z, priceCurrency: "TRY", price: Number(prices[i]), availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url })) };
      const pre = `<nav class="bc"><a href="/magaza.html">Mağaza</a> › ${esc(catName[p.category_id] || "Çekirdek kahve")} › ${esc(p.name)}</nav><article><h1>${esc(p.name)}</h1><p>${esc(p.origin)}</p>${(p.notes || []).length ? `<p>Tadım notları: ${esc(p.notes.join(", "))}</p>` : ""}<p>İşlem: ${esc(p.process)} · Rakım: ${esc(p.altitude)} · Kavurma seviyesi: ${p.roast || "-"} / 5</p>${p.story ? `<h2>${esc(p.name)} hakkında</h2><p>${esc(p.story)}</p>` : ""}<h2>Boyutlar ve fiyatlar (KDV dahil)</h2><ul>${SZ.map((z, i) => `<li>${z}: ${tl(prices[i])}</li>`).join("")}</ul>${(p.brew || []).length ? `<h2>Önerilen demleme</h2><table>${p.brew.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>` : ""}${(p.faq || []).length ? `<h2>Sık sorulanlar</h2>${p.faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}` : ""}</article>`;
      wr(`magaza/${p.slug}/index.html`, withMain(head(tpl, { title, desc, url, image: img, type: "product", ld }), pre));
      urls.push({ loc: url, freq: "weekly", mod: p.updated_at });
    }
    // liste sayfası: ürün bağlantıları
    if (fs.existsSync(path.join(OUT, "magaza.html"))) {
      const list = prods.map(p => `<a class="pc" href="magaza/${esc(p.slug)}/"><div class="bd"><h3>${esc(p.name)}</h3><span class="ori">${esc(p.origin)}</span></div></a>`).join("");
      wr("magaza.html", rd("magaza.html").replace(/(<div class="grid" id="grid">)[\s\S]*?(<\/div>)/, `$1${list}$2`));
    }
  }
  // blog yazıları
  if (fs.existsSync(path.join(OUT, "yazi.html"))) {
    const tpl = rd("yazi.html");
    for (const p of posts) {
      const url = `${SITE}/blog/${p.slug}/`, title = p.seo_title || `${p.title} | One Percenter`, desc = p.seo_desc || p.excerpt || "", img = p.cover || SITE + "/og.png";
      const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: desc, datePublished: p.published_at, dateModified: p.updated_at || p.published_at, image: p.cover ? [p.cover] : undefined, author: { "@type": "Organization", name: "One Percenter" }, publisher: { "@type": "Organization", name: "One Percenter", logo: { "@type": "ImageObject", url: SITE + "/logo.png" } }, mainEntityOfPage: url };
      const pre = `<nav class="bc"><a href="/">Ana sayfa</a> › <a href="/blog.html">Blog</a> › ${esc(p.title)}</nav><article class="art"><span class="k">${esc(p.category || "")}</span><h1>${esc(p.title)}</h1>${clean(p.body)}</article>`;
      wr(`blog/${p.slug}/index.html`, withMain(head(tpl, { title, desc, url, image: img, type: "article", ld }), pre));
      urls.push({ loc: url, freq: "monthly", mod: p.updated_at || p.published_at });
    }
    if (fs.existsSync(path.join(OUT, "blog.html"))) {
      const list = posts.map(p => `<a class="pil" href="blog/${esc(p.slug)}/"><h3>${esc(p.title)}</h3><p>${esc(p.excerpt || "")}</p></a>`).join("");
      wr("blog.html", rd("blog.html").replace(/(<div class="g3" id="list">)[\s\S]*?(<\/div>\s*<\/main>)/, `$1${list}$2`));
    }
  }
  wr("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${u.loc}</loc>${u.mod ? `<lastmod>${new Date(u.mod).toISOString().slice(0, 10)}</lastmod>` : ""}<changefreq>${u.freq}</changefreq></url>`).join("\n")}\n</urlset>\n`);
  wr("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  console.log(`Hazır: ${prods.length} ürün, ${posts.length} yazı, ${urls.length} adres.`);
}
main().catch(e => { console.error(e); process.exit(1); });
