"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Zap,
  Target,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/components/language-context";

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
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Calculate total number of slides (groups of 3)
  const totalSlides = userTypes.length - 2;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

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

  return (
    <div className="relative">
      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-akili-blue dark:text-akili-green" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-akili-blue dark:text-akili-green" />
      </button>

      {/* Carousel Container - Fixed to show exactly 3 cards */}
      <div className="overflow-hidden py-6 mx-16">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 33}%)`,
            width: "100%",
            height: "300%",
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full grid grid-cols-3 gap-6 px-4"
            >
              {userTypes
                .slice(slideIndex * 3, slideIndex * 3 + 3)
                .map((userType, index) => {
                  const Icon = userType.icon;
                  return (
                    <Card
                      key={index}
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 min-h-[420px] flex flex-col ${
                        userType.color === "akili-blue"
                          ? "bg-[#021455]/5 dark:bg-[#021455]/20 hover:bg-[#021455]/8 dark:hover:bg-[#021455]/30"
                          : userType.color === "akili-green"
                          ? "bg-[#12B99A]/5 dark:bg-[#12B99A]/20 hover:bg-[#12B99A]/8 dark:hover:bg-[#12B99A]/30"
                          : "bg-orange-500/5 dark:bg-orange-500/20 hover:bg-orange-500/8 dark:hover:bg-orange-500/30"
                      }`}
                    >
                      <CardHeader className="text-center pb-6">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 ${
                            userType.color === "akili-blue"
                              ? "bg-[#021455]/15 group-hover:bg-[#021455]/25 dark:bg-[#021455]/30 dark:group-hover:bg-[#021455]/40"
                              : userType.color === "akili-green"
                              ? "bg-[#12B99A]/15 group-hover:bg-[#12B99A]/25 dark:bg-[#12B99A]/30 dark:group-hover:bg-[#12B99A]/40"
                              : "bg-orange-500/15 group-hover:bg-orange-500/25 dark:bg-orange-500/30 dark:group-hover:bg-orange-500/40"
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              userType.color === "akili-blue"
                                ? "text-[#021455] dark:text-[#021455]"
                                : userType.color === "akili-green"
                                ? "text-[#12B99A] dark:text-[#12B99A]"
                                : "text-orange-500 dark:text-orange-400"
                            }`}
                          />
                        </div>
                        <CardTitle
                          className={`text-xl mb-3 font-semibold ${
                            userType.color === "akili-blue"
                              ? "text-[#021455] dark:text-[#021455]"
                              : userType.color === "akili-green"
                              ? "text-[#12B99A] dark:text-[#12B99A]"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {userType.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          {userType.subtitle}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6 flex-1 flex flex-col">
                        <CardDescription className="text-gray-700 dark:text-gray-200 leading-relaxed text-center text-base flex-1">
                          {userType.description}
                        </CardDescription>
                        <div className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                          {userType.benefits.map((benefit, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-sm text-gray-700 dark:text-gray-200 font-medium"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
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
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Carousel Dots */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 h-3 bg-[#021455] dark:bg-[#12B99A]"
                : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
