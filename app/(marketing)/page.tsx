"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calculator,
  Database,
  Zap,
  Target,
  DollarSign,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Calendar,
  Leaf,
  ExternalLink,
  Activity,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/components/language-context"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { AkiliLogo } from "@/components/akili-logo";
import { WaveAnimation } from "@/components/wave-animation"

export default function LandingPage() {
  const { t, language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTypewriter, setShowTypewriter] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [heroAnimated, setHeroAnimated] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Hero animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimated(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Trigger typewriter effect on load
    const timer = setTimeout(() => setShowTypewriter(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Intersection observer for scroll-based replay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and replay animations when scrolling back to top
            setShowTypewriter(false);
            setHeroAnimated(false);
            setTimeout(() => {
              setShowTypewriter(true);
              setHeroAnimated(true);
            }, 1000);
          }
        })
      },
      { threshold: 0.5 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const userTypes = [
    {
      icon: Target,
      title: "Deal Advisors",
      subtitle: "Conseil M&A & Stratégique",
      description:
        "Identifiez les opportunités d'acquisition, benchmarkez les valorisations et accédez aux données de transactions comparables.",
      benefits: ["Benchmarking des transactions", "Cartographie des opportunités", "Analyse de valorisation"],
      color: "akili-blue",
    },
    {
      icon: Zap,
      title: "Développeurs/IPPs",
      subtitle: "Producteurs Indépendants",
      description:
        "Analysez la concurrence, suivez les pipelines de projets et identifiez les opportunités de partenariat.",
      benefits: ["Intelligence concurrentielle", "Suivi de pipeline", "Identification de partenaires"],
      color: "akili-green",
    },
    {
      icon: DollarSign,
      title: "Investisseurs",
      subtitle: "Fonds & Institutions",
      description:
        "Évaluez les dynamiques de marché, suivez les performances de portefeuille et identifiez les opportunités.",
      benefits: ["Analyse ROI", "Suivi de portefeuille", "Sourcing de deals"],
      color: "akili-orange",
    },
    {
      icon: Building2,
      title: "EPC/O&M",
      subtitle: "Ingénierie & Construction",
      description:
        "Suivez les projets à venir, surveillez les concurrents et identifiez les opportunités de développement.",
      benefits: ["Pipeline de projets", "Suivi concurrentiel", "Expansion marché"],
      color: "akili-blue",
    },
    {
      icon: Users,
      title: "Particuliers",
      subtitle: "Professionnels & Passionnés",
      description:
        "Accédez à la veille sectorielle, explorez les projets en temps réel et montez en compétence sur les tendances énergétiques.",
      benefits: ["Veille sectorielle", "Exploration interactive", "Analyse des tendances"],
      color: "akili-green",
    },
  ]

  const features = [
    {
      icon: Database,
      title: "Base de Données Complète",
      description:
        "Plus de 10,000 transactions et 500+ profils d'entreprises à travers l'Afrique.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: BarChart3,
      title: "Analyses Avancées",
      description:
        "Outils analytiques puissants pour identifier les tendances et opportunités de marché.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Calculator,
      title: "Simulateur Financier",
      description:
        "Modélisation financière interactive pour évaluer l'économie des projets.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Globe,
      title: "Couverture Géographique",
      description:
        "Données complètes sur 54 pays africains avec analyses régionales détaillées.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const projectSectors = [
    {
      title: "Énergie Solaire",
      description: "Projets photovoltaïques et thermiques à travers l'Afrique",
      stats: "2,847 projets • 15.2 GW",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Solar energy installation in Africa",
    },
    {
      title: "Énergie Éolienne",
      description: "Parcs éoliens terrestres et offshore",
      stats: "1,234 projets • 8.7 GW",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Wind turbines in African landscape",
    },
    {
      title: "Hydroélectricité",
      description: "Barrages et centrales hydroélectriques",
      stats: "892 projets • 12.1 GW",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Hydroelectric dam in Africa",
    },
    {
      title: "Biomasse & Biogaz",
      description: "Valorisation des déchets organiques",
      stats: "456 projets • 2.3 GW",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Biomass energy facility in Africa",
    },
    {
      title: "Stockage d'Énergie",
      description: "Solutions de stockage et réseaux intelligents",
      stats: "234 projets • 1.8 GWh",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Energy storage facility in Africa",
    },
    {
      title: "Efficacité Énergétique",
      description: "Optimisation et réduction de consommation",
      stats: "1,567 projets • 890 MW économisés",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Energy efficiency project in Africa",
    },
  ]

  const recentDeals = [
    {
      company: "AMEA Power",
      deal: "500 MW Abydos Solar Plant",
      country: "Egypt",
      amount: "$500M",
      status: "Project",
      type: "Operational",
    },
    {
      company: "EDF Renewables",
      deal: "120 MW Volobe Hydropower",
      country: "Madagascar",
      amount: "$600M",
      status: "Financing",
      type: "Development",
    },
    {
      company: "Gaia Renewables",
      deal: "Renewable Assets Acquisition",
      country: "South Africa",
      amount: "$38.4M",
      status: "M&A",
      type: "Completed",
    },
  ]

  const recentNews = [
    {
      id: 1,
      title: "AMEA Power Commissions 500 MW Abydos Solar Plant",
      type: "Project Update",
      date: "14 Dec 2024",
      isResearch: false,
    },
    {
      id: 2,
      title: "Q1 2025 African Energy Investment Report",
      type: "Research",
      date: "15 Mar 2025",
      isResearch: true,
      fileSize: "2.4 MB",
    },
    {
      id: 3,
      title: "New Mini-Grid Regulation in Nigeria",
      type: "Policy Brief",
      date: "21 Mar 2025",
      isResearch: true,
      fileSize: "1.8 MB",
    },
  ]

  // Calculate total number of slides (groups of 3)
  const totalSlides = userTypes.length - 2

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalSlides])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-akili min-h-[90vh] flex items-center">
        <WaveAnimation /> {/* Integrate the WaveAnimation component */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2312B99A&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-akili-green/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-akili-orange/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="space-y-6 pb-6">
                <Badge className="bg-akili-green/20 text-akili-green border border-akili-green/30 hover:bg-akili-green/30 text-sm px-4 py-2 animate-bounce">
                  {t("home.chip")}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {showTypewriter ? (
                    <TypewriterEffect text={t("home.hero.title")} speed={50} className="inline" />
                  ) : (
                    <span className="opacity-0">{t("home.hero.title")}</span>
                  )}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in-up delay-500">
                  {t("home.hero.subtitle")}
                </p>
              </div>

              {/* <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center animate-fade-in-up delay-700">
                  <div className="text-2xl lg:text-3xl font-bold text-akili-green">
                    {isLoading ? "..." : (stats.deals || 0).toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">Transactions Suivies</div>
                </div>
                <div className="text-center animate-fade-in-up delay-1000">
                  <div className="text-2xl lg:text-3xl font-bold text-akili-orange">54</div>
                  <div className="text-sm text-gray-400">Pays Couverts</div>
                </div>
                <div className="text-center animate-fade-in-up delay-1300">
                  <div className="text-2xl lg:text-3xl font-bold text-akili-green">
                    {isLoading ? "..." : (stats.projects || 0).toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">Projets Actifs</div>
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-1500 pt-6">
                <Button
                  size="lg"
                  className="bg-akili-green hover:bg-akili-green/90 text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/platform">
                    {t("home.hero.cta.primary")} <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-akili-blue border-2 border-white hover:bg-akili-blue hover:text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">{t("home.hero.cta.secondary")}</Link>
                </Button>
              </div>
            </div>

            {/* Hero Cards Stack with Enhanced Animation */}
            <div className="relative">
              <div className={`space-y-6 transition-all duration-1000 ${heroAnimated ? "transform-gpu" : ""}`}>
                {/* First Card - Deal Analytics */}
                <div
                  className={`relative z-30 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-1000 hover:scale-105 ${
                    heroAnimated
                      ? "rotate-2 translate-y-0 opacity-100 animate-float"
                      : "rotate-0 translate-y-20 opacity-0"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t("home.hero.cards.deal_analysis")}</h3>
                      <Badge className="bg-akili-green/10 text-akili-green animate-pulse">Live</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-akili-blue/5 to-akili-green/5 rounded-lg hover:from-akili-blue/10 hover:to-akili-green/10 transition-all duration-300">
                        <div>
                          <p className="font-medium text-sm">{t("home.hero.cards.ma_solar")}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Afrique du Sud</p>
                        </div>
                        <span className="font-bold text-akili-green">$38.4M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-akili-blue/5 to-akili-green/5 rounded-lg hover:from-akili-blue/10 hover:to-akili-green/10 transition-all duration-300">
                        <div>
                          <p className="font-medium text-sm">{t("home.hero.cards.hydro_financing")}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Madagascar</p>
                        </div>
                        <span className="font-bold text-akili-green">$600M</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Card - Project Pipeline */}
                <div
                  className={`relative z-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-1000 delay-300 hover:scale-105 ${
                    heroAnimated
                      ? "-rotate-1 -mt-4 ml-8 opacity-100 animate-float-delayed"
                      : "rotate-0 mt-0 ml-0 opacity-0"
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t("home.hero.cards.project_pipeline")}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("projects.stages.in_construction")}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-akili-green h-2 rounded-full w-3/4 animate-pulse"></div>
                          </div>
                          <span className="text-sm font-medium">2.5 GW</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("projects.stages.operational")}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-akili-orange h-2 rounded-full w-1/2 animate-pulse delay-300"></div>
                          </div>
                          <span className="text-sm font-medium">1.8 GW</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("projects.stages.in_development")}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-akili-blue h-2 rounded-full w-2/3 animate-pulse delay-500"></div>
                          </div>
                          <span className="text-sm font-medium">3.2 GW</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Card - Market Intelligence */}
                <div
                  className={`relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-1000 delay-500 hover:scale-105 ${
                    heroAnimated
                      ? "rotate-1 -mt-4 mr-8 opacity-100 animate-float-reverse"
                      : "rotate-0 mt-0 mr-0 opacity-0"
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t("home.hero.cards.market_intelligence")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-akili-blue/10 rounded-lg hover:bg-akili-blue/20 transition-all duration-300">
                        <div className="text-lg font-bold text-akili-blue">42%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t("home.hero.cards.yoy_growth")}</div>
                      </div>
                      <div className="text-center p-3 bg-akili-green/10 rounded-lg hover:bg-akili-green/20 transition-all duration-300">
                        <div className="text-lg font-bold text-akili-green">
                          $12.5B
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t("home.hero.cards.investments")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section - Enhanced Carousel */}
      <section className="py-20 bg-gradient-soft dark:bg-gradient-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              {t("home.carousel.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("home.carousel.subtitle")}
            </p>
          </div>

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
                  height: "300%"
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="flex-shrink-0 w-full grid grid-cols-3 gap-6 px-4">
                    {userTypes.slice(slideIndex * 3, slideIndex * 3 + 3).map((userType, index) => {
                      const Icon = userType.icon
                      return (
                        <Card
                          key={index}
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-akili-green/20 bg-white dark:bg-gray-800 hover:scale-105"
                        >
                          <CardHeader className="text-center pb-4">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                                userType.color === "akili-blue"
                                  ? "bg-akili-blue/10 group-hover:bg-akili-blue/20"
                                  : userType.color === "akili-green"
                                    ? "bg-akili-green/10 group-hover:bg-akili-green/20"
                                    : "bg-akili-orange/10 group-hover:bg-akili-orange/20"
                              }`}
                            >
                              <Icon
                                className={`w-7 h-7 ${
                                  userType.color === "akili-blue"
                                    ? "text-akili-blue"
                                    : userType.color === "akili-green"
                                      ? "text-akili-green"
                                      : "text-akili-orange"
                                }`}
                              />
                            </div>
                            <CardTitle className="text-lg mb-2 text-akili-blue dark:text-akili-green">
                              {userType.title}
                            </CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{userType.subtitle}</p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-center text-sm">
                              {userType.description}
                            </CardDescription>
                            <div className="space-y-2">
                              {userType.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                      userType.color === "akili-blue"
                                        ? "bg-akili-blue"
                                        : userType.color === "akili-green"
                                          ? "bg-akili-green"
                                          : "bg-akili-orange"
                                    }`}
                                  ></div>
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
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
                      ? "w-8 h-3 bg-akili-blue dark:bg-akili-green"
                      : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - White Background */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              Plateforme d'Intelligence Énergétique Complète
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour prendre des décisions éclairées dans le secteur énergétique africain
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-card hover:scale-105"
                >
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-3 text-akili-blue dark:text-akili-green group-hover:text-akili-green dark:group-hover:text-akili-blue transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same... */}
      {/* Akili Platform Section */}
      <section className="py-20 bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              La Plateforme Akili Energy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Une interface intuitive pour accéder à toute l'intelligence du marché énergétique africain
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-akili-blue text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-akili-green rounded flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Akili Energy Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-akili-green text-white">Live Data</Badge>
                  <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b">
                <div className="flex space-x-8 text-sm">
                  <span className="text-akili-blue dark:text-akili-green font-medium border-b-2 border-akili-blue dark:border-akili-green pb-2">
                    Dashboard
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green cursor-pointer">
                    Deals
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green cursor-pointer">
                    Projects
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green cursor-pointer">
                    Companies
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green cursor-pointer">
                    Simulator
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-6">
                  <Card className="p-4 text-center bg-akili-blue/5 border-akili-blue/20">
                    <div className="text-2xl font-bold text-akili-blue dark:text-akili-green">10,247</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
                  </Card>
                  <Card className="p-4 text-center bg-akili-green/5 border-akili-green/20">
                    <div className="text-2xl font-bold text-akili-green">2,856</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
                  </Card>
                  <Card className="p-4 text-center bg-akili-orange/5 border-akili-orange/20">
                    <div className="text-2xl font-bold text-akili-orange">542</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Companies</div>
                  </Card>
                  <Card className="p-4 text-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">$12.5B</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="font-semibold text-akili-blue dark:text-akili-green mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Energy Deals
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left py-3 px-2">Deal Name</th>
                          <th className="text-left py-3 px-2">Company</th>
                          <th className="text-left py-3 px-2">Country</th>
                          <th className="text-left py-3 px-2">Value</th>
                          <th className="text-left py-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDeals.map((deal, index) => (
                          <tr
                            key={index}
                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-2 font-medium text-akili-blue dark:text-akili-green">{deal.deal}</td>
                            <td className="py-3 px-2">{deal.company}</td>
                            <td className="py-3 px-2">{deal.country}</td>
                            <td className="py-3 px-2 font-semibold text-akili-green">{deal.amount}</td>
                            <td className="py-3 px-2">
                              <Badge className="bg-akili-green/10 text-akili-green">{deal.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              <Button className="bg-akili-green hover:bg-akili-green/90 text-white shadow-lg" asChild>
                <Link href="/platform">
                  Access Platform <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Geographic Intelligence & Project Sectors Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              Intelligence Géographique
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Cartographie complète des opportunités énergétiques à travers l'Afrique
            </p>
          </div>

          {/* African Map with Regional Markers */}
          <div className="relative mb-16">
            <div className="bg-gradient-to-br from-akili-blue/5 to-akili-green/5 rounded-3xl p-8 shadow-lg">
              <div className="relative w-full max-w-4xl mx-auto">
                {/* Stylized Africa Map SVG */}
                <div className="relative w-full h-128 flex items-center justify-center">
                  {/* <svg
                    viewBox="0 0 400 500"
                    className="w-full h-full max-w-md"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M200 50C220 45 240 50 260 60C280 70 300 85 315 105C325 120 330 140 335 160C340 180 345 200 350 220C355 240 360 260 355 280C350 300 340 320 325 335C310 350 290 360 270 365C250 370 230 370 210 365C190 360 170 350 155 335C140 320 130 300 125 280C120 260 125 240 130 220C135 200 140 180 145 160C150 140 155 120 165 105C180 85 200 70 200 50Z"
                      fill="url(#africaGradient)"
                      stroke="#12b99a"
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                    <defs>
                      <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#021455" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#12b99a" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                  </svg> */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/66/Blank_Map-Africa.svg"
                    alt="Africa Map SVG"
                    height="500"
                    width="480"
                  />

                  {/* Regional Markers */}
                  {/* North Africa */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 bg-akili-blue rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                  </div>

                  {/* West Africa */}
                  <div className="absolute top-32 left-1/4 transform -translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-4 h-4 bg-akili-green rounded-full animate-pulse shadow-lg border-2 border-white"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>

                  {/* Central Africa */}
                  <div className="absolute top-40 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-4 h-4 bg-akili-orange rounded-full animate-pulse shadow-lg border-2 border-white"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>

                  {/* East Africa */}
                  <div className="absolute top-32 right-1/4 transform translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-4 h-4 bg-akili-blue rounded-full animate-pulse shadow-lg border-2 border-white"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>

                  {/* Southern Africa */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-4 h-4 bg-akili-green rounded-full animate-pulse shadow-lg border-2 border-white"
                      style={{ animationDelay: "2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Sector Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Solar Energy Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="aspect-[9/16] relative">
                <Image
                  src="/images/solar.jpg"
                  alt="Solar energy professionals working on solar panels in Africa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Énergie Solaire</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">15.2 GW Installés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wind Energy Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="aspect-[9/16] relative">
                <Image
                  src="/images/wind-farm.jpg"
                  alt="Wind energy engineers at wind turbine site in Africa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Énergie Éolienne</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">8.7 GW Installés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hydroelectric Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="aspect-[9/16] relative">
                <Image
                  src="/images/hydropower.jpg"
                  alt="Hydroelectric dam engineers in control room in Africa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <Database className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Hydroélectricité</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">12.1 GW Installés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biomass Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="aspect-[9/16] relative">
                <Image
                  src="/images/bioenergy.jpg"
                  alt="Biomass energy facility workers in Africa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Biomasse</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2.3 GW Installés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Storage Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="aspect-[9/16] relative">
                <Image
                  src="/images/storage.jpg"
                  alt="Energy storage facility technicians in Africa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Stockage d'Énergie</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1.8 GWh Installés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts Section */}
      <section className="py-20 bg-gradient-soft dark:bg-gradient-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">Key Facts</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive data coverage across Africa's energy ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Profiles */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-blue/5 to-akili-green/5 border-akili-blue/20">
              <CardContent className="p-8">
                <Link href="/platform/companies" className="block">
                  <div className="w-16 h-16 bg-akili-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-blue/20 transition-colors duration-300">
                    <Building2 className="w-8 h-8 text-akili-blue" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-blue mb-2">500+</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Company Profiles</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Energy companies across Africa</p>
                </Link>
              </CardContent>
            </Card>

            {/* Project Profiles */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-green/5 to-akili-orange/5 border-akili-green/20">
              <CardContent className="p-8">
                <Link href="/platform/projects" className="block">
                  <div className="w-16 h-16 bg-akili-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-green/20 transition-colors duration-300">
                    <Zap className="w-8 h-8 text-akili-green" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-green mb-2">2,856</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Project Profiles</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Active energy infrastructure projects</p>
                </Link>
              </CardContent>
            </Card>

            {/* Total Deals */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-orange/5 to-akili-blue/5 border-akili-orange/20">
              <CardContent className="p-8">
                <Link href="/platform/deals" className="block">
                  <div className="w-16 h-16 bg-akili-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-orange/20 transition-colors duration-300">
                    <BarChart3 className="w-8 h-8 text-akili-orange" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-orange mb-2">10,247</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Total Deals</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Transactions tracked since inception</p>
                </Link>
              </CardContent>
            </Card>

            {/* Project Finance 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-blue/5 to-akili-green/5 border-akili-blue/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=financing" className="block">
                  <div className="w-16 h-16 bg-akili-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-blue/20 transition-colors duration-300">
                    <DollarSign className="w-8 h-8 text-akili-blue" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-blue mb-2">$12.5B+</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Project Finance in 2025</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total financing deals this year</p>
                </Link>
              </CardContent>
            </Card>

            {/* M&A Deals 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-green/5 to-akili-orange/5 border-akili-green/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=ma" className="block">
                  <div className="w-16 h-16 bg-akili-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-green/20 transition-colors duration-300">
                    <Target className="w-8 h-8 text-akili-green" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-green mb-2">247</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">M&A Deals in 2025</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mergers & acquisitions this year</p>
                </Link>
              </CardContent>
            </Card>

            {/* Green Bond Deals 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-orange/5 to-akili-blue/5 border-akili-orange/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=green-bonds" className="block">
                  <div className="w-16 h-16 bg-akili-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-orange/20 transition-colors duration-300">
                    <Leaf className="w-8 h-8 text-akili-orange" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-orange mb-2">$3.8B+</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Green Bond Deals in 2025</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sustainable financing this year</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Research Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
                Actualités & Recherche
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Restez informé des dernières tendances du marché énergétique africain
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-akili-blue text-akili-blue hover:bg-akili-blue hover:text-white dark:border-akili-green dark:text-akili-green dark:hover:bg-akili-green"
            >
              <Link href="/research">Voir tout</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentNews.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-all duration-300 bg-card hover:scale-105">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-akili-blue/10 to-akili-green/10 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-akili-blue dark:text-akili-green mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{news.type}</p>
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-akili-blue text-white">{news.type}</Badge>
                  {news.isResearch && (
                    <Badge className="absolute top-3 right-3 bg-akili-green text-white text-xs">{news.fileSize}</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{news.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{news.date}</span>
                    </div>
                    {news.isResearch ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-akili-green text-akili-green hover:bg-akili-green hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/research/${news.id}`}>Read More</Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-akili">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-5xl font-bold">Prêt à Accélérer Votre Stratégie Énergétique ?</h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              Rejoignez les entreprises et professionnels qui font confiance à Akili Energy pour leurs décisions
              d'investissement dans le secteur énergétique africain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-akili-green hover:bg-akili-green/90 text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/platform">
                  Explorer les transactions <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-akili-blue border-2 border-white hover:bg-akili-blue hover:text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact">Demander une démo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-akili-blue text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AkiliLogo />
                <span className="text-xl font-bold">
                  <span className="text-white">Akili</span><span className="text-akili-green">Energy</span>
                </span>
              </div>
              <p className="text-gray-300">Intelligence stratégique pour le secteur énergétique africain.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-akili-green transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-akili-green transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-akili-green transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/platform" className="hover:text-white transition-colors">
                    Tableau de Bord
                  </Link>
                </li>
                <li>
                  <Link href="/platform/deals" className="hover:text-white transition-colors">
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link href="/platform/projects" className="hover:text-white transition-colors">
                    Projets
                  </Link>
                </li>
                <li>
                  <Link href="/platform/companies" className="hover:text-white transition-colors">
                    Entreprises
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/research" className="hover:text-white transition-colors">
                    Recherche
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-300">
                <p>contact@akilienergy.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-akili-blue/30 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Akili Energy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
