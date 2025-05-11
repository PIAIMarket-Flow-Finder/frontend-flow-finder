import {useDispatch} from "react-redux";
import {startPipeline} from "../../hooks/pipelineSlice.tsx";
import {RequestSend} from "../../models/RequestSend.tsx";
import {AppDispatch} from "../../hooks/store.tsx";

function Forms() {
    const dispatch = useDispatch<AppDispatch>()

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const appName = formData.get('package_name')?.toString() || '';
        const country = formData.get('country')?.toString() || '';
        const language = formData.get('language')?.toString() || '';
        const max_reviews = parseInt(formData.get('max_reviews')?.toString() || '1000', 10);

        const form: RequestSend = {
            package_name: appName,
            country: country,
            language: language,
            max_reviews: max_reviews,
        }

        dispatch(startPipeline(form));
    }

    return (
        <div className={"flex flex-row justify-between bg-white shadow border-gray-200 border rounded-md content-center"} >
            <form className={"flex flex-col p-6 gap-6 w-full"} onSubmit={onSubmit}>
                <div className={"text-3xl font-bold text-center"}>
                    Form
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Package Name*
                    </label>
                    <input name={"package_name"} type={"text"} placeholder={"com.example.app"} required={true}/>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Language*
                    </label>
                    <select name={"language"} required={true}>
                        <option value={"en"}>en</option>
                        <option value={"fr"}>fr</option>
                        <option value={"us"}>us</option>
                    </select>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Country*
                    </label>
                    <select name={"country"}  required={true}>
                        <option value={"us"}>United States</option>
                        <option value={"fr"}>Switzerland</option>
                        <option value={"fr"}>France</option>
                        <option value={"it"}>Italia</option>
                    </select>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    <label className={"font-bold text-gray-700"}>
                        Counter*
                    </label>
                    <input name={"max_reviews"} type={"number"} defaultValue={1000} required={true}/>
                </div>
                <div className={"flex flex-row gap-8 w-full"}>
                    <div className={"flex flex-col gap-2 w-full"}>
                        <label className={"font-bold text-gray-700"}>
                            Date from
                        </label>
                        <input  type={"date"} placeholder={"com.example.app"}/>
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