import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const contactData = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
        };

        const contactsDir = path.join(__dirname, '../data');
        const contactsFile = path.join(contactsDir, 'contacts.json');

        try {
            await fs.access(contactsDir);
        } catch {
            await fs.mkdir(contactsDir, { recursive: true });
        }

        await fs.writeFile(
            contactsFile,
            JSON.stringify(contactData, null, 2),
            'utf8'
        );

        console.log(`Contact saved: ${name.trim()} (${email.trim()})`);

        res.status(201).json({
            success: true,
            message: "Thanks! Your message has been received.",
            data: {
                id: contactData.id,
                name: contactData.name,
                email: contactData.email,
                timestamp: contactData.timestamp
            }
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            error: "Failed to save your message. Please try again later."
        });
    }
};

export default {
    contact,
};
