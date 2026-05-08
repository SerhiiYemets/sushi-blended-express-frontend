import Modal from "@/components/Modal/Modal";

import { MODAL_TITLE_ID } from "./_constants";

export default function InterceptedProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Modal labelledBy={MODAL_TITLE_ID}>{children}</Modal>;
}
