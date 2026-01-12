export const uploadImage = async (file, userId, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "user_docs_unsigned");
  formData.append("folder", `user_docs/${userId}`);
  formData.append("public_id", type);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/drxpclusd/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return data.secure_url;
};
