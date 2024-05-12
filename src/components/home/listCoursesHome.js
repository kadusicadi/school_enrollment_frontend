import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useIsMobile from "./useIsMobile";

const ListCoursesHome = () => {
    const { data } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useIsMobile(); // Use custom hook to detect mobile devices

    async function getAllCourses() {
        try {
            const resp = await fetch(`${Url}api/sec-schools/school-list/1/courses/`, {});
            const coursesData = await resp.json();
            setCourses(coursesData);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-3xl font-semibold text-center">Dobrodošli na upis učenika u Tehničku školu 2024/2025</h1>
            </div>
            <div className="flex flex-col">
                {isMobile && (
                <h1 className="text-2xl font-semibold mb-3 ml-3">Lista smjerova</h1>
                )}
                {!isMobile && (
                <div className="flex">
                    <dt className="text-gray-700 ml-5 font-bold min-w-[37rem]">Smjerovi</dt>
                    <dt className="text-gray-700 ml-5 font-bold">Trajanje</dt>
                </div>
                )}
                {isMobile && (
                <div className="flex">
                </div>
                )}
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {courses.map((item, index) => (
                            <div key={index} className="py-4">
                                <div className={isMobile ? "flex flex-col" : "sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6"}>
                                    {item && item._course_code && (
                                        <div className={isMobile ? "mb-2" : "sm:col-span-2"}>
                                            <Link href={`/home/${item._course_code.toUpperCase()}`}>
                                                <span className="underline cursor-pointer text-gray-700">{item.course_name}</span>
                                            </Link>
                                        </div>
                                    )}
                                    {item && item._course_code && isMobile && (
                                        <div className="text-sm text-gray-900">Trajanje: {item.course_duration} godine</div>
                                    )}
                                    {item && item._course_code && !isMobile && (
                                        <div className="mt-1 text-sm text-gray-900">{item.course_duration} godine</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ListCoursesHome;
