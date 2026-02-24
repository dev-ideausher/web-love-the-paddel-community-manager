import {
  apiError,
  appendQueryParams,
  getAuthToken,
  responseValidator,
  URL,
} from "./api/helper";

export const getSubCommunitiesList = async (payload) => {
  let endpoint = `${URL}/communities/sub-communities`;
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

export const getPushSubCommunitiesList = async (payload) => {
  let endpoint = `${URL}/subCommunities/admin`;
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

export const getNotificationById = async (id, payload) => {
  let endpoint = `${URL}/subCommunities/${id}`;
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

export const deleteSubCommunity = async (communityId, subCommunityId) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const endpoint = `${URL}/communities/sub-communities/${communityId}`;

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};

export const deleteSubCommunities = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const endpoint = `${URL}/subCommunities`;

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: JSON.stringify({ ids: [id] }),
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};

export const createSubCommunities = async (payload) => {
  const endpoint = `${URL}/subCommunities`;
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

export const createSubCommunity = async (payload) => {
  const endpoint = `${URL}/communities/`;
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
    const result = await responseValidator(response, true);
    return result;
  } catch (error) {
    console.error('Create error:', error);
    return apiError(error);
  }
};

export const updateSubCommunity = async (id, payload) => {
  const endpoint = `${URL}/communities/sub-communities/${id}`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
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

export const editNotification = async (id, payload) => {
  const endpoint = `${URL}/subCommunities/${id}`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
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

export const getUnreadSubCommunities = async () => {
  let endpoint = `${URL}/subCommunities/unread`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

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

export const subscribeSubCommunities = async ({ fcmToken }) => {
  try {
    const token = await getAuthToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const endpoint = `${URL}/subCommunities/subscribe/${fcmToken}`;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    console.error("subscribeSubCommunities error:", error);
    return apiError(error);
  }
};

export const unsubscribeSubCommunities = async ({ fcmToken }) => {
  try {
    const requestOptions = await getRequestOptions();
    const payload = {
      fcmToken,
    };

    const response = await fetch(
      `${URL}/subCommunities/unsubscribe/${fcmToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...requestOptions.headers,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      },
    );

    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

export const readUnreadNotification = async (payload) => {
  const endpoint = `${URL}/subCommunities/mark-read-unread`;
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

export const readUnreadSingleNotification = async (payload) => {
  const endpoint = `${URL}/subCommunities/mark-read`;
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
export const unreadNotification = async (payload) => {
  const endpoint = `${URL}/subCommunities/mark-unread`;
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

export const deletePushSubCommunities = async (payload) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  let endpoint = `${URL}/subCommunities`;
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: JSON.stringify(payload),
    redirect: "follow",
  };
  try {
    const response = await fetch(`${endpoint}`, requestOptions);

    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};
