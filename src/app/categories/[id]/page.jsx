import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import SortControl from "./SortControl";

const API_URL = "https://api.abcz.workers.dev/api/bazardor";

const unitNames = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export default async function CategoryPage({ params, searchParams }) {
  await connection();

  const { id } = await params;
  const { sort } = await searchParams;

  const categoryResponse = await fetch(`${API_URL}/categories/${id}`, {
    cache: "no-store",
  });

  if (!categoryResponse.ok) {
    notFound();
  }

  const category = await categoryResponse.json();
  const productsResponse = await fetch(`${API_URL}/products?category=${id}`, {
    cache: "no-store",
  });
  const products = await productsResponse.json();

  if (sort === "asc") {
    products.sort((first, second) => first.today - second.today);
  } else if (sort === "desc") {
    products.sort((first, second) => second.today - first.today);
  }

  const priceFormat = new Intl.NumberFormat("bn-BD");
  const percentFormat = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  });

  return (
    <div className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="flex min-h-24 items-center gap-4 rounded-xl border border-base-300 bg-[#fbfdfb] p-5 sm:p-6">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-base-200 text-3xl">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-base-content">{category.nameBn}</h1>
            <p className="mt-1 text-sm text-base-content/60">
              {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-3 rounded-xl border border-base-300 bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:justify-between">
          <SortControl categoryId={id} selectedSort={sort || ""} />
        </section>

        <p className="mt-4 text-sm text-base-content/60">
          {products.length}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isUp = product.change.dir === "up";
            const isDown = product.change.dir === "down";
            let changeColor = "bg-base-200 text-base-content/60";

            if (isUp) {
              changeColor = "bg-error/10 text-error";
            } else if (isDown) {
              changeColor = "bg-success/10 text-success";
            }

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                <article className="flex min-h-32 min-w-0 flex-col justify-between rounded-lg border border-base-300 bg-base-100 p-4 transition-colors hover:border-emerald-700/40">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-base-200 text-xl">
                    {product.image || product.categoryIcon}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold leading-tight text-base-content">
                      {product.nameBn}
                    </h2>
                    <p className="mt-1 text-sm text-base-content/55">
                      প্রতি {unitNames[product.unit] || product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs text-base-content/55">আজকের দাম</p>
                    <p className="mt-1 text-base font-bold">
                      {priceFormat.format(product.today)} টাকা
                    </p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${changeColor}`}>
                    {isUp ? <TbTriangleFilled aria-hidden="true" /> : null}
                    {isDown ? <TbTriangleInvertedFilled aria-hidden="true" /> : null}
                    {!isUp && !isDown ? <span aria-hidden="true">−</span> : null}
                    {percentFormat.format(Math.abs(product.change.pct))}%
                  </span>
                </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}