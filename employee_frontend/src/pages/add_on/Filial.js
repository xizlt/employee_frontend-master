import React, {useEffect, useRef, useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Controller, useForm} from 'react-hook-form';
import {classNames} from 'primereact/utils';
import {Toast} from "primereact/toast";
import {FilialService} from "../../service/FilialService";

export const Filial = () => {
    const [positions, setPositions] = useState({});

    const toast = useRef(null);
    const filialService = new FilialService();

    useEffect(() => {
        filialService.getFilial().then(data => setPositions(data));
    }, []);

    const onRowEditComplete = (e) => {
        let _positions = [...positions];
        let {newData, index} = e;
        _positions[index] = newData;
        filialService.putFilial(newData).then(data => setPositions((_positions), data));
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{width: "100%"}}/>;
    }

    const defaultValues = {
        name: ''
    }
    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});

    const sendMassageOk = (data) => {
        toast.current.show({severity: 'success', summary: 'Добавлено', detail: `Вы добавили ${data}`})
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }

    const onSubmit = (options) => {
        filialService.postFilial(options.name).then(data => {
            setPositions([...positions, data]);
            sendMassageOk(data.name)
        }).catch((error) => {
            sendMassageError(error.response.data.name[0])
        });
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-left"/>
            <div className="col-12">
                <div className="card">
                    <h5>Подразделение</h5>
                    <div className="card">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="formgroup-inline">
                                <div className="field">
                                <span className="p-float-label">
                                <Controller name="name" control={control} rules={{required: 'Обязательно для заполнения.'}}
                                            render={({field, fieldState}) => (
                                                <InputText id={field.name} {...field} autoFocus className={classNames({'p-invalid': fieldState.invalid})}/>
                                            )}/>
                                <label htmlFor="name" className={classNames({'p-error': errors.name})}>Название*</label>
                                </span>
                                    {getFormErrorMessage('name')}
                                </div>
                                <div className="field">
                                    <Button label="Создать" type="submit"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <DataTable value={positions}
                               editMode="row"
                               className="p-datatable-customers editable-cells-table"
                               breakpoint="960px"
                               onRowEditComplete={onRowEditComplete}
                    >
                        <Column field="id" header="ID" style={{width: "20px"}} readonly/>
                        <Column field="name" header="Название" sortable
                                editor={(props) => textEditor(props)}
                                style={{wordBreak: "break-all"}}
                        />
                        <Column rowEditor style={{textAlign: "center", width: '4rem'}}/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
