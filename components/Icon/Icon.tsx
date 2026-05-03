type Props = {
    name: string;
    width?: number;
    height?: number;
    className?: string;
    "aria-label"?: string;
    "aria-hidden"?: boolean | "true" | "false";
    style?: React.CSSProperties;
};

export default function Icon({ name, width, height, className, style, ...aria }: Props) {
    return (
        <svg width={width} height={height} className={className} style={style} {...aria}>
        <use href={`/sprite.svg#${name}`} />
        </svg>
    );
}