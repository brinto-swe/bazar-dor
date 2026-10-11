"use client";

const SignUpPage = () => {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="hero-content flex-col justify-center items-center">
          <h2 className="text-2xl font-bold">একাউন্ট তৈরি করুন</h2>
          <p>বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label text-sm">নাম</label>
              <input
                type="text"
                className="input"
                placeholder="যেমনঃ কুদ্দুস আলি"
              />
              <label className="label text-sm">ইমেইল</label>
              <input type="email" className="input" placeholder="you@example.com" />
              <label className="label text-sm">পাসওয়ার্ড</label>
              <input type="password" className="input" placeholder="কমপক্ষে ৮ অক্ষর" />
              <label className="label text-sm">পাসওয়ার্ড</label>
              <input type="password" className="input" placeholder="আবার লিখুন" />
              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>
              <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
