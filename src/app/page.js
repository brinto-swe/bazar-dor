import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import bazarHero from "../assets/bazar-hero.png";

const PRODUCTS_URL = "https://api.abcz.workers.dev/api/bazardor/products";

const unitNames = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function ProductCard({ product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const priceFormat = new Intl.NumberFormat("bn-BD");
  const percentFormat = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  });

  let changeColor = "bg-base-200 text-base-content/60";

  if (isUp) {
    changeColor = "bg-error/10 text-error";
  } else if (isDown) {
    changeColor = "bg-success/10 text-success";
  }

  return (
    <article className="flex min-h-32 min-w-0 flex-col justify-between rounded-lg border border-base-300 bg-base-100 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-base-200 text-xl">
          {product.image || product.categoryIcon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-tight text-base-content">
            {product.nameBn}
          </h3>
          <p className="mt-1 truncate text-sm leading-tight text-base-content/55">
            {product.categoryNameBn}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs leading-tight text-base-content/55">সর্বশেষ দাম</p>
          <p className="mt-1 text-base font-bold leading-tight">
            {priceFormat.format(product.today)} টাকা
            <span className="ml-1 text-xs font-normal text-base-content/60">
              /{unitNames[product.unit] || product.unit}
            </span>
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
  );
}

function ProductSection({ title, products, id, direction }) {
  return (
    <section id={id} className="mt-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-base-content">
        {direction === "up" ? (
          <TbTriangleFilled className="text-error" aria-hidden="true" />
        ) : direction === "down" ? (
          <TbTriangleInvertedFilled className="text-success" aria-hidden="true" />
        ) : null}
        {title}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  await connection();

  const response = await fetch(PRODUCTS_URL, { cache: "no-store" });
  const products = await response.json();

  const increasedProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((first, second) => second.change.pct - first.change.pct)
    .slice(0, 6);

  const decreasedProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((first, second) => first.change.pct - second.change.pct)
    .slice(0, 6);

  const today = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="grid min-h-56 grid-cols-1 items-center gap-4 rounded-xl border border-base-300 bg-[#fbfdfb] px-4 py-5 sm:grid-cols-[minmax(0,1fr)_16rem] sm:gap-8 sm:px-8">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
              {today}
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#24342d] sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-base-content/65 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারদরভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং মাসের পরিবর্তন এক জায়গায়।
            </p>
            <Link
              href="#all-products"
              className="btn mt-5 h-11 min-h-11 rounded-md border-0 bg-emerald-700 px-6 text-sm text-white shadow-sm hover:bg-emerald-800"
            >
              সব পণ্যের দাম
            </Link>
          </div>

          <div className="flex items-center justify-center sm:justify-end">
            <Image
              src={bazarHero}
              alt="বাজারের তাজা সবজি ও ফলের ঝুড়ি"
              priority
              className="h-36 w-40 object-contain sm:h-52 sm:w-56"
            />
          </div>
    </section>

    <ProductSection
      title="আজ দাম বেড়েছে"
      products={increasedProducts}
      direction="up"
    />

    <ProductSection
      title="আজ দাম কমেছে"
      products={decreasedProducts}
      direction="down"
    />

    <section id="all-products" className="mt-8">
      <h2 className="text-xl font-bold text-base-content">সব পণ্য</h2>
      <p className="mt-2 text-sm text-base-content/55">আজকের সব পণ্যের বাজারদর দেখুন</p>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
      </div>
    </main>
  );
}
