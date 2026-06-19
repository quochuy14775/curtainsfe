import { api } from "@/lib/api";

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

export const uploadService = {
  // Upload ảnh: xin chữ ký từ BE (chỉ admin) rồi đẩy thẳng lên Cloudinary.
  async uploadImage(file: File): Promise<string> {
    const sig = await api.get<UploadSignature>("/upload/signature");

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("folder", sig.folder);
    form.append("signature", sig.signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: form }
    );

    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url as string;
  },
};
