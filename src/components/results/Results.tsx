import ResultsHeader from "./ResultsHeader.tsx";
import { FaDownload } from "react-icons/fa6";

function Results() {

    function downloadFile() {

    }

    return (
        <>
            <ResultsHeader/>
            <div className="flex justify-end py-4 hover:cursor-pointer select-none" onClick={downloadFile}>
                <div className="flex flex-row p-3 gap-4 rounded-md bg-gray-900">
                    <FaDownload className={"size-6 text-white"}/>
                    <div className={"text-white"}>
                        Export Results
                    </div>
                </div>
            </div>
        </>
    )
}

export default Results;