import React from 'react';

const ShippingPolicy = () => {
  return (
    <div>
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Shipping & Delivery Policy</h1>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>
            For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within 8-14 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
          </p>
          <p>
            RABINDRA SARANI SHREE NANU SHAKTI JANKALYAN SEVA SAMITY is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 8-14 days rom the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
          </p>
          <p>
            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on 9830473753 or shrinanusatidadi@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
