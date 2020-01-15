import axios from "axios";
export default async (context) => {
    if (context.app.context.app.$cookies.get('token')) {
        const checkToken = await axios.get(
            process.env.apiUrl + "/user/check-token",
            context.app.context.app.$cookies.get('header-token')
        );
        if (!checkToken.data.status) {            
            return context.redirect(process.env.baseUrl);
        }
    } else {
        return context.redirect(process.env.baseUrl);
    }
}