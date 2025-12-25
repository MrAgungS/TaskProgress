import { CircleUser, Clipboard, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function MenuBar() {
    return(
        <div className="flex justify-center items-center min-h-screen">
            <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
                <li>
                    <Link href="/" className="tooltip" data-tip="Home">
                        <HomeIcon className="size-5"></HomeIcon>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className="tooltip" data-tip="User">
                        <CircleUser className="size-5"></CircleUser>
                    </Link>
                </li>
                <li>
                    <Link href="/tasks" className="tooltip" data-tip="Task">
                        <Clipboard className="size-5"></Clipboard>
                    </Link>
                </li>
            </ul>
        </div>
    )
}