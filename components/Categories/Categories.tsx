type Props = {
    data: { 
        category: string 
    }[];
};

export default function Categories({ data }: Props) {
    return (
        <div className="categories">
            {data.map((cat) => (
                <a key={cat.category} href={`#${cat.category}`}>
                {cat.category}
                </a>
            ))}
        </div>
    );
}