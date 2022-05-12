import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {Password} from "primereact/password";
import {PasswordGenerate} from "./PasswordGenerate";
import "../table.css"
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Tooltip} from "primereact/tooltip";
import {AccountService} from "../service/AccountService";
import {InputMask} from "primereact/inputmask";
import {InputSwitch} from "primereact/inputswitch";
import {copyToClipboard} from "./Helper";

export const DataTableAccounts = (props) => {
    let acc = null

    if (props.employee_.account) {
        acc = props.employee_.account
        acc.map((item) => item.show = false)
    }
    const initService = new AccountService();

    const [accounts, setAccounts] = useState(acc);
    const [password, setPassword] = useState();

    const onShowPass = (rowData, value) => {
        setAccounts(accounts.map(item =>
            item.id === rowData.id
                ? {...item, show: value}
                : item
        ));
    }

    // Отображенеи пароля +
    const toastSuccess = useRef(null);

    const passwordBodyTemplate = (rowData) => {
        return (<>
            <Toast ref={toastSuccess} position="bottom-left"/>
            <span onClick={() => showSuccess(rowData.password)} className={classNames({'blur-text': !rowData.show})}>
                {rowData.password}
            </span>
            <div style={{textAlign: "center"}}>
                {rowData.password && <i className="pi pi-eye"
                                        onMouseDown={() => onShowPass(rowData, true)}
                                        onMouseUp={() => onShowPass(rowData, false)}
                />}
            </div>
        </>);
    }
    // Отображенеи пароля -

    const showSuccess = (password) => {
        copyToClipboard(password)
        toastSuccess.current.show({severity: 'success', summary: 'Копирование', detail: 'Новый пароль скопирован.', life: 3000});
    }
    const handleMouseUpCopy = () => {
        let string_text = window.getSelection().toString()
        copyToClipboard(string_text)
    }

    const commentBodyTemplate = (rowData) => {
        return (<>
            <Tooltip target=".custom-full-comment" style={{maxWidth: '500px'}}/>
            <div data-pr-tooltip={rowData.comment} className="custom-full-comment" data-pr-position="top" style={{maxWidth: '150px'}}
                 onClick={()=> copyToClipboard(rowData.comment)}>
                {rowData.comment}
            </div>
        </>);
    }

    const basicEditor = (options) => {
        return <InputSwitch checked={options.value} onChange={() => options.editorCallback(!options.value)} />
    }

    const typeBodyTemplate = (data) => {
        return <span onMouseUp={handleMouseUpCopy} onClick={()=> copyToClipboard(data.type.name)}>{data.type.name}</span>
    }
    const itemBodyTemplate = (data) => {
        return <span onMouseUp={handleMouseUpCopy} onClick={()=> copyToClipboard(data.item)}>{data.item}</span>
    }

    // Если основной
    const accIsBasic = (data) => {
        return {
            'row-accessories': data.basic && data.id
        }
    }
    // TODO Переделать
    const inputEditor = (options) => {
        if (options.rowData.type.id === 1)
            return inputNumberEditor(options)
        else
            return inputTextEditor(options)
    }

    const inputTextEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    }

    const inputNumberEditor = (options) => {
        return <InputMask id="phone" mask="7 (999) 999-9999" unmask value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    }

    const inputTextAreaEditor = (options) => {
        return <InputTextarea type="text" value={options.value}
                              onChange={(e) => options.editorCallback(e.target.value)}
                              rows={5} cols={5} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15}}
        />;
    }


    const inputPasswordEditor = (options) => {
        return <div className="p-inputgroup">
            <Password value={password?password:options.value} toggleMask
                      onFocus={ () => {password && options.editorCallback(password)} }
                      onChange={(e) => {
                        options.editorCallback(e.target.value);
                        setPassword(null);
                        }}
            />
            <PasswordGenerate password={password} setPassword={setPassword}/>
        </div>
    }

    // Диалоговое окно для удаления аккаунта +
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [account, setAccount] = useState();
    const toast = useRef(null);
    const [hideColumnBasic, setHideColumnBasic] = useState(true);

    const confirmDeleteAccount = (rowData) => {
        setAccount(rowData);
        setDeleteAccountDialog(true);

    }

    const removeRow = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => confirmDeleteAccount(rowData)}/>
            </React.Fragment>
        );
    }

    useEffect(() => {
        setAccounts(props.employee_.account)
    }, [props.employee_]);


    const deleteAccount = () => {
        let _accounts = accounts.filter(val => val.id !== account.id);
        setAccounts(_accounts);
        setDeleteAccountDialog(false);
        setAccount({});
        initService.deleteAccount(account.id).then(r => {
                toast.current.show({severity: 'success', summary: 'Подтверждение', detail: `Аккаунт удален`, life: 3000});
                props.employee_.account = _accounts
                props.setEmployee(props.employee_)
            }
        )
    }
    const hideDeleteProductDialog = () => {
        setDeleteAccountDialog(false);
    }
    const deleteAccountDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteAccount}/>
        </React.Fragment>
    );
    // Диалоговое окно для удаления аккаунта -

    const sendMassageOk = (data) => {
        toast.current.show({severity: 'success', summary: 'Изменения внесены', detail: `Новые данные для '${data}' применены.`})
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }

    const hideColumn = (val) => {
        setHideColumnBasic(val)
    }

    const checkIsBasic = (val) => {
        let res = accounts.map(data=>{
            if(data.type.id === val.type.id && val.basic && data.basic && data.id !== val.id)
                return data.item
        })
        return res.find(i => i)
    }

    const onRowEditComplete = (e) => {

        let _val = [...accounts];
        let {newData, index} = e;
        let newDataS = {...newData}
        let isFall = checkIsBasic(newData)

        if (isFall){
            hideColumn(true);
            return sendMassageError(`Основной уже есть ${isFall}.`)
        }

        let id_ = newData.id
        let type_ = newData.type

        delete newData.id
        newData.type = newData.type.id
        hideColumn(true)

        const setPutItem = (data) => {
            data.type = type_
            _val[index] = data
            setAccounts(_val)

            let _empl = props.employee_
            _empl.account = _val
            props.setEmployee(_empl)

            sendMassageOk(data.item)
        }

        if (JSON.stringify(_val[index]) !== JSON.stringify(newDataS)) {
            initService.putAccount(id_, newData).then(
                data => setPutItem(data)
            ).catch((error) => {
                sendMassageError(error)
            });
        }
        setPassword(null)
    }

    return (
        <div>
            <Toast ref={toast} position="bottom-left"/>
            <DataTable value={accounts} rowClassName={accIsBasic} dataKey="id"
                       resizableColumns
                       editMode="row"
                       editRows={['item', 'password', 'comment']}
                       className="p-datatable-gridlines p-datatable-customers editable-cells-table p-datatable-striped"
                       columnResizeMode="fit"
                       onRowEditComplete={onRowEditComplete}
                       onRowEditInit={e=>hideColumn(false)}
                       onRowEditCancel={e=>hideColumn(true)}
                       emptyMessage="Тут как бы пусто!"
            >

                <Column field="basic" header="Основной" dataType={'checkbox'} editor={(props) => basicEditor(props)} hidden={hideColumnBasic}/>
                <Column field="type.name" header="Тип" sortable style={{textAlign: "center"}} body={typeBodyTemplate}/>
                <Column field="item" header="Значение" sortable
                        editor={(options) => inputTextEditor(options)} body={itemBodyTemplate}/>
                <Column field="password" header="Пароль" body={passwordBodyTemplate} style={{wordBreak: "break-all"}}
                        editor={(options) => inputPasswordEditor(options)} />
                <Column field="comment" header="Комментарий"
                        editor={(options) => inputTextAreaEditor(options)}
                        body={commentBodyTemplate}/>
                <Column rowEditor headerStyle={{width: '4rem'}} bodyStyle={{textAlign: 'center'}}/>
                <Column body={removeRow} style={{textAlign: "center", width: '4rem'}}/>
            </DataTable>

            <Dialog visible={deleteAccountDialog} style={{width: '450px'}} header="Подтвердить действие" modal footer={deleteAccountDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {<span>Точно удалить?</span>}
                </div>
            </Dialog>
        </div>
    )
}
