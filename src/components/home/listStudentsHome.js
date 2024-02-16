import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([]);
    const [courseInput, setCourseInput] = useState('');
    
    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentsData = await resp.json();
            console.log("🚀 ~ file: listStudents.js:17 ~ getStudents ~ studentsData:", studentsData);
            setStudents(studentsData);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getStudents(data);
    }, []);

    const handleInputChange = (event) => {
        console.log(event.target.value);
        setCourseInput(event.target.value);
    };
    
    let filteredStudents = students.filter(student => {
        // If courseInput is empty, it show students with the course "el", otherwise it filters based on the input;
        return courseInput.trim() === '' ? student.desired_course_A.toLowerCase() === 'el' : student.desired_course_A.toLowerCase().includes(courseInput.toLowerCase());
    });

    console.log(filteredStudents);

    return (
        <div>
        <div className="flex justify-center"
        style={{ paddingBottom: '40px' }}>
                <h1 className="text-4xl font-semibold text-center">Dobrodošli</h1>
        </div>
        <div className="flex flex-col">
            <div className="mb-4">
                <label htmlFor="courseInput" className="block text-sm font-bold mb-2">Unesite smjer za pretraživanje, RTiA ili EL:</label>
                <input
                    id="courseInput"
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    value={courseInput}
                    onChange={handleInputChange}
                    placeholder="Unesi smjer"
                />
            </div>
            {students.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {filteredStudents.map((item, index) => (
                            <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.name} {item.last_name}</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Smjer: {item.desired_course_A}</dd>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Prednost: {item.special_case}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </div>
    </div>
);
};


export default ListStudents;