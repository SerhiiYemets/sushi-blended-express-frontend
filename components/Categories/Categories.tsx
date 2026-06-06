import type { Category } from "@/types/menu";

import css from "./Categories.module.css";

export default function Categories({ data }: { data: Category[] }) {
    return (
        <nav className={css.categories} aria-label="Kategorie">
            {data.map((cat) => (
                <a key={cat._id} href={`#${cat.name}`}>
                    {cat.name}
                </a>
            ))}
        </nav>
    );
}
