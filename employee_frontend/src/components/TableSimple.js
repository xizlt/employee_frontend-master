import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Avatar} from "primereact/avatar";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import classNames from "classnames";
import {Dropdown} from "primereact/dropdown";
import {Divider} from "primereact/divider";
import {MultiSelect} from "primereact/multiselect";
import {DataTableAccounts} from "./TableAccount";
import {Panel} from "primereact/panel";
import {FilterService} from 'primereact/api';
import {ContextMenu} from "primereact/contextmenu";
import {optionTemplate, panelFooterPositionTemplate, positionOptionTemplate, selectedOptionTemplate, selectedPositionOptionTemplate} from "./dialog/OptionForm";
import {Menubar} from "primereact/menubar";
import {messageEmail} from "./MessageEmail";
import {Toast} from "primereact/toast";
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {FilialService} from "../service/FilialService";
import {EmployeeService} from "../service/EmployeeService";
import {StatusService} from "../service/StatusService";
import {PositionService} from "../service/PositionService";
import {NewAccountForm} from "./NewAccountForm";
import {ActionService} from "../service/ActionService";
import {ExportExel} from "./ExportExcel";
import {BadgeDate} from "./BadgeDate";
import {Tooltip} from "primereact/tooltip";
import {copyToClipboard} from "./Helper";

export const TableSimple = () => {
    let emptyEmployee = {
        name_last: '',
        name_first: '',
        name_middle: '',
        position: null,
        filial: null,
        status: null,
        comment: '',
        account: null
    };

    const cm = useRef(null);
    const toast = useRef(null);
    const employeeService = new EmployeeService();

    const [submitted, setSubmitted] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(emptyEmployee);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [status, setStatus] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [filterStatus, setFilterStatus] = useState(null);

    const [filial, setFilial] = useState();
    const [selectedFilial, setSelectedFilial] = useState(null);
    const [filterFilial, setFilterFilial] = useState(null);

    const [positions, setPositions] = useState();
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [filterPosition, setFilterPosition] = useState(null);

    useEffect(() => {
        employeeService.getEmployee().then(data => setEmployees(data));
        initFilters();
    }, [])

    useEffect(() => {
        const statusService = new StatusService();
        const filialService = new FilialService();
        const positionService = new PositionService();

        statusService.getStatus().then(data => {
            setStatus(data);
            let status_arr = []
            data.map((item) => status_arr.push(item.name))
            setFilterStatus(status_arr)
        });
        filialService.getFilial().then(data => {
            let filial_arr = []
            data.map((item) => filial_arr.push(item.name))
            setFilterFilial(filial_arr)
            setFilial(data);
            setSelectedFilial(employee.filial)
        });
        positionService.getPosition().then(data => {
            let position_arr = []
            data.map((item) => position_arr.push(item.name))
            setFilterPosition(position_arr)
            setPositions(data);
        });
    }, []);


    // -----------Фильтр в главной +
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const initFilters = () => {
        setFilters({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'name_last': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            'position.name': {value: null, matchMode: 'myfilter'},
            'account.item': {value: null, matchMode: FilterMatchMode.IN},
            'filial.name': {value: null, matchMode: FilterMatchMode.IN},
            'status.name': {value: null, matchMode: FilterMatchMode.IN},
        });
        setGlobalFilterValue('');
    }



    FilterService.register('myfilter', (value, filters)  => {
        if (filters === undefined || filters === null || filters.length === 0) {
            return true;
        }
        value = employees
        return value.some(v => filters.includes(v.position && v.position[0] !== undefined && v.position[0].name));
    });


    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span>{option}</span>
            </div>
        );
    }

    const rowFilterTemplate = (options, arr) => {

        return <MultiSelect value={options.value} options={arr}
                            itemTemplate={representativesItemTemplate}
                            onChange={(e) => options.filterCallback(e.value)}
                            optionLabel="" placeholder="Выбирай" className="p-column-filter"/>;
    }

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-outlined p-button-secondary"/>;
    }

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-outlined p-button-success"/>
    }

    // -----------Фильтр в главной -


    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
        setSelectedFilial(null);
        setSelectedPositions([]);
        setSelectedStatus(null);
    }

    const prepareEmployee = (option) => {
        return {
            account: option.account.map(r => r.id),
            position: selectedPositions.map(r => r.id),
            name_last: option.name_last,
            name_first: option.name_first,
            name_middle: option.name_middle,
            status: selectedStatus.id,
            comment: option.comment,
            filial: selectedFilial.id
        }
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }
    // TODO переделать не обновляя запрос к api
    const saveAccount = () => {
        setSubmitted(true);
        if (employee.name_last.trim()
            && selectedStatus
            && selectedPositions.length > 0
            && selectedFilial
            && employee.name_first.trim()
        ) {
            let _employees = [...employees];
            let _employee = {...employee};
            if (employee.id) {
                const index = findIndexById(employee.id);
                employee.position=selectedPositions
                employee.status=selectedStatus
                employee.filial=selectedFilial

                if (JSON.stringify(employees[index]) !== JSON.stringify(employee)) {
                    _employees[index] = _employee
                    employeeService.putEmployee(
                        employee.id, prepareEmployee(_employee)
                    ).then(r => employeeService.getEmployee().then(data => setEmployees(data)))
                    toast.current.show({severity: 'success', summary: 'Внесены изменения', detail: `${employee.name_last} ${employee.name_first}`, life: 5000});
                }
                hideDialog()
                setEmployee(emptyEmployee);
            } else {
                delete _employee.account
                _employee.status = selectedStatus.id
                _employee.filial = selectedFilial.id
                _employee.position = selectedPositions.map(i => i.id)

                employeeService.postEmployee(_employee).then(
                    r => {
                        employeeService.getEmployee().then(data => setEmployees(data));
                        setEmployee(r);
                        toast.current.show({severity: 'success', summary: 'Создан новый пользователь', detail: `${employee.name_last} ${employee.name_first}`, life: 3000});
                    }).catch(error =>
                    sendMassageError(error))
            }
        }
    }

    const editEmployee = (options) => {
        setEmployee({...options});
        setSelectedFilial(options.filial);
        setSelectedStatus(options.status);
        setSelectedPositions(options.position);
        setEmployeeDialog(true);
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _employee = {...employee};
        _employee[`${name}`] = val;

        setEmployee(_employee);
    }


    // ----------Экспорт +
    const [exportDataExcel, setExportDataExcel] = useState([]);

    const prepareExportExcel = (arr) => {
        let results = [];
        for (let i = 0; i < arr.length; i++) {
            let prepare = {}
            prepare['Фамилия']=arr[i].name_last
            prepare['Имя']=arr[i].name_first
            prepare['Отчество']=arr[i].name_middle
            prepare['Должность']=arr[i].position.map(name => name.name).join()
            prepare['Филиал']=arr[i].filial.name
            prepare['Статус']=arr[i].status.name
            arr[i].account.map(value=> {
                    prepare[value.type.name] = value.basic ? value.item: '';
                    prepare[`${value.type.name} пароль`] = value.basic ? value.password: '';
            })
            results.push(prepare)
        }
        return results
    }

    const exportExcel = () => {
        ExportExel(prepareExportExcel(exportDataExcel.length !== 0 ? exportDataExcel: employees), 'Аккаунты');
    }

    const getCSVTemplateEmail = () => {
        const instService = new ActionService();
        let FileSaver = require('file-saver');
        instService.getCSVEmail('account')
            .then((response) => {
                    FileSaver.saveAs(response.data, 'report.csv');
                });
    }

    // ----------Экспорт -


    // Контекстное меню для таблице +
    const reset_filter = () => {
        initFilters();
    }

    const openNew = () => {
        setEmployee(emptyEmployee);
        setSubmitted(false);
        setEmployeeDialog(true);
    }

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
                    label: 'CSV',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        {
                            label: 'Адресная',
                            icon: 'pi pi-book',
                            command: () => getCSVTemplateEmail()
                        },
                    ]
                },
                {
                    label: 'Excel',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        {
                            label: 'Экспорт',
                            icon: 'pi pi-book',
                            command: () => {
                                exportExcel();
                            }
                        }
                    ]
                }
            ]
        },
        {
            label: 'Сброс',
            icon: 'pi pi-filter-slash',
            command: () => reset_filter()
        }
    ];

    const start = <div className="p-inputgroup ">
        <InputText id="search_main" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск"/>
        <Button type="button" className="p-button-outlined" icon="pi pi-times" onClick={reset_filter}/>
    </div>

    const customerTableHeader = (
        <div className="table-header">
        <Menubar model={items} start={start} className="table-menu-header" />
        </div>
    );
// Контекстное меню для таблице -

    const handleMouseUpCopy = () => {
        let string_text = window.getSelection().toString()
         copyToClipboard(string_text)
    }

    const commentBodyTemplate = (rowData) => {
        return (<>
            <Tooltip target={`.custom-full-comment-${rowData.id}`} style={{maxWidth: '300px'}}/>
            <div data-pr-tooltip={rowData.comment} data-pr-position="top"
                 className={`custom-full-comment-${rowData.id}`} style={{maxWidth: '250px'}}>
                {rowData.comment}
            </div>
        </>);
    }

    const filialBodyTemplate = (data) => {
        return (
            <div onMouseUp={()=>handleMouseUpCopy()} onClick={() => copyToClipboard(data.filial.name)}>
                {data.filial.name}
            </div>
        );
    };
    const statusBodyTemplate = (data) => {
        return (
            <div onMouseUp={()=>handleMouseUpCopy()} onClick={() => copyToClipboard(data.status.name)}>
                {data.status.name}
            </div>
        );
    };
    const positionBodyTemplate = (data) => {
        return (
            <div onMouseUp={()=>handleMouseUpCopy()} onClick={() => copyToClipboard(data.position[0] && data.position[0].name)}>
                {data.position && data.position.map((item) =>
                    <div key={item.id} className="p-text-normal">{item.name}</div>
                )}
            </div>
        );
    };
    const baseInformationBodyTemplate = (data) => {
        return (
            <div className="flex align-items-center py-2 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                    <Avatar label={data.name_last[0]}
                            className="p-overlay-badge" size="large"
                            style={{backgroundColor: '#2196F3', color: '#ffffff'}}
                            shape="circle"
                            onClick={() => editEmployee(data)}>
                        {BadgeDate(data)}
                    </Avatar>
                </div>
                <span className="pl-2 line-height-3">
                        <div className="font-bold text-orange-500" onMouseUp={()=>handleMouseUpCopy()}>{data.name_last} {data.name_first}</div>
                    {data.account && data.account.map((item) =>
                        <div key={item.id} className="p-text-normal" onMouseUp={()=>handleMouseUpCopy()}>{item.basic ? item.type.name + ': ' +item.item : ''}</div>
                    )}
                    </span>
            </div>
        );
    };


    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }
    const onFilialChange = (e) => {
        setSelectedFilial(e.value);
    }

    //----------------------------------------

    const userDialogFooter = (
        <>
            {selectedEmployee && <Button label="Отправить" icon="pi pi-fw pi-send" className="p-button-text" onClick={() => messageEmail(selectedEmployee)}/>}
            <Button label="Отменить" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveAccount}/>
        </>
    );

    const menuModel = [
        {label: 'Открыть', icon: 'pi pi-fw pi-eye', command: () => editEmployee(selectedEmployee)},
        {label: 'Отправить', icon: 'pi pi-fw pi-send', command: () => messageEmail(selectedEmployee)}
    ];

    // изменения комента из основной таблице +
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{width: "100%"}}/>;
    }
    const onCellEditComplete = (e) => {
        let {rowData, newValue, field} = e;
        let _employees = [...employees];
        let opt = {}
        rowData[field] = newValue;
        opt[field] = rowData[field]
        employeeService.patchEmployee(rowData.id, opt).then(
            () => setEmployee(_employees)
        ).catch(
            error => sendMassageError(error)
        );
    }
    // изменения комента из основной таблице -

    return (
        <div>
            <div className="col-12">
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedEmployee(null)} />
                <div className="card" style={{ height: 'calc(100vh - 140px)' }}>
                    <h5>Обычные пользователи</h5>
                    <DataTable
                        value={employees}
                        dataKey="id"
                        globalFilterFields={['name_first', 'name_last', 'account.item', 'position.name', 'filial.name']}
                        emptyMessage="Ты что-то делаешь не то!"
                        filters={filters}
                        filterDisplay="menu"
                        resizableColumns
                        columnResizeMode="fit"
                        scrollable
                        stripedRows
                        showGridlines
                        scrollHeight="70vh"
                        className="p-datatable-customers editable-cells-table"
                        // loading={loading}
                        header={customerTableHeader}
                        selectionMode="single"
                        selection={selectedEmployee}
                        contextMenuSelection={selectedEmployee}
                        reorderableColumns
                        responsiveLayout="stack"
                        breakpoint="960px"
                        onContextMenuSelectionChange={e => setSelectedEmployee(e.value)}
                        onContextMenu={e => cm.current.show(e.originalEvent)}
                        onSelectionChange={e => setSelectedEmployee(e.value)}
                        onRowDoubleClick={() => messageEmail(selectedEmployee)}
                        editMode="cell"
                        autoLayout={true}
                        onValueChange={filteredData => setExportDataExcel(filteredData)}
                        // stateKey="tablestatedemo-session"
                    >
                        <Column field="name_last" header="Информация"
                                style={{width: "350px"}}
                                sortable
                                body={baseInformationBodyTemplate}
                                columnKey={"name_last"}
                        />
                        <Column header="Позиция"
                                body={positionBodyTemplate}
                                filter
                                filterField="position.name"
                                filterPlaceholder="Поиск должности"
                                filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                                onFilterApplyClick={e=>console.log(e.constraints.value)}
                                filterClear={filterClearTemplate}
                                filterApply={filterApplyTemplate}
                                showFilterMatchModes={false}
                                filterElement={e=>rowFilterTemplate(e, filterPosition)}
                                columnKey={"position"}
                        />
                        <Column header="Статус" field="status.name" sortable
                                body={statusBodyTemplate}
                                filterClear={filterClearTemplate}
                                filter showFilterMatchModes={false}
                                filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                                filterElement={e=>rowFilterTemplate(e, filterStatus)}
                                filterApply={filterApplyTemplate}
                                columnKey={"status"}
                        />
                        <Column header="Филиал" field="filial.name" sortable
                                body={filialBodyTemplate}
                                filterClear={filterClearTemplate}
                                filter showFilterMatchModes={false}
                                filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                                filterField="filial.name"
                                filterElement={e=>rowFilterTemplate(e, filterFilial)}
                                filterApply={filterApplyTemplate}
                                columnKey={"filial"}
                        />
                        <Column field="comment" header="Комментарий"
                                editor={(options) => textEditor(options)}
                                body={commentBodyTemplate}
                                onCellEditComplete={onCellEditComplete}
                                columnKey={"comment"}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog visible={employeeDialog}
                    style={{width: '900px'}}
                    header="Профиль пользователя"
                    modal
                    maximizable
                    className="p-fluid"
                    footer={userDialogFooter}
                    onHide={hideDialog}>

                <div className="formgrid grid">
                    <Toast ref={toast} position="bottom-left"/>
                    <div className="field col">
                        <label htmlFor="name_first">Имя:</label>
                        <InputText id="name_first" value={employee.name_first} onChange={(e) => onInputChange(e, 'name_first')} required autoFocus
                                   className={classNames({'p-invalid': submitted && !employee.name_first})}/>
                        {submitted && !employee.name_first && <small className="p-invalid">Обязательно для заполнения</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="name_middle">Отчество:</label>
                        <InputText id="name_middle" value={employee.name_middle} onChange={(e) => onInputChange(e, 'name_middle')}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="name_last">Фамилия:</label>
                    <InputText id="name_last" value={employee.name_last} onChange={(e) => onInputChange(e, 'name_last')} required
                               className={classNames({'p-invalid': submitted && !employee.name_last})}/>
                    {submitted && !employee.name_last && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="filial">Филиал:</label>
                        <Dropdown value={selectedFilial} options={filial} optionLabel="filial" showClear
                                  onChange={onFilialChange} placeholder="Филиал" required
                                  valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate}
                                  className={classNames({'p-invalid': submitted && !selectedFilial})}
                        />
                        {submitted && !selectedFilial && <small className="p-invalid">Обязательно для заполнения</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="status">Статус:</label>
                        <Dropdown value={selectedStatus} options={status} optionLabel="status" showClear onChange={onStatusChange}
                                  placeholder="Статус" required
                                  className={classNames({'p-invalid': submitted && !selectedStatus})}
                                  valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate}
                        />
                        {submitted && !selectedStatus && <small className="p-invalid">Обязательно для заполнения</small>}
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="position">Должность:</label>
                    <MultiSelect value={selectedPositions}
                                 options={positions}
                                 onChange={(e) => setSelectedPositions(e.value)}
                                 optionLabel="position"
                                 placeholder="Должность"
                                // filter
                                 required
                                 virtualScrollerOptions={{itemSize: 34}}
                                 resetFilterOnHide={true}
                                 showSelectAll={false}
                                 emptyFilterMessage={"Ерунда какая-то! Ты точно сотрудник компании?"}
                                 itemTemplate={positionOptionTemplate}
                                 selectedItemTemplate={selectedPositionOptionTemplate}
                                 panelFooterTemplate={panelFooterPositionTemplate(selectedPositions)}
                                 dataKey="id"
                                 className={classNames({'p-invalid': submitted && selectedPositions.length === 0})}
                    />
                    {submitted && selectedPositions.length === 0 && <small className="p-invalid">Обязательно для заполнения</small>}
                </div>

                <Divider align="center">
                    <span className="p-tag">Аккаунты</span>
                </Divider>
                {employee.id && <div className="formgrid grid">
                                    <div className="field col">
                                        <Panel header="Добавить аккаунт" toggleable collapsed={employee.account.length !== 0}>
                                            <div className="form-demo">
                                                <NewAccountForm user={employee} setEmployee={setEmployee}/>
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                }
                <div className="field">
                    <DataTableAccounts employee_={employee} setEmployee={setEmployee}/>
                </div>
            </Dialog>
        </div>
    )
}

