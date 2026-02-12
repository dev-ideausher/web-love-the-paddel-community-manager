import { URL, getAuthToken, responseValidator, apiError, appendQueryParams } from "./helper";

export const getCommunityManagerNotifications = async (payload) => {
  let endpoint = `${URL}/notifications/community-manager`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  
  if (payload) {
    const queryParams = appendQueryParams(payload);
    endpoint += queryParams;
  }
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};
