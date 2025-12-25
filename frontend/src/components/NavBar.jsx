"use client"
import { CircleUser, ClipboardPen, HomeIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react"

export default function NavBar() {
    return(
        <motion.nav
            initial={{y: -20, opacity: 0}}
            animate={{y:0 , opacity: 1}}
            transition={{ duration: 0.4, ease:"easeOut"}}
        >
            <div className="navbar bg-base-100 shadow-sm">
                {/* LEFT - Brand */}
                <div className="navbar-start">
                    <a className="text-xl font-mono font-semibold">
                        TaskProgress
                    </a>
                </div>

                {/* CENTER - Menu */}
                <div className="navbar-center">
                    <ul className="menu menu-horizontal gap-2 rounded-box">
                        <li>
                            <Link href="/" className="tooltip" >
                                <HomeIcon className="size-5" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard" className="tooltip" >
                                <CircleUser className="size-5" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/tasks" className="tooltip" >
                                <ClipboardPen className="size-5" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* RIGHT - optional */}
                <div className="navbar-end"></div>
            </div>
        </motion.nav>
    )
}