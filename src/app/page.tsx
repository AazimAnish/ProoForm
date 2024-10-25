"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Sparkles, Lock } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  return (
    <div className="min-h-screen">
      <WavyBackground 
        className="min-h-screen flex items-center justify-center"
        colors={["#dc2626", "#991b1b", "#7f1d1d", "#450a0a", "#b91c1c"]}
        waveWidth={50}
        backgroundFill="black"
        blur={10}
        speed="fast"
        waveOpacity={2}
      >
        <main className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-red-800 bg-red-950/30 backdrop-blur-sm px-4 py-2 text-sm text-red-200"
            >
              <span>Introducing ProofForm</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>

            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Create forms that verify what
              <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent"> really matters</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl text-lg text-red-100/80"
            >
              Build customizable forms with automatic verification of users' online credentials. From GitHub repos to social metrics - validate eligibility while preserving privacy.
            </motion.p>

            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-4 sm:flex-row sm:gap-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-red-600/80 backdrop-blur-sm text-white hover:bg-red-700"
                  onClick={() => console.log("Get Started clicked")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-800/50 backdrop-blur-sm text-red-600 hover:bg-red-950/30"
                  onClick={() => console.log("Learn More clicked")}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl"
            >
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6" />,
                  title: "Secure Verification",
                  description: "End-to-end encrypted verification process"
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Privacy First",
                  description: "Zero knowledge proofs for user privacy"
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Seamless Integration",
                  description: "Easy to implement with any platform"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-xl border border-red-800/20 bg-red-800/20 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block text-red-500"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">{feature.title}</h3>
                  <p className="text-red-100/70 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-8 text-red-200"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Lock className="h-5 w-5" />
                <span>100% Secure</span>
              </motion.div>
              {/* <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                <span>10k+ Users</span>
              </motion.div> */}
            </motion.div>
          </motion.div>
        </main>
      </WavyBackground>
    </div>
  );
}
