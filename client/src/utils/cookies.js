export const setCookie = (tokenName, tokenValue, days) => {
    const expires = new Date(Date.now() + days * 864000000).toUTCString();
    document.cookie = `${tokenName}=${tokenValue}; expires=${expires}; path=/; secure; samesite=lax`;
}

export const getCookie = (name) => {
    return decodeURIComponent(document.cookie)
        .split('; ')
        .find(row => row.startsWith(name))
        ?.split('=')[1];
}

export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};