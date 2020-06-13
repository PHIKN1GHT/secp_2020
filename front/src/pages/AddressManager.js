import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { useState, useEffect } from 'react';
import { IconButton, ListItemAvatar, Avatar, List, ListItem, Tooltip, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

export default function AddressManagerPage(props) {
    let tmpAaddrs = []
    for (let i = 0; i < 5; ++i) {
        tmpAaddrs.push({
            number: i,
            id: i + 1,
            addr: '上海市奉贤区xx路xx号',
            receiver: '张三',
            phone: Math.random()
        })
    }
    const [addrs, setAddrs] = useState(tmpAaddrs)
    const [openDia, setOpenDia] = useState(false)
    const [selectInd, setSelectInd] = useState(0)
    const handleGoBack = (event) => {
        props.history.goBack()
    }
    const handleChangeAddr = (event) => {
        setSelectInd(Number(event.currentTarget.getAttribute('number')))
        setOpenDia(true)
    }
    const handleCancelDia = (event) => {
        setOpenDia(false)
    }
    const handleConfirmDia = (event) => {
        setAddrs((prevState) => {
            prevState[selectInd].addr = document.getElementById('modify-addr').value
            prevState[selectInd].receiver = document.getElementById('modify-name').value
            prevState[selectInd].phone = document.getElementById('modify-phone').value
            return prevState
        })
        setOpenDia(false)
    }
    const handleDeleteAddr = (event) => {
        let index = Number(event.currentTarget.getAttribute('number'))
        setAddrs((prevState) => {
            prevState.splice(index, 1)
            let tmp = []
            for (let i = 0; i < prevState.length; ++i) {
                tmp.push(prevState[i])
            }
            return tmp
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
                <IconButton className='add-icon'>
                    <AddIcon />
                </IconButton>
            </div>
        </div>
        <Dialog open={openDia} onClose={handleCancelDia}>
            <DialogTitle>修改地址</DialogTitle>
            <DialogContent>
                <DialogContentText>请在此处修改您的信息</DialogContentText>
                <TextField
                    margin="dense"
                    id="modify-name"
                    label='收货人姓名'
                    defaultValue={addrs[selectInd].receiver}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="modify-phone"
                    label='收货人电话'
                    type='number'
                    defaultValue={addrs[selectInd].phone}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="modify-addr"
                    label='收货人地址'
                    defaultValue={addrs[selectInd].addr}
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