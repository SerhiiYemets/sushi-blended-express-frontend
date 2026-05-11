import Image from "next/image";
import css from "./Logo.module.css";

type Props = {
    showText?: boolean;
    priority?: boolean;
};

export default function Logo({ showText = true, priority = false }: Props) {
    return (
        <div className={css.logo}>
            <Image
                src="/logo.png"
                alt="SushiMax"
                width={40}
                height={40}
                priority={priority}
                sizes="40px"
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
