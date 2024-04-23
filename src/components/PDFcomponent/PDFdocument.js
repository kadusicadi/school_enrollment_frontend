import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: '100%', // Set width to 100% to span the full page
    border: '1px solid #000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    border: '1px solid #000',
    width: 'auto', // Set to 'auto' to allow flexible width
    fontSize: 8,
    textAlign: 'center',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #000',
    fontWeight: 'normal',
    width: 'auto', // Set the width to match the width of the corresponding data cell
  },
});

const PDFDocument = ({ sortedStudents, averageScores, specialScores, acknowledgmentPoints, sv, sv2, sv3, total }) => {

  // Calculate the maximum length of text for each column
  const maxTextLengths = ['RB', 'Ime i prezime', 'Osnovna škola', ...(averageScores ? Object.keys(averageScores[Object.keys(averageScores)[0]]) : []), 'SV (Opšti kriterij)', ...(specialScores && specialScores[Object.keys(specialScores)[0]] && specialScores[Object.keys(specialScores)[0]].length > 0 ? Object.keys(specialScores[Object.keys(specialScores)[0]][0]).filter(key => key !== 'course' && key !== 'total_special_points') : []), 'SV (posebni kriterij)', 'O', 'K', 'F', 'SV (specijalni kriterij)', 'Ukupno'].reduce((acc, header) => {
    acc[header] = sortedStudents.reduce((max, student) => {
      const value = student[header];
      if (value && value.length > max) {
        return value.length;
      }
      return max;
    }, header.length) + 7;
    return acc;
  }, {});

  // Calculate the total length of all headers
  const totalHeaderLength = Object.values(maxTextLengths).reduce((total, length) => total + length, 0);

  // Render function
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>JU TEHNIČKA ŠKOLA ZENICA</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.headerCell, { width: '20%' }]} colSpan={4}>Generalije</Text>
              {averageScores && Object.keys(averageScores).length > 0 && (
                <Text style={[styles.tableCell, styles.headerCell, { width: '22%' }]} colSpan={5}>I-Opšti kriterij - USPJEH VI - IX O.Š. x3</Text>
              )}
              {averageScores && Object.keys(averageScores).length > 0 && (
                <Text style={[styles.tableCell, styles.headerCell, { width: '38%' }]} colSpan={7}>II-Posebni kriterij - RELEVANTNI NASTAVNI PREDMETI</Text>
              )}
              {averageScores && Object.keys(averageScores).length > 0 && (
                <Text style={[styles.tableCell, styles.headerCell, { width: '22%' }]} colSpan={4}>III-Specijalni kriterij - TAKMIČENJE VIII i IX RAZRED</Text>
              )}
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.headerCell]}>RB</Text>
              {['Ime i prezime', 'Osnovna škola', ...(averageScores ? Object.keys(averageScores[Object.keys(averageScores)[0]]) : []), 'SV (Opšti kriterij)', ...(specialScores && specialScores[Object.keys(specialScores)[0]] && specialScores[Object.keys(specialScores)[0]].length > 0 ? Object.keys(specialScores[Object.keys(specialScores)[0]][0]).filter(key => key !== 'course' && key !== 'total_special_points') : []), 'SV (posebni kriterij)', 'O', 'K', 'F', 'SV (specijalni kriterij)', 'Ukupno'].map((header, index) => (
                <Text key={index} style={[styles.tableCell, styles.headerCell, { width: `${(maxTextLengths[header] / totalHeaderLength) * 100}%` }]}>{header}</Text>
              ))}
            </View>
            {/* Student data */}
            {sortedStudents && sortedStudents.map((student, studentIndex) => (
              <View key={student.id} style={styles.tableRow}>
                {/* RB */}
                <Text style={[styles.tableCell, { width: `${(maxTextLengths['RB'] / totalHeaderLength) * 100}%` }]}>{studentIndex + 1}</Text>
                {/* Data cells */}
                {[`${student?.name || ''} ${student?.last_name || ''}`, student?.primary_school || '', ...(averageScores && averageScores[student.id] ? Object.values(averageScores[student.id]) : []), sv && sv[student.id] ? sv[student.id] : '', ...(specialScores && specialScores[student.id] && specialScores[student.id].length > 0 ? Object.values(specialScores[student.id][0]).filter((_, index) => index !== 0 && index !== Object.values(specialScores[student.id][0]).length - 1) : []), sv2 && sv2[student.id] ? sv2[student.id] : '', ...(acknowledgmentPoints && acknowledgmentPoints[student.id] ? Object.values(acknowledgmentPoints[student.id]) : []), sv3 && sv3[student.id] !== undefined ? sv3[student.id] : 0, total && total[student.id] ? total[student.id] : ''].map((value, index) => (
                  <Text key={index} style={[styles.tableCell, { width: `${(maxTextLengths[Object.keys(maxTextLengths)[index + 1]] / totalHeaderLength) * 100}%` }]}>{value}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
