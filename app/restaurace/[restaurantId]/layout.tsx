type Props = {
    children: React.ReactNode;
    modal: React.ReactNode;
};

export default function RestaurantLayout({ children, modal }: Props) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
