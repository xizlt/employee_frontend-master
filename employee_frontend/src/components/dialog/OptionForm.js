import React from 'react';

export const selectedOptionTemplate = (option, props) => {
    if (option) {
        return (
            <div >{option.name}</div>
        );
    }
    return (
        <span >
            {props.placeholder}
        </span>
    );
}


export const optionTemplate = (option) => {
    return (
        <div>{option.name}</div>
    );
}


export const positionOptionTemplate = (option) => {
    return (
        <div >{option.name}</div>
    );
}
export const selectedPositionOptionTemplate = (option) => {
    if (option) {
        return (
            <div>{option.name}</div>
        );
    }
    return "Выбери должность";
}

export const panelFooterPositionTemplate = (props) => {
    const length = props ? props.length : 0;
    return (
        <div className="p-py-2 p-px-3">
            <b>{length}</b> выбрано.
        </div>
    );
}
