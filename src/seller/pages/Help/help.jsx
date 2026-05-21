"use client";
import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LifeBuoy,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = [
    {
      title: "Orders & Shipping",
      icon: <Truck className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Payments & Payouts",
      icon: <CreditCard className="text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Account Settings",
      icon: <ShieldCheck className="text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      title: "Seller Policy",
      icon: <FileText className="text-amber-600" />,
      color: "bg-amber-50",
    },
  ];

  const faqs = [
    {
      question: "How do I list a new product?",
      answer:
        "Go to the Dashboard, click on 'Add New Product' button. Fill in the details like title, price, description, and images, then click submit.",
    },
    {
      question: "When will I receive my payments?",
      answer:
        "Payments are processed every 7 days for completed orders. You can check your 'Withdraw Balance' in the main dashboard.",
    },
    {
      question: "How to handle return requests?",
      answer:
        "You can view return requests in the 'Recent Return Orders' section. You have 48 hours to approve or contest a return request.",
    },
    {
      question: "What are the shipping charges?",
      answer:
        "Shipping charges depend on the product weight and delivery location. You can set custom shipping rates in your profile settings.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-10 text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How can we help you?
        </h1>
        <p className="text-gray-500 mb-8">
          Search our knowledge base or contact our support team.
        </p>

        <div className="relative max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for articles, topics, or keywords..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Help Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div
                className={`p-3 rounded-xl w-fit mb-4 ${cat.color} group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-800">{cat.title}</h3>
              <p className="text-xs text-gray-500 mt-2">View 15+ articles</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-lg text-gray-800">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {faqs.map((faq, index) => (
              <div key={index} className="px-6 py-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-gray-700">
                    {faq.question}
                  </span>
                  {activeFaq === index ? (
                    <ChevronUp size={20} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="mt-3 text-gray-500 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E4CF6] rounded-2xl p-8 text-white relative overflow-hidden group">
            <LifeBuoy className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
            <h4 className="text-xl font-bold mb-2">Live Chat Support</h4>
            <p className="text-blue-100 text-sm mb-6">
              Average response time: 5 minutes
            </p>
            <button className="bg-white text-[#1E4CF6] px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors">
              <MessageCircle size={18} />
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Email Support
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                For complex issues, reach out via email.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} className="text-blue-600" />
                <span className="font-medium">support@sellerportal.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={18} className="text-blue-600" />
                <span className="font-medium">+91 1800-123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pb-8">
          <p className="text-gray-500 text-sm">
            Can't find what you're looking for?
            <button className="text-blue-600 font-bold ml-2 hover:underline inline-flex items-center gap-1">
              Visit our Documentation <ExternalLink size={14} />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
