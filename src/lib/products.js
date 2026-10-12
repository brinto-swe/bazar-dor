export const API_BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export const unitNames = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export const priceFormat = new Intl.NumberFormat("bn-BD");
export const percentFormat = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

export async function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_BASE_URL}/products${query}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("পণ্যের তথ্য আনা যায়নি।");
  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  return response.ok ? response.json() : null;
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("বিভাগের তথ্য আনা যায়নি।");
  return response.json();
}

export async function getCategory(id) {
  const response = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  return response.ok ? response.json() : null;
}
