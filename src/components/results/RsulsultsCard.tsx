import { FaCircleInfo } from "react-icons/fa6";

function ResultsCard() {
    return (
        <div className={"flex flex-row p-2 gap-4 w-full"}>
            <div>
                <FaCircleInfo className={"size-6 text-gray-900"} />
            </div>
            <div className={"text-gray-500 font-semibold"}>
                L'application prend plus de 10 secondes à se lancer sur certains appareils.
            </div>
        </div>
    )
}

export default ResultsCard;