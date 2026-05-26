import type { MenuCategory } from "@/types/menu";

export default function Categories({ data }: { data: MenuCategory[] }) {
    return (
        <div>
            {data.map((cat) => (
                <a key={cat._id} href={`#${cat.name}`}>
                    {cat.name}
                </a>
            ))}
        </div>
    );
}
