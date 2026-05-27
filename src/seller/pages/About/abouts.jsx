"use client";
import React from "react";
import {
  Users,
  Target,
  Globe,
  Award,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
  Store,
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "Active Sellers", value: "50,000+", icon: <Store size={20} /> },
    { label: "Monthly Orders", value: "1.2M+", icon: <TrendingUp size={20} /> },
    { label: "Countries", value: "25+", icon: <Globe size={20} /> },
    { label: "Happy Customers", value: "10M+", icon: <Heart size={20} /> },
  ];

  const values = [
    {
      title: "Seller First",
      desc: "We believe in empowering small and medium businesses by providing them the best-in-class tools.",
      icon: <Users className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Security & Trust",
      desc: "Every transaction and user interaction is protected by industry-leading security protocols.",
      icon: <ShieldCheck className="text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Fast Innovation",
      desc: "We continuously evolve our platform to meet the dynamic needs of the global marketplace.",
      icon: <Zap className="text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      title: "Quality Excellence",
      desc: "Our rigorous standards ensure that only the best products reach our end customers.",
      icon: <Award className="text-amber-600" />,
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="relative w-full bg-[#0B1E3A] px-4 pt-4 pb-6 rounded-b-[3rem] shadow-2xl overflow-hidden mb-16">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Journey
          </h1>
          <p className="text-blue-200 mt-4 text-xl font-medium max-w-2xl">
            Empowering the next generation of digital commerce. Founded in 2020,
            our mission is to simplify the way people sell online.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="flex justify-center text-blue-600 mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-[#1E4CF6] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group">
            <Target className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-blue-100 leading-relaxed mb-6">
              To build a transparent, efficient, and accessible e-commerce
              ecosystem where any seller, regardless of their size, can reach a
              global audience with zero friction.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <div className="w-8 h-1 bg-white rounded-full"></div>
              Driven by Innovation
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Why we started?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We noticed that most sellers struggle with complex logistics and
              payment gateways. Our portal was built to bridge this gap,
              providing a seamless interface that handles the hard work in the
              background.
            </p>
            <ul className="space-y-3">
              {["User-centric design", "Global reach", "24/7 Support"].map(
                (item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-700 font-medium"
                  >
                    <div className="bg-green-100 p-1 rounded-full">
                      <ShieldCheck size={16} className="text-green-600" />
                    </div>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800">
              Our Core Values
            </h3>
            <p className="text-gray-500 mt-2">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div
                  className={`p-3 rounded-xl w-fit mb-5 ${val.color} group-hover:rotate-6 transition-transform`}
                >
                  {val.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-3">{val.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Want to be part of our story?
          </h3>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join thousands of successful sellers who are growing their business
            every day using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#1E4CF6] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Start Selling Now <ArrowRight size={18} />
            </button>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pb-8 border-t border-gray-200 pt-8">
          <p className="text-gray-400 text-sm italic">
            "Your success is our greatest achievement." — The Founder Team
          </p>
        </div>
      </div>
    </div>
  );
}
