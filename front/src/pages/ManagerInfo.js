import React, { useEffect, useState } from 'react';
import BottomNavBarForManager from '../components/BottomNavBarForManager';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { server, IsLoggedIn } from './Const';
import Toast from '../components/Toast';
export default function ManagerInfoCard(props) {
    // const [username, setUsername] = useState('default')
    // const [avaterURL, setAvaterURL] = useState(
    //     'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592676695916&di=96aac1fac45091c1c61b2c8d3367af56&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F01%2F20151101135231_wj4Zu.jpeg')
    let username = localStorage.getItem('logged_in_as')
    const avaterURL = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592676695916&di=96aac1fac45091c1c61b2c8d3367af56&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F01%2F20151101135231_wj4Zu.jpeg'
    const _token = 'Bearer ' + localStorage.getItem('access_token')
    const handleLogout = () => {
        const url = server + '/api/account/logout'
        fetch(url, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'Authorization': _token
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        }).then(response => response.json())
            .then(json => {
                if (json.result) {
                    Toast('成功退出登录', 500)
                    localStorage.clear()
                    //localStorage.removeItem('access_token')
                    setTimeout(props.history.push({ pathname: '/login' }), 500)
                } else {
                    Toast('退出登录失败', 500)
                }
            })
    }
    useEffect(() => {
        username = localStorage.getItem('logged_in_as')
    }, [])
    const [loggedIn, setL] = useState(false)
    useEffect(() => {
        IsLoggedIn(['customer'], () => {
            setL(true)
        }, () => {
            setL(false)
            props.history.push({ pathname: '/login' })
        })
    }, [])

    return (<>
        {loggedIn ?
            <div className='user-info'>
                <div className='user-info-card'>
                    <div className='header'>
                        <div className='user-information'>
                            <div className='avater-con'>
                                <img className='avater' src={avaterURL} />
                            </div>
                            <div className='username'>{username}</div>
                        </div>
                    </div>
                    <div className='cards'>
                        <div className='log-out' onClick={handleLogout}>
                            <PowerSettingsNewIcon className='icon' />
                            <div className='text'>退出登录</div>
                        </div>
                    </div>
                </div>
                <div className='bottom'><BottomNavBarForManager />
                </div>
            </div> : null
        }
    </>)
}