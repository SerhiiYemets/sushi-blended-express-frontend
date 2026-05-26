type Props = {
    children: React.ReactNode;
    modal: React.ReactNode;
};

export default function MenuLayout({ children, modal }: Props) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
