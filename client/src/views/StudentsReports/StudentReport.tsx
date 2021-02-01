import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { match } from "react-router-dom";
import { Column, Container, DataTable, ErrorModal, FormField, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";

interface StudentReportProps {
    match: match<{ studentEmail: string }>;
}

const StudentReport: React.FC<StudentReportProps> = ({ match }) => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [examResults, setExamResults] = useState<models.interfaces.ExamResult[]>([]);
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();
    const { studentEmail } = match.params;

    const columns: Column[] = [
        {
            label: "Test name",
            key: "title",
            sortable: true,
        },
        {
            label: "Grade",
            key: "grade",
            sortable: true,
        },
        {
            label: "Last activity",
            key: "completed",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "",
            key: "id",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View student's answers"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => openStudentExamResult(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const openStudentExamResult = (id: models.classes.guid) => {
        console.log("go to exam res", id);
    };

    useEffect(() => {
        setLoadingState("loading");
        reportService.getStudentReports(
            buildAuthRequestData(), studentEmail)
            .then(({ data }) => setExamResults(data))
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, openModal, studentEmail]);

    return (
        <Container>
            <h1>Student report</h1>
            <SearchRow>
                <span>{studentEmail}</span>
                <FormField label="Search by test name/id" type="text" search value={search} onChange={e => setSearch(e.target.value)} />
            </SearchRow>
            <DataTable data={examResults} columns={columns} searchTerm={search} searchKeys={["id", "test", "title"]} />
        </Container>
    );
};

export default StudentReport;
