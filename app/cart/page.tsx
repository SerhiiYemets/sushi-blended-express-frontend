import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CartClient from './CartClient';

export const metadata = {
    title: 'Košík | Sushi Delivery',
};

export default function CartPage() {
    return (
        <>
            <Header />
                <CartClient />
            <Footer />
        </>
    );
}
