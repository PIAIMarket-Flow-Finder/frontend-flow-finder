import Icons from "../common/Icons.tsx";
import ProgressBar from "../common/ProgressBar.tsx";
import Forms from "../forms/Forms.tsx";
import Results from "../results/Results.tsx";

function MainLayout() {
    return (
        <>
            <div className="w-3/4 mx-auto flex flex-col gap-8">
                <div className={"flex flex-col gap-4"}>
                    <Icons/>
                    <ProgressBar/>
                </div>
                <div className="flex flex-row mx-16 gap-6">
                    <div className={"flex-1/5"}>
                        <Forms/>
                    </div>
                    <div className={"flex-3/5"}>
                        <Results/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout;