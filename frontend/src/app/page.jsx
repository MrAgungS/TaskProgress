"use client";

import Link from "next/link";
import { motion } from "motion/react";


const MotionLink = motion(Link);

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                className="max-w-2xl text-center space-y-8"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.6,
                            ease: "easeOut",
                            staggerChildren: 0.15,
                        },
                    },
                }}
            >
                {/* HERO TITLE */}
                <motion.h1
                    className="text-4xl md:text-5xl font-bold tracking-tight"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    Welcome to <span className="text-primary">TaskProgress</span>
                </motion.h1>

                {/* HERO TEXT */}
                <motion.p
                    className="text-base md:text-lg text-base-content/80 leading-relaxed"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    TaskProgress helps you organize, track, and complete your daily tasks
                    with a simple yet powerful task management system. Stay focused,
                    productive, and never miss a deadline.
                </motion.p>


                {/* SECTION 2 */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold tracking-tight pt-12"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    Why Use <span className="text-primary">TaskProgress?</span>
                </motion.h2>

                <motion.ul
                    className="text-left text-base md:text-lg text-base-content/80 space-y-2 max-w-xl mx-auto"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                >
                    <li>✅ Secure JWT-based authentication</li>
                    <li>📝 Easy task creation & management</li>
                    <li>📊 task statuses (To Do, Progress, Done)</li>
                </motion.ul>

                {/* SECTION 3 */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold tracking-tight pt-12"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    How it <span className="text-primary">Works?</span>
                </motion.h2>

                <motion.ol
                    className="text-left text-base md:text-lg text-base-content/80 space-y-2 max-w-xl mx-auto list-decimal pl-6"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                >
                    <li>Create an account or log in</li>
                    <li>Add and organize your tasks</li>
                    <li>Complete tasks efficiently</li>
                </motion.ol>

                {/* SECTION 4 */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold tracking-tight pt-12"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    Start Managing Your <span className="text-primary">Tasks Today</span>
                </motion.h2>
                {/* SECTION  TEXT */}
                <motion.p
                    className="text-base md:text-lg text-base-content/80 leading-relaxed"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    Join TaskProgress and take control of your productivity with a modern task management solution built for developers and teams.
                </motion.p>


                {/* CTA */}
                <motion.div
                    className="flex justify-center gap-4 pt-4"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <MotionLink
                        href="/login"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Get Started
                    </MotionLink>

                    <MotionLink
                        href="/dashboard"
                        className="btn btn-outline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        View Dashboard
                    </MotionLink>
                </motion.div>
            </motion.div>
        </div>
    );
}
