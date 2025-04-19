import { FieldsSummary } from "../Field/FieldsSummary";
import React from "react";
import { ManagerFieldsAdmin } from "../Field/ManagerFieldsAdmin";





const ManagerFields = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex bg-gray-100 ml-64 p-4">
                <ManagerFieldsAdmin/>
            </div>
        </div>
    );
};
export default ManagerFields;