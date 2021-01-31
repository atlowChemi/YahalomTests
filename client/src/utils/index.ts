import type { models } from "@yahalom-tests/common";

export const enumToArray = <T extends string, TEnumValue extends number | string>(
    enumVariable: { [key in T]: TEnumValue }
): string[] => {
    return Object.keys(enumVariable).filter(key => isNaN(Number(key)));
};
export const SwitchCamelCaseToHuman = (val: string) => ({
    label: val.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"),
});

export const isExamAnExamResult = (exam?: models.interfaces.Exam | models.interfaces.ExamResult): exam is models.interfaces.ExamResult =>
    exam?.hasOwnProperty('questionCount') ?? false;