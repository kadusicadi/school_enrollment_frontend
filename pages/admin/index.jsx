import Layout from '../../src/components/layout/Layout';
import Sidebar from '../../src/components/admin/sidebar';
import ListTeachers from '../../src/components/admin/listTeachers';
import NewTeacher from '../../src/components/admin/newTeacher';
import ListCourses from '../../src/components/admin/listCourses';
import { useEffect, useState } from 'react';

const Admin = (props) => {
  const [selectedPage, setSelectedPage] = useState("listTeachers")

  useEffect(() => {
    const a = 2
    const b = 3
    const c = 4
    if (a===2 && (b===2 || c===4)) {
      console.log('true')
    } else {
      console.log('false')

    }
  })
  return (
    <Layout>
      <div className="flex mt-6 gap-5">
        <div className="w-1/5 border-r">
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        </div>
        <div className="w-4/5">
          {selectedPage === "listTeachers" && <ListTeachers />}
          {selectedPage === "newTeacher" && <NewTeacher setSelectedPage={setSelectedPage} />}
          {selectedPage === "listCourses" && <ListCourses setSelectedPage={setSelectedPage} />}
        </div>
      </div>





    </Layout>
  )
};

export default Admin;