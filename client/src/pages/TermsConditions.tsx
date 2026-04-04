import React from 'react';

const TermsConditions = () => {
  return (
    <div>
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Terms & Conditions</h1>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Welcome to Shri Nanu Sati Dadi Mandir's official website.</h3>
        <p className="text-lg text-slate-700 mb-8">By accessing or donating through our website, you agree to the following:</p>
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>1. All donations are voluntary contributions for religious and charitable purposes.</p>
          <p>2. Donors are responsible for providing accurate information while making donations.</p>
          <p>3. The Temple Trust reserves the right to update, modify, or discontinue any part of the website without notice.</p>
          <p>4. No products or commercial services are being sold through this platform.</p>
          <p>5. By using this site, you agree not to misuse the platform or engage in fraudulent activity.</p>
          <p>6. Donors will not be able to get exemption under 80G at the moment.</p>
        </div>
        <p className="mt-12 text-slate-900 font-semibold">If you have any concerns, please contact us at +91 9830473753</p>
      </div>
    </div>
  );
};

export default TermsConditions;
