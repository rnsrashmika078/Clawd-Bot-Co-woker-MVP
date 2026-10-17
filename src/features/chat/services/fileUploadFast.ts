export const uploadFile = async (
  file: File | null,
  userId: number | undefined,
) => {
  if (!userId || !file) {
    throw new Error("User id or file not defined!");
  }
  console.log("FILE", file);

  const formData = new FormData();

  formData.append("file", file);

  console.log("formData", formData);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  console.log("response", response);

  if (!response.ok) {
    throw new Error("Image upload failed");
  }
  const data = await response.json();
  console.log("DATA ABOUT FILE", data);

  return {
    secure_url: data.secure_url,
    format: data.format,
  };
};
