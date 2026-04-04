import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchCommitteeMembers, CommitteeMember } from '../services/apiService';
import Button from '../components/Button';

const About = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchCommitteeMembers();
      setMembers(data);
      setLoading(false);
    };
    loadMembers();
  }, []);
  const galleryImages = [
    'https://www.shrinanusatidadi.com/images/gallery/10.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/01.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/02.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/03.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/04.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/05.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/06.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/07.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/08.jpeg',
    'https://www.shrinanusatidadi.com/images/gallery/09.jpeg',
  ];

  return (
    <div>
      {/* Banner */}
      <div className="h-[16rem] bg-cover relative" style={{ backgroundImage: "url('https://www.shrinanusatidadi.com/images/activity/activity-banner.jpeg')" }}>
        <section className="relative z-10 flex h-full items-end justify-center overflow-hidden bg-primary/60">
          <div className="container">
            <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">About Us</h1>
          </div>
        </section>
      </div>

      {/* History Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-slate-700 leading-relaxed text-justify"
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 -m-6 -rotate-2 rounded-2xl bg-orange-100" />
              <div className="absolute inset-0 -m-6 rotate-1 rounded-2xl bg-primary/10 shadow-inner" />
              <img
                src="https://www.shrinanusatidadi.com/images/about/about.jpg"
                alt="Temple History"
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Our Gallery</h2>
            <p className="text-slate-600">Glimpses of the divine temple and its serene surroundings.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src={galleryImages[0]} alt="" className="col-span-2 row-span-2 h-full w-full rounded-xl object-cover shadow-sm min-h-[400px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[1]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[2]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[3]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[4]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[5]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[6]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[7]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[8]} alt="" className="h-full w-full rounded-xl object-cover shadow-sm min-h-[200px]" referrerPolicy="no-referrer" />
            <img src={galleryImages[9]} alt="" className="col-span-2 row-span-2 h-full w-full rounded-xl object-cover shadow-sm min-h-[400px]" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Committee Members Placeholder */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">Committee Members</h2>
            <p className="text-slate-600">The dedicated individuals serving the temple and its community.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-100 animate-pulse">
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              ))
            ) : members.length > 0 ? (
              members.map((member) => (
                <div key={member._id} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-2 border-primary/20">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.designation}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">No committee members found.</div>
            )}
          </div>
        </div>
      </section>

      {/* How You Can Help Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 mb-4">How You Can Help</h2>
            <p className="text-slate-600 text-lg">
              We humbly request all members of the Dalmia family to visit the temple of our Kul Devi Maa and contribute their service and support, so that the temple remains well-maintained and continues to run smoothly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="mb-6">
                <img 
                  src="https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Fsip.webp&w=256&q=75" 
                  alt="One-Time Donation"
                  className="w-24 h-24 mx-auto mb-4 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">One-Time Donation</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Make a one-time donation to support the temple’s upkeep, rituals, and development needs.</p>
              <Button href="#">Donate Now</Button>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="mb-6">
                <img 
                  src="https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Fsip.webp&w=256&q=75" 
                  alt="Start a SIP"
                  className="w-24 h-24 mx-auto mb-4 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Start a SIP (Systematic Investment Plan)</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Contribute regularly through a monthly SIP to provide steady, long-term support for the temple’s maintenance and future growth.</p>
              <Button href="#">Start SIP</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
