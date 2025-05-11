import { FaPuzzlePiece, FaBoltLightning, FaShield  } from "react-icons/fa6";
import ResultsCard from "./RsulsultsCard.tsx";
import {useState} from "react";

function ResultsHeader() {
    const [number] = useState(Math.floor(1 + (Math.random() * (3-1))));

    function chooseIcon(){
        let icon;
        switch (number){
            case 1:
                icon = <FaPuzzlePiece className={"size-6 text-gray-900"}/>;
                break;
            case 2:
                icon = <FaBoltLightning className={"size-6 text-gray-900"}/>;
                break;
            case 3:
                icon = <FaShield className={"size-6 text-gray-900"}/>;
                break;
        }
        return icon;
    }

    return (
        <div className={"flex flex-col gap-8 justify-between w-full border-gray-200 border bg-white p-8 rounded shadow"}>
            <div className={"flex flex-row justify-between"}>
                <div className={"text-xl font-bold"}>
                    Performance
                </div>
                <div>
                    {chooseIcon()}
                </div>
            </div>
            <div className={"flex flex-col gap-2 p-2"}>
                {[...Array(2)].map(() =>
                    <ResultsCard />
                )}
            </div>
        </div>
    )
}

export default ResultsHeader;