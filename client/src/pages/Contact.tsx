import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, Facebook, Youtube } from 'lucide-react';

const Contact = () => {
  return (
    <div>
      {/* Banner */}
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">Contact Us</h1>
          </div>
        </section>
      </div>

      {/* Contact Info */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-slate-600 text-lg">
              We look forward to welcoming you to the temple. May Nanu Sati Dadi bless you and your family with peace, health, and prosperity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#4C2A1F] p-8 rounded-2xl text-white flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Temple Address</h3>
              <div className="space-y-1 text-slate-300 mb-8">
                <p className="font-bold text-white">Shri Kul Devi Maa Mandir</p>
                <p>CV57+Q9Q, Sohansara Ajampur Rd</p>
                <p>Sohansara, Haryana 127201</p>
              </div>
              <a
                href="https://maps.app.goo.gl/PotMgLAPNafiGanv6"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
              >
                <MapPin size={18} className="text-primary" />
                Visit Temple
              </a>
            </motion.div>

            {/* Communicate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#F5EEE6] p-8 rounded-2xl text-[#4C2A1F] flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-[#4C2A1F]/5 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare size={24} className="text-[#C45C29]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Communicate with Us</h3>
              <p className="text-slate-600 mb-8">
                We are here to assist you with darshan timings, room bookings, donations, and any other queries related to the temple.
              </p>
              <a
                href="tel:+919830473753"
                className="mt-auto inline-flex items-center gap-2 bg-[#C45C29] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A34A21] transition-colors shadow-lg"
              >
                🎧 Contact Now
              </a>
            </motion.div>

            {/* Connect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#4C2A1F] p-8 rounded-2xl text-white flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Phone size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
              <div className="space-y-4 mb-8">
                <p className="text-slate-300">
                  <span className="block font-bold text-white">Phone / WhatsApp :</span>
                  +91 98304 73753
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-auto">
                Stay updated with temple events, live darshan, and announcements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
