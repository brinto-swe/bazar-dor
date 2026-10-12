import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import MarqueeText from "react-marquee-text";
import { connection } from "next/server";
import "react-marquee-text/dist/styles.css";
import { getProducts, percentFormat, priceFormat, unitNames } from "@/lib/products";

const Marque = async () => {
	await connection();

	const products = await getProducts();

	const productItems = products.map((product) => {
		const isUp = product.change.dir === "up";
		const isDown = product.change.dir === "down";
		const changeColor = isUp
			? "text-error"
			: isDown
				? "text-success"
				: "text-base-content/50";

		return (
			<div
				key={product.id}
				className="flex h-12 items-center gap-3 border-r border-base-300 px-5 text-sm whitespace-nowrap"
			>
				<span className="flex size-7 items-center justify-center rounded-full bg-base-200 text-base">
					{product.image || product.categoryIcon}
				</span>
				<span className="font-medium">{product.nameBn}</span>
				<span className="text-base-content/75">
					{priceFormat.format(product.today)} টাকা/{unitNames[product.unit] || product.unit}
				</span>
				<span className={`flex items-center gap-1 font-semibold ${changeColor}`}>
					{isUp ? <TbTriangleFilled aria-hidden="true" /> : null}
					{isDown ? <TbTriangleInvertedFilled aria-hidden="true" /> : null}
					{!isUp && !isDown ? <span aria-hidden="true">•</span> : null}
					{percentFormat.format(Math.abs(product.change.pct))}%
				</span>
			</div>
		);
	});

	return (
		<div aria-label="আজকের বাজারদর" className="w-full overflow-hidden border-b border-[#dce5df] bg-white">
			<MarqueeText direction="right" duration={28} pauseOnHover>
				{productItems}
			</MarqueeText>
		</div>
	);
};

export default Marque;
