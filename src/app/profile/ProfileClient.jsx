"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut, updateUser } from "@/lib/auth-client";

export default function ProfileClient({ user }) {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const userInitial = user.name?.trim().charAt(0) || user.email.charAt(0);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { error } = await updateUser({
        name: formData.get("name").toString().trim(),
      });

      if (error) {
        setErrorMessage(error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      setMessage("নাম আপডেট হয়েছে।");
    } catch {
      setErrorMessage("তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-10rem)] bg-[#f2f6f3] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-base-content">আমার প্রোফাইল</h1>
          <p className="mt-2 text-sm text-base-content/65">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <section className="flex flex-col items-center gap-4 rounded-xl border border-base-300 bg-[#fbfdfb] p-5 sm:flex-row sm:p-6">
          <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-200 text-2xl font-semibold text-base-content/70">
            {user.image ? (
              <Image src={user.image} alt="" fill sizes="80px" unoptimized className="object-cover" />
            ) : (
              userInitial
            )}
          </span>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-lg font-semibold text-base-content">{user.name || "নাম যোগ করুন"}</h2>
            <p className="mt-1 truncate text-sm text-base-content/60">{user.email}</p>
          </div>
          <button type="button" onClick={() => signOut()} className="btn btn-outline btn-error btn-sm">
            সাইন আউট
          </button>
        </section>

        <section className="mt-5 rounded-xl border border-base-300 bg-[#fbfdfb] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-base-content">তথ্য</h2>
          <form onSubmit={handleUpdate} className="mt-5 flex flex-col gap-3">
            <label htmlFor="profile-name" className="text-sm font-medium text-base-content/75">নাম</label>
            <input
              id="profile-name"
              name="name"
              defaultValue={user.name || ""}
              className="input input-bordered w-full"
              autoComplete="name"
              minLength={3}
              required
            />
            {errorMessage ? <p role="alert" className="text-sm text-error">{errorMessage}</p> : null}
            {message ? <p role="status" className="text-sm text-success">{message}</p> : null}
            <button type="submit" className="btn w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto sm:self-start" disabled={isSaving}>
              {isSaving ? <span className="loading loading-spinner loading-sm" /> : null}
              আপডেট
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}