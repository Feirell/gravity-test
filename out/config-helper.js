import { transformCamelCaseIntoSnakeCase, transformCamelCaseIntoReadable } from "./util.js";
;
export function createDetailedConfig(config) {
    const detailedConfig = {};
    const isDetailConfig = (n) => typeof n == 'object' && 'value' in n;
    for (const key in config) {
        detailedConfig[key] = isDetailConfig(config[key]) ? config[key] : { value: config[key] };
    }
    return detailedConfig;
}
const inputCreator = {
    number(elem, changeListener, config, name) {
        const entry = config[name];
        elem.value = '' + entry.value;
        elem.addEventListener('change', () => {
            const c = config[name];
            c.value = +elem.value;
            changeListener(name, +elem.value);
        });
    }
};
export function createConfigInterface(config, changeListener) {
    const form = document.getElementsByTagName('form')[0];
    if (!form)
        return;
    let configEntry;
    for (configEntry in config) {
        const entry = config[configEntry];
        const type = typeof entry.value;
        if (!(type in inputCreator))
            throw new Error('could not translate config entry ' + configEntry + ' with the value ' + config[configEntry] + ' (' + type + ')');
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('name', transformCamelCaseIntoSnakeCase(name));
        for (const key in entry)
            input.setAttribute(key, entry[key]);
        inputCreator[type](input, changeListener, config, configEntry);
        const label = document.createElement('label');
        label.innerText = transformCamelCaseIntoReadable(configEntry);
        const group = document.createElement('div');
        group.appendChild(label);
        group.appendChild(input);
        form.appendChild(group);
    }
}
