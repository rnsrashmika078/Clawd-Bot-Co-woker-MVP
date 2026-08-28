export const LocalUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/local-upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  

  return data.url;
};