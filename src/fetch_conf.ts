const url = "http://localhost:8080/";

const getHeaders = (token: string) => {
    return {
        "Authorization": "Bearer " + token,
        'Content-Type': 'application/json'
    }
}

export { url, getHeaders };