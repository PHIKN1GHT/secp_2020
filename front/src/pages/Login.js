import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Toast from '../components/Toast';

export default function LoginPage(props) {
    const [captchaTimes, setCaptchaTimes] = useState(0)
    const [captchaURL, setCaptchaURL] = useState("")
    //let captchaURL = 'http://localhost:2333/api/account/captcha#'+Date.now()
    console.log('a')
    const handleChangeCaptcha = () => {
        //setCaptchaURL()
        
        let url = 'http://localhost:2333/api/account/captcha#'+Date.now()
        
        fetch(url)
            .then(response => response.blob()) // parses response to blob
            .then((imgData) => {
                setCaptchaURL(url)
                //setCaptchaURL(URL.createObjectURL(imgData))
                setCaptchaTimes(prevState => prevState + 1)
                //console.log(imgData)
            })

        //console.log('http://localhost:2333/api/account/captcha#'+Date.now())
        /*fetch('http://localhost:2333/api/account/captcha#'+Date.now())
            .then(response => response.blob()) // parses response to blob
            .then((imgData) => {
                setCaptchaURL(URL.createObjectURL(imgData))
                console.log(URL.createObjectURL(imgData))
            })*/
    }
    
    useEffect(()=>{
        handleChangeCaptcha()
    }, [])

    const handleLogin = (event) => {
        const username = document.getElementsByName('username')[0].value
        const password = document.getElementsByName('password')[0].value
        const captcha = document.getElementsByName('captcha')[0].value
        const bodyData = JSON.stringify({
            username: username,
            password: password,
            captcha: captcha
        })
        const url = 'http://localhost:2333/api/account/login'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        }).then(response => response.json()) // parses response to JSON 
            .then(json => {
                if (json['result']) {
                    // 成功登录
                    Toast('登陆成功', 500)
                    localStorage.setItem('token', json['token'])

                    // 检验账号类型
                    // TODO
                    switch (json['type']) {
                        case '':
                            break;
                        default:
                            break;
                    }
                }
                else {
                    //失败
                    console.log(json['reason'])
                    Toast('登陆失败，请检查用户名和密码是否正确', 500)
                    handleChangeCaptcha()
                }
            }).catch(Toast('访问服务器失败', 500))
    }
    return (
        <div className='login'>
            <div className='login-card'>
                <div className='card-content'>
                    <div className='header'>Login</div>
                    <form className='login-wrapper'>
                        <div className='username-input'>
                            <TextField fullWidth variant='outlined'
                                name='username' label='USERNAME' defaultValue='SYSTEM'>
                            </TextField>
                        </div>
                        <div className='password-input'>
                            <TextField fullWidth
                                variant='outlined' name='password' label='PASSWORD' type='password' defaultValue='This is a simple SALT'>
                            </TextField>
                        </div>
                        <div className='captcha'>
                            <img className='captcha-img' onClick={handleChangeCaptcha}
                                crossOrigin='use-credentials' src={captchaURL} name='captcha-img' 
                                key={`captcha-${captchaTimes}`} />
                            <div className='captcha-input'>
                                <TextField fullWidth variant='outlined' name='captcha' label='CAPTCHA'></TextField>
                            </div>
                        </div>
                        <div className='login-btn'>
                            <Button fullWidth className='login-btn-' onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
                <div className='card-action'>
                    Don't Have Account? <a href='/register' className='reg'>Register</a>
                </div>
                <a href='/userInfo'></a>
            </div>
        </div>)
}