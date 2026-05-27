import Image from "next/image";
import css from "./Logo.module.css";

type Props = {
    showText?: boolean;
    priority?: boolean;
};

export default function Logo({
    showText = true,
    priority = false,
}: Props) {
    return (
        <div className={css.logo}>
        <Image
            src="/sushimaxlogo.png"
            alt="Sushi Max"
            width={48}
            height={48}
            priority={priority}
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