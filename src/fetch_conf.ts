const url = "http://89.168.27.59:8080/";

const getHeaders = (token: string) => {
    return {
        "Authorization": "Bearer " + token,
        'Content-Type': 'application/json'
    }
}

export { url, getHeaders };
