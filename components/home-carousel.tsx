"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Zap,
  Target,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const userTypes = [
  {
    icon: Target,
    title: "Deal Advisors",
    subtitle: "Conseil M&A & Stratégique",
    description:
      "Identifiez les opportunités d'acquisition, benchmarkez les valorisations et accédez aux données de transactions comparables.",
    benefits: [
      "Benchmarking des transactions",
      "Cartographie des opportunités",
      "Analyse de valorisation",
      "Due diligence sectorielle",
      "Stratégie de croissance",
    ],
    color: "akili-blue",
  },
  {
    icon: Zap,
    title: "Développeurs/IPPs",
    subtitle: "Producteurs Indépendants",
    description:
      "Analysez la concurrence, suivez les pipelines de projets et identifiez les opportunités de partenariat.",
    benefits: [
      "Intelligence concurrentielle",
      "Suivi de pipeline",
      "Identification de partenaires",
      "Analyse de marché",
      "Optimisation des projets",
    ],
    color: "akili-green",
  },
  {
    icon: DollarSign,
    title: "Investisseurs",
    subtitle: "Fonds & Institutions",
    description:
      "Évaluez les dynamiques de marché, suivez les performances de portefeuille et identifiez les opportunités.",
    benefits: [
      "Analyse ROI",
      "Suivi de portefeuille",
      "Sourcing de deals",
      "Évaluation des risques",
      "Stratégie de sortie",
    ],
    color: "akili-orange",
  },
  {
    icon: Building2,
    title: "EPC/O&M",
    subtitle: "Ingénierie & Construction",
    description:
      "Suivez les projets à venir, surveillez les concurrents et identifiez les opportunités de développement.",
    benefits: [
      "Pipeline de projets",
      "Suivi concurrentiel",
      "Expansion marché",
      "Analyse des appels d'offres",
      "Optimisation des coûts",
    ],
    color: "akili-blue",
  },
  {
    icon: Users,
    title: "Particuliers",
    subtitle: "Professionnels & Passionnés",
    description:
      "Accédez à la veille sectorielle, explorez les projets en temps réel et montez en compétence sur les tendances énergétiques.",
    benefits: [
      "Veille sectorielle",
      "Exploration interactive",
      "Analyse des tendances",
      "Données en temps réel",
      "Formation continue",
    ],
    color: "akili-green",
  },
];

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const carouselRef = useRef(null);

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Calculate total number of slides
  const totalSlides = Math.max(1, userTypes.length - cardsPerView + 1);

  // Reset slide if it exceeds total when screen size changes
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, currentSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const translatePercentage = (100 / cardsPerView) * currentSlide;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Carousel Controls - Hidden on mobile, visible on larger screens */}
      {cardsPerView > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 lg:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-[#021455]" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 lg:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#021455]" />
          </button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden py-6">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${translatePercentage}%)`,
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={() => setIsAutoPlaying(false)}
        >
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;
            return (
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2 sm:px-3"
              >
                <div
                  className={`rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 min-h-[420px] sm:min-h-[450px] flex flex-col ${
                    userType.color === "akili-blue"
                      ? "bg-[#021455]/5 hover:bg-[#021455]/8"
                      : userType.color === "akili-green"
                      ? "bg-[#12B99A]/5 hover:bg-[#12B99A]/8"
                      : "bg-orange-500/5 hover:bg-orange-500/8"
                  }`}
                >
                  <div className="p-6 text-center pb-4 sm:pb-6">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300 ${
                        userType.color === "akili-blue"
                          ? "bg-[#021455]/15 group-hover:bg-[#021455]/25"
                          : userType.color === "akili-green"
                          ? "bg-[#12B99A]/15 group-hover:bg-[#12B99A]/25"
                          : "bg-orange-500/15 group-hover:bg-orange-500/25"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          userType.color === "akili-blue"
                            ? "text-[#021455]"
                            : userType.color === "akili-green"
                            ? "text-[#12B99A]"
                            : "text-orange-500"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg sm:text-xl mb-2 sm:mb-3 font-semibold ${
                        userType.color === "akili-blue"
                          ? "text-[#021455]"
                          : userType.color === "akili-green"
                          ? "text-[#12B99A]"
                          : "text-orange-600"
                      }`}
                    >
                      {userType.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {userType.subtitle}
                    </p>
                  </div>
                  <div className="p-6 pt-0 space-y-4 sm:space-y-6 flex-1 flex flex-col">
                    <p className="text-gray-700 leading-relaxed text-center text-sm sm:text-base flex-1">
                      {userType.description}
                    </p>
                    <div className="space-y-2 sm:space-y-3 pt-4 border-t border-gray-200/50">
                      {userType.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs sm:text-sm text-gray-700 font-medium"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                              userType.color === "akili-blue"
                                ? "bg-[#021455]"
                                : userType.color === "akili-green"
                                ? "bg-[#12B99A]"
                                : "bg-orange-500"
                            }`}
                          ></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center items-center space-x-2 mt-6 sm:mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-6 sm:w-8 h-2.5 sm:h-3 bg-[#021455]"
                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
