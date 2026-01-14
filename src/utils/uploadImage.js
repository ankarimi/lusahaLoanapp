export const uploadImage = async (file, userId, type) => {
  const formData = new FormData();
  formData.append("file", file);
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "user_docs_unsigned";
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "drxpclusd";
  formData.append("upload_preset", preset);
  formData.append("folder", `user_docs/${userId}`);
  formData.append("public_id", type);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return data.secure_url;
};
