import Image from "next/image";
import css from "./Logo.module.css";

export default function Logo({ width = 60, height = 40, showText = true }) {
    return (
        <div className={css.logo}>
            <Image
                src="/logo.png"
                alt="SushiMax"
                width={width}
                height={height}
                priority
                className={css.image}
            />
            {showText && (
                <span className={css.text}>
                    Sushi<span className={css.accent}>Max</span>
                </span>
            )}
        </div>
    );
}