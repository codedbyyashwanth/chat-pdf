export const config = {
    region: import.meta.env.VITE_API_AWS_REGION,
    accessKeyId: import.meta.env.VITE_API_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_API_AWS_SECRET_KEY,
    bucketName: import.meta.env.VITE_API_S3_BUCKET
};