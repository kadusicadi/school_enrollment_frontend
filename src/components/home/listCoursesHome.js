import { useEffect, useState } from "react";
import Url from "../../../constants";

const ListCoursesHome = () => {
    const [courses, setCourses] = useState([]);

    async function getCourses() {
        try {
            // Here I manually passed the id of the school (1= Tehnička škola Zenica);
            const resp = await fetch(`${Url}api/sec-schools/school-list/1/courses/`);
            const coursesData = await resp.json();
            setCourses(coursesData.results);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista smjerova</h1>
                {courses.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {courses.map((item, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.course_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Kod: {item._course_code}</dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Trajanje: {item.course_duration}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListCoursesHome;