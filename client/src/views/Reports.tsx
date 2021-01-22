import React from "react";
import { AppButton, Modal } from "../components";
import { useModal } from "../hooks";

const Reports: React.FC = () => {
    const { openModal } = useModal();
    const showMessage = (title: string, body: string) =>
        openModal(Modal, {
            title,
			children: <p>{body}</p>,
            okText: "SAVE",
            cancelText: "LATER",
        }).promise;
    return (
        <div>
            Reports
            <AppButton onClick={() => showMessage("Title!", "Example")}>Open provided modal</AppButton>
        </div>
    );
};

export default Reports;
