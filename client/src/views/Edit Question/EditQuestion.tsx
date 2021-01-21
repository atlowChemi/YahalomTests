import { models } from '@yahalom-tests/common'
import React, { useState } from 'react'
import { Row, AppButton, FormField, Select, QuestionAnswer, SectionNavigator, Section } from '../../components';
import { useAuth } from "../../hooks";
import { enumToArray, SwitchCamelCaseToHuman } from '../../utils';

interface EditParams {
    questionId?: models.classes.guid;
}
const types = enumToArray(models.enums.QuestionType).map(SwitchCamelCaseToHuman);
const alignments = enumToArray(models.enums.Alignment).map(SwitchCamelCaseToHuman);

const EditQuestion: React.FC = () => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [],
        label: "",
        alignment: models.enums.Alignment.Vertical,
    });
    const [titleError, setTitleError] = useState("");
    const [answersError, setAnswersError] = useState("");
    const [labelError, setLabelError] = useState("");

    const { activeStudyField } = useAuth()

    const isInvalid = Boolean(
        titleError || answersError || labelError ||
        question.answers.length < 2
    );

    // useEffect(() => {

    // }, [question])

    const onTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestion({ ...question, type: e.target.selectedIndex - 1 });
    };
    const onAlignmentSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestion({ ...question, alignment: e.target.selectedIndex - 1 });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("save");
    };


    return (
        <form className="container" onSubmit={onSubmit}>
            <p>Field: <b>{activeStudyField?.name}</b></p>
            <SectionNavigator>
                <Section label="Question Details">
                    <Row>
                        <Select label="Question type"
                            required
                            value={question.type}
                            onChange={onTypeSelected}
                            options={types} />
                        <Select label="Answer layout"
                            required
                            value={question.alignment}
                            onChange={onAlignmentSelected}
                            options={alignments} />
                    </Row>
                    <FormField
                        label="Title"
                        type="text"
                        required
                        value={question.title}
                        onChange={e =>
                            setQuestion({ ...question, title: e.target.value.trim() })
                        }
                        error={titleError}
                    />

                    <FormField
                        label="Aditional content"
                        type="textarea"
                        value={question.additionalContent}
                        onChange={e =>
                            setQuestion({ ...question, additionalContent: e.target.value })
                        }
                        error={titleError}
                    />
                    <FormField
                        label="Tags"
                        required
                        type="text"
                        value={question.label}
                        onChange={e =>
                            setQuestion({ ...question, label: e.target.value.trim() })
                        }
                        error={labelError}
                    />
                </Section>
                <Section label="Question answers">
                    {/* /*not render on UI. need to check*/}
                    <QuestionAnswer
                        content="One"
                        selected={true}
                        answerIndex={0}
                        questionType={models.enums.QuestionType.SingleChoice}
                        onSelectionChange={() => { }}
                        mode={{ isEditMode: true, onContentChange: () => { } }} />
                    <QuestionAnswer
                        content="Two"
                        selected={false}
                        answerIndex={0}
                        questionType={models.enums.QuestionType.SingleChoice}
                        onSelectionChange={() => { }}
                        mode={{ isEditMode: true, onContentChange: () => { } }} />
                    <QuestionAnswer
                        content="Three"
                        selected={true}
                        answerIndex={0}
                        questionType={models.enums.QuestionType.MultiChoice}
                        onSelectionChange={() => { }}
                        mode={{ isEditMode: true, onContentChange: () => { } }} />
                    <QuestionAnswer
                        content="Four"
                        selected={false}
                        answerIndex={0}
                        questionType={models.enums.QuestionType.MultiChoice}
                        onSelectionChange={() => { }}
                        mode={{ isEditMode: true, onContentChange: () => { } }} />
                </Section>
            </SectionNavigator>
            <AppButton disabled={isInvalid} type="submit">
                Submit
            </AppButton>
        </form >
    )
}

export default EditQuestion