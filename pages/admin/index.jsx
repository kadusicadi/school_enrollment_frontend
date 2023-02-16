import Layout from '../../src/components/layout/Layout';
import Sidebar from '../../src/components/admin/sidebar';
import ListTeachers from '../../src/components/admin/listTeachers';
import NewTeacher from '../../src/components/admin/newTeacher';
import { useState } from 'react';

const Admin = (props) => {
  const [selectedPage, setSelectedPage] = useState("listTeachers")
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
          {selectedPage === "newTeacher" && <NewTeacher />}
        </div>
      </div>





    </Layout>
  )
};

export default Admin;