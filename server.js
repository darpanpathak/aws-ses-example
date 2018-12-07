const xlsx = require('xlsx');
const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
    accessKeyId: "<your access key>",
    secretAccessKey: "<your access secret>",
    region: "us-east-1"
});

const ses = new AWS.SES({
    apiVersion: "2010-12-01"
});

function sendEmail() {

     let workbook = xlsx.readFile('./inkloft.xlsx');
    let data = xlsx.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

    let emailIds = data.map((item) => {
        return item.email;
    });


    let htmlText = fs.readFileSync("./newsletter.txt").toString();

    //console.log(htmlText);

    const params = {
        Destination: {
            ToAddresses: emailIds // Email address/addresses that you want to send your email
        },
        Message: {
            Body: {
                Html: {
                    // HTML Format of the email
                    Charset: "UTF-8",
                    Data: htmlText
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Test email"
            }
        },
        Source: "info@inkloft.in"
    };

    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
        .then(data => {
            console.log("Done" + JSON.stringify(data));
        })
        .catch(error => {
            console.log(error);
        });
}

sendEmail();