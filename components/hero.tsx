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
  Bell,
  FileText,
  Maximize,
  MoreVertical,
  Search,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/components/language-context"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { AkiliLogo } from "@/components/akili-logo";
import { WaveAnimation } from "@/components/wave-animation"
import DemoInteractiveMap from "@/components/demo-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table"

export default function LandingPage() {
  const { t } = useLanguage()
  const [showTypewriter, setShowTypewriter] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroAnimated, setHeroAnimated] = useState(false)

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

  return (
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-akili min-h-[90vh] flex items-center"
      >
        <WaveAnimation /> {/* Integrate the WaveAnimation component */}
        <div className="absolute inset-0 opacity-20">
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%2312B99A" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)]'></div>
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
                    <TypewriterEffect
                      text={t("home.hero.title")}
                      speed={50}
                      className="inline"
                    />
                  ) : (
                    <span className="opacity-0">{t("home.hero.title")}</span>
                  )}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in-up delay-500">
                  {t("home.hero.subtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-1500 pt-6">
                <Button
                  size="lg"
                  className="bg-akili-green hover:bg-akili-green/90 text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/platform">
                    {t("home.hero.cta.primary")}{" "}
                    <ArrowRight className="ml-2 w-5 h-5" />
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
              <div
                className={`space-y-6 transition-all duration-1000 ${
                  heroAnimated ? "transform-gpu" : ""
                }`}
              >
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {t("home.hero.cards.deal_analysis")}
                      </h3>
                      <Badge className="bg-akili-green/10 text-akili-green animate-pulse">
                        Live
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-akili-blue/5 to-akili-green/5 rounded-lg hover:from-akili-blue/10 hover:to-akili-green/10 transition-all duration-300">
                        <div>
                          <p className="font-medium text-sm">
                            {t("home.hero.cards.ma_solar")}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Afrique du Sud
                          </p>
                        </div>
                        <span className="font-bold text-akili-green">
                          $38.4M
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-akili-blue/5 to-akili-green/5 rounded-lg hover:from-akili-blue/10 hover:to-akili-green/10 transition-all duration-300">
                        <div>
                          <p className="font-medium text-sm">
                            {t("home.hero.cards.hydro_financing")}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Madagascar
                          </p>
                        </div>
                        <span className="font-bold text-akili-green">
                          $600M
                        </span>
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("home.hero.cards.project_pipeline")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("projects.stages.in_construction")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-akili-green h-2 rounded-full w-3/4 animate-pulse"></div>
                          </div>
                          <span className="text-sm font-medium">2.5 GW</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("projects.stages.operational")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-akili-orange h-2 rounded-full w-1/2 animate-pulse delay-300"></div>
                          </div>
                          <span className="text-sm font-medium">1.8 GW</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("projects.stages.in_development")}
                        </span>
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("home.hero.cards.market_intelligence")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-akili-blue/10 rounded-lg hover:bg-akili-blue/20 transition-all duration-300">
                        <div className="text-lg font-bold text-akili-blue">
                          42%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t("home.hero.cards.yoy_growth")}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-akili-green/10 rounded-lg hover:bg-akili-green/20 transition-all duration-300">
                        <div className="text-lg font-bold text-akili-green">
                          $12.5B
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t("home.hero.cards.investments")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        );
}
