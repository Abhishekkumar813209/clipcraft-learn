import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, ChevronDown, Shield, Crown, Landmark, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

const QUOTES = [
  "Discipline is the bridge between goals and accomplishment 💪",
  "UPSC is not about talent, it's about consistency 🎯",
  "2027 mein tera naam hoga IAS toppers mein 🏆",
  "Har din ka effort compound hota hai 📈",
  "Abhi nahi toh kab? Uth aur padh! 🔥",
  "Tu woh hai jo haar ke bhi nahi haarta 🦁",
  "IAS banna hai toh comfort zone chhod de 🚀",
  "Tera sapna bada hai, mehnat bhi badi kar ⚡",
  "Nation builders roz thoda zyada karte hain 🇮🇳",
  "Consistency > Intensity. Roz padh, roz badh 📚",
];

const TARGET_DATE = new Date('2027-05-23T00:00:00+05:30');

function getCountdown() {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const POWER_CARDS = [
  { icon: Shield, emoji: '🔴', title: 'Power', subtitle: 'Tera ek order, system hilega', color: 'from-red-500/20 to-red-900/10' },
  { icon: Crown, emoji: '💰', title: 'Respect', subtitle: 'Salute milega har jagah', color: 'from-amber-500/20 to-amber-900/10' },
  { icon: Landmark, emoji: '🏛️', title: 'Authority', subtitle: 'District tera hoga', color: 'from-blue-500/20 to-blue-900/10' },
  { icon: Globe, emoji: '🇮🇳', title: 'Impact', subtitle: 'Crores ki zindagi badlegi', color: 'from-emerald-500/20 to-emerald-900/10' },
];

function RotatingEmblem() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
      ringRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[2, 0.03, 8, 64]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#f59e0b" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#3b82f6" />
      <RotatingEmblem />
      <Stars radius={50} depth={30} count={80} factor={3} saturation={0.5} fade speed={0.5} />
    </>
  );
}

function PowerCard({ icon: Icon, emoji, title, subtitle, color, delay }: typeof POWER_CARDS[0] & { delay: number }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${color} backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:scale-105 hover:border-white/25`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-3 right-3 text-2xl">{emoji}</div>
      <Icon className="h-8 w-8 text-white/80 mb-4" />
      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{title}</h3>
      <p className="text-base md:text-lg text-white/70 font-medium">{subtitle}</p>
    </div>
  );
}

export default function UpscMotivation() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(getCountdown());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % QUOTES.length);
        setFadeIn(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const countdownBlocks = useMemo(() => [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Min' },
    { value: countdown.seconds, label: 'Sec' },
  ], [countdown]);

  const scrollToSection2 = () => {
    section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-thin">
      {/* Section 1 — 3D Motivation */}
      <section className="relative w-full h-screen snap-start overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
              <Scene />
            </Canvas>
          </Suspense>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
          <div className="absolute top-4 left-4 pointer-events-auto">
            <Button variant="ghost" className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/30" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study
            </Button>
          </div>

          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-8 w-8 text-amber-400 animate-pulse" />
              <Flame className="h-6 w-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              IAS Officer Banne Wala Hai Tu
            </h1>
            <p className="text-lg md:text-xl text-amber-200/70 font-medium">
              UPSC CSE 2027 — Tera Sapna, Teri Mehnat 🇮🇳
            </p>
          </div>

          <div className="flex gap-3 md:gap-5 mb-10">
            {countdownBlocks.map((block) => (
              <div key={block.label} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black/50 backdrop-blur-md border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-900/20">
                  <span className="text-2xl md:text-3xl font-bold text-amber-300 font-mono tabular-nums">
                    {String(block.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-amber-200/50 mt-1.5 uppercase tracking-widest">{block.label}</span>
              </div>
            ))}
          </div>

          <div className="max-w-xl text-center h-16 flex items-center justify-center">
            <p className={`text-lg md:text-xl text-amber-100/90 font-medium italic transition-opacity duration-400 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              "{QUOTES[quoteIndex]}"
            </p>
          </div>

          <div className="mt-8 pointer-events-auto">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-xl shadow-amber-900/40 transition-all hover:scale-105"
            >
              <Flame className="h-5 w-5 mr-2" />
              Ab Padhai Shuru Kar! 🚀
            </Button>
          </div>

          {/* Scroll down indicator */}
          <button onClick={scrollToSection2} className="absolute bottom-8 pointer-events-auto animate-bounce text-amber-300/60 hover:text-amber-300 transition-colors">
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* Section 2 — Power & Respect (Red Beacon) */}
      <section ref={section2Ref} className="relative w-full min-h-screen snap-start overflow-hidden bg-black flex items-center justify-center">
        {/* YouTube background video — Fortuner VIP convoy */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] md:w-[120%] md:h-[120%] pointer-events-none"
            src="https://www.youtube.com/embed/gCbGmAFqLoU?autoplay=1&mute=1&loop=1&playlist=gCbGmAFqLoU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&vq=hd720"
            title="VIP Convoy Background"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 red-beacon-glow" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-red-400/80 uppercase tracking-[0.3em] text-sm font-semibold mb-3">What Awaits You</p>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              IAS Ka <span className="text-red-500">Power</span> 🔴
            </h2>
            <p className="text-lg text-white/50">Fortuner. Red Light. Salute. Authority. Sab tera hoga.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-16">
            {POWER_CARDS.map((card, i) => (
              <PowerCard key={card.title} {...card} delay={i * 150} />
            ))}
          </div>

          <div className="text-center space-y-6">
            <p className="text-2xl md:text-3xl font-bold text-white/90">
              Ye sab tera hoga — <span className="text-amber-400">bas padh le</span> 📚
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold text-lg px-10 py-6 rounded-xl shadow-xl shadow-red-900/50 transition-all hover:scale-105"
            >
              🔥 Padhai Pe Chal — Ab Bahut Ho Gaya
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
