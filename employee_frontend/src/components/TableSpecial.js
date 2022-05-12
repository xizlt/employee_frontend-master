import React, {useEffect, useRef, useState} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {SpecialService} from "../service/SpecialService";
import {Menubar} from "primereact/menubar";
import {ContextMenu} from "primereact/contextmenu";
import {Divider} from "primereact/divider";
import {PasswordGenerate} from "./PasswordGenerate";
import {ExportExel} from "./ExportExcel";
import {Avatar} from "primereact/avatar";
import {BadgeDate} from "./BadgeDate";
import {TYPE} from "../App";
import {copyToClipboard} from "./Helper";

export const TableSpecial = () => {

    let emptyAccount = {
        name: '',
        appointment: '',
        comment: '',
        account: {
            item: '',
            password: ''
        }
    };

    const [cards, setCards] = useState(null);
    const [accountDialog, setAccountDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [card, setCard] = useState(emptyAccount);
    const [selectedCard, setSelectedCard] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedCardForMenu, setSelectedCardForMenu] = useState(emptyAccount);
    const toast = useRef(null);
    const dt = useRef(null);
    const specialService = new SpecialService();

    useEffect(() => {
        specialService.getSpecial().then(data => setCards(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const openNew = () => {
        setCard(emptyAccount);
        setSubmitted(false);
        setAccountDialog(true);
        setEditField(false);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAccountDialog(false);
        setCard(emptyAccount)
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const prepareCardAccount = (option) => {
        return {
            account: {
                basic: true,
                comment: "",
                item: option.account.item,
                password: option.account.password,
                type: TYPE['special']
            },
            name: option.name,
            appointment: option.appointment,
            comment: option.comment
        }
    }

    const saveAccount = () => {
        setSubmitted(true);
        if (card.name.trim() &&
            card.account.item.trim()
        ) {
            let _cards = [...cards];
            let _card = {...card};
            if (password && !passIs){
                _card.account.password = password
            }

            if (card.id) {
                const index = findIndexById(card.id);
                _cards[index] = _card;
                specialService.putSpecial(card.id, prepareCardAccount(_card)).then(
                    r => toast.current.show({severity: 'success', summary: 'Внесены изменения в ', detail: `${card.name}`, life: 5000})
                )
            } else {
                specialService.postSpecial(prepareCardAccount(_card)).then(
                    r => {
                        toast.current.show({severity: 'success', summary: 'Создана новая запись', detail: `${card.name}`, life: 3000});
                    }
                )
                _cards.push(_card);
            }
            setCards(_cards);
            setAccountDialog(false);
            setCard(emptyAccount);
        }
    }

    const editCard = (data) => {
        setCard({...data});
        setAccountDialog(true);
        setEditField(false);
    }

    const confirmDeleteCard = (data) => {
        setCard(data);
        setDeleteProductDialog(true);
    }

    const deleteCard = () => {
        let _products = cards.filter(val => val.id !== card.id);
        setCards(_products);
        setDeleteProductDialog(false);
        specialService.deleteSpecial(card.id).then(r => {
                toast.current.show({severity: 'success', summary: 'Подтверждение', detail: `Аккаунт удален`, life: 3000});
            }
        )
        setCard(emptyAccount);
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const deleteSelectedCard = () => {
        let _cards = cards.filter(val => !selectedCard.includes(val));
        setCards(_cards);
        setDeleteProductsDialog(false);
        setSelectedCard(null);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
    }
    const [passIs, setPassIs]=useState(false)

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _card = {...card};
        let j = name.split(".")

        if (j.length === 2) {
            setPassIs(j[1] === 'password');
            _card[j[0]][j[1]] = val;
        } else {
            _card[`${name}`] = val;
        }
        setCard(_card);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-success p-button-text p-mr-2" onClick={() => editCard(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-warning p-button-text" onClick={() => confirmDeleteCard(rowData)}/>
            </React.Fragment>
        );
    }

    const start = <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)}/>
            </span>


    const items = [
        {
            label: 'Новый',
            icon: 'pi pi-fw pi-user-plus',
            command: () => openNew()
        },
        {
            label: 'Экспорт',
            icon: 'pi pi-fw pi-upload',
            items: [
                {
                    label: 'Excel',
                    icon: 'pi pi-fw pi-list',
                    command: () => {
                        exportExcel();
                    }
                }
            ]
        },
    ];

    const header = (
        <div className="table-header">
            <Menubar model={items} start={start} className="table-menu-header"/>
        </div>
    );

    const cardDialogFooter = (
        <React.Fragment>
            {card.id && <Button label="Отправить" icon="pi pi-fw pi-send" className="p-button-text" onClick={() => messageEmail(card)}/>}
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveAccount}/>
        </React.Fragment>
    );

    const infoDialogFooter = (
        <React.Fragment>
            <Button label="Отправить" icon="pi pi-fw pi-send" className="p-button-text" onClick={() => messageEmail(card)}/>
            <Button label="Выйти" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
        </React.Fragment>
    );

    const deleteCardDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCard}/>
        </React.Fragment>
    );
    const deleteCardsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCard}/>
        </React.Fragment>
    );

    const passwordBody = (data) => {
        return (
            <div>
                <div className={classNames({'blur-text': true})}>{data.account.password}</div>
            </div>
        );
    };

    const [editField, setEditField] = useState(false);

    const messageEmail = (e) => {
        copyToClipboard(
            `Название: ${e.name}\nАккаунт: ${e.account.item}\nПароль: ${e.account.password}`
        )

    }
    // TODO Не передается card
    const showDetailsInfo = (data) => {
        setCard(data);
        setEditField(true);
        setAccountDialog(true);
    }

    const cm = useRef(null);

    const menuModel = [
        {
            label: 'Открыть', icon: 'pi pi-fw pi-eye',
            command: () => showDetailsInfo(selectedCardForMenu)
        },
        {
            label: 'Отправить', icon: 'pi pi-fw pi-send',
            command: () => messageEmail(selectedCardForMenu)
        }
    ];

    const [password, setPassword] = useState('');
    const toastSuccess = useRef(null);
    const showSuccess = (option) => {
        copyToClipboard(option)
        toastSuccess.current.show({severity: 'success', summary: 'Копирование', detail: 'Все хорошо.', life: 3000});
    }


    const [exportDataExcel, setExportDataExcel] = useState([]);
    const prepareExportExcel = (arr) => {
        let results = [];

        for (let i = 0; i < arr.length; i++) {
            let prepare = {}
            prepare['Название']=arr[i].name
            prepare['Назначение']=arr[i].appointment
            prepare['Акаунт'] = arr[i].account.item;
            prepare['Пароль'] = arr[i].account.password;
            prepare['Комментарий']=arr[i].comment

            results.push(prepare)
        }
        return results
    }

    const exportExcel = () => {
        ExportExel(prepareExportExcel(exportDataExcel.length !== 0 ? exportDataExcel: cards), 'Специальные');

    }

    const nameBodyTemplate = (data) => {
        return (
                <div>
                     <div>{BadgeDate(data)} </div>
                    {data.name}
                </div>
        );
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} position="bottom-left"/>
            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedCardForMenu(emptyAccount)}/>
            <div className="card">
                <h5>Специальные пользователи</h5>
                <DataTable ref={dt} dataKey="id"
                           value={cards} header={header}
                           resizableColumns
                           stripedRows
                           emptyMessage="Ты что-то делаешь не то!"
                           scrollHeight="650px"
                           className="p-datatable-customers editable-cells-table"
                           selectionMode="single"
                           responsiveLayout="stack"
                           breakpoint="960px"
                           onValueChange={filteredData => setExportDataExcel(filteredData)}
                           contextMenuSelection={selectedCardForMenu}
                           onContextMenuSelectionChange={e => setSelectedCardForMenu(e.value)}
                           onContextMenu={e => cm.current.show(e.originalEvent)}
                           onRowDoubleClick={e => showDetailsInfo(e.data)}
                           editMode="cell"
                           selection={card}
                           onSelectionChange={(e) => setCard(e.value)}
                           globalFilter={globalFilter}
                           filterDisplay="row" showGridlines
                           columnResizeMode="fit"
                           autoLayout={true}
                    // scrollable
                >
                    <Column field="name" header="Название" sortable filter showFilterMatchModes={false} showFilterMenu={false} body={nameBodyTemplate} />
                    <Column field="appointment" header="Преднозначение" sortable filter showFilterMatchModes={false} showFilterMenu={false}/>
                    <Column field="account.item" header="Аккаунт" sortable filter showFilterMatchModes={false} showFilterMenu={false}/>
                    <Column field="account.password" header="Пароль" body={passwordBody}/>
                    <Column field="comment" header="Комментарий"/>
                    <Column body={actionBodyTemplate} exportable={false} style={{minWidth: '5rem'}}/>
                </DataTable>
            </div>

            <Dialog visible={accountDialog} style={{width: '450px'}} header={card.id ? editField ? 'Просмотр' : 'Редактировать' : 'Создать новую запись'} modal className="p-fluid"
                    footer={editField ? infoDialogFooter : cardDialogFooter} onHide={hideDialog}>
                <Toast ref={toastSuccess} position="bottom-left"/>
                <div className="formgrid grid">
                    <div className="field col" onClick={() => editField && showSuccess(card.name)}>
                        <label htmlFor="name">Название:</label>
                        <InputText id="name" value={card.name} onChange={(e) => onInputChange(e, 'name')}
                                   required disabled={editField}
                                   className={classNames({'p-invalid': submitted && !card.name})}/>
                        {submitted && !card.name && <small className="p-invalid">Обязательно для заполнения</small>}
                    </div>
                    <div className="field col" onClick={() => editField && showSuccess(card.appointment)}>
                        <label htmlFor="appointment">Назначение:</label>
                        <InputText id="appointment" value={card.appointment} onChange={(e) => onInputChange(e, 'appointment')}
                                   disabled={editField}/>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col" onClick={() => editField && showSuccess(card.comment)}>
                        <label htmlFor="comment">Комментарий:</label>
                        <InputTextarea id="comment" value={card.comment} rows={5} cols={30} onChange={(e) => onInputChange(e, 'comment')} disabled={editField} autoResize/>
                    </div>
                </div>
                <Divider align="center">
                    <span className="p-tag">Аккаунт</span>
                </Divider>
                <div className="formgrid grid">
                    <div className="field col" onClick={() => editField && showSuccess(card.account.item)}>
                        <label htmlFor="item">Значение:</label>
                        <InputText id="item" value={card.account.item} onChange={(e) => onInputChange(e, 'account.item')} required
                                   className={classNames({'p-invalid': submitted && !card.account.item})} disabled={editField}/>
                        {submitted && !card.account.item && <small className="p-invalid">Обязательно для заполнения</small>}
                    </div>
                    <div className="field col" onClick={() => editField && showSuccess(card.account.password)}>
                        <label htmlFor="password">Пароль:</label>
                        <div className="p-inputgroup">
                            <InputText id="password" value={password || card.account.password} onInput={(e) => onInputChange(e, 'account.password')}
                                       disabled={editField}/>
                            {!editField && < PasswordGenerate password={password} setPassword={setPassword}/>}
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{width: '450px'}} header="Confirm" modal footer={deleteCardDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {card && <span>Точно удалить <b>{card.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{width: '450px'}} header="Confirm" modal footer={deleteCardsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {card && <span>>Точно удалить?</span>}
                </div>
            </Dialog>
        </div>
    );
}
