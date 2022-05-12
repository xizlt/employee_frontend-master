import React, {useRef, useState} from 'react';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {Checkbox} from "primereact/checkbox";
import {InputNumber} from "primereact/inputnumber";
import {ActionService} from "../service/ActionService";
import {copyToClipboard} from "./Helper";

export const PasswordGenerate = (props) => {
    const default_pass = ['tl', 'ti', 'tp']
    const op = useRef(null);
    const toast = useRef(null);
    const [passRule, setPassRule] = useState(default_pass);
    const [lengthPassword, setLengthPassword] = useState(10);

    const sendMassageOk = () => {
        toast.current.show({severity: 'success', summary: 'Все ок', detail: 'Новый пароль сгенерирован и скопирован.'})
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }

    const onPassRuleChange = (e) => {
        let selectedRule = [...passRule];
        if (e.checked)
            selectedRule.push(e.value);
        else
            selectedRule.splice(selectedRule.indexOf(e.value), 1);
        setPassRule(selectedRule);
    }

    const generatePassword = (e) => {
        e.preventDefault();
        const instService = new ActionService();
        instService.getPassword(lengthPassword, passRule).then(data => {
            props.setPassword(data.password)
            setPassRule(default_pass)
            copyToClipboard(data.password)
            sendMassageOk()
        }).catch((error) => {
            sendMassageError(error)
        });
    }

    const generateCustomPassword = (e) => {
        generatePassword(e);
        op.current.hide();
    }

    return (
        <>
            <Toast ref={toast} position="bottom-left"/>
            <span className="p-buttonset">
                    <Button icon="pi pi-key" onClick={e=>generatePassword(e)} className="p-button-outlined p-button-secondary"/>
                    <Button icon="pi pi-cog" onClick={(e) => {
                        e.preventDefault();
                        op.current.toggle(e)
                    }} aria-haspopup aria-controls="overlay_panel_pwd"
                            className="select-product-button p-button-outlined p-button-secondary"/>
                </span>

            <OverlayPanel ref={op} showCloseIcon id="overlay_panel_pwd" style={{width: '250px'}} >
                <h5>Настройка пароля</h5>
                <div className="formgrid grid">
                    <div className="field">
                        <div className="pb-2">
                            <Checkbox inputId="cb2" value="tl" onChange={onPassRuleChange} checked={passRule.includes("tl")}/>
                            <label htmlFor="cb2" className="p-checkbox-label pl-2">Буквы</label>
                        </div>
                        <div className="pb-2">
                            <Checkbox inputId="cb3" value="ti" onChange={onPassRuleChange} checked={passRule.includes("ti")}/>
                            <label htmlFor="cb3" className="p-checkbox-label pl-2">Цифры</label>
                        </div>
                        <div className="pb-2">
                            <Checkbox inputId="cb3" value="tp" onChange={onPassRuleChange} checked={passRule.includes("tp")}/>
                            <label htmlFor="cb3" className="p-checkbox-label pl-2">Символы</label>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="minmax-buttons">Длина</label>
                        <div className="p-inputgroup">
                            <InputNumber inputId="minmax-buttons" value={lengthPassword}
                                         onValueChange={(e) => setLengthPassword(e.value)}
                                         mode="decimal" showButtons min={0} max={100}/>
                        </div>
                    </div>
                    <div className="field">
                        <Button label="Создать" onClick={e=>generateCustomPassword(e)}/>
                    </div>
                </div>
            </OverlayPanel>
        </>
    )
}
