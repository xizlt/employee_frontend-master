import React from 'react';
import {TYPE} from "../App";
import {copyToClipboard} from "./Helper";

export const messageEmail = (employee) => {
    let message = '';

    employee.account.forEach(function (item) {
            
            if (item.type.id === TYPE['email'] && item.basic) {
                message += `Почтовый ящик: ${item.item}\nПароль: ${item.password}\n\n`
            }
            if (item.type.id === TYPE['account'] && item.basic) {
                message += `Сотрудник: ${employee.name_last} ${employee.name_first}\nПользователь: ${item.item}\nПароль: ${item.password}\n\n`
            }
            if (item.type.id === TYPE['phone'] && item.basic) {
                message += `Внутренний номер: ${item.item}`
            }

            if (message) {
                copyToClipboard(message);
                console.log("Что-то есть")
            } else {
                console.log("Пусто")
            }
        }
    )

    



    
};
