const BASE_URL = "https://earth-intel.onrender.com";

export const predictSoil = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
};