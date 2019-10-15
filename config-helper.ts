import {
    transformCamelCaseIntoSnakeCase,
    transformCamelCaseIntoReadable
} from "./util.js";


interface DetailConfig {
    value: number,
    min?: number,
    max?: number,
    step?: number
};

export function createDetailedConfig<T extends Object>(config: T) {
    const detailedConfig = {};

    const isDetailConfig = (n: any): n is DetailConfig => typeof n == 'object' && 'value' in n

    for (const key in config) {
        (detailedConfig as any)[key] = isDetailConfig((config as any)[key]) ? (config as any)[key] : { value: (config as any)[key] };
    }

    return detailedConfig as any as { [key in keyof typeof config]: DetailConfig };
}

interface Config {
    [key: string]: DetailConfig
}

interface InputCreator {
    (elem: HTMLInputElement, changeListener: ConfigChange, config: Config, name: string): void
}

const inputCreator: { [key: string]: InputCreator } = {
    number(elem, changeListener, config, name) {
        const entry = config[name];
        elem.value = '' + entry.value;
        elem.addEventListener('change', () => {
            const c = config[name];
            c.value = +elem.value;
            changeListener(name, +elem.value);
        })
    }
};

interface ConfigChange {
    (name: string, newValue: string | number): void
}

export function createConfigInterface(config: Config, changeListener: ConfigChange) {
    const form = document.getElementsByTagName('form')[0];
    if (!form)
        return;

    let configEntry: keyof Config;
    for (configEntry in config) {
        const entry = config[configEntry];
        const type = typeof entry.value;

        if (!(type in inputCreator))
            throw new Error('could not translate config entry ' + configEntry + ' with the value ' + config[configEntry] + ' (' + type + ')');

        const input = document.createElement('input');

        input.setAttribute('type', 'number');
        input.setAttribute('name', transformCamelCaseIntoSnakeCase(name));

        for (const key in entry)
            input.setAttribute(key, (entry as any)[key]);

        inputCreator[type](input, changeListener, config, configEntry);

        const label = document.createElement('label');
        label.innerText = transformCamelCaseIntoReadable(configEntry);
        const group = document.createElement('div');


        group.appendChild(label);
        group.appendChild(input);

        form.appendChild(group);
    }

}