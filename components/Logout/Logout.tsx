"use client";

import Link from "next/link";
import Icon from "@/components/Icon/Icon";

export default function Logout() {
    return (
        <div>
            <Link href="/logout-confirm" scroll={false}>
                <Icon name="logout" width={24} height={24} aria-label="Exit" />
            </Link>
        </div>
    );
}