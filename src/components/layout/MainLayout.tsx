import Icons from "../common/Icons.tsx";
import ProgressBar from "../common/ProgressBar.tsx";
import Forms from "../forms/Forms.tsx";
import Results from "../results/Results.tsx";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import EmptyRequest from "../common/EmptyRequest.tsx";
import {ProcessStep} from "../../utils/ProcessStep.tsx";
import logo from '../../assets/flow-finder-logo-text.jpg';
import {useSelector} from "react-redux";
import {RootState} from "../../hooks/store.tsx";

function MainLayout() {
    const pipelineStatus = useSelector((state:RootState) => state.pipeline.pipelineStatus);

    function showLeftLayout() {
        let layout;
        switch (pipelineStatus) {
            case ProcessStep.None:
                layout = <EmptyRequest/>
                break;
            case ProcessStep.Processing:
                layout = <LoadingSpinner/>
                break;
            case ProcessStep.Completed:
                layout = <Results/>
                break;
        }
        return layout;
    }

    return (
        <>
            <div className={"w-full h-20 bg-white shadow border-t-2 border-t-gray-300 p-4"}>
                <div className={"flex flex-row justify-between w-9/12 m-auto"}>
                    <div className={"flex flex-row gap-4"}>
                        <img src={logo} alt={"logo"} className={"h-12"}/>
                    </div>
                </div>
            </div>
            <div className="w-3/4 mx-auto flex flex-col gap-8 py-8">
                <div className={"flex flex-col gap-4"}>
                    <Icons/>
                    <ProgressBar/>
                </div>
                <div className="flex flex-row mx-16 gap-6">
                    <div className={"flex-1/5"}>
                        <Forms/>
                    </div>
                    <div className={"flex-3/5"}>
                        { showLeftLayout() }
                    </div>
                </div>
            </div>
            <div className={"fixed bottom-0 w-full h-20 bg-white shadow border-t-2 border-t-gray-300 p-4"}>
                <div className={"flex flex-row justify-between w-9/12 m-auto"}>
                    <div>
                        📱 App Analyzer — Interdisciplinary project AIMarket 2025
                    </div>
                    <div>
                        Developed by: Frossard Loïc & Van der Ben Marco
                    </div>
                    <div>
                        Master in Computer Science, HES-SO
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout;