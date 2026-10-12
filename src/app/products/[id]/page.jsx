import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { auth } from "@/lib/auth";
import { getProduct, percentFormat, priceFormat, unitNames } from "@/lib/products";

export const instant = false;

export default async function ProductPage({ params }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/sign-in?callbackURL=${encodeURIComponent(`/products/${id}`)}`);
  }

  const product = await getProduct(id);
  if (!product) notFound();
  const markets = Array.isArray(product.markets) ? product.markets : [];
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const changeColor = isUp
    ? "text-error"
    : isDown
      ? "text-success"
      : "text-base-content/60";
  const lowestPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : product.today;
  const highestPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : product.today;
  const averagePrice = markets.length
    ? Math.round(markets.reduce((total, market) => total + (market.min + market.max) / 2, 0) / markets.length)
    : product.today;

  return (
    <main className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
          <Link href="/" className="hover:text-emerald-700">হোম</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/categories/${product.category}`} className="hover:text-emerald-700">{product.categoryNameBn}</Link>
          <span aria-hidden="true">›</span>
          <span className="text-base-content">{product.nameBn}</span>
        </nav>

        <section className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#dce5df] bg-white p-5 sm:flex-row sm:p-6">
          <div className="flex min-w-0 items-center gap-4 self-start">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-base-200 text-3xl">
              {product.image || product.categoryIcon}
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-base-content sm:text-2xl">{product.nameBn}</h1>
              <p className="mt-1 text-sm text-base-content/60">
                {product.categoryNameBn} · প্রতি {unitNames[product.unit] || product.unit}
              </p>
              <p className="mt-2 text-sm font-medium text-base-content/80">
                বাজারদর অনুযায়ী এখনকার দাম দেখুন।
              </p>
            </div>
          </div>

          <div className="flex min-w-36 flex-col items-center rounded-lg bg-[#f2f6f3] px-5 py-3 text-center sm:self-stretch sm:justify-center">
            <span className="text-xs text-base-content/60">আজকের দাম</span>
            <span className="mt-1 text-2xl font-bold text-base-content">{priceFormat.format(product.today)}</span>
            <span className="text-xs text-base-content/60">টাকা / {unitNames[product.unit] || product.unit}</span>
            <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${changeColor}`}>
              {isUp ? <TbTriangleFilled aria-hidden="true" /> : null}
              {isDown ? <TbTriangleInvertedFilled aria-hidden="true" /> : null}
              {!isUp && !isDown ? <span aria-hidden="true">−</span> : null}
              {percentFormat.format(Math.abs(product.change.pct))}%
            </span>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dce5df] bg-white p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-base-content">দামের সারসংক্ষেপ</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-base-300 bg-base-100 p-4">
              <p className="text-sm text-base-content/60">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-xl font-bold text-success">{priceFormat.format(lowestPrice)} টাকা</p>
              <p className="text-xs text-base-content/55">বাজারভিত্তিক সর্বনিম্ন দর</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-4">
              <p className="text-sm text-base-content/60">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-xl font-bold text-error">{priceFormat.format(highestPrice)} টাকা</p>
              <p className="text-xs text-base-content/55">বাজারভিত্তিক সর্বোচ্চ দর</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-4">
              <p className="text-sm text-base-content/60">গড় দাম</p>
              <p className="mt-1 text-xl font-bold text-emerald-700">{priceFormat.format(averagePrice)} টাকা</p>
              <p className="text-xs text-base-content/55">সব বাজারের গড় দর</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["আজ", product.today],
              ["গতকাল", product.yesterday],
              ["গত সপ্তাহ", product.lastWeek],
              ["গত মাস", product.lastMonth],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#f2f6f3] p-3 text-center">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-bold">{priceFormat.format(value)} টাকা</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dce5df] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-lg font-semibold text-base-content">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto rounded-lg border border-base-300">
            <table className="table table-zebra min-w-[620px] text-sm">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th className="text-right">সর্বনিম্ন</th>
                  <th className="text-right">সর্বোচ্চ</th>
                  <th className="text-right">গড়</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market) => (
                  <tr key={`${market.market}-${market.division}`}>
                    <td>{market.market}</td>
                    <td>{market.division}</td>
                    <td className="text-right">{priceFormat.format(market.min)} টাকা</td>
                    <td className="text-right">{priceFormat.format(market.max)} টাকা</td>
                    <td className="text-right">{priceFormat.format(Math.round((market.min + market.max) / 2))} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
