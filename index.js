const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()

// AWS credentials and configuration
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_KEY
const region = process.env.REGION
const bucket = process.env.BUCKET

// Initialize S3 client
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

// Function to upload file to S3
async function uploadFileToS3() {
    const uploadParams = {
        Bucket: bucket,
        Key: 'file.txt', // Object key in S3
        Body: fs.createReadStream('file.txt')
    };

    try {
        const data = await s3.upload(uploadParams).promise()
        console.log('File uploaded successfully to bucket:', data.Bucket)
    } catch (err) {
        console.error('Error uploading file:', err)
    }
}

// Function to download object from S3
async function downloadObjectFromS3(bucketName, objectKey, destinationPath) {
    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    try {
        const data = await s3.getObject(params).promise()
        fs.writeFileSync(destinationPath, data.Body)
        console.log(`Object '${objectKey}' downloaded successfully to '${destinationPath}'`)
    } catch (err) {
        console.error('Error downloading object:', err)
    }
}

// Async wrapper function to run the upload and download functions
async function runUploadAndDownload() {
    try {
        await uploadFileToS3();
        await downloadObjectFromS3(bucket, 'file.txt', 'downloadedFile.txt')
    } catch (err) {
        console.error('Error in runUploadAndDownload:', err)
    }
}

// Call the function to upload the file
runUploadAndDownload()