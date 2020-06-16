import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Toast from '../components/Toast';


// 和logincard共用css
export default function RegisterPage(props) {
    const host = 'http://188.131.174.176:8082'
    const captchaURL = host + '/api/account/captcha?' + Date.now()
    const [captchaTimes, setCaptchaTimes] = useState(0)

    const handleChangeCaptcha = (event) => {
        setCaptchaTimes(prevState => prevState + 1)
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
        const url = host + '/api/account/registery'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
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
                    props.history.push({ pathname: '/mainpage' })
                }
                else {
                    //失败
                    Toast('注册失败', 500)
                    handleChangeCaptcha()
                }
            })
    }
    return (
        <div className='login'>
            <div className='login-card'>
                <div className='card-content'>
                    <div className='header'>Register</div>
                    <form className='login-wrapper'>
                        <div className='username-input'>
                            <TextField fullWidth variant='outlined' name='username' label='USERNAME'></TextField>
                        </div>
                        <div className='password-input'>
                            <TextField fullWidth variant='outlined' name='password' label='PASSWORD'></TextField>
                        </div>
                        <div className='captcha'>
                            <img className='captcha-img'
                                onClick={handleChangeCaptcha}
                                src={captchaURL}
                                name='captcha-img'
                                key={`captcha-${captchaTimes} `} />
                            <div className='captcha-input'>
                                <TextField fullWidth variant='outlined' name='captcha' label='CAPTCHA'></TextField>
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
                    Already Have Account? <a href='/login' className='reg'>Login</a>
                </div>
            </div>
        </div>)
}