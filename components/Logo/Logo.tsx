import css from "./Logo.module.css";

type Props = {
    showText?: boolean;
    priority?: boolean;
};

export default function Logo({ showText = true }: Props) {
    return (
        <div className={css.logo}>
            {showText && (
                <span className={css.text}>
                    Sushi<span className={css.accent}>Room</span>
                </span>
            )}
        </div>
    );
}
