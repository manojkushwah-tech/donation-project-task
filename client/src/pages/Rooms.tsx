import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const Rooms = () => {
  const [activeTab, setActiveTab] = useState(0);

  const roomGallery = [
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/01.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/02.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/03.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/04.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/05.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/06.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/07.jpg',
    'https://www.shrinanusatidadi.com/images/rooms/dharamshala/08.jpg',
  ];

  const roomTypes = [
    {
      name: 'AC Standard Deluxe (Max 3 People)',
      features: [
        'Peaceful, air-conditioned room for a comfortable stay.',
        'Suitable for small families or groups of up to three.',
        'Attached washroom provided for convenience.',
        '⁠Hot water available for guests.',
      ],
      images: [
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/01.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/02.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/03.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/04.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/05.jpg',
      ]
    },
    {
      name: 'Non-AC Standard Deluxe (Max 3 People)',
      features: [
        'Simple, clean, and well-ventilated non-AC rooms.',
        'Ideal for budget-conscious solo travelers or small groups.',
        'Attached washroom with basic amenities.',
        'Hot water available on request.',
      ],
      images: [
        'https://www.shrinanusatidadi.com/images/rooms/dharamshala/01.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/dharamshala/02.jpg',
      ]
    },
    {
      name: 'AC Family Suite (Max 6 People)',
      features: [
        'Spacious air-conditioned suite for larger families.',
        'Multiple beds to accommodate up to six guests comfortably.',
        'Modern attached washroom with premium fittings.',
        'Dedicated seating area for family gatherings.',
      ],
      images: [
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/06.jpg',
        'https://www.shrinanusatidadi.com/images/rooms/ac-delux/07.jpg',
      ]
    },
    {
      name: 'Dormitory (Max 12 People)',
      features: [
        'Economical stay for large groups or pilgrims.',
        'Clean bunk beds or individual floor bedding options.',
        'Shared washrooms maintained with high hygiene standards.',
        'Ideal for group yatras and spiritual retreats.',
      ],
      images: [
        'https://www.shrinanusatidadi.com/images/rooms/dharamshala/08.jpg',
      ]
    }
  ];

  return (
    <div>
      {/* Banner */}
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Our Rooms</h1>
          </div>
        </section>
      </div>

      {/* Room Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2 h-[400px] md:h-[600px]">
              <img src={roomGallery[0]} alt="" className="h-full w-full rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
            </div>
            <div className="h-[190px] md:h-[290px]">
              <img src={roomGallery[1]} alt="" className="h-full w-full rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
            </div>
            <div className="h-[190px] md:h-[290px]">
              <img src={roomGallery[2]} alt="" className="h-full w-full rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
            </div>
            <div className="h-[190px] md:h-[290px]">
              <img src={roomGallery[3]} alt="" className="h-full w-full rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
            </div>
            <div className="h-[190px] md:h-[290px]">
              <img src={roomGallery[4]} alt="" className="h-full w-full rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Info */}
      <section className="py-16 md:py-24 bg-[#F8F9FA]">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-6">Accommodation at the Temple</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We warmly welcome all devotees seeking to stay close to the divine presence of our Nanu Sati Dadi Maa. Our temple premises offer clean, comfortable, and spiritually serene rooms for families and individuals visiting for darshan, pooja, or during festivals.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div>
                <h3 className="text-2xl font-bold uppercase text-slate-900 mb-6 border-b-2 border-primary inline-block pb-1">Booking Information</h3>
                <ul className="space-y-6 text-slate-600">
                  <li className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900 text-lg">Advance Booking Recommended:</span>
                    <span>Especially during festivals like Navratri, Diwali, and Sawan.</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900 text-lg">Check-in/Check-out Timings:</span>
                    <span>Flexible, with prior confirmation.</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900 text-lg">Booking Contact:</span>
                    <span className="text-primary font-bold text-xl">+91 98304 73753</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://www.shrinanusatidadi.com/images/about/about.jpg"
                alt="Temple Stay"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-8 text-center lg:text-left">
              <div>
                <h3 className="text-2xl font-bold uppercase text-slate-900 mb-6 border-b-2 border-primary inline-block pb-1">Guidelines for Guests</h3>
                <ul className="space-y-5 text-slate-600">
                  <li className="flex items-start gap-3 justify-center lg:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <span>Please maintain silence and cleanliness within the premises.</span>
                  </li>
                  <li className="flex items-start gap-3 justify-center lg:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <span>Smoking, alcohol, and non-vegetarian food are strictly prohibited.</span>
                  </li>
                  <li className="flex items-start gap-3 justify-center lg:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <span>Modest dress and respectful behavior are expected on temple grounds.</span>
                  </li>
                  <li className="flex items-start gap-3 justify-center lg:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <span>Participation in daily aartis is encouraged for spiritual benefit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Room Types</h2>
            <p className="text-slate-600 text-lg">We offer a variety of room options to suit the needs of individuals, couples, and families.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {roomTypes.map((type, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={cn(
                  'py-4 px-8 rounded-full border-2 font-bold text-base transition-all duration-300 shadow-sm',
                  activeTab === idx 
                    ? 'bg-[#4C2A1F] border-[#4C2A1F] text-white' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-primary hover:text-primary'
                )}
              >
                {type.name.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-8 md:p-16">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-8">{roomTypes[activeTab].name}</h3>
                  <ul className="space-y-6">
                    {roomTypes[activeTab].features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                        <span className="text-slate-700 font-semibold text-lg">{feature}</span>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                          <CheckCircle className="text-primary group-hover:text-white shrink-0" size={20} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {roomTypes[activeTab].images.map((img, idx) => (
                    <div key={idx} className={cn(
                      "rounded-2xl overflow-hidden shadow-md h-48",
                      idx === 0 && "col-span-2 h-64"
                    )}>
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
