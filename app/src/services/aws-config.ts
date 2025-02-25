export const config = {
    region: process.env.VITE_APP_AWS_REGION,
    accessKeyId: process.env.VITE_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.VITE_APP_AWS_SECRET_KEY,
    bucketName: process.env.VITE_APP_S3_BUCKET
};