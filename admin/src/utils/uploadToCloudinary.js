export const uploadToCloudinary = async (fileOrUrl) => {
  const data = new FormData();

  if (typeof fileOrUrl === 'string') {
    const response = await fetch(fileOrUrl);
    const blob = await response.blob();
    fileOrUrl = new File([blob], "image.jpg", { type: blob.type });
  }

  data.append("file", fileOrUrl);

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cloudinary/upload`, {
      method: "POST",
      body: data
    });

    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};