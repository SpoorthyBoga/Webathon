const studentId = '67f171d3ee97841eb84206ab';  // The ID of the student
const certificateData = {
  name: 'Certificate of Excellence',
  issuedTo: studentId,  // The student receiving the certificate
  event: '67f19c1f528a9749b23dc0e1',  // Event ID
  issueDate: new Date(),
  fileUrl: 'https://someurl.com/certificate.pdf'
};

const Certificate = require('./models/Certificate');
const User = require('./models/student');

// Create a new certificate and save it
const createAndPushCertificate = async () => {
  try {
    // Create the certificate
    const certificate = new Certificate(certificateData);
    await certificate.save();

    // Push the certificate's _id into the student's certificates array
    const student = await User.findById(studentId);
    if (!student) {
      console.log('Student not found');
      return;
    }

    student.certificates.push(certificate._id);  // Push the certificate ID into the array
    await student.save();

    console.log('Certificate added to student successfully');
  } catch (err) {
    console.error('Error while adding certificate:', err);
  }
};

// Call the function to create and push the certificate
createAndPushCertificate();
