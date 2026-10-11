import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

const PRODUCTS_URL = "https://api.abcz.workers.dev/api/bazardor/products";

const unitNames = {
	kg: "কেজি",
	litre: "লিটার",
	dozen: "ডজন",
	piece: "পিস",
};

const Marque = async () => {
	const response = await fetch(PRODUCTS_URL, { cache: "no-store" });
	const products = await response.json();
	const priceFormat = new Intl.NumberFormat("bn-BD");
	const percentFormat = new Intl.NumberFormat("bn-BD", {
		maximumFractionDigits: 1,
	});

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
		<div aria-label="আজকের বাজারদর" className="w-full overflow-hidden border-y border-base-300 bg-base-100">
			<MarqueeText className="py-1" direction="right" duration={18} pauseOnHover>
				{productItems}
			</MarqueeText>
		</div>
	);
};

export default Marque;
