import {MdOutlinePending, MdSearch} from "react-icons/md";
import {BiCategoryAlt, BiFilterAlt, BiVector} from "react-icons/bi";
import Icon from "./Icon.tsx";
import {TbReportAnalytics} from "react-icons/tb";

function Icons() {

    return (
        <div className={"flex flex-row justify-between"}>
            <Icon title={"Submitted"} tasks_id={0}>
                <MdOutlinePending className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Scraping"} tasks_id={1}>
                <MdSearch className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Vectorizing"} tasks_id={2}>
                <BiVector className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Sorting"} tasks_id={3}>
                <BiFilterAlt className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Categorizing"} tasks_id={4}>
                <BiCategoryAlt className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Summarizing"} tasks_id={5}>
                <TbReportAnalytics className={"size-8 mx-auto"}/>
            </Icon>
        </div>
    );
}

export default Icons;