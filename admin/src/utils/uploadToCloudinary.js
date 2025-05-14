export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ecommerce");   // 🔁 replace this
  data.append("cloud_name", "dksz8hsb4");      // 🔁 replace this

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dksz8hsb4/image/upload", {
      method: "POST",
      body: data
    });
    const json = await res.json();
    return json.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
};