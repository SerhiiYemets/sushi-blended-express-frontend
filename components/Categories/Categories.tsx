import type { MenuCategory } from "@/types/menu";

export default function Categories({ data }: { data: MenuCategory[] }) {
    return (
        <div>
            {data.map((cat) => (
                <a key={cat.category} href={`#${cat.category}`}>
                {cat.category}
                </a>
            ))}
        </div>
    );
}