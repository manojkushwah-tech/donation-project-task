import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div>
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Privacy Policy</h1>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Shri Nanu Sati Dadi Mandir respects your privacy.</h3>
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>1. We collect donor details (such as name, email, phone, address) only for issuing receipts, maintaining donation records, and statutory compliance.</p>
          <p>2. We do not sell, rent, or share your personal information with third parties.</p>
          <p>3. All payments are processed securely through our payment gateway partners.</p>
          <p>4. Our website may use cookies for better user experience.</p>
          <p>5. You may contact us anytime to update or delete your personal information from our records.</p>
        </div>
        <p className="mt-12 text-slate-900 font-semibold">For concerns, reach us at +91 9830473753</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
