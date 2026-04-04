import React from 'react';

const RefundPolicy = () => {
  return (
    <div>
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Cancellation & Refunds Policy</h1>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Thank you for supporting Shri Nanu Sati Dadi Mandir through your kind donations. Please note:</h3>
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>1. Donations made to the Temple are considered voluntary and non-refundable.</p>
          <p>2. Once a donation or offering has been processed, we cannot cancel, refund, or return the amount.</p>
          <p>3. In case of duplicate transactions, technical errors, or wrong deductions, please contact us within 7 working days at shrinanusatidadi@gmail.com or +91 98304 73753. Verified cases will be refunded to the original payment method.</p>
          <p>4. Refunds, if approved, will be processed within 10-15 working days.</p>
        </div>
        <p className="mt-12 text-slate-900 font-semibold">For any queries, contact us at +91 98304 73753</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
