import React, { useState } from 'react';
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';
import { EmailForm } from "./EmailForm"

export type TestEmailsKeys = Pick<models.dtos.TestDto,
    "failureEmail" | "successEmail" | "failureMessage" | "successMessage">;

interface TestEmailsProps {
    test: TestEmailsKeys;
    onChange: (change: Partial<TestEmailsKeys>) => void;
    onValidityChange: (change: string) => void;
};

export const TestEmails: React.FC<TestEmailsProps> = ({ test, onChange, onValidityChange }) => {
    const [successMsgError, setSuccessMsgError] = useState("");
    const [failureMsgError, setFailureMsgError] = useState("");
    const [successBodyError, setSuccessBodyError] = useState("");
    const [failureBodyError, setFaliureBodyError] = useState("");

    const successEmailValidity = () => { };
    const failureEmailValidity = () => { };

    const onSuccessMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "Success message");
        onChange({ successMessage: value });
    };

    const onFailureMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "Failure message");
        onChange({ failureMessage: value });
    };

    const onSuccessMailChange = (changed: Partial<models.dtos.EmailDto>) => { };

    const onFailureMailChange = (changed: Partial<models.dtos.EmailDto>) => {
        onChange({ failureEmail: changed.subject as string, failureMessage: changed.body });
        console.log(changed);
    };

    const stringPropsErrorValidate = (value: string, propName: string) => {
        propName === "Success message" ? setSuccessMsgError("") : setFailureMsgError("");
        if (!value.trim()) {
            propName === "Success message" ? setSuccessMsgError(`${propName} is required!`) : setFailureMsgError(`${propName} is required!`);
        }
    };

    return (
        <>
            <FormField label="Seccess message"
                type="textarea"
                required
                value={test.successMessage}
                onChange={onSuccessMessageChanged}
                error={successMsgError}
            />
            <EmailForm email={test.successEmail} onChange={onSuccessMailChange} onValidityChange={successEmailValidity} />
            <FormField label="Failure message"
                type="textarea"
                required
                value={test.failureMessage}
                onChange={onFailureMessageChanged}
                error={failureMsgError}
            />
            <EmailForm email={test.successEmail} onChange={onFailureMailChange} onValidityChange={failureEmailValidity} />
        </>
    )
}
