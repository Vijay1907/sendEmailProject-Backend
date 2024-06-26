
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const User = require('../models/user')
const Client = require('../models/client')

const sendEmails = require('../utils/sendEmail')

const authenticateAdmin = require('../middlewares/authenticateAdmin')
const { getFileUploader } = require('../middlewares/fileUpload');



const nodemailer = require('nodemailer');
const multer = require('multer');
const Category = require('../models/category');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajayraj072001@gmail.com', // Your Gmail email address
        pass: 'nweu lmcl wupy lbeu',  // Your Gmail password
    }
});

router.post('/sendEmail', upload.single('file'), (req, res) => {
    try {
        console.log('Body:', req.body);
        console.log('File:', req.file); // Access the single file

        const { subject, message } = req.body;
        const recipients = JSON.parse(req.body.emails); // Parse the array of recipient objects

        console.log(recipients, 'heyhghjghj')

        const attachment = {
            filename: req.file.originalname,
            content: req.file.buffer,
            cid: 'unique@nodemailer.com' // define unique content id
        };

        // const embeddedImage = `<img src="cid:${attachment.cid}" alt="Embedded Image"/>`;

        recipients.forEach(({ email, nickName }) => {
            // const personalizedMessage = `Dear ${nickName},\n\n${message}\n\n${embeddedImage}`;

            const personalizedMessage = `
            <p>Dear ${nickName},</p>
        <p>${message}</p><br><br><br>
        <div style="text-align: center;">
        <img src="cid:${attachment.cid}" alt="Embedded Image" style="display: block; width: 100%; height: auto;">
    </div>
    <div style="height: 20px;"></div>   
        `;

            const mailOptions = {
                from: 'ajayraj072001@gmail.com',
                to: email,
                subject: subject,
                html: personalizedMessage,
                attachments: [attachment] // Attach single file as attachment
            };

            transporter.sendMail(mailOptions)
                .then(() => {
                    console.log(`Email sent to ${email}`);
                })
                .catch(error => {
                    console.error(`Error sending email to ${email}:`, error);
                });
        });

        res.send({ message: 'Email sending process started in the background' });
    } catch (err) {
        console.log('error11', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// router.post('/sendEmail', upload.array('files'), (req, res) => {
//     try {
//         console.log('Body:', req.body);
//         console.log('Files:', req.files);

//         const { subject, message } = req.body

//         let to = JSON.parse(req.body.emails); // Parse the string back into an array of email addresses

//         const attachments = req.files.map(file => ({
//             filename: file.originalname,
//             content: file.buffer
//         }));

//         const mailOptions = {
//             from: 'ajayraj072001@gmail.com',
//             subject: subject,
//             text: message,
//             attachments: attachments
//         };

//         to.forEach(recipient => {
//             const mailOpts = { ...mailOptions, to: recipient };
//             transporter.sendMail(mailOpts)
//                 .then(() => {
//                     console.log(`Email sent to ${recipient}`);
//                 })
//                 .catch(error => {
//                     console.error(`Error sending email to ${recipient}:`, error);
//                 });
//         });

//         res.send({ message: 'Email sending process started in the background' });
//     } catch (err) {
//         console.log('error11', err)
//         res.status(500).json({ success: false, message: err.message });
//     }
// });


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: admin._id }, process.env.ACCESS_TOKEN_SECRET);


        res.status(200).json({ success: true, message: 'Login successfully', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/logout', (req, res) => {

    res.status(200).json({ success: true, message: 'Logout successful.' });
});

router.get('/get_admin_info', authenticateAdmin, async (req, res) => {
    try {
        const id = req.admin._id
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Admin details retrieved successfully.',
            adminProfile: admin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.put('/reset_password', authenticateAdmin, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.admin._id;

        // Check if both oldPassword and newPassword are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both oldPassword and newPassword are required fields.' });
        }

        const admin = await Admin.findById(id)
        if (!admin) {
            res.status(400).send({ success: false, message: 'Admin not found.' })
        }

        // Compare oldPassword with the hashed password stored in the database
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid old password.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update admin password
        admin.password = hashedNewPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});



router.put('/update_admin', authenticateAdmin, async (req, res) => {
    try {
        const { name, email } = req.body;
        const id = req.admin._id;

        // Check if both name and email are provided
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required fields.' });
        }

        // Update admin document
        const updatedAdmin = await Admin.findByIdAndUpdate(id, { name, email }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Admin details updated successfully.',
            updatedAdminProfile: updatedAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.post('/create_user', authenticateAdmin, async (req, res) => {
    try {
        const { email, name, nickName, address, categoryId, landLine, phone, displayMessage } = req.body
        const userExist = await User.findOne({ email })

        if (userExist) {
            res.status(400).send({ status: false, message: "User already exist with this email" })
        }

        const newUser = await User.create({
            email,
            name,
            nickName,
            address,
            categoryId,
            landLine,
            phone,
            displayMessage
        });

        res.status(201).json({ success: true, message: "User created successfully", data: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.post('/create_category', authenticateAdmin, async (req, res) => {
    try {
        const { categoryName } = req.body
        const categoryExist = await Category.findOne({ categoryName })

        if (categoryExist) {
            res.status(400).send({ status: false, message: "Category already exist with this name" })
        }

        const newUser = await Category.create({
            categoryName,
        });

        res.status(201).json({ success: true, message: "Category created successfully", data: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
router.delete('/delete_category/:categoryId', authenticateAdmin, async (req, res) => {
    try {
        const { categoryId } = req.params
        await Category.findByIdAndDelete(categoryId)
        await User.deleteMany({ categoryId })


        res.status(201).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        const categories = await Category.find({});
        const results = [];

        for (const category of categories) {
            const count = await User.countDocuments({ categoryId: category._id });
            results.push({
                name: `Total ${category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}`,
                count: count,
                _id: category._id,
                categoryName: category.categoryName
            });
        }
        const clientsCount = await Client.count();
        res.status(200).json({ data: results, clientsCount: clientsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: 'Internal server error.'

        });
    }
});

router.get('/get_user/:id', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.put('/edit_user/:id', authenticateAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.delete('/delete_user/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.post('/create_client', authenticateAdmin, getFileUploader('profileImage', 'client_images'), async (req, res) => {
    try {
        const { email, serviceType, companyName, clientName, phone, address } = req.body;
        const newClient = new Client({
            email,
            serviceType,
            companyName,
            clientName,
            phone,
            address,
            profileImage: req.file ? `uploads/client_images/${req.file.filename}` : ''
        });
        await newClient.save();
        res.status(201).json({ success: true, message: "Client added successfully", data: newClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.get('/get_clients', authenticateAdmin, async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// router.get('/get_categories', authenticateAdmin, async (req, res) => {
//     try {
//         const clients = await Category.find();
//         res.status(200).json({ success: true, clients });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
// });

router.get('/get_users/:categoryId', authenticateAdmin, async (req, res) => {
    try {
        const { categoryId } = req.params
        console.log("hiiiiiiiiiiiiii0", categoryId)

        const users = await User.find({ categoryId });
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.get('/get_client/:id', authenticateAdmin, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.put('/edit_client/:id', authenticateAdmin, getFileUploader('image', 'client_images'), async (req, res) => {
    try {
        const { email, serviceType, companyName, clientName, phone, address } = req.body;
        const updatedFields = {
            email,
            serviceType,
            companyName,
            clientName,
            phone,
            address
        };

        if (req.file) {
            updatedFields.image = `client_images/${req.file.filename}`;
        }

        const updatedClient = await Client.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        res.status(200).json({ success: true, data: updatedClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


router.delete('/delete_client/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        res.status(200).json({ success: true, message: 'Client deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;
