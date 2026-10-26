// Utility to resolve reliable product image URLs and category fallbacks

export function getProductFallbackImage(product = {}) {
  const title = (product.title || product.name || "").toLowerCase();
  const catSlug = (product.category?.slug || product.category?.name || "").toLowerCase();

  // Keyword-based accurate category illustration fallback
  if (title.includes("milk") || title.includes("butter") || title.includes("paneer") || title.includes("cheese") || title.includes("curd") || title.includes("dahi") || title.includes("cream") || catSlug.includes("dairy")) {
    return "/images/category-dairy.avif";
  }
  if (title.includes("bread") || title.includes("toast") || title.includes("bun") || title.includes("cake") || title.includes("biscuit") || title.includes("cookie") || catSlug.includes("bakery")) {
    return "/images/category-bakery.avif";
  }
  if (title.includes("chip") || title.includes("lays") || title.includes("kurkure") || title.includes("snack") || title.includes("bhujia") || title.includes("namkeen") || catSlug.includes("munchies") || catSlug.includes("snack")) {
    return "/images/category-snacks.avif";
  }
  if (title.includes("drink") || title.includes("coke") || title.includes("pepsi") || title.includes("juice") || title.includes("frooti") || title.includes("water") || title.includes("soda") || catSlug.includes("drink") || catSlug.includes("juice")) {
    return "/images/category-drinks.avif";
  }
  if (title.includes("apple") || title.includes("banana") || title.includes("mango") || title.includes("onion") || title.includes("potato") || title.includes("tomato") || title.includes("vegetable") || title.includes("fruit") || catSlug.includes("fruit") || catSlug.includes("veg")) {
    return "/images/category-fruits.avif";
  }
  if (title.includes("tea") || title.includes("coffee") || title.includes("chai") || title.includes("green tea") || catSlug.includes("tea") || catSlug.includes("coffee")) {
    return "/images/category-tea.avif";
  }
  if (title.includes("atta") || title.includes("rice") || title.includes("dal") || title.includes("flour") || title.includes("oil") || title.includes("ghee") || catSlug.includes("atta") || catSlug.includes("dal")) {
    return "/images/category-grains.avif";
  }
  if (title.includes("sweet") || title.includes("chocolate") || title.includes("mithai") || title.includes("candy") || catSlug.includes("sweet")) {
    return "/images/category-sweet.avif";
  }
  if (title.includes("paan") || title.includes("supari") || catSlug.includes("paan")) {
    return "/images/category-paan.avif";
  }

  // Next fallback to category image if present
  if (product.category?.image) {
    return product.category.image;
  }

  return "/images/category-dairy.avif";
}

export function getProductImageUrl(product = {}) {
  const url = product.images?.[0]?.url || product.image || "";
  if (url && typeof url === "string" && url.trim().length > 0) {
    return url.trim();
  }
  return getProductFallbackImage(product);
}
