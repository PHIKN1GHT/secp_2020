import React from 'react';
import { ListItemText, ListItem } from '@material-ui/core';
import { FixedSizeList } from 'react-window';


function renderRow(props) {
    const { index, style } = props;

    return (
        <ListItem button style={style} key={index}>
            <ListItemText primary={`Item ${index + 1}`} />
        </ListItem>
    );
}
export default function OrderCards(props) {

    return (<>
        <div className='order-cards'>
            <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
                {renderRow}
            </FixedSizeList><div></div>
        </div>
    </>)
}