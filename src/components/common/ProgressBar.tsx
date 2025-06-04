import {useSelector} from "react-redux";
import {RootState} from "../../hooks/store.tsx";

function ProgressBar() {
    const currentTaskNumber = useSelector((state:RootState) => state.pipeline.currentTaskNumber);

    const widthMap: { [key: number]: string } = {
        0: "w-0",
        1: "w-1/5",
        2: "w-2/5",
        3: "w-3/5",
        4: "w-4/5",
        5: "w-full",
    };

    return (
        <>
            <div className={"h-2 bg-gray-300 rounded-full mx-16"}>
                <div className={`h-full bg-black rounded-full ${widthMap[currentTaskNumber]}`}>
                </div>
            </div>
        </>
    );
}

export default ProgressBar;