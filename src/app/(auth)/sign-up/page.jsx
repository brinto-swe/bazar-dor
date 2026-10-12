"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

const SignUpPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setErrorMessage("দুটি পাসওয়ার্ড এক নয়।");
      toast.error("দুটি পাসওয়ার্ড এক নয়।");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await signUp.email({
        name: data.name.toString().trim(),
        email: data.email.toString().trim(),
        password: data.password.toString(),
      });

      if (error) {
        setErrorMessage(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে।");
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setErrorMessage("");

    try {
      const { error } = await signIn.social({ provider, callbackURL: "/" });

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
        <h1 className="text-2xl font-bold text-base-content">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="mt-2 text-sm text-base-content/65">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[#dce5df] bg-white p-6 sm:p-7">
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
          <label className="form-control gap-1.5">
            <span className="text-sm font-semibold">নাম</span>
            <input name="name" autoComplete="name" minLength={3} placeholder="যেমনঃ রহিম উদ্দিন" className="input input-bordered w-full" required />
          </label>

          <label className="form-control gap-1.5">
            <span className="text-sm font-semibold">ইমেইল</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input input-bordered w-full" required />
          </label>

          <label className="form-control gap-1.5">
            <span className="text-sm font-semibold">পাসওয়ার্ড</span>
            <input name="password" type="password" autoComplete="new-password" minLength={8} placeholder="কমপক্ষে ৮ অক্ষর" className="input input-bordered w-full" required />
          </label>

          <label className="form-control gap-1.5">
            <span className="text-sm font-semibold">পাসওয়ার্ড নিশ্চিত করুন</span>
            <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} placeholder="আবার লিখুন" className="input input-bordered w-full" required />
          </label>

          {errorMessage ? <p role="alert" className="text-sm text-error">{errorMessage}</p> : null}
          <button type="submit" disabled={isSubmitting} className="btn w-full border-0 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800">
            {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
            {isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="divider my-4 text-sm text-base-content/55">অথবা</div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => handleSocialSignIn("google")} className="btn btn-outline w-full border-[#dce5df] bg-white text-xs">
            <FcGoogle aria-hidden="true" className="size-5" />
            Google দিয়ে সাইন আপ
          </button>
          <button type="button" onClick={() => handleSocialSignIn("github")} className="btn btn-outline w-full border-[#dce5df] bg-white text-xs">
            <FaGithub aria-hidden="true" className="size-5" />
            GitHub দিয়ে সাইন আপ
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-base-content/70">
          আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/sign-in" className="font-medium text-emerald-700 hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>

      <Link href="/" className="mt-5 text-sm text-base-content/60 hover:text-base-content">
        ← হোম পেজে ফিরে যান
      </Link>
    </section>
  );
};

export default SignUpPage;
