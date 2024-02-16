import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([])

    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const studentsData = await resp.json();
            setStudents(studentsData)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (data) {
            getStudents(data)
        }
    }, [data])

    // It lists the students based on the teachers course;
    const filteredStudents = students.filter(i => i.desired_course_A == data.user.course_code)
    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista učenika</h1>
                {students.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {filteredStudents.map((item, index) => {
                                return (
                                    <div key={index} className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-5 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.name} {item.last_name}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Mail: {item.email}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Smjer: {item.desired_course_A}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Telefon: {item.guardian_number}</dd>
                                    </div>
                                )
                            })}

                        </dl>
                    </div>
                )}

            </div>
        </div>
    )
};

export default ListStudents;