import React, { useState } from 'react';
import { ListItem, List } from '@material-ui/core';


export default function OrderCards(props) {

    const [orders, setOrders] = useState(['a', 'ok', 'shit', 'shit', 'shit', 'shit'])
    return (<>
        <div className='order-cards'>
            <List className='list'>
                {orders.map((val, ind) =>
                    <ListItem className='item' button>{val}</ListItem>
                )}
            </List>
        </div>
    </>)
}