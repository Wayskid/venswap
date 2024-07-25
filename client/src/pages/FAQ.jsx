import React from "react";
import { Helmet } from "react-helmet-async";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function FAQ() {
  const faqs = [
    {
      qstn: "What is Venswap",
      ans: "Venswap is a business marketplace connecting buyers and sellers of businesses. We provide a secure and trusted platform for listing, marketing, and selling businesses, as well as resources and support for a successful transaction.",
    },
    {
      qstn: "How do I find the right business for me?",
      ans: "Use our advanced search filters to narrow down your search by category, location, price range, and more.",
    },
    {
      qstn: "Can I contact the seller directly?",
      ans: "Yes, once you've created an account, you can contact sellers through our secure messaging system.",
    },
    {
      qstn: "Are businesses on your site vetted or verified?",
      ans: "We verify business listings and ensure they meet our quality standards, but it's still important to do your own due diligence.",
    },
    {
      qstn: "How can I ensure a secure payment process when buying a business?",
      ans: "Use our escrow services to hold payment until the transaction is complete, ensuring a safe and secure transfer of funds.",
    },
    {
      qstn: "How do I list my business for sale?",
      ans: "To list your business for sale, create an account, fill out our comprehensive listing form, providing detailed information about your business, upload all supporting documents, add high-quality photos showcasing your business's assets, facilities, and operations, set a competitive price for your business based on its value and market conditions, review and agree to our terms and conditions, submit your listing",
    },
    {
      qstn: "How do I handle inquiries and offers from buyers?",
      ans: "To avoid fraud and ensure a secure transaction, it's crucial to use our messaging system to communicate with buyers. This protects your personal contact information and ensures all communication is kept in a secure and traceable environment. Never share personal contact information or agree to transactions outside of our platform.",
    },
    {
      qstn: "Can I withdraw my listing if I change my mind?",
      ans: "Yes, contact our support team to remove your listing at any time.",
    },
    {
      qstn: "Is my personal and business information secure?",
      ans: "Yes, our site uses SSL encryption and follows best practices for data protection.",
    },
    {
      qstn: "How do I report a suspicious listing or activity?",
      ans: "Contact our support team immediately, and we'll investigate and take appropriate action.",
    },
    {
      qstn: "Can I use your site if I'm not a business broker or agent?",
      ans: "Yes, our site is open to individual buyers and sellers, as well as business brokers and agents.",
    },
  ];

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | FAQ</title>
        <meta
          name="description"
          content="Frequently Asked Questions - Business Marketplace Answers."
        />
        <link rel="canonical" href="/faq" />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 grid">
        <p className="text-3xl">Frequently Asked Questions</p>
        <p className="mt-3">
          Explore our FAQ page, where we've gathered a collection of frequently
          asked questions and provided concise, informative responses to help
          you find the answers you need quickly and easily.
        </p>

        <div className="mt-10 md:mt-16 border-t border-t-gray-600">
          {faqs.map((faq, index) => (
            <div className="border-b border-b-gray-600 py-4" key={index}>
              <input
                type="checkbox"
                id={index}
                className="hidden peer/accordion"
              />
              <label
                htmlFor={index}
                className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[180deg]"
              >
                <p className="text-lg font-semibold">{faq.qstn}</p>
                <MdKeyboardArrowDown className="text-3xl justify-self-end transition-all" />
              </label>
              <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                <p className="font-light mt-3 whitespace-pre-wrap">{faq.ans}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#dbe1e35c] p-5 text-center grid gap-5 mt-10">
          <p className="text-xl font-semibold">Still have a question?</p>
          <p className="text-sm w-[min(50rem,100%)] justify-self-center">
            Reach out to us through our contact form, and please provide all
            relevant details to ensure we can address your inquiry or request
            efficiently and accurately.
          </p>
          <NavLink
            className="bg-Orange border border-Orange rounded-sm text-White disabled:opacity-60 mx-0 md:mx-auto py-2 !px-10"
            to="../contact"
          >
            Get in touch
          </NavLink>
        </div>
      </div>
    </section>
  );
}
