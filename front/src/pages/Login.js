import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Toast from '../components/Toast';

export default function LoginPage(props) {
    const [captchaTimes, setCaptchaTimes] = useState(0)
    const captchaURL = 'http://localhost:2333/api/account/captcha'
    const handleChangeCaptcha = (event) => {
        fetch(captchaURL)
            .then(response => response.blob()) // parses response to blob
            .then(
                setCaptchaTimes(prevState => prevState + 1)
                //setCaptchaURL(URL.createObjectURL(imgData))
            )
    }
    const handleLogin = (event) => {
        const username = document.getElementsByName('username')[0].value
        const password = document.getElementsByName('password')[0].value
        const captcha = document.getElementsByName('captcha')[0].value
        const bodyData = JSON.stringify({
            username: username,
            password: password,
            captcha: captcha
        })
        const url = 'http://127.0.0.1:2333/api/account/login'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
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
                                src={captchaURL} name='captcha-img' key={`captcha-${captchaTimes}`} />
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