import {FaCircleInfo} from "react-icons/fa6";
import {useState} from "react";

function EmptyRequest() {
    const [number] = useState(Math.floor(1 + (Math.random() * (4-1))));

    function chooseText(){
        let icon;
        switch (number){
            case 1:
                icon = 'Let’s get started! Provide the details in the form, and watch your results unfold live on this page.';
                break;
            case 2:
                icon = 'Please fill out the form to begin — once submitted, your results will appear here in real time!';
                break;
            case 3:
                icon = 'Ready to analyze your app? Enter the details in the form, and we’ll show your insights here!';
                break;
            case 4:
                icon = 'Just fill out the form, hit submit, and watch the magic happen — your results will pop up here!';
                break;
        }
        return icon;
    }
    return (
        <div className="flex flex-col justify-center items-center gap-8 w-full h-full bg-gray-50 p-4 border border-gray-300 rounded-md inset-shadow-sm shadow">
            <FaCircleInfo className={"size-24"}/>
            <div className={"text-2xl font-semibold text-justify max-w-1/2"}>
                { chooseText() }
            </div>
        </div>
    )
}

export default EmptyRequest;