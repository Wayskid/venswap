import React from "react";

export default function Escrow() {
  return (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 grid">
        <div className="grid">
          <p className="text-3xl">Escrow services</p>
          <p className="mt-3 text-lg">
            Our escrow service is designed to provide a secure and trusted
            payment solution for buyers and sellers of businesses listed on our
            platform. The escrow service ensures that payments are held securely
            until the transaction is complete, protecting both parties from
            potential fraud or disputes.
          </p>
        </div>
        <div className="grid mt-10">
          <p className="text-xl font-medium">How to use the Escrow Service</p>
          <div className="">
            <p className="mt-3 font-medium">For Sellers:</p>
            <ul className="mt-1">
              <li className="list-inside list-item list-disc">
                Click on "Create Payment" and input the amount you want the
                buyer to pay.
              </li>
              <li className="list-inside list-item list-disc">
                After imputing the description, click "Create Payment". This
                will send a generated payment link to the buyer.
              </li>
              <li className="list-inside list-item list-disc">
                To withdraw money paid to you by a buyer, contact us. (An
                automatic withdrawal system will be available soon.)
              </li>
            </ul>
          </div>
          <div className="mt-2">
            <p className="mt-3 font-medium">For Buyers:</p>
            <ul className="mt-1">
              <li className="list-inside list-item list-disc">
                Ask the seller to send you the payment link.
              </li>
              <li className="list-inside list-item list-disc">
                Click on "Pay" and a payment dialogue powered by Paystack will
                pop up.
              </li>
              <li className="list-inside list-item list-disc">
                Select a payment option that suits you and complete the payment.
              </li>
              <li className="list-inside list-item list-disc">
                After payment, the seller will be notified.
              </li>
            </ul>
          </div>
        </div>
        <div className="grid mt-10">
          <p className="text-xl font-medium">Terms and Conditions</p>
          <ul className="mt-2">
            <li className="list-inside list-item list-disc">
              Our escrow service is only available for business listings on our
              platform.
            </li>
            <li className="list-inside list-item list-disc">
              The escrow service is a secure and trusted payment solution, but
              we are not responsible for any disputes or fraud related to the
              transaction.
            </li>
            <li className="list-inside list-item list-disc">
              All payments are held securely until the transaction is complete.
            </li>
            <li className="list-inside list-item list-disc">
              We reserve the right to cancel or reverse any payment if we
              suspect fraud or a dispute.
            </li>
            <li className="list-inside list-item list-disc">
              Our escrow service is subject to change, and we will notify users
              of any updates or modifications.
            </li>
          </ul>
        </div>
        <p className="mt-10">
          If you have any questions or issues with our escrow service, please
          contact us at info@venswap.com. We are here to help.
        </p>
      </div>
    </section>
  );
}
