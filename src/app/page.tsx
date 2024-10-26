"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Sparkles, Lock, Github, Check, Clock } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black">
      <WavyBackground 
        className="absolute inset-0 min-h-screen w-full py-16 lg:py-24"
        colors={["#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#1e3a8a"]}
        waveWidth={50}
        backgroundFill="black"
        blur={10}
        speed="fast"
        waveOpacity={2}
      >
        <main className="container mx-auto px-4 overflow-x-hidden relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-6 md:gap-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-950/30 backdrop-blur-sm px-4 py-2 text-sm text-blue-200"
            >
              <span>Forms, but make them trustless ✨</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>

            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white font-mono"
            >
              Trust through
              <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent"> verification</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl text-base md:text-lg text-blue-100/80 font-mono px-4"
            >
              Because sometimes you need proof that someone's actually got the skills they say they do. 
              We verify it all, keeping it private and simple.
            </motion.p>

            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/formCreate" passHref>
                  <Button
                    size="lg"
                    className="bg-blue-600/80 backdrop-blur-sm text-white hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="https://github.com/AazimAnish/ProoForm" target="_blank">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-800/50 backdrop-blur-sm text-blue-600 hover:bg-blue-950/30 w-full sm:w-auto"
                  >
                    Star on GitHub
                    <Github className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 w-full max-w-4xl px-4"
            >
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6" />,
                  title: "Verified Truth",
                  description: "No more guessing games. We check what matters."
                },
                {
                  icon: <Lock className="h-6 w-6" />,
                  title: "Privacy First",
                  description: "Your data stays yours. We just verify it."
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Easy Setup",
                  description: "Integration so smooth, it feels like magic."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 md:p-6 rounded-xl border border-blue-800/20 bg-blue-800/20 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block text-blue-500"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2 font-mono">{feature.title}</h3>
                  <p className="text-blue-100/70 text-sm font-mono">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 w-full max-w-2xl bg-blue-950/30 backdrop-blur-sm rounded-xl border border-blue-800/20 p-4 md:p-6 mx-4"
            >
              <h2 className="text-xl md:text-2xl font-bold text-blue-300 mb-4 md:mb-6 font-mono">Project Progress 🚀</h2>
              <div className="grid gap-3 text-left">
                {[
                  { done: true, feature: "GitHub repo verification" },
                  { done: true, feature: "Contribution count verification" },
                  { done: true, feature: "Social media authentication" },
                  { done: false, feature: "GitHub star count verification" },
                  { done: false, feature: "Twitter follower count" },
                  { done: false, feature: "Instagram story views" },
                  { done: false, feature: "LinkedIn connections" },
                  { done: false, feature: "Discord server members" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 text-blue-100/80 font-mono text-sm md:text-base"
                  >
                    {item.done ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    )}
                    <span>{item.feature}</span>
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-3 text-blue-100/80 font-mono text-sm md:text-base"
                >
                  <span className="text-xl">∞</span>
                  <span>More integrations coming soon...</span>
                </motion.div>
              </div>
            </motion.div> */}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 text-blue-200 font-mono text-sm px-4"
            >
              <span>Open Source</span>
              <span className="hidden md:inline">•</span>
              <span>Privacy Focused</span>
              <span className="hidden md:inline">•</span>
              <span>Community Driven</span>
            </motion.div>
          </motion.div>
        </main>
      </WavyBackground>
    </div>
  );
}