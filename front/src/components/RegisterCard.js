import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Toast from './Toast'
import '../css/LoginCard.css'

// 和logincard共用css
export default function RegisterCard() {
    const [captchaURL, setCaptchaURL] = useState('')

    const handleChangeCaptcha = (event) => {
        const url = '/api/account/captcha'
        fetch(url).then(response => response.blob()) // parses response to blob
            .then(imgData => {
                setCaptchaURL(URL.createObjectURL(imgData))
            })
    }


    const handleRegister = (event) => {
        const username = document.getElementsByName('username')[0].value
        const password = document.getElementsByName('password')[0].value
        const captcha = document.getElementsByName('captcha')[0].value
        const bodyData = JSON.stringify({
            username: username,
            password: password,
            captcha: captcha
        })
        const url = '/api/account/registery'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }).then(response => response.json()) // parses response to JSON 
            .then(json => {
                if (json['result']) {
                    // 成功注册
                    localStorage.setItem('token', json['token'])
                    Toast('注册成功', 500)
                }
                else {
                    //失败
                    Toast('注册失败', 500)
                }
            }).catch(Toast('访问服务器失败', 500))
    }
    return (
        <div className='login-card'>
            <div className='card-content'>
                <div className='header'>Register</div>
                <form className='login-wrapper'>
                    <div className='username-input'>
                        <TextField fullWidth name='username' label='USERNAME'></TextField>
                    </div>
                    <div className='password-input'>
                        <TextField fullWidth name='password' label='PASSWORD'></TextField>
                    </div>
                    <div className='captcha'>
                        <img className='captcha-img' onClick={handleChangeCaptcha}
                            src={captchaURL} name='captcha-img' />
                        <div className='captcha-input'>
                            <TextField fullWidth name='captcha' label='CAPTCHA'></TextField>
                        </div>
                    </div>
                    <div className='login-btn'>
                        <Button fullWidth className='login-btn-' onClick={handleRegister}>
                            Register
                        </Button>
                    </div>
                </form>
            </div>
            <div className='card-action'>
                Already Have Account? <a href='/Login' className='reg'>Login</a>
            </div>
        </div>)
}