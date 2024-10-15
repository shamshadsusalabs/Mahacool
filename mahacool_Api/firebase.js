// const admin = require('firebase-admin');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid'); // For generating unique file names
// const pdfcrowd = require("pdfcrowd");
// const fs = require('fs'); // Import the fs module

// // Initialize Firebase Admin SDK
// const serviceAccount = require('./mahacool-5b59f-firebase-adminsdk-er29u-4a752e1132.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'mahacool-5b59f.appspot.com' // Updated to 'appspot.com'
// });

// // Cloud Storage
// const bucket = admin.storage().bucket();

// // Upload a file to Firebase Storage
// const uploadFile = async (file) => {
//   try {
//     console.log("file", file);

//     const { originalname, buffer } = file;
//     const uniqueFilename = ${uuidv4()}-${path.parse(originalname).name}.pdf; // Save as PDF

//     // Initialize PDFCrowd Client
//     const client = new pdfcrowd.HtmlToPdfClient("mahacool", "bd5aced6bfd6af265c9563bf0094bef0");

//     // Save the PDF to the /tmp directory on GCP
//     const pdfFilePath = path.join('/tmp', ${uniqueFilename}.pdf);

//     // Convert HTML to PDF and save it to the /tmp directory
//     await new Promise((resolve, reject) => {
//       client.convertStringToFile(buffer.toString('utf8'), pdfFilePath, (err) => {
//         if (err) {
//           console.error("Error during PDF conversion:", err);
//           reject(err);
//         } else {
//           console.log("PDF generated successfully!");
//           resolve();
//         }
//       });
//     });

//     // Upload PDF from the /tmp directory to Firebase Storage
//     await bucket.upload(pdfFilePath, {
//       destination: uniqueFilename,
//       metadata: {
//         contentType: 'application/pdf',
//       },
//     });

//     // Make the PDF publicly accessible
//     const fileUpload = bucket.file(uniqueFilename);
//     await fileUpload.makePublic();

//     // Get the public URL of the uploaded PDF
//     const publicUrl = https://storage.googleapis.com/${bucket.name}/${uniqueFilename};

//     // Delete the local PDF file from the /tmp directory
//     fs.unlink(pdfFilePath, (err) => {
//       if (err) {
//         console.error(Error deleting the local PDF file: ${err});
//       } else {
//         console.log(Successfully deleted the local PDF file: ${pdfFilePath});
//       }
//     });

//     return publicUrl;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// };

// module.exports = {
//   uploadFile,
//   bucket
// };







require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For generating unique file names
const fs = require('fs'); // Import the fs module
const pdf = require('html-pdf'); // For HTML to PDF conversion

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Cloud Storage
const bucket = admin.storage().bucket();

// Upload a file to Firebase Storage
const uploadFile = async (file) => {
  try {
    console.log("file", file);

    const { originalname, buffer } = file;
    const uniqueFilename = `${uuidv4()}-${path.parse(originalname).name}.pdf`; // Save as PDF

    // Convert HTML to PDF using `html-pdf`
    const pdfFilePath = path.join('/tmp', uniqueFilename);
    const htmlContent = buffer.toString('utf8');

    // PDF options
    const options = { format: 'A4' };

    // Convert HTML to PDF and save it to the /tmp directory
    await new Promise((resolve, reject) => {
      pdf.create(htmlContent, options).toFile(pdfFilePath, (err, res) => {
        if (err) {
          console.error("Error during PDF conversion:", err);
          reject(err);
        } else {
          console.log("PDF generated successfully!");
          resolve();
        }
      });
    });

    // Upload PDF from the /tmp directory to Firebase Storage
    await bucket.upload(pdfFilePath, {
      destination: uniqueFilename,
      metadata: {
        contentType: 'application/pdf',
      },
    });

    // Make the PDF publicly accessible
    const fileUpload = bucket.file(uniqueFilename);
    await fileUpload.makePublic();

    // Get the public URL of the uploaded PDF
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;

    // Delete the local PDF file from the /tmp directory
    fs.unlink(pdfFilePath, (err) => {
      if (err) {
        console.error(`Error deleting the local PDF file: ${err}`);
      } else {
        console.log(`Successfully deleted the local PDF file: ${pdfFilePath}`);
      }
    });

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  bucket
};
