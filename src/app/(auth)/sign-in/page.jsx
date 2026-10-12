"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

const SignInPage = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const getReturnUrl = () => {
		const callbackURL = new URLSearchParams(window.location.search).get("callbackURL");

		if (callbackURL?.startsWith("/") && !callbackURL.startsWith("//")) {
			return callbackURL;
		}

		return "/";
	};

	const handleSignIn = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());
		const callbackURL = getReturnUrl();

		try {
			const { error } = await signIn.email({
				email: data.email.toString().trim(),
				password: data.password.toString(),
				callbackURL,
			});

			if (error) {
				setErrorMessage(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
				toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
				return;
			}

			toast.success("সফলভাবে সাইন ইন হয়েছে।");
			router.push(callbackURL);
			router.refresh();
		} catch {
			setErrorMessage("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
			toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSocialSignIn = async (provider) => {
		setErrorMessage("");
		const callbackURL = getReturnUrl();

		try {
			const { error } = await signIn.social({ provider, callbackURL });

			if (error) {
				setErrorMessage(error.message || "সাইন ইন করা যায়নি।");
				toast.error(error.message || "সাইন ইন করা যায়নি।");
			}
		} catch {
			setErrorMessage("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
			toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
		}
	};

	return (
		<section className="flex min-h-[calc(100vh-11rem)] flex-col items-center bg-[#f2f6f3] px-4 py-10 sm:py-12">
			<div className="mb-5 text-center">
				<h1 className="text-2xl font-bold text-base-content">সাইন ইন করুন</h1>
				<p className="mt-2 text-sm text-base-content/65">বিস্তারিত দাম, বাজার তুলনা ও রিপোর্ট দেখতে অ্যাকাউন্টে ঢুকুন।</p>
			</div>

			<div className="w-full max-w-md rounded-2xl border border-[#dce5df] bg-white p-6 sm:p-7">
				<form onSubmit={handleSignIn} className="flex w-full flex-col gap-4">
					<label className="form-control w-full gap-1.5">
						<span className="label-text text-sm font-medium">ইমেইল</span>
						<input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input input-bordered w-full" required />
					</label>

					<label className="form-control w-full gap-1.5">
						<span className="label-text text-sm font-medium">পাসওয়ার্ড</span>
						<input name="password" type="password" autoComplete="current-password" placeholder="কমপক্ষে ৮ অক্ষর" className="input input-bordered w-full" required />
					</label>

					{errorMessage ? <p role="alert" className="text-sm text-error">{errorMessage}</p> : null}
					<button type="submit" disabled={isSubmitting} className="btn w-full border-0 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800">
						{isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
						{isSubmitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
					</button>
				</form>

				<div className="divider my-4 text-sm text-base-content/55">অথবা</div>

				<div className="grid grid-cols-2 gap-2">
					<button type="button" onClick={() => handleSocialSignIn("google")} className="btn btn-outline min-w-0 flex-nowrap gap-2 border-[#dce5df] bg-white px-2 text-xs">
						<FcGoogle aria-hidden="true" className="size-5 shrink-0" />
						<span className="whitespace-nowrap">Google দিয়ে সাইন ইন</span>
					</button>
					<button type="button" onClick={() => handleSocialSignIn("github")} className="btn btn-outline min-w-0 flex-nowrap gap-2 border-[#dce5df] bg-white px-2 text-xs">
						<FaGithub aria-hidden="true" className="size-5 shrink-0" />
						<span className="whitespace-nowrap">GitHub দিয়ে সাইন ইন</span>
					</button>
				</div>

				<p className="mt-5 text-center text-sm text-base-content/70">
					অ্যাকাউন্ট নেই? <Link href="/sign-up" className="font-medium text-emerald-700 hover:underline">নতুন অ্যাকাউন্ট তৈরি করুন</Link>
				</p>
			</div>

			<Link href="/" className="mt-5 text-sm text-base-content/60 hover:text-base-content">
				← হোম পেজে ফিরে যান
			</Link>
		</section>
	);
};

export default SignInPage;
