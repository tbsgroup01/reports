import React, { useEffect, useRef, useState } from "react";
import aboutImg from "../../assets/about.png";
import { Calendar, Users, Award, Target, ShieldCheck, Zap } from "lucide-react";

export default function AboutCompanySection() {
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

  const stats = [
    {
      icon: Calendar,
      value: "10+ Years",
      label: "Experience",
    },
    {
      icon: Users,
      value: "100+",
      label: "Skilled Professionals",
    },
    {
      icon: Award,
      value: "500+",
      label: "Projects Delivered",
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-10 sm:py-14 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 sm:space-y-9">



        <div className="bg-white rounded-3xl border border-slate-200/90 hover:shadow-md transition-shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            <div
              className={`lg:col-span-5 relative flex items-center justify-center transition-all duration-1000 ease-out transform ${isInView
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-12 sm:-translate-x-16 scale-95"
                }`}
            >
              <div className="relative w-full h-[240px] sm:h-[300px] lg:h-[320px] rounded-2xl lg:rounded-l-3xl lg:rounded-tr-[80px] overflow-hidden border border-slate-200/80 shadow-xs group">


                <img
                  src={aboutImg}
                  alt="Abdiva Infotech Pvt Ltd Office Headquarters"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div
              className={`lg:col-span-7 space-y-4 sm:space-y-5 transition-all duration-1000 ease-out delay-150 transform ${isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12 sm:translate-x-16"
                }`}
            >
              <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-[#0e6b38] border border-emerald-200/80">
                About Us
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                Your Trusted <span className="text-[#0e6b38]">BPO &amp; Data Services</span> Partner
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl">
                Abdiva Infotech Private Limited is a professional BPO and data management company, delivering high-quality, secure, and scalable business support services to clients across industries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-4 border-t border-slate-100">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const delays = ["delay-300", "delay-500", "delay-700"];
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 transition-all duration-700 ease-out ${delays[idx]} transform ${isInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                        }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#0e6b38] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
