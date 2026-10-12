import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import bazarHero from "../assets/bazar-hero.png";
import ProductCard from "./components/ProductCard";
import { getProducts } from "@/lib/products";

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
      <div className="mt-4 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  await connection();

  const products = await getProducts();

  const increasedProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((first, second) => second.change.pct - first.change.pct)
    .slice(0, 3);

  const decreasedProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((first, second) => first.change.pct - second.change.pct)
    .slice(0, 3);

  const today = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#f2f6f3] px-4 pb-14 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="grid min-h-64 grid-cols-1 items-center gap-4 rounded-2xl border border-[#dce5df] bg-white px-5 py-6 sm:grid-cols-[minmax(0,1fr)_16rem] sm:gap-8 sm:px-8">
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
              সব পণ্য দেখুন
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
      <div className="mt-4 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
      </div>
    </div>
  );
}
