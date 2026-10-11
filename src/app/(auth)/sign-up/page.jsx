"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { signIn, signUp } from "@/lib/auth-client";

const SignUpPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setErrorMessage("দুটি পাসওয়ার্ড এক নয়।");
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
        return;
      }

      setSuccessMessage("অ্যাকাউন্ট তৈরি হয়েছে।");
    } catch {
      setErrorMessage("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  const handleSocialSignIn = async (provider) => {
    setErrorMessage("");

    try {
      const { error } = await signIn.social({ provider, callbackURL: "/" });

      if (error) {
        setErrorMessage(error.message || "সাইন ইন করা যায়নি।");
      }
    } catch {
      setErrorMessage("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center bg-[#f2f6f3] px-4 py-8 sm:py-10">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-base-content">একাউন্ট তৈরি করুন</h1>
        <p className="mt-2 text-sm text-base-content/65">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-base-300 bg-[#fbfdfb] p-5 sm:p-6">
        <Form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
          <TextField isRequired name="name" autoComplete="name" validate={(value) => value.trim().length < 3 ? "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" : null}>
            <Label>নাম</Label>
            <Input placeholder="যেমনঃ কুদ্দুস আলি" />
            <FieldError />
          </TextField>

          <TextField isRequired name="email" type="email" autoComplete="email" validate={(value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? null : "সঠিক ইমেইল ঠিকানা লিখুন।"}>
            <Label>ইমেইল</Label>
            <Input placeholder="you@example.com" />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password" autoComplete="new-password" minLength={8} validate={(value) => {
            if (value.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
            if (!/[A-Z]/.test(value)) return "একটি বড় হাতের অক্ষর দিন।";
            if (!/[0-9]/.test(value)) return "একটি সংখ্যা দিন।";
            return null;
          }}>
            <Label>পাসওয়ার্ড</Label>
            <Input placeholder="আপনার পাসওয়ার্ড" />
            <Description>কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর ও একটি সংখ্যা</Description>
            <FieldError />
          </TextField>

          <TextField isRequired name="confirmPassword" type="password" autoComplete="new-password">
            <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>
            <Input placeholder="আবার লিখুন" />
            <FieldError />
          </TextField>

          {errorMessage ? <p role="alert" className="text-sm text-error">{errorMessage}</p> : null}
          {successMessage ? <p role="status" className="text-sm text-success">{successMessage}</p> : null}

          <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800">
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </Form>

        <div className="divider my-4 text-sm text-base-content/55">অথবা</div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button type="button" onPress={() => handleSocialSignIn("google")} variant="secondary" className="w-full">
            <FcGoogle aria-hidden="true" className="size-5" />
            Google দিয়ে সাইন আপ
          </Button>
          <Button type="button" onPress={() => handleSocialSignIn("github")} variant="secondary" className="w-full">
            <FaGithub aria-hidden="true" className="size-5" />
            GitHub দিয়ে সাইন আপ
          </Button>
        </div>

        {successMessage ? <Link href="/" className="mt-4 block text-center text-sm font-medium text-emerald-700 hover:underline">হোম পেজে যান</Link> : null}

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
