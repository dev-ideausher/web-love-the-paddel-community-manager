import { URL, responseValidator, apiError } from "./helper";

export const userLogin = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`)


    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };
    try{
        const response = await fetch(URL+"/auth/login", requestOptions) 
        return responseValidator(response)
    }
    catch(e){
        return apiError(e)
    }
}

export const resetPassword = async (token, newPassword) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ newPassword }),
        redirect: "follow"
    };
    try {
        const response = await fetch(URL + "/auth/reset-password", requestOptions);
        return responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
}
