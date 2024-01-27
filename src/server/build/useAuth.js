import { useEffect, useState } from 'react';
import axios from 'axios';
function useAuth({ code }) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
    console.log('code:', code);
    useEffect(() => {
        axios
            .post('http://localhost:3001/login', {
            code
        })
            .then((res) => {
            console.log('resLogin:', res.data);
            setAccessToken(res.data.accessToken);
            console.log(accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            window.history.pushState({}, '', '/');
        }).catch(() => {
            console.log('we are in catch');
            window.location.href = '/';
        });
    }, [code]);
    useEffect(() => {
        if (!refreshToken || !expiresIn)
            return;
        console.log('refreshToken:', refreshToken);
        const interval = setInterval(() => {
            axios
                .post('http://localhost:3001/refresh', {
                refreshToken,
            })
                .then((res) => {
                console.log('resRefresh:', res);
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            }).catch(() => {
                window.location.href = '/';
            });
        }, (expiresIn - 60) * 1000);
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);
    return accessToken;
}
export default useAuth;
