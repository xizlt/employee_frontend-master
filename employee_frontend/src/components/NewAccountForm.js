import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {Password} from 'primereact/password';
import {Checkbox} from 'primereact/checkbox';
import {Divider} from 'primereact/divider';
import {classNames} from 'primereact/utils';
import {PasswordGenerate} from "./PasswordGenerate";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import {AccountTypeService} from "../service/AccountTypeService";
import {AccountService} from "../service/AccountService";
import {EmployeeService} from "../service/EmployeeService";
import {ActionService} from "../service/ActionService";
import {TYPE} from "../App";

export const NewAccountForm = (props) => {
    const [typeAccount, setTypeAccount] = useState([]);
    const toast = useRef(null);
    const [password, setPassword] = useState('');
    const [account, setAccount] = useState(props.user.account);

    const employeeService = new EmployeeService();
    const instService = new AccountService();

    useEffect(() => {
        const accTypeService = new AccountTypeService();
        accTypeService.getAccountType().then(data => {
            setTypeAccount(data);
        }).catch(err => sendMassageError(err));
    }, []);


    const defaultValues = {
        item: '',
        password: '',
        type: null,
        basic: true,
        comment: ''
    }

    const {control, formState: {errors}, handleSubmit, reset, setValue} = useForm({defaultValues});

    const sendMassageOk = (data) => {
        toast.current.show({severity: 'success', summary: 'Добавлено', detail: `Вы добавили ${data}`})
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }


    const checkIsBasic = (val) => {
        let res = props.user.account.map(data => {
            if (data.type.id === val.type.id && val.basic && data.basic)
                return data.item
        })
        return res.find(i => i)
    }

    const onSubmit = (options) => {
        if (password){
            setValue("password", password,{
                shouldValidate: true,
                shouldDirty: true
            })
        }
        let isFall = checkIsBasic(options)
        if (isFall) {
            return sendMassageError(`Основной уже есть ${isFall}.`)
        }

        options.type = options.type.id
        let user_acc_ids = props.user.account.map(i => i.id)

        instService.postAccount(options).then(
            data => {
                employeeService.patchEmployee(props.user.id, {account: [...user_acc_ids, data.id]}).then(
                    r => {
                        employeeService.itemEmployee(props.user.id).then(
                            i => {
                                props.setEmployee(i);
                            });
                    }
                );
                sendMassageOk(data.item);
            }).catch((error) => {
            sendMassageError(error.response.data)
        });

        setAccount(null);
        setPassword(null);
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const rule = {required: 'Обязательно для заполнения.'}


    const field_name = (
        <div className="p-field" key="name">
                        <span className="p-float-label">
                            <Controller name="item" control={control} rules={rule} render={({field, fieldState}) => (
                                <InputText id={field.name} {...field} className={classNames({'p-invalid': fieldState.invalid})}/>
                            )}/>
                            <label htmlFor="item" className={classNames({'p-error': errors.item})}>Значение*</label>
                        </span>
            {getFormErrorMessage('item')}
        </div>)

    const field_email = (
        <div className="p-field" key="email">
                <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope"/>
                    <Controller name="item" control={control}
                                rules={{required: 'Обязательно для заполнения.', pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Неверный формат, пример: example@email.com'}}}
                                render={({field, fieldState}) => (
                                    <InputText id={field.name} {...field}
                                               className={classNames({'p-invalid': fieldState.invalid})}/>
                                )}/>
                    <label htmlFor="item" className={classNames({'p-error': !!errors.item})}>Email*</label>
                </span>
            {getFormErrorMessage('item')}
        </div>)

    const field_mobile = (
        <div className="p-field" key="mobile">
                        <span className="p-float-label">
                            <Controller name="item" control={control}
                                        rules={{required: 'Обязательно для заполнения.', pattern: {value: /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/, message: 'Неверный формат, должно быть в формате 7 (999) 999-9999'}}}
                                        render={({field, fieldState}) => (
                                            <InputMask id={field.name} {...field} mask="7 (999) 999-9999" unmask
                                                       refCallback={field.ref} ref={null}
                                                       className={classNames({'p-invalid': fieldState.invalid})}/>
                                        )}/>
                            <label htmlFor="item" className={classNames({'p-error': errors.item})}>Телефон*</label>
                        </span>
            {getFormErrorMessage('item')}
        </div>)

    const field_phone = (
        <div className="p-field" key="phone">
                        <span className="p-float-label">
                            <Controller name="item" control={control}
                                        rules={{required: 'Обязательно для заполнения.', pattern: {value: /^[0-9]{4}$/, message: 'Неверный формат, должно быть 4 числа'}}}
                                        render={({field, fieldState}) => (
                                            <InputMask id={field.name} {...field} mask="9999" className={classNames({'p-invalid': fieldState.invalid})} refCallback={field.ref} ref={null}/>
                                        )}/>
                            <label htmlFor="item" className={classNames({'p-error': errors.item})}>Телефон*</label>
                        </span>
            {getFormErrorMessage('item')}
        </div>)


    const field_password = (req) => (
        <div className="p-field" key="password">
                <span className="p-float-label">
                    <div className="p-inputgroup">
                    <Controller name="password" control={control}
                                render={({field, fieldState}) => (
                                    <Password id={field.name} {...field} toggleMask placeholder={req ? 'Пароль*' : 'Пароль'}
                                              value={password ? password: field.value}
                                              className={classNames({'p-invalid': fieldState.invalid})}
                                              onChange={(e)=> {
                                                  setPassword('');
                                                  field.onChange(e.target.value);
                                              }}
                                    />
                                )}/>
                        <PasswordGenerate setPassword={setPassword} />
                    </div>
                </span>
            {getFormErrorMessage('password')}
        </div>)

    /*
    * Мобильный - 1
    * Внутренний - 4
    * Учетка в домене - 3
    * Email - 2
    * */

    const FieldsForm = () => {
        if (!account) {
            return ''
        }
        switch (account.id) {
            case TYPE['mobile']:
                return field_mobile;
            case TYPE['phone']:
                return field_phone;
            case TYPE['account']:
                return [field_name, field_password(true)];
            case TYPE['email']:
                return [field_email, field_password(true)];
            default:
                return [field_name, field_password(false)];
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <Toast ref={toast} position="bottom-left"/>
            <div className="p-field">
                <span className="p-float-label">
                    <Controller name="type" rules={rule} control={control} render={({field}) => (
                        <Dropdown value={field.value} options={typeAccount} showClear required onChange={e => {
                            field.onChange(e.value);
                            setAccount(e.value);
                        }} refCallback={field.ref} ref={null} optionLabel="name" id={field.name} autoFocus/>
                    )}/>
                    <label htmlFor="type" className={classNames({'p-error': errors.type})}>Тип*</label>
                </span>
                {getFormErrorMessage('type')}
            </div>

            {FieldsForm()}

            <div className="p-field">
                <Controller name="basic" control={control} render={({field, fieldState}) => (
                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value}/>
                )}/>
                <label htmlFor="basic" className="ml-2">Основной</label>
            </div>
            <div className="p-field">
                <span className="p-float-label">
                    <Controller name="comment" control={control} render={({field, fieldState}) => (
                        <InputTextarea id={field.name} {...field} autoResize/>
                    )}/>
                    <label htmlFor="comment">Комментарий</label>
                </span>
            </div>
            <Button type="submit" label="Добавить" className="p-mt-2"/>
        </form>
    );
}
