import React, {useState} from "react";
import {FaCheck} from "react-icons/fa6";

function Icon({children, title}: { children: React.ReactNode, title: string }) {
    const [isFinished, setIsFinished] = useState(false);


    function onClickIcons() {
        setIsFinished(!isFinished);
    }

    return (
        <div className={"flex flex-col p-4 gap-2 justify-center min-w-36 select-none"}>
            <div className={"flex justify-center"} onClick={onClickIcons}>
                {!isFinished
                    ?
                    <div className={"bg-gray-300 rounded-full w-12 h-12 content-center"}>
                        {children}
                    </div>
                    :
                    <div className={"bg-black rounded-full w-12 h-12 content-center"}>
                        <FaCheck className={"size-6 mx-auto text-white"}/>
                    </div>
                }
            </div>
            <div className={"flex flex-col justify-center font-bold text-xl text-center"}>
                {title}
            </div>
        </div>
    )
}

export default Icon;