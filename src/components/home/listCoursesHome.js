import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ListCoursesHome = () => {
    const { data } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getAllCourses() {
        try {
            const resp = await fetch(`${Url}api/sec-schools/school-list/1/courses/`, {
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null // Include authorization token in headers
                }
            });
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
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3 ml-3">Lista smjerova</h1>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {courses.map((item, index) => (
                            <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                {item && item._course_code && (
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">
                                        {index + 1}.{' '}
                                        <Link href={`/home/${item._course_code.toUpperCase()}`}>
                                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{item.course_name}</span>
                                        </Link>
                                    </dt>
                                )}
                                {item && item._course_code && (
                                    <>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Kod: {item._course_code}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Trajanje: {item.course_duration}</dd>
                                    </>
                                )}
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ListCoursesHome;
