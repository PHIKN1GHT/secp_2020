import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { useState, useEffect, useRef } from 'react';
import { IconButton, ListItemAvatar, Avatar, List, ListItem, Tooltip, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import { server, EQ } from './Const';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Toast from '../components/Toast';

export default function AddressManagerPage(props) {
    const [addrs, setAddrs] = useState([])
    const [openDia, setOpenDia] = useState(false)
    const [selectInd, setSelectInd] = useState(-1)
    const [diaType, setDiaType] = useState('null')
    const [init, setInit] = useState(true)
    const _token = 'Bearer ' + localStorage.getItem('access_token')
    const GetAddrData = () => {
        const url = server + '/api/address/all'
        fetch(url, { // must match 'Content-Type' header
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json',
                'Authorization': _token
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            // redirect: 'follow', // manual, *follow, error
            // referrer: 'no-referrer', // *client, no-referrer
        }).then(response => {
            return response.json()
        }).then(json => {
            //如果是数组
            if (json instanceof Array) {
                setAddrs((prevState) => {
                    let tmp = []
                    json.map((val, ind) => {
                        tmp.push({
                            number: ind,
                            id: val['id'],
                            addr: val['address'],
                            phone: val['phonenumber'],
                            receiver: val['receiver']
                        })
                    })
                    if (tmp.length !== prevState.length) { return tmp }
                    for (let i in tmp) {
                        for (let j in i) {
                            if (prevState[i][j] !== tmp[i][j]) {
                                return tmp
                            }
                        }
                    }
                    return prevState
                })
            }
        })
    }
    useEffect(() => {
        if (init) {
            GetAddrData()
            setInit(false)
        }
        else { }
    }, [])
    const handleGoBack = (event) => {
        props.history.goBack()
    }
    const handleChangeAddr = (event) => {
        setDiaType('change')
        setSelectInd(Number(event.currentTarget.getAttribute('number')))
        setOpenDia(true)
    }
    const handleAddAddr = (event) => {
        setDiaType('add')
        setSelectInd(-1)
        setOpenDia(true)
    }
    const handleCancelDia = (event) => {
        setDiaType('null')
        setOpenDia(false)
    }
    const handleConfirmDia = (event) => {
        const inputData = {
            addr: document.getElementById('modify-addr').value,
            receiver: document.getElementById('modify-name').value,
            phone: document.getElementById('modify-phone').value
        }
        if (diaType === 'change') {
            inputData.number = addrs[selectInd].number
            inputData.id = addrs[selectInd].id
            const url = server + '/api/address/update'
            const bodyData = JSON.stringify({
                id: inputData.id,
                address: inputData.addr,
                receiver: inputData.receiver,
                phonenumber: inputData.phone
            })
            fetch(url, {
                body: bodyData,
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            }).then(response => { return response.json() })
                .then(json => {
                    if (json['result']) {
                        //修改成功
                        Toast('修改成功', 500)
                        setAddrs((prevState) => {
                            prevState[selectInd] = inputData
                            let tmp = []
                            for (let i in prevState) {
                                tmp.push(prevState[i])
                            }
                            return tmp
                        })
                        handleCancelDia()
                    } else {
                        //修改失败
                        Toast("修改失败", 500)
                    }
                })
        }
        else if (diaType === 'add') {
            inputData.number = addrs.length
            const url = server + '/api/address/add'
            const bodyData = JSON.stringify({
                receiver: inputData.receiver,
                address: inputData.addr,
                phonenumber: inputData.phone
            })
            fetch(url, {
                body: bodyData,
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            }).then(response => { return response.json() })
                .then(json => {
                    if (json.result) {
                        //添加成功
                        Toast('添加成功', 500)
                        inputData.id = json.id
                        setAddrs(prevState => {
                            prevState.push(inputData)
                            let tmp = []
                            for (let i in prevState) {
                                tmp.push(Object.assign(prevState[i]))
                            }
                            return tmp
                        })
                        handleCancelDia()
                    } else {
                        Toast('添加失败', 500)
                        //添加失败
                    }
                })
        }
        setDiaType('null')
        setOpenDia(false)
    }
    const handleDeleteAddr = (event) => {
        const index = Number(event.currentTarget.getAttribute('number'))
        const id = Number(event.currentTarget.getAttribute('id'))
        const url = server + '/api/address/del'
        const bodyData = JSON.stringify({
            id: id
        })
        fetch(url, {
            body: bodyData,
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json',
                'Authorization': _token
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        }).then(response => response.json())
            .then(json => {
                if (json.result) {
                    Toast('删除成功', 500)
                    setAddrs(prevState => {
                        prevState.splice(index, 1)
                        let tmp = []
                        prevState.map((val, ind) => {
                            val.number = ind
                            tmp.push(val)
                        })
                        return tmp
                    })
                } else {
                    Toast('删除失败', 500)
                }
            })
    }

    return (<>
        <div className='address-manager'>
            <div className='backicon-con'>
                <ArrowBackIosIcon className='backicon' onClick={handleGoBack} />
                <div className='head'>地址列表</div>
            </div>
            <div className='content'>
                <div className='list-con'>
                    <List className='list'>
                        {addrs.map((val) =>
                            <ListItem className='item'>
                                <ListItemAvatar>
                                    <Avatar>
                                        <HomeWorkIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <div className='texts'>
                                    <div className='receiver'>{val.receiver}</div>
                                    <div className='phone'>{val.phone}</div>
                                    <div className='addr'>{val.addr}</div>
                                </div>
                                <div className='icons'>
                                    <Tooltip title='修改地址' placement='top'>
                                        <IconButton number={val.number} id={val.id} onClick={handleChangeAddr}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='删除地址' placement='top'>
                                        <IconButton number={val.number} id={val.id} onClick={handleDeleteAddr}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </ListItem>
                        )}
                    </List>
                </div>
            </div>
            <div className='add-icon-con'>
                <IconButton className='add-icon' onClick={handleAddAddr}>
                    <AddIcon />
                </IconButton>
            </div>
        </div>
        <Dialog open={openDia} onClose={handleCancelDia}>
            <DialogTitle>修改地址</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="modify-name"
                    label='收货人姓名'
                    defaultValue={selectInd >= 0 ? addrs[selectInd].receiver : ''}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="modify-phone"
                    label='收货人电话'
                    type='number'
                    defaultValue={selectInd >= 0 ? addrs[selectInd].phone : ''}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="modify-addr"
                    label='收货人地址'
                    defaultValue={selectInd >= 0 ? addrs[selectInd].addr : ''}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelDia} color="primary">取消</Button>
                <Button onClick={handleConfirmDia} color="primary">确认</Button>
            </DialogActions>
        </Dialog>
    </>)
}