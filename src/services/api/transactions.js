import { URL, getRequestOptions, responseValidator, apiError, appendQueryParams } from "./helper";

export const getCommunityTransactions = async (payload = {}) => {
    try {
        const queryParams = appendQueryParams(payload);
        const requestOptions = await getRequestOptions();
        const response = await fetch(`${URL}/communities/transactions${queryParams}`, {
            method: 'GET',
            ...requestOptions
        });
        return await responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
};

export const getCommunityDashboard = async () => {
    try {
        const requestOptions = await getRequestOptions();
        const response = await fetch(`${URL}/communities/dashboard`, {
            method: 'GET',
            ...requestOptions
        });
        return await responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
};
