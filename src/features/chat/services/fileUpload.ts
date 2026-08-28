

const Name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const Preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (
  file: File | null,
  userId: number | undefined,
) => {
  if (!userId || !file) throw new Error("User id or file not defined!");
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", Preset!);
  formData.append("folder", `flowsome/lib/${userId ?? 1}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${Name!}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return { secure_url: data.secure_url, format: data.format };
};
