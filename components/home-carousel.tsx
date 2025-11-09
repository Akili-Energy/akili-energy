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
      "Analysez la concurrence, suivez les pipelines de projets et identifiez les opportunités de partenariat pour maximiser vos investissements.",
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
      "Évaluez les dynamiques de marché, suivez les performances de portefeuille et identifiez les opportunités d'investissement stratégiques.",
    benefits: [
      "Analyse ROI détaillée",
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
      "Suivez les projets à venir, surveillez les concurrents et identifiez les opportunités de développement dans le secteur énergétique.",
    benefits: [
      "Pipeline de projets détaillé",
      "Suivi concurrentiel avancé",
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
      "Accédez à la veille sectorielle, explorez les projets en temps réel et montez en compétence sur les tendances énergétiques mondiales.",
    benefits: [
      "Veille sectorielle complète",
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

  // Background color classes with proper dark mode variants
  const getBackgroundClass = (color: string) => {
    const baseClasses =
      "min-h-[380px] flex flex-col transition-all duration-300";

    if (color === "akili-blue") {
      return `${baseClasses} bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/30`;
    } else if (color === "akili-green") {
      return `${baseClasses} bg-green-50/80 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/30`;
    } else {
      return `${baseClasses} bg-orange-50/80 dark:bg-orange-950/30 border-orange-200/50 dark:border-orange-800/30`;
    }
  };

  const getHoverClass = (color: string) => {
    if (color === "akili-blue") {
      return "hover:border-akili-blue/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/40";
    } else if (color === "akili-green") {
      return "hover:border-akili-green/40 hover:bg-green-100/90 dark:hover:bg-green-900/40";
    } else {
      return "hover:border-akili-orange/40 hover:bg-orange-100/90 dark:hover:bg-orange-900/40";
    }
  };

  return (
    <div className="relative">
      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-600"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-akili-blue dark:text-akili-green" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-600"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-akili-blue dark:text-akili-green" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden py-8 mx-16">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 33}%)`,
            width: "100%",
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full grid grid-cols-3 gap-8 px-4"
            >
              {userTypes
                .slice(slideIndex * 3, slideIndex * 3 + 3)
                .map((userType, index) => {
                  const Icon = userType.icon;
                  const backgroundClass = getBackgroundClass(userType.color);
                  const hoverClass = getHoverClass(userType.color);

                  return (
                    <Card
                      key={index}
                      className={`border-2 shadow-lg hover:shadow-xl transition-all duration-500 group hover:scale-105 ${backgroundClass} ${hoverClass}`}
                    >
                      <CardHeader className="text-center pb-6 pt-8">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                            userType.color === "akili-blue"
                              ? "bg-akili-blue/15 group-hover:bg-akili-blue/20"
                              : userType.color === "akili-green"
                              ? "bg-akili-green/15 group-hover:bg-akili-green/20"
                              : "bg-akili-orange/15 group-hover:bg-akili-orange/20"
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              userType.color === "akili-blue"
                                ? "text-akili-blue"
                                : userType.color === "akili-green"
                                ? "text-akili-green"
                                : "text-akili-orange"
                            }`}
                          />
                        </div>
                        <CardTitle className="text-xl mb-3 text-akili-blue dark:text-akili-green font-bold">
                          {userType.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                          {userType.subtitle}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6 flex-1">
                        <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed text-center text-base">
                          {userType.description}
                        </CardDescription>
                        <div className="space-y-3">
                          {userType.benefits.map((benefit, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                                  userType.color === "akili-blue"
                                    ? "bg-akili-blue"
                                    : userType.color === "akili-green"
                                    ? "bg-akili-green"
                                    : "bg-akili-orange"
                                }`}
                              ></div>
                              <span className="font-medium">{benefit}</span>
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
      <div className="flex justify-center items-center space-x-2 mt-10">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 h-3 bg-akili-blue dark:bg-akili-green shadow-md"
                : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
