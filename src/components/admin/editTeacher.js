import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";

const EditTeacher = ({ teacherId }) => {
    const { status, data } = useSession();
    const router = useRouter();
    const [editingTeacher, setEditingTeacher] = useState(null);

    useEffect(() => {
        fetchTeacherData();
    }, [teacherId]);

    async function fetchTeacherData() {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher/${teacherId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            })
            const teacherData = await resp.json();
            setEditingTeacher(teacherData);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    }

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditingTeacher(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const updateTeacher = async () => {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher/${editingTeacher.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(editingTeacher)
            });

            if (resp.ok) {
                console.log('Teacher updated successfully');
                router.push('/admin');
            } else {
                console.error('Failed to update teacher');
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    const handleCancel = () => {
        // When we press cancel it goes to admin page;
        router.back();
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-md">
                {editingTeacher && (
                    <div>
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Edituj nastavnika</h1>
                        <input
                            type="text"
                            value={editingTeacher.first_name}
                            onChange={(e) => handleInputChange(e, 'first_name')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <input
                            type="text"
                            value={editingTeacher.last_name}
                            onChange={(e) => handleInputChange(e, 'last_name')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <input
                            type="text"
                            value={editingTeacher.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        <div className="flex justify-center pt-4">
                            <button onClick={updateTeacher} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Sačuvaj</button>
                            <button onClick={handleCancel} className="w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg ml-2">Otkaži</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditTeacher;