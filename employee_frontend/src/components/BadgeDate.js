import React from 'react';
import {Badge} from "primereact/badge";

export const BadgeDate = (data) => {
    let date_create = new Date(data.created).getTime();
    let date_upd = new Date(data.update).getTime();
    let fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
    let toDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).getTime();

    if (fromDate <= date_create && date_create <= toDate) {
        return <Badge value="NEW" severity="success"/>
    }
    if (fromDate <= date_upd && date_upd <= toDate) {
        return <Badge value="UPD" severity="danger"/>
    }
}
