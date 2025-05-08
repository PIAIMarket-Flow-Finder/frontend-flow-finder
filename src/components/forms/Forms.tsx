function Forms() {
    return (
        <div className={"flex flex-row justify-between bg-white shadow border-gray-200 border rounded-md content-center"}>
            <form className={"flex flex-col p-6 gap-6 w-full"}>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Package Name*
                    </label>
                    <input type={"text"} placeholder={"com.example.app"}/>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Language*
                    </label>
                    <select>
                        <option>en-US</option>
                        <option>en-US</option>
                        <option>en-US</option>
                        <option>en-US</option>
                    </select>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Country*
                    </label>
                    <select>
                        <option>United States</option>
                        <option>Switzerland</option>
                        <option>France</option>
                        <option>Italia</option>
                    </select>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Counter*
                    </label>
                    <input type={"number"} defaultValue={1000}/>
                </div>
                <div className={"flex flex-row gap-8 w-full"}>
                    <div className={"flex flex-col gap-2 w-full"}>
                        <label className={"font-bold text-gray-700"}>
                            Date from
                        </label>
                        <input type={"date"} placeholder={"com.example.app"}/>
                    </div>
                    <div className={"flex flex-col gap-2 w-full"}>
                        <label className={"font-bold text-gray-700"}>
                            Date to
                        </label>
                        <input type={"date"} placeholder={"com.example.app"}/>
                    </div>
                </div>

                <button type="submit" className={"bg-gray-900 rounded-xl text-white p-4 hover:cursor-pointer"}>
                    Submit for analysis
                </button>
            </form>
        </div>
    );
}

export default Forms;