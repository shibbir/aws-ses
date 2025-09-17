const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sesClient = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

app.post('/send-email', async (req, res, next) => {
    const { from, to, subject, message } = req.body;

    if (!from || !to || !subject || !message) {
        return res.sendStatus(400);
    }

    const params = {
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        Content: {
            Simple: {
                Subject: { Data: subject },
                Body: { Text: { Data: message } }
            }
        }
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        res.json({ success: true, messageId: result.MessageId });
    } catch (err) {
        next(err);
    }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
