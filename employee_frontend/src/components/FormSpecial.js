import React, {Component, useEffect, useRef} from 'react';
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {InputTextarea} from "primereact/inputtextarea";
import {Divider} from "primereact/divider";
import {useState} from "react";
import {Toast} from "primereact/toast";
import {PasswordGenerate} from "./PasswordGenerate";
import {copyToClipboard} from "./Helper";

export const FormSpecial = (props) => {
    const [special, setSpecial] = useState(props.items);
    const [submitted, setSubmitted] = useState(false);
    const [editField, setEditField] = useState(props.editField);
    const [password, setPassword] = useState('');

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _employee = {...special};
        let j = name.split(".")
        if (Array.isArray(j)){
            _employee[0][1] = val;
        }else {
            _employee[`${name}`] = val;
        }
        setSpecial(_employee);
        console.log(special)
    }

    const toastSuccess = useRef(null);
    const showSuccess = (option) => {
        copyToClipboard(option)
        toastSuccess.current.show({severity: 'success', summary: 'Копирование', detail: 'Все хорошо.', life: 3000});
    }
    return (
        <>
            <Toast ref={toastSuccess} position="bottom-left"/>
            <div className="formgrid grid">
                <div className="field col" onClick={() => editField && showSuccess(special.name)}>
                    <label htmlFor="name" >Название:</label>
                    <InputText id="name" value={special.name} onChange={(e) => onInputChange(e, 'name')}
                               required disabled={editField}
                               className={classNames({'p-invalid': submitted && !special.name})}/>
                    {submitted && !special.name && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>
                <div className="field col" onClick={() => editField && showSuccess(special.appointment)}>
                    <label htmlFor="appointment">Назначение:</label>
                    <InputText id="appointment" value={special.appointment} onChange={(e) => onInputChange(e, 'appointment')} required
                               className={classNames({'p-invalid': submitted && !special.appointment})} disabled={editField}/>
                    {submitted && !special.appointment && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col" onClick={() => editField && showSuccess(special.comment)}>
                    <label htmlFor="comment">Комментарий:</label>
                    <InputTextarea id="comment" value={special.comment} rows={5} cols={30} onChange={(e) => onInputChange(e, 'comment')} disabled={editField} autoResize/>
                </div>
            </div>
            <Divider align="center">
                <span className="p-tag">Аккаунт</span>
            </Divider>
            <div className="formgrid grid">
                <div className="field col" onClick={() => editField && showSuccess(special.account.item)}>
                    <label htmlFor="item">Значение:</label>
                    <InputText id="item" value={special.account.item} onChange={(e) => onInputChange(e, 'item')} required
                               className={classNames({'p-invalid': submitted && !special.account.item})} disabled={editField}/>
                    {submitted && !special.account.item && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>
                <div className="field col" onClick={() => editField && showSuccess(special.account.password)}>
                    <label htmlFor="password">Пароль:</label>
                    <div className="p-inputgroup">
                    <InputText id="password" value={special.account.password || password} onChange={(e) => onInputChange(password || e, 'password')} required
                               className={classNames({'p-invalid': submitted && !special.account.password})} disabled={editField}/>
                    <PasswordGenerate password={password} setPassword={setPassword}/>
                    </div>
                    {submitted && !special.account.password && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>
            </div>
        </>
    )}
