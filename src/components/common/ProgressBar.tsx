import {useSelector} from "react-redux";
import {RootState} from "../../hooks/store.tsx";

function ProgressBar() {
    const currentTaskNumber = useSelector((state:RootState) => state.pipeline.currentTaskNumber);

    return (
        <>
            <div className={"h-2 bg-gray-300 rounded-full mx-16"}>
                <div className={`h-full bg-black rounded-full ${currentTaskNumber === 0 ? "w-0" : "w-" + currentTaskNumber + "/5"}`}>
                </div>
            </div>
        </>
    );
}

export default ProgressBar;