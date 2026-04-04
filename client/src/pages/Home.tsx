import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Calendar, Heart } from 'lucide-react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { fetchEvents, Event } from '../services/apiService';
import Button from '../components/Button';

const Home = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const timings = [
    { name: 'Opening Time', time: '5:00 AM', icon: 'https://www.shrinanusatidadi.com/images/activity/opening-time.svg' },
    { name: 'Mangal Aarti', time: '05:30 AM', icon: 'https://www.shrinanusatidadi.com/images/activity/mangal-aarti.svg' },
    { name: 'Shringar Darshan, Bhog & Aarti', time: '8:00 AM', icon: 'https://www.shrinanusatidadi.com/images/activity/shringar-darshan.svg' },
    { name: 'Afternoon Break', time: '1:00 PM – 4:00 PM', icon: 'https://www.shrinanusatidadi.com/images/activity/afternoon_break.svg' },
    { name: 'Sandhya Aarti', time: '6:30 PM', icon: 'https://www.shrinanusatidadi.com/images/activity/sandhya-aarti.svg' },
    { name: 'Night Bhog Seva', time: '8:00 PM', icon: 'https://www.shrinanusatidadi.com/images/activity/night-bhog.svg' },
    { name: 'Shayan Aarti', time: '9:00 PM', icon: 'https://www.shrinanusatidadi.com/images/activity/shayan-aarti.svg' },
  ];

  const helpCards = [
    {
      title: 'One-Time Donation',
      desc: 'Make a one-time donation to support the temple’s upkeep, rituals, and development needs.',
      btnText: 'Donate Now',
      img: 'https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Fsip.webp&w=256&q=75'
    },
    {
      title: 'Start a SIP (Systematic Investment Plan)',
      desc: 'Contribute regularly through a monthly SIP to provide steady, long-term support for the temple’s maintenance and future growth.',
      btnText: 'Start SIP',
      img: 'https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Fsip.webp&w=256&q=75'
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[32rem] md:h-[38rem] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/hero/hero-banner.jpeg')" }}
        >
          <div className="absolute inset-0 bg-primary/40" />
        </div>
        <div className="container relative h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="mb-8 text-4xl md:text-6xl font-bold text-white leading-tight">
              म्हारी नानू सती दादी माँ
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="#" className="border-0">Seva Kare</Button>
              <Button href="#" className="border-0">Monthly Recurring Seva</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Darshan */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Live Darshan</h2>
            <p className="text-slate-600 text-lg">
              Join us for Live Darshan during key aarti times and special events.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group bg-black">
              {!showVideo ? (
                <>
                  <img
                    src="https://www.shrinanusatidadi.com/images/video/video.jpg"
                    alt="Live Darshan"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <button 
                      onClick={() => setShowVideo(true)}
                      className="w-20 h-20 flex items-center justify-center rounded-full bg-white/80 text-primary hover:bg-white transition-all transform hover:scale-110"
                    >
                      <Play fill="currentColor" size={32} className="ml-1" />
                    </button>
                  </div>
                </>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/uFfwjGS3IvY?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Help Section - NO HOVER EFFECT */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">How You Can Help</h2>
            <p className="text-slate-600 text-lg">
              We humbly request all members of the Dalmia family to visit the temple of our Kul Devi Maa and contribute their service and support, so that the temple remains well-maintained and continues to run smoothly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {helpCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100"
              >
                <div className="mb-6">
                  <img 
                    src={card.img} 
                    alt={card.title}
                    className="w-24 h-24 mx-auto mb-4 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{card.desc}</p>
                <Button href="#">{card.btnText}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900">A Brief History of Our Temple</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed text-justify">
              <p>
                Our revered Kuldevi, Nanu Sati Dadi Ji, was born and raised in Dalma. She was later married to Shri Tejpal Ji, a noble and devoted gau-rakshak who dedicated his entire life to the service and protection of cows (go-seva). Together, they were blessed with a son, Daidas Ji.
              </p>
              <p>
                Following the divine will, when Tejpal Ji departed from this world, our Kuldevi chose the sacred path of sati, offering herself in eternal devotion. Before ascending the pyre, she entrusted her young son to Domni Maya, blessing him with a mother’s prayer for safety and well-being.
              </p>
              <p>
                To protect the child, Domni Maya placed him inside a dholak and set forth, guided by the divine words of Nanu Devi Maa: " Wherever the cows stop, that shall be your home."
              </p>
              <p>
                That very spot became Sohansara village, blessed as the eternal seat of our Kuldevi and the cradle of our lineage. And because our roots lay in Dalma, our people came to be known as Dalmias.
              </p>
              <p>
                Since then, generation after generation has carried forward the devotion, faith, and blessings of Nanu Sati Dadi Maa, whose grace continues to protect and guide us.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -m-6 -rotate-2 rounded-2xl bg-orange-100" />
              <div className="absolute inset-0 -m-6 rotate-1 rounded-2xl bg-primary/10 shadow-inner" />
              <img
                src="https://www.shrinanusatidadi.com/images/about/about.jpg"
                alt="Temple History"
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}
        >
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="container relative">
          <h2 className="text-center text-3xl md:text-4xl font-bold uppercase text-white mb-16 tracking-wider">Mandir Timings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timings.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg transform transition hover:scale-105">
                <div className="aspect-square bg-slate-50 flex items-center justify-center p-4">
                  <img src={item.icon} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-primary font-bold mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Our Upcoming Events</h2>
            <p className="text-slate-600 text-lg">
              There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.
            </p>
          </div>
          <div className="max-w-6xl mx-auto overflow-hidden">
          <Carousel
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
            }}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="px-4 pb-8"
          >
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg h-80 shadow-md border border-slate-100" />
              ))
            ) : events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className="group relative h-full w-full overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-xl border border-slate-100">
                  <div className="relative block aspect-[37/22] w-full overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <h3>
                      <a className="mb-4 block text-xl font-bold text-slate-900 hover:text-primary transition-colors sm:text-2xl" href="#">
                        {event.title}
                      </a>
                    </h3>
                    <p className="text-base font-medium text-slate-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">No upcoming events found.</div>
            )}
          </Carousel>
        </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900">Find us on Google</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14037.29736225122!2d75.8634818!3d28.4094686!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3912e5cfa2bf2be3%3A0x819181039d53e23e!2sNanu%20Sati%20Dadi%20Mandir%2C%20Suhasada!5e0!3m2!1sen!2sin!4v1726911481095!5m2!1sen!2sin"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
