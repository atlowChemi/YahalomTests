import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { AppButton, SectionNavigator, Section, ErrorModal, QuestionPeekModal } from '../../components';
import { useAuth, useModal } from "../../hooks";
import { questionService } from '../../services';
import "./EditQuestion.scoped.scss";
import { QuestionDetails, QuestionDetailsKeys, QuestionAnswers } from './QuestionForm';

interface EditParams {
    questionId?: models.classes.guid;
}

const EditQuestion: React.FC = () => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [{ content: "", correct: false }],
        label: "",
        alignment: models.enums.Alignment.Vertical,
    });
    const [detailsError, setDetailsError] = useState("");
    const [answersError, setAnswersError] = useState("");
    const { activeStudyField, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();
    const { state } = useLocation<{ question: models.dtos.QuestionDto }>();
    const { params } = useRouteMatch<EditParams>();

    useEffect(() => {
        if (params.questionId && state?.question) {
            setQuestion(state.question);
        } else if (params.questionId) {
            console.log("Got Question ID to edit, no question.")
        }
    }, [state, params, setQuestion])
    const isInvalid = !question.title || !question.label || Boolean(detailsError) || question.answers.length < 2 || Boolean(answersError);
    const onChange = (e: Partial<QuestionDetailsKeys>) => setQuestion({ ...question, ...e });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isInvalid) {
            return;
        }
        try {
            const questionClone = { ...question };
            const { answers } = questionClone;
            if (!answers[answers.length - 1]?.content.trim()) {
                answers.pop();
            }
            await questionService.addQuestion(buildAuthRequestData(), questionClone);
        } catch (err) {
            openModal(ErrorModal, { title: "Add question failed", body: err.message });
        }
    };


    const previewQuestion = () => {
        openModal(QuestionPeekModal, { question });
    }

    return (
        <form onSubmit={onSubmit} noValidate className="edit-question__form">
            <SectionNavigator>
                <Section label="Question Details" isValid={!detailsError} errMsg={detailsError}>
                    <QuestionDetails
                        question={question}
                        fieldName={activeStudyField?.name || ""}
                        onChange={onChange}
                        onValidityChange={setDetailsError} />
                </Section>
                <Section label="Question answers" isValid={!answersError} errMsg={answersError}>
                    <QuestionAnswers question={question} onChange={onChange} onValidityChange={setAnswersError} />
                </Section>
            </SectionNavigator>
            <div>
                <AppButton disabled={isInvalid} type="submit" className="edit-question__form">
                    Submit
                </AppButton>
                <AppButton disabled={isInvalid} type="button" varaiety="secondary" className="edit-question__form" onClick={() => previewQuestion()}>
                    Preview
                </AppButton>
            </div>
        </form >
    )
}

export default EditQuestion
