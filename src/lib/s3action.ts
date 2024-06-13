"use server"

import { getSignedUrlForS3Object } from "@/lib/s3";

export async function createUploadURL(key: string, type: string) {
    return await getSignedUrlForS3Object(key, type);
}