import React, { useEffect, useState } from "react";
import { models } from "@yahalom-tests/common";
import {
    Accordion,
    AccordionSection,
    Column,
    Container,
    DataTable,
    FormField,
} from '../../../components';
import { EmailForm } from "./EmailForm";

const columns: Column[] = [
    {
        label: 'Template',
        key: 'key',
        sortable: true,
    },
    {
        label: 'Value',
        key: 'value',
        sortable: true,
        largeColumn: true,
    },
];
const emailTemplates = [
    { key: '@TestName@', value: 'The name of the test.' },
    { key: '@FirstName@', value: 'First name of student who took the exam.' },
    { key: '@LastName@', value: 'Last name of student who took the exam.' },
    { key: '@Date@', value: 'Date of exam completion.' },
    { key: '@Grade@', value: 'The grade the student has gotten.' },
    {
        key: '@Certificate@',
        value: 'A link to the course certificate - will work only for students who passed.',
    },
];

export type TestEmailsKeys = Pick<
    models.dtos.TestDto,
    "failureEmail" | "successEmail" | "failureMessage" | "successMessage"
>;

interface TestEmailsProps {
    test: TestEmailsKeys;
    onChange: (change: Partial<TestEmailsKeys>) => void;
    onValidityChange: (change: string) => void;
}

export const TestMessages: React.FC<TestEmailsProps> = ({ test, onChange, onValidityChange }) => {
    const [successMsgError, setSuccessMsgError] = useState('');
    const [failureMsgError, setFailureMsgError] = useState('');
    const [successEmailError, setSuccessEmailError] = useState('');
    const [failureEmailError, setFaliureEmailError] = useState('');

    const onSuccessMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, 'Success message');
        onChange({ successMessage: value });
    };

    const onFailureMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, 'Failure message');
        onChange({ failureMessage: value });
    };

    const onSuccessMailChange = (changed: Partial<models.dtos.EmailDto>) => {
        onChange({ successEmail: { ...test.successEmail, ...changed } });
    };

    const onFailureMailChange = (changed: Partial<models.dtos.EmailDto>) => {
        onChange({ failureEmail: { ...test.failureEmail, ...changed } });
    };

    const stringPropsErrorValidate = (
        value: string,
        propName: 'Success message' | 'Failure message'
    ) => {
        propName === 'Success message' ? setSuccessMsgError('') : setFailureMsgError('');
        if (!value.trim()) {
            propName === 'Success message'
                ? setSuccessMsgError(`${propName} is required`)
                : setFailureMsgError(`${propName} is required`);
        }
    };

    useEffect(() => {
        let errorStr = '';
        const errors = [successMsgError, failureMsgError, successEmailError, failureEmailError];
        if (successMsgError || failureMsgError || successEmailError || failureEmailError) {
            if (successMsgError && failureMsgError && successEmailError && failureEmailError) {
                errorStr = `Errors: ${successMsgError}, ${failureMsgError},${successEmailError},${failureEmailError}`;
            } else {
                errorStr = `Errors: `;
                errors.forEach((err) => {
                    if (err) {
                        errorStr += `${err},`;
                    }
                });
                errorStr.slice(0, -1);
            }
        }
        onValidityChange(errorStr);
    }, [successMsgError, failureMsgError, successEmailError, failureEmailError, onValidityChange]);

    return (
        <Container>
            <Accordion>
                <AccordionSection title="After test messages">
                    <FormField
                        label="Success message"
                        type="textarea"
                        required
                        value={test.successMessage}
                        onChange={onSuccessMessageChanged}
                        error={successMsgError}
                    />
                    <FormField
                        label="Failure message"
                        type="textarea"
                        required
                        value={test.failureMessage}
                        onChange={onFailureMessageChanged}
                        error={failureMsgError}
                    />
                </AccordionSection>
                <AccordionSection title="Success Email">
                    <EmailForm
                        email={test.successEmail}
                        onChange={onSuccessMailChange}
                        onValidityChange={setSuccessEmailError}
                    />
                </AccordionSection>
                <AccordionSection title="Failure Email">
                    <EmailForm
                        email={test.failureEmail}
                        onChange={onFailureMailChange}
                        onValidityChange={setFaliureEmailError}
                    />
                </AccordionSection>
                <AccordionSection title="Email messages wildcards">
                    <DataTable columns={columns} data={emailTemplates} />
                </AccordionSection>
            </Accordion>
        </Container>
    );
};