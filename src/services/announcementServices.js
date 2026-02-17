import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getAnnouncementsList = async (payload) => {
  let endpoint = `${URL}/announcements`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  const queryParams = appendQueryParams(payload);
  endpoint += queryParams;
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${endpoint}`, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

export const createAnnouncement = async (payload) => {
  const endpoint = `${URL}/announcements/`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};
