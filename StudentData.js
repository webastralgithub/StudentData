import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState, useEffect } from 'react';


const studentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState({});
  const [legalguardiansData, setLegalguardiansData] = useState({});
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    const fetchAllStudentDetails = async () => {
      const fetchedStudentsData = [];
      const fetchedSchoolsData = {};
      const fetchedLegalguardiansData = {};

      for (const studentId of selectedStudentIds) {
        const studentData = await fetchStudentData(studentId);
        const { schoolId, legalguardianId } = studentData;
        fetchedStudentsData.push(studentData);

        if (!schoolsData[schoolId]) {
          const schoolData = await fetchSchoolData(schoolId);
          fetchedSchoolsData[schoolId] = schoolData;
        }

        if (!legalguardiansData[legalguardianId]) {
          const legalguardianData = await fetchLegalguardianData(legalguardianId);
          fetchedLegalguardiansData[legalguardianId] = legalguardianData;
        }
      }

      setStudentsData(fetchedStudentsData);
      setSchoolsData((prevSchoolsData) => ({ ...prevSchoolsData, ...fetchedSchoolsData }));
      setLegalguardiansData((prevLegalguardiansData) => ({ ...prevLegalguardiansData, ...fetchedLegalguardiansData }));
    };

    if (selectedStudentIds.length > 0) {
      fetchAllStudentDetails();
    }
  }, [selectedStudentIds]);

  const onStudentsPick = (selectedStudentIds) => {
    setSelectedStudentIds(selectedStudentIds);
  };

  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        LegalguardiansData={legalguardiansData}
      />
    </>
  );
};

export default studentsDataComponent;
