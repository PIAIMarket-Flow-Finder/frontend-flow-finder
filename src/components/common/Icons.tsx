import {MdOutlinePending, MdSearch} from "react-icons/md";
import {BiVector} from "react-icons/bi";
import {FaFlagCheckered} from "react-icons/fa6";
import {TbReport} from "react-icons/tb";
import Icon from "./Icon.tsx";

function Icons() {

    return (
        <div className={"flex flex-row justify-between"}>
            <Icon title={"Submitted"}>
                <MdOutlinePending className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Scraping"}>
                <MdSearch className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Vectorizing"}>
                <BiVector className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Reporting"}>
                <TbReport className={"size-8 mx-auto"}/>
            </Icon>
            <Icon title={"Done"}>
                <FaFlagCheckered className={"size-6 mx-auto"}/>
            </Icon>
        </div>
    );
}

export default Icons;