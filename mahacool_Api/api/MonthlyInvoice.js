const express = require('express');
const router = express.Router();
const MonthlyInvoice = require('../schema/MonthlyInvoice');
const { ClientSchemas } = require('../schema/Client');
const multer = require('multer');
const {uploadFile } = require('../firebase');

const upload = multer();
router.get('/invoices', async (req, res) => {
    try {
        // Find all invoices
        const invoices = await MonthlyInvoice.find({}, 'customerId totalPaidAmount unpaidRemainingAmount');

        if (invoices.length === 0) {
            return res.status(404).json({ message: 'No invoices found.' });
        }

        // Initialize totals
        let totalGrandAmount = 0;
        let totalRemainingAmount = 0;

        // Map to extract the necessary fields and calculate totals
        const response = invoices.map(invoice => {
            totalGrandAmount += invoice.totalPaidAmount; // Sum totalPaidAmount
            totalRemainingAmount += invoice.unpaidRemainingAmount; // Sum unpaidRemainingAmount
            
            return {
                customerId: invoice.customerId,
                totalPaidAmount: invoice.totalPaidAmount,
                unpaidRemainingAmount: invoice.unpaidRemainingAmount,
            };
        });

        // Add total amounts to response
        const totals = {
            totalGrandAmount,
            totalRemainingAmount,
        };

        return res.status(200).json({ invoices: response, totals });
    } catch (error) {
        console.error('Error retrieving invoices:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


// Function to handle PDF upload and client update
const handlePDFUpload = async (clientId, htmlBuffer) => {
    try {
        console.log('Starting PDF upload process...'); // Start of the process

        // Prepare the upload object for the uploadFile function
        const uploadObject = {
            originalname: 'invoice.html', // Name the file appropriately
            buffer: htmlBuffer,           // The HTML buffer
            mimetype: 'application/html'   // Set the appropriate MIME type
        };

        console.log('Upload object prepared:', uploadObject); // Log the upload object

        // Upload the PDF buffer using uploadFile
        const pdfUrl = await uploadFile(uploadObject);
        console.log('PDF uploaded successfully. URL:', pdfUrl); // Log successful upload

        // Find the client by customer ID, only fetch fileUrls
        const client = await ClientSchemas.findOne({ customerID: clientId }).select('fileUrls');
        if (!client) {
            console.error('Client not found for ID:', clientId); // Log if client is not found
            throw new Error('Client not found');
        }

        console.log('Client found:', client); // Log the found client

        // Initialize fileUrls array if it doesn't exist or contains invalid values
        if (!client.fileUrls || !Array.isArray(client.fileUrls)) {
            client.fileUrls = [];
        } else {
            // Filter out invalid entries (ensure each is an object with a 'url' field)
            client.fileUrls = client.fileUrls.filter(item => typeof item === 'object' && item.url);
        }

        // Add the new file URL with the current date
        client.fileUrls.push({
            url: pdfUrl,
            date: new Date().toISOString(),
        });

        // Save only the updated fileUrls field
        await ClientSchemas.updateOne({ customerID: clientId }, { $set: { fileUrls: client.fileUrls } });
        console.log('Client file URLs updated successfully.'); // Log successful update
        
        return pdfUrl; // Return the URL for the response
    } catch (error) {
        console.error('Error in handlePDFUpload:', error.message); // Log the error message
        throw error; // Rethrow to handle in the caller function
    }
};

// Route to handle HTML to PDF conversion and Firebase upload


// Route to update paid totals
router.post('/updatePaidTotals/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const { paidGrandTotalAmounts } = req.body;

    // Validate input
    if (!paidGrandTotalAmounts || paidGrandTotalAmounts <= 0) {
        console.log('Invalid input for paidGrandTotalAmounts:', paidGrandTotalAmounts);
        return res.status(400).json({ message: 'Invalid paidGrandTotalAmounts. It must be greater than zero.' });
    }

    try {
        // Find the customer by customer ID
        const customer = await ClientSchemas.findOne({ customerID: customerId });
        if (!customer) {
            console.log(`Customer not found for Customer ID: ${customerId}`);
            return res.status(404).json({ message: `Customer not found for Customer ID: ${customerId}` });
        }

        // Find the invoice by customer ID
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            console.log(`Invoice not found for Customer ID: ${customerId}`);
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
        }

        // Push the new payment to the paidGrandTotalAmounts array
        const paymentDate = new Date();
        invoice.paidGrandTotalAmounts.push({ amount: paidGrandTotalAmounts, date: paymentDate });
        await invoice.processPayments(); 
        // Calculate totals
        const totalPaidAmount = invoice.paidGrandTotalAmounts.reduce((total, payment) => total + payment.amount, 0);
        const grandTotalAmount = invoice.grandTotalAmount;
        const unpaidRemainingAmount = grandTotalAmount - totalPaidAmount;

        // Prepare HTML content for PDF generation
        const htmlContent = `
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                padding: 0; 
                background-color: #f4f4f4; 
            }
            .invoice-container { 
                background-color: #ffffff; 
                padding: 20px; 
                border-radius: 10px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                text-align: center; 
                max-width: 800px; 
                margin: auto; 
            }
            .invoice-header { 
                margin-bottom: 30px; 
            }
            .logo { 
                width: 100px; 
                height: auto; 
            }
            h1 { 
                font-size: 12px; 
                margin-bottom: 20px; 
                color: #333; 
            }
            h2 { 
                margin: 0; 
                font-size: 10px; 
                color: #555; 
            }
            .contact-details, .company-details { 
                margin: 10px 0; 
                font-size: 6px; 
                color: #666; 
            }
            .customer-details, .invoice-details { 
                margin-top: 20px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
                padding: 15px; 
                display: inline-block; 
                width: 80%; 
                background-color: #fafafa; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h3 { 
                margin-bottom: 5px; 
                color: #333; 
                border-bottom: 2px solid #007bff; 
                padding-bottom: 5px; 
            }
            p { 
                margin: 5px 0; 
                font-size: 8px; 
                line-height: 1.5; 
            }
            .total { 
                font-weight: bold; 
                font-size: 8px; 
                color: #007bff; 
            }
            .payment-info { 
                margin-top: 10px; 
                border-top: 2px solid #ddd; 
                padding-top: 10px; 
                font-size: 16px; 
            }
            @media print {
                body { 
                    margin: 0; 
                    padding: 0; 
                }
                .invoice-container { 
                    box-shadow: none; 
                }
            }
        </style>
        <div class="invoice-container">
            <div class="invoice-header">
                <img src="https://firebasestorage.googleapis.com/v0/b/mahacool-5b59f.appspot.com/o/icons%2Fmahacool%20app%20icon%20basic.jpg?alt=media&token=ad59b58c-a3ea-4e83-81de-dbc737b70225" alt="Company Logo" class="logo" />
                <h2 class="company-name">www.mahacool.com</h2>
                <div class="contact-details">
                    <p>Email: gaurav@anakeen.net</p>
                    <p>Direct Line: +91-9818647283</p>
                </div>
                <div class="company-details">
                    <p>GSTN: 07AHFPA6877M1ZW</p>
                    <p>2317/30, Gali Hinga Beg, Tilak Bazar, Khari Baoli, New Delhi, 110018</p>
                </div>
            </div>
            <h1 style="font-size: 10px;">Invoice Details for Customer ID: ${customerId}</h1>
            <div class="customer-details">
                <h3 style="font-size: 10px;">Customer Information</h3>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Business Name:</strong> ${customer.bussinessName}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Mobile:</strong> ${customer.mobile}</p>
                <p><strong>Address:</strong> ${customer.address}</p>
                <p><strong>GST Number:</strong> ${customer.gstNumber || 'N/A'}</p>
            </div>
            <div class="invoice-details">
                <h3 style="font-size: 10px;">Invoice Summary</h3>
                <p><strong>Paid Amount:</strong> ₹${paidGrandTotalAmounts.toFixed(2)}</p>
                <p class="total"><strong>Total Paid Amount:</strong> ₹${totalPaidAmount.toFixed(2)}</p>
                <p class="total"><strong>Grand Total Amount with 18% GST:</strong> ₹${grandTotalAmount.toFixed(2)}</p>
                <p class="total"><strong>Unpaid Remaining Amount:</strong> ₹${unpaidRemainingAmount.toFixed(2)}</p>
            </div>
            <div class="payment-info">
                <h3 style="font-size: 10px;">Payment Details</h3>
                <p><strong>Payment Date:</strong> ${paymentDate.toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
        // Call the handlePDFUpload function
        const pdfUrl = await handlePDFUpload(customerId, htmlContent);

        // Save the updated invoice
        await invoice.save();

        res.status(200).json({ message: 'Paid totals updated successfully', pdfUrl, paidGrandTotalAmounts });
    } catch (error) {
        console.error(`Error updating paid totals for Customer ID: ${customerId}`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/upload/:clientId', upload.single('file'), async (req, res) => {
    try {
        const clientId = req.params.clientId;  // Extract the clientId from the URL parameters
        console.log(`Client ID: ${clientId}`);  // Log the clientId for debugging
        
        const file = req.file;  // Get the uploaded file from the request
        console.log('Uploaded File:', file);  // Log the file details

        if (!file) {
            console.log('No file uploaded');  // Log the absence of an uploaded file
            return res.status(400).send('No file uploaded');  // Send a 400 response if no file is uploaded
        }

        const htmlContent = file.buffer.toString();  // Convert the file buffer to a string (HTML content)
        console.log('HTML Content:', htmlContent);  // Log the HTML content for debugging

        const pdfUrl = await handlePDFUpload(clientId, htmlContent);  // Handle the PDF upload
        console.log(`PDF URL: ${pdfUrl}`);  // Log the generated PDF URL

        res.status(200).json({ msg: 'PDF uploaded successfully', pdfUrl });  // Send a success response with the PDF URL
    } catch (error) {
        console.error('Error occurred in /upload:', error.message);  // Log any errors that occur
        res.status(500).json({ msg: 'Server error' });  // Send a 500 response if an error occurs
    }
});


router.get('/getAll', async (req, res) => {
    try {
        const invoices = await MonthlyInvoice.find({});
        if (invoices.length === 0) {
            return res.status(404).json({ message: 'No invoices found' });
        }
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching all invoices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. Route to get invoice by customerId
router.get('/getByCustomerId/:customerId', async (req, res) => {
    const { customerId } = req.params;
    
    try {
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error(`Error fetching invoice for Customer ID: ${customerId}`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// router.post('/updatePaidTotals/:customerId', async (req, res) => {
//     const { customerId } = req.params;
//     const { paidGrandTotalAmounts } = req.body; // paid amount directly from the request

//     // Validate input
//     if (!paidGrandTotalAmounts || paidGrandTotalAmounts <= 0) {
//         return res.status(400).json({ message: 'Invalid paidGrandTotalAmounts. It must be greater than zero.' });
//     }

//     try {
//         // Find the invoice by customer ID
//         const invoice = await MonthlyInvoice.findOne({ customerId });
//         if (!invoice) {
//             return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
//         }

//         // Push the new payment to the paidGrandTotalAmounts array
//         invoice.paidGrandTotalAmounts.push({ 
//             amount: paidGrandTotalAmounts, 
//             date: new Date() 
//         });

//         // Process payments
//         await invoice.processPayments(); 

//         // Save the updated invoice
//         await invoice.save();

//         res.status(200).json({ message: 'Paid totals updated successfully', paidGrandTotalAmounts });
//     } catch (error) {
//         console.error(`Error updating paid totals for Customer ID: ${customerId}`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });






    



module.exports = router;



