import React from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import '../css/loginCard.css'

export default function LoginCard() {
    return (<Card className='root'>
        <div className='card-content'>
            <div className='header'>Login</div>
            <form className='login-wrapper'>
                <div className='username-input'>
                    <TextField fullWidth name='username' label='USERNAME'></TextField>
                </div>
                <div className='password-input'>
                    <TextField fullWidth name='password' label='PASSWORD'></TextField>
                </div>
                <div className='captcha'>
                    <img className='captcha-img'></img>
                    <div className='captcha-input'>
                        <TextField fullWidth name='captcha' label='CAPTCHA'></TextField>
                    </div>
                </div>
            </form>
        </div>
        <div className='card-action'>
            Don't Have An Acoount? <a href='#' className='reg'>Register</a>
        </div>
    </Card>)
}