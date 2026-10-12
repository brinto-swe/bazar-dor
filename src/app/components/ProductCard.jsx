import Link from "next/link";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { percentFormat, priceFormat, unitNames } from "@/lib/products";

export default function ProductCard({ product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const changeStyle = isUp
    ? "bg-red-50 text-red-500"
    : isDown
      ? "bg-emerald-50 text-emerald-600"
      : "bg-slate-100 text-slate-600";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
    >
      <article className="flex min-h-36 flex-col justify-between rounded-2xl border border-[#dce5df] bg-white p-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-300 group-hover:shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f1f6f2] text-2xl">
            {product.image || product.categoryIcon}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[#26332c]">
              {product.nameBn}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              প্রতি {unitNames[product.unit] || product.unit}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">আজকের দাম</p>
            <p className="mt-0.5 text-lg font-extrabold text-[#26332c]">
              {priceFormat.format(product.today)} <span className="text-sm font-semibold">টাকা</span>
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${changeStyle}`}>
            {isUp ? <TbTriangleFilled aria-hidden="true" /> : null}
            {isDown ? <TbTriangleInvertedFilled aria-hidden="true" /> : null}
            {!isUp && !isDown ? <span aria-hidden="true">−</span> : null}
            {percentFormat.format(Math.abs(product.change.pct))}%
          </span>
        </div>
      </article>
    </Link>
  );
}
