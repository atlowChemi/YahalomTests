import React from "react";
import { Column } from ".";
import "./Row.scoped.scss";

const Row: React.FC<{
    columns: Column[];
    record: { [key: string]: any };
}> = ({ record, columns }) => {
    return (
        <div className="table-row">
            {columns.map((col, colInd) => (
                <div
                    className={`col ${col.smallColumn ? "col__small" : ""} ${
                        col.largeColumn ? "col__large" : ""
                    }`}
                    key={`col-${colInd}`}>
                    {col.isFromData ? (
                        col.template ? (
                            <col.template data={col.key === "*" ? record : record[col.key]} />
                        ) : (
                            record[col.key]
                        )
                    ) : (
                        <col.template />
                    )}
                </div>
            ))}
        </div>
    );
};
export default Row;
