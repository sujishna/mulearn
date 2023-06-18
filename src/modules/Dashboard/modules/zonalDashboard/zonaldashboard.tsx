import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../../components/MuComponents/Table/Table";
import THead from "../../../../components/MuComponents/Table/THead";
import TableTop from "../../../../components/MuComponents/TableTop/TableTop";
import Pagination from "../../../../components/MuComponents/Pagination/Pagination";
import { getzonaldashboard } from "./apis";
import { useToast } from "@chakra-ui/react";

import { hasRole } from "../../../../services/common_functions";
import { roles } from "../../../../services/types";
import { columnsStudent, columnsCampus } from "./THeaders";
import TableTopTab from "./TableTopTab";
import Textfield from "../../../../components/MuComponents/TextField/Textfield";
import Dropdown from "../../../../components/MuComponents/Dropdown/Dropdown";

import "./Organizations.scss";
import PrimaryButton from "../../../../components/MuComponents/MuButtons/MuOutlinedButton";
import { MuButton } from "../../../../components/MuComponents/MuButtons/MuButton";
import { dashboardRoutes } from "../../../../services/urls";
import { Blank } from "../../../../components/MuComponents/Table/Blank";

function ZonalDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [columns, setColumns] = useState(columnsStudent);
    const [activeTab, setActiveTab] = useState("Student management");
    const [sort, setSort] = useState("");
    const [popupStatus, setPopupStatus] = useState(false);

    const [isCreate, setIsCreate] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const navigate = useNavigate();

    const toast = useToast();

    useEffect(() => {
        if (!hasRole([roles.ADMIN, roles.FELLOW, roles.ZONAL_CAMPUS_LEAD]))
            navigate("/404");

        getzonaldashboard(
            activeTab,
            setData,
            1,
            perPage,
            setTotalPages,
            "",
            ""
        );
    }, []);

    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getzonaldashboard(activeTab, setData, nextPage, perPage);
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        getzonaldashboard(activeTab, setData, prevPage, perPage);
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getzonaldashboard(
            activeTab,
            setData,
            1,
            perPage,
            setTotalPages,
            search,
            ""
        );
    };

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
        getzonaldashboard(
            activeTab,
            setData,
            1,
            selectedValue,
            setTotalPages,
            "",
            ""
        );
    };

    const handleTabClick = (tab: string) => {
        if (tab === "Student management") {
            setColumns(columnsStudent);
            getzonaldashboard(tab, setData, 1, perPage, setTotalPages, "", "");
        } else if (tab === "Campus management") {
            setColumns(columnsCampus);
            getzonaldashboard(tab, setData, 1, perPage, setTotalPages, "", "");
        } else {
            alert("Error to load Table Headers");
        }
        setCurrentPage(1);
        setActiveTab(tab);
        setPopupStatus(false);
    };

    const handleIconClick = (column: string) => {
        if (sort === column) {
            setSort(`-${column}`);
            getzonaldashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                sort
            );
        } else {
            setSort(column);
            getzonaldashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                sort
            );
        }

        console.log(`Icon clicked for column: ${column}`);
    };

    const CSV = (tabname: string) => {
        if (
            activeTab === "Student management" &&
            tabname === "Student management"
        ) {
            return dashboardRoutes.zonalStudentData;
        } if (
            activeTab === "Campus management" &&
            tabname === "Campus management"
        ) {
            return dashboardRoutes.zonalCampusData;
        }
    };

    return (
        <>
            <TableTopTab active={activeTab} onTabClick={handleTabClick} />
            <TableTop
                onSearchText={handleSearch}
                onPerPageNumber={handlePerPageNumber}
                // CSV={
                //     activeTab === "Student management"
                //         ? dashboardRoutes.zonalStudentData
                //         : dashboardRoutes.zonalCampusData
                // }
                CSV={CSV(activeTab)}

                // CSV={"https://dev.muelarn.org/api/v1/dashboard/ig/csv"}
                // CSV={"http://localhost:8000/api/v1/dashboard/ig/csv"}
            />
            {data && (
                <Table
                    rows={data}
                    page={currentPage}
                    perPage={perPage}
                    columnOrder={columns}
                    id={["code"]}
                >
                    <THead
                        columnOrder={columns}
                        onIconClick={handleIconClick}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        margin="10px 0"
                        handleNextClick={handleNextClick}
                        handlePreviousClick={handlePreviousClick}
                    />
                    {/*use <Blank/> when u don't need <THead /> or <Pagination inside <Table/> cause <Table /> needs atleast 2 children*/}
                </Table>
            )}
        </>
    );
}

export default ZonalDashboard;