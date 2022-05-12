import React, {useContext, useRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import '../table.css';
import {Password} from "primereact/password";
import axiosInstance from "../service/axcio";
import {classNames} from "primereact/utils";
import {Toast} from "primereact/toast";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";


export const LoginForm = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const defaultValues = {
        username: '',
        password: '',
    }
    const toast = useRef(null);
    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }

    const onSubmit = (data) => {
        axiosInstance
            .post(`token/`, {
                username: data.username,
                password: data.password,
            })
            .then((res) => {
                    auth.login(res.data);
                    history.push('/accounts_regular');
                }
            ).catch((error) => {
                if (error.response.status === 500)
                    sendMassageError(error.response.data)
                else
                    sendMassageError(error.response.data.detail)
        }).catch((error) => {
            sendMassageError("Нет соединения")
        })
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <div className="form-demo text-center mb-5">
                    <Toast ref={toast} position="bottom-left"/>
                    <div className="p-d-flex p-jc-center">
                        <h1 className="p-text-center">Авторизация</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="p-field">
                            <span className="p-float-label">
                                <Controller name="username" control={control} rules={{required: 'Обязательно.'}} render={({field, fieldState}) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({'p-invalid': fieldState.invalid})}/>
                                )}/>
                                <label htmlFor="username" className={classNames({'p-error': errors.username})}>Имя*</label>
                            </span>
                                {getFormErrorMessage('username')}
                            </div>
                            <div className="p-field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{required: 'Обязательно.'}} render={({field, fieldState}) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({'p-invalid': fieldState.invalid})} feedback={false}/>
                                )}/>
                                <label htmlFor="password" className={classNames({'p-error': errors.password})}>Пароль*</label>
                            </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <Button type="submit" label="Войти" className="p-mt-2"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
