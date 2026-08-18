export const LocalUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log(data.url);
  return data.url;
};