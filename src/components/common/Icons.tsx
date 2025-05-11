import {MdOutlinePending, MdSearch} from "react-icons/md";
import {BiVector} from "react-icons/bi";
// import {FaFlagCheckered} from "react-icons/fa6";
// import {TbReport} from "react-icons/tb";
import Icon from "./Icon.tsx";

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
            {/*<Icon title={"Reporting"} tasks_id={3}>*/}
            {/*    <TbReport className={"size-8 mx-auto"}/>*/}
            {/*</Icon>*/}
            {/*<Icon title={"Done"} tasks_id={4}>*/}
            {/*    <FaFlagCheckered className={"size-6 mx-auto"}/>*/}
            {/*</Icon>*/}
        </div>
    );
}

export default Icons;