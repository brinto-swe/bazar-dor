import { connection } from "next/server";
import { notFound } from "next/navigation";
import SortControl from "./SortControl";
import ProductCard from "@/app/components/ProductCard";
import { getCategory, getProducts, priceFormat } from "@/lib/products";

export default async function CategoryPage({ params, searchParams }) {
  await connection();

  const { id } = await params;
  const { sort } = await searchParams;

  const [category, products] = await Promise.all([
    getCategory(id),
    getProducts(id),
  ]);

  if (!category) notFound();

  if (sort === "asc") {
    products.sort((first, second) => first.today - second.today);
  } else if (sort === "desc") {
    products.sort((first, second) => second.today - first.today);
  }

  return (
    <div className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="flex min-h-24 items-center gap-4 rounded-2xl border border-[#dce5df] bg-white p-5 sm:p-6">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-base-200 text-3xl">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-base-content">{category.nameBn}</h1>
            <p className="mt-1 text-sm text-base-content/60">
              {priceFormat.format(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#dce5df] bg-white p-4 sm:flex-row sm:items-center sm:justify-end">
          <SortControl categoryId={id} selectedSort={sort || ""} />
        </section>

        <p className="mt-4 text-sm text-base-content/60">
          মোট {priceFormat.format(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
