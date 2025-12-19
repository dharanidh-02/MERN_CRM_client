import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PremiumButton from '../../components/common/PremiumButton';
import GradientText from '../../components/common/GradientText';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaAward, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Silk from '../Silk/Silk';
import PixelCard from '../PixelCard/PixelCard';

// Inline simple card if SpotlightCard is complex to adapt quickly, or import if adaptable. 
// Let's use a custom dark card here for full control.
const FeatureCard = ({ icon, title, description, variant = "default" }) => (
    <PixelCard variant={variant} className="h-full min-h-[300px] w-full bg-[#0a0a16]">
        <div className="relative h-full p-8 flex flex-col items-start justify-center">
            <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-3xl mb-6 text-white backdrop-blur-md border border-white/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
        </div>
    </PixelCard>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#020617] overflow-x-hidden selection:bg-blue-500/30">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-40 z-10 w-full overflow-hidden">

                    <div
                        className="pointer-events-none"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            borderRadius: 32,
                            overflow: 'hidden',
                        }}
                    >
                        <Silk
                            speed={5}
                            scale={1.2}
                            color="#4b2cff"      // try a strong purple
                            noiseIntensity={1.2}
                            rotation={-0.6}
                        />
                    </div>

                    {/* Gradient Fallbacks */}
                    <div className="absolute top-0 inset-x-0 h-[600px] w-full bg-[#020617] -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-[100%] blur-[100px] animate-pulse"></div>
                        <div className="absolute top-20 left-1/3 w-[600px] h-[400px] bg-cyan-600/10 rounded-[100%] blur-[80px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8 backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Next-Gen Campus Intelligence
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none mb-8">
                            Administer with <br />
                            <span className="text-white drop-shadow-lg">
                                Absolute Power
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed">
                            A futuristic CRM designed for elite institutions.
                            Automate workflows, track real-time analytics, and empower your faculty.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

                            <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full border border-blue-600 hover:bg-blue-700 transition-colors">
                                Login
                            </Link>
                            <Link to="/enquiry" className="px-8 py-3 bg-white/10 text-white font-medium rounded-full border border-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                Enquiry
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="py-24 relative z-10 bg-[#020617]/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Pioneering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Future of Education</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                Founded with a vision to eliminate administrative friction, our platform serves as the neural backbone for modern educational institutions. We believe that technology should be invisible—empowering educators and students to focus purely on learning and growth.
                            </p>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                From real-time academic tracking to seamless communication channels, we bridge the gap between complex data and intuitive decision-making.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">50+</span>
                                    <span className="text-sm text-blue-400 uppercase tracking-widest">Institutions</span>
                                </div>
                                <div className="w-px bg-gray-700 h-12 self-center mx-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">10k+</span>
                                    <span className="text-sm text-blue-400 uppercase tracking-widest">Students</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl -z-10 transform rotate-3"></div>
                            <div className="bg-[#0f172a] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-300">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FaRocket size={100} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                                <p className="text-gray-400 mb-6">
                                    To architect a digital ecosystem where administrative efficiency meets academic excellence. We supply the tools; you supply the brilliance.
                                </p>
                                <div className="space-y-3">
                                    {['Zero Latency Operations', 'AI-Driven Insights', 'Bank-Grade Security'].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 text-gray-300">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-32 relative bg-[#020617]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Unmatched Capabilities</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                                Equipped with high-performance tools to manage every aspect of your educational ecosystem.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<FaRocket />}
                                title="High Velocity"
                                description="Blitz through administrative tasks with automated workflows and instant data retrieval."
                                variant="blue"
                            />
                            <FeatureCard
                                icon={<FaShieldAlt />}
                                title="Ironclad Security"
                                description="Enterprise-grade data protection ensures your institutional records are safe."
                                variant="blue"
                            />
                            <FeatureCard
                                icon={<FaUserGraduate />}
                                title="Student 360°"
                                description="Comprehensive profiles analyzing attendance, performance, and behavioral metrics."
                                variant="blue"
                            />
                            <FeatureCard
                                icon={<FaChalkboardTeacher />}
                                title="Faculty Command"
                                description="Empower educators with digital attendance, grading, and scheduling tools."
                                variant="blue"
                            />
                            <FeatureCard
                                icon={<FaClipboardList />}
                                title="Smart Admissions"
                                description="Streamline the entire enquiry-to-admission pipeline with intelligent tracking."
                                variant="blue"
                            />
                            <FeatureCard
                                icon={<FaAward />}
                                title="Result Analytics"
                                description="Deep dive into exam performance with automated grading and detailed insights."
                                variant="blue"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
