import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

import '../css/LoginCard.css'

export default function LoginCard() {
    return (
        <div className='root'>
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
                    <div className='login-btn'>
                        <Button fullWidth className='login-btn-'>
                            Login
                        </Button>
                    </div>
                </form>
            </div>
            <div className='card-action'>
                Don't Have Acoount? <a href='#' className='reg'>Register</a>
            </div>
        </div>)
}