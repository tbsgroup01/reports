import React, { useEffect, useRef, useState } from "react";
import bpoServiceImg from "../../assets/bposervice.png";
import { Check } from "lucide-react";

export default function AboutBpoSection() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const features = [
    "High-accuracy data processing",
    "Scalable team for any project size",
    "Quick turnaround & regular updates",
    "Cost-efficient freelance engagement",
  ];

  return (
    <section id="bpo-support" ref={sectionRef} className="py-8 sm:py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            <div
              className={`lg:col-span-7 space-y-4 sm:space-y-5 transition-all duration-1000 ease-out delay-150 transform ${isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12 sm:translate-x-16"
                }`}
            >

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                Complete BPO Support <br className="hidden sm:inline" />
                for <span className="text-[#0e6b38]">Your Business</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                From data handling to document management, we offer end-to-end back office support to streamline your operations, reduce costs, and improve productivity.
              </p>

              <ul className="space-y-3.5 pt-2 text-xs sm:text-sm font-semibold text-slate-800">
                {features.map((feature, idx) => {
                  const delays = ["delay-300", "delay-450", "delay-600", "delay-750"];
                  return (
                    <li
                      key={idx}
                      className={`flex items-center gap-3 transition-all duration-600 ease-out ${delays[idx]} transform ${isInView
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8"
                        }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#0e6b38] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  );
                })}
              </ul>

            </div>


            <div
              className={`lg:col-span-5 flex items-center justify-center transition-all duration-1000 ease-out transform ${isInView
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-12 sm:-translate-x-16 scale-95"
                }`}
            >
              <div className="w-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={bpoServiceImg}
                  alt="Complete BPO Services Diagram"
                  className="w-full max-w-[400px] lg:max-w-[440px] h-auto object-contain block transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>



          </div>
        </div>

      </div>
    </section>
  );
}
