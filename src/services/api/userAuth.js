import { URL, responseValidator, apiError } from "./helper";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase-services/firebase";

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

export const forgotPasswordAPI = async (email) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ email }),
        redirect: "follow"
    };
    try {
        const response = await fetch(URL + "/auth/reset-password", requestOptions);
        return responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
}

export const resetPassword = async (oobCode, newPassword) => {
    try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        return { status: true, message: "Password reset successfully" };
    } catch (e) {
        return apiError(e);
    }
}
