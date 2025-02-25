import AWS from 'aws-sdk';
import { config } from './aws-config';

AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
});

const s3 = new AWS.S3();

export const uploadFile = async (file: File) => {
    const params = {
        Bucket: config.bucketName!,
        Key: `pdfs/${Date.now()}_${file.name}`,
        Body: file,
        ContentType: file.type
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export const getFileUrl = (fileName: string) => {
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${fileName}`;
};

export const listFiles = async () => {
    const params = {
        Bucket: config.bucketName!,
        Prefix: 'pdfs/'
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents?.map(file => file.Key) || [];
    } catch (error) {
        console.error('List files error:', error);
        throw error;
    }
};