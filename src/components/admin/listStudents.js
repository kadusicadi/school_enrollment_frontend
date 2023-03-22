import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([])

    async function getStudents(dataInfo) {
        try {
            const resp = await fetch('http://51.15.114.199:3534/api/student-list/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const studentsData = await resp.json();
            console.log("🚀 ~ file: listStudents.js:17 ~ getStudents ~ studentsData:", studentsData)
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

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista učenika</h1>
                {students.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {students.map((item, index) => {
                                return (
                                    <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.first_name} {item.last_name}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.email}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.school_id.school_name}</dd>
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