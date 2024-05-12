import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";

const EditStudent = ({ studentId }) => {
    const { data } = useSession();
    const router = useRouter();
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    async function fetchStudentData() {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/${studentId}`, {
                method: 'GET',
                /*
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.user.token}`,
                }*/
            })
            const studentData = await resp.json();
            setEditingStudent(studentData);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    }

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditingStudent(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const updateStudent = async () => {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${editingStudent.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(editingStudent)
            });

            if (resp.ok) {
                console.log('Student updated successfully');
                const redirectUrl = data.user.is_superuser ? '/admin' : '/user';
                router.push(redirectUrl);
            } else {
                console.error('Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleCancel = () => {
        // When we press cancel it goes to admin page;
        router.back();
    };

    return (
        <div className="flex justify-center items-start h-screen w-screen bg-gray-200 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
                {editingStudent && (
                    <div>
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">{editingStudent.name} {editingStudent.last_name}</h1>
                        <div className="mb-1 font-bold text-gray-800">Ime:</div>
                        <input
                            type="text"
                            value={editingStudent.name}
                            onChange={(e) => handleInputChange(e, 'name')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="mb-1 mt-1 font-bold text-gray-800">Srednje ime:</div>
                        <input
                            type="text"
                            placeholder="Srednje ime učenika (nije obavezno)"
                            value={editingStudent?.middle_name || ''}
                            onChange={(e) => handleInputChange(e, 'middle_name')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="mb-1 mt-1 font-bold text-gray-800">Prezime:</div>
                        <input
                            type="text"
                            value={editingStudent.last_name}
                            onChange={(e) => handleInputChange(e, 'last_name')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="mb-1 mt-1 font-bold text-gray-800">Ime jednog roditelja:</div>
                        <input
                        type="text"
                        placeholder="Ime jednog roditelja"
                        value={editingStudent.guardian_name}
                        onChange={(e) => handleInputChange(e, 'guardian_name')}
                        className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="mb-1 mt-1 font-bold text-gray-800">Email:</div>
                        <input
                            type="text"
                            placeholder="Email učenika (nije obavezno)"
                            value={editingStudent.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="mb-1 mt-1 font-bold text-gray-800">Status:</div>
                            <select
                                value={editingStudent.special_case}
                                onChange={(e) => handleInputChange(e, 'special_case')}
                                className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2">
                                <option value="regular">Regular student</option>
                                <option value="invalid">Invaliditet</option>
                                <option value="others">Ostali</option>
                            </select>
                        <div className="flex justify-center pt-4">
                            <button onClick={updateStudent} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Sačuvaj</button>
                            <button onClick={handleCancel} className="w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg ml-2">Otkaži</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default EditStudent;