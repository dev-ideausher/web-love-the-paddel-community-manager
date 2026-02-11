import {
  apiError,
  appendQueryParams,
  getAuthToken,
  responseValidator,
  URL,
} from "./api/helper";

export const getMatchesList = async (payload) => {
  let endpoint = `${URL}/communities/matches`;
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

export const getPushMatchesList = async (payload) => {
  let endpoint = `${URL}/matches/admin`;
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
  let endpoint = `${URL}/matches/${id}`;
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

export const deleteMatches = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const endpoint = `${URL}/matches`;

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

export const createMatch = async (payload) => {
  const endpoint = `${URL}/communities/matches/`;
  const token = await getAuthToken();
  console.log('Payload being sent:', payload);
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
    console.error('Create match error:', error);
    return apiError(error);
  }
};
export const cancelMatch = async (id) => {
  const endpoint = `${URL}/communities/matches/${id}/cancel`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};

export const editMatch = async (id, payload) => {
  const endpoint = `${URL}/matches/${id}`;
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

export const getUnreadMatches = async () => {
  let endpoint = `${URL}/matches/unread`;
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

export const subscribeMatches = async ({ fcmToken }) => {
  try {
    const token = await getAuthToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const endpoint = `${URL}/matches/subscribe/${fcmToken}`;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    console.error("subscribeMatches error:", error);
    return apiError(error);
  }
};

export const unsubscribeMatches = async ({ fcmToken }) => {
  try {
    const requestOptions = await getRequestOptions();
    const payload = {
      fcmToken,
    };

    const response = await fetch(`${URL}/matches/unsubscribe/${fcmToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requestOptions.headers,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

export const readUnreadNotification = async (payload) => {
  const endpoint = `${URL}/matches/mark-read-unread`;
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
  const endpoint = `${URL}/matches/mark-read`;
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
  const endpoint = `${URL}/matches/mark-unread`;
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

export const deleteMatch = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  const endpoint = `${URL}/communities/matches/${id}`;
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const response = await fetch(`${endpoint}`, requestOptions);

    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};
