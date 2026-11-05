import Modal from "@/components/Modal/Modal";

import { MODAL_TITLE_ID } from "@/app/menu/@modal/(.)[categoryId]/[productId]/_constants";

export default function InterceptedRestaurantProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Modal labelledBy={MODAL_TITLE_ID}>{children}</Modal>;
}
