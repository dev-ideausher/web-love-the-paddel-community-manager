import { apiError, getAuthToken, responseValidator, URL } from "./api/helper";

const compressImage = async (file, maxSizeMB = 1) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const uploadFile = async (file) => {
  const endpoint = `/api/proxy/files`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let fileToUpload = file;
  if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
    fileToUpload = await compressImage(file);
  }

  const formData = new FormData();
  formData.append("files", fileToUpload);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formData,
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    const result = await responseValidator(response, true);
    
    if (result.status && result.data && result.data.length > 0) {
      return { status: true, data: { url: result.data[0].url } };
    }
    
    return result;
  } catch (error) {
    return apiError(error);
  }
};
