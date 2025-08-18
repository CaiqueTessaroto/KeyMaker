
//console.log("Hello");

document.getElementById("button_eyes").addEventListener('click', () => { Show_Input(); });
document.getElementById("button_more").addEventListener('click', () => { Add_InputFields(); });
document.getElementById("button_less").addEventListener('click', () => { Remove_InputFields(); });
document.getElementById("button_play").addEventListener('click', () => { Gerate(); });

window.onload = function () {

    const selecfields = document.getElementsByClassName("order");
    var myOptions = [];

    for (var x = 0; x < selecfields.length; x++) {
        myOptions[x] = x + 1;
    }

    for (var x = 0; x < selecfields.length; x++) {

        var select = document.getElementById(selecfields[x].id);
        for (var i = 1; i <= myOptions.length; i++) {
            var option = '<option value="' + i + '" >' + myOptions[i - 1] + '</option>';
            select.insertAdjacentHTML('beforeend', option);
        }
    }

    const checkboxs = document.getElementsByClassName("more_checkbox");
    const less_checkboxs = document.getElementsByClassName("less_checkbox");
    for (var i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener('click', (event) => {
            Add_Checkbox(event.target.id);
        });
        less_checkboxs[i].addEventListener('click', (event) => {
            Remove_Checkbox(event.target.id);
        });
    }

    let password = document.getElementById('ordem_1');
    password.value = 2;


    load();

    Get_Sitename();


};


function load() {

    const amount_container = JSON.parse(localStorage.getItem('amount_container'));
    const container = document.querySelectorAll('.container');

    var gerate = amount_container - container.length;

    for (let i = 0; i < gerate; i++) {
        Add_InputFields()
    }

    const input = document.querySelectorAll('.input');
    const words_container = JSON.parse(localStorage.getItem('words_container'));

    if (words_container != null)
        for (let i = 1; i < input.length; i++) {
            input[i].value = words_container[i];
        }

}


function Get_Sitename() {
    let url;
    const sitename = document.getElementById('password_0');

    var aKeys = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"],
        sUsrAg = navigator.userAgent,
        nIdx = aKeys.length - 1;

    for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);

    // see the note below on how to choose currentWindow or lastFocusedWindow
    if (aKeys[nIdx] == "Chrome") {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            url = tabs[0].url;

            url = url.substring(url.lastIndexOf(".", url.lastIndexOf(".") - 1) + 1);

            url = url.replace(/(https?:\/\/)?(www.)?/i, '');
            url = url.split('.');

            if (url.length == 1) {
                url = url[0];
                url = url.split(':');
            }
            if (url[0].length <= 2) url.shift();

            url = url[0];

            sitename.value = url;
            // use `url` here inside the callback because it's asynchronous!
        });
    }
    //else aviso

}



function Show_Input() {
    var button_img = document.getElementById("button_eyes");
    const inputs = document.getElementsByName("myInput");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "password") {
            inputs[i].type = "text";
        } else {
            inputs[i].type = "password";
        }
    }

    if (inputs[0].type == "text") {
        button_img.style.backgroundImage = "url(imagens/open_eyes.png)";
    } else {
        button_img.style.backgroundImage = "url(imagens/close_eyes.png)";
    }
}

function Add_InputFields() {
    let item, node, local, container;

    const itens = document.getElementsByClassName("inputfield");

    if (itens.length <= 6) {

        var number = itens.length;

        container = "container_" + number;

        item = document.getElementById(container);
        local = document.getElementById("inputfields");

        node = document.importNode(item, true);

        let userTemplate = document.getElementById("text_template").innerHTML;

        userTemplate = userTemplate
            .replace('{{less}}', "checkbox_button_less_" + number)
            .replace('{{more}}', "checkbox_button_more_" + number)
            .replace('{{id}}', "checkbox_0_" + number)
            .replace('{{name}}', "checkbox_field_" + number)
            .replace('{{ordem}}', "ordem_" + number)
            .replace('{{password}}', "password_" + number)
            .replace('{{valor}}', number);


        let nex_container = document.getElementById(container);
        nex_container.innerHTML = userTemplate;

        number = itens.length;
        node.id = "container_" + number;

        local.appendChild(node);

        document.getElementsByClassName("more_checkbox")[number - 1].addEventListener('click', (event) => { Add_Checkbox(event.target.id); });
        document.getElementsByClassName("less_checkbox")[number - 1].addEventListener('click', (event) => { Remove_Checkbox(event.target.id); });


        const inputs = document.getElementsByName("myInput");
        for (let i = 1; i < inputs.length; i++) {
            if (inputs[0].type === "password") inputs[i].type = "password";
            if (inputs[0].type === "text") inputs[i].type = "text";
        }

        Replace_order();
    }

}

function Replace_order() {

    let item, node, local, parentNode;
    var myOptions = [];

    const selecfields = document.getElementsByClassName("order");

    for (var x = 0; x < selecfields.length; x++) {
        myOptions[x] = x + 1;
    }

    for (var x = 0; x < selecfields.length; x++) {

        item = document.getElementById("ordem_" + x);
        local = document.getElementById(selecfields[x].id);
        node = document.importNode(item, true);

        parentNode = local.parentNode;

        for (var i = 1; i <= myOptions.length; i++) {
            if (i == selecfields.length) {
                var option = '<option value="' + i + '" >' + myOptions[i - 1] + '</option>';
                node.insertAdjacentHTML('beforeend', option);
            }
            else if (x == selecfields.length - 1) {
                var option = '<option value="' + i + '" >' + myOptions[i - 1] + '</option>';
                node.insertAdjacentHTML('beforeend', option);
            }
        }

        parentNode.replaceChild(node, local);
    }

    for (var x = 0; x < selecfields.length; x++) {
        local = document.getElementById(selecfields[x].id);
        local.value = x + 1;
    }

}

function Add_Checkbox(id) {
    let item, node, local;

    var field = id.match(/\d/g).join("");

    const itens = document.getElementsByName("checkbox_field_" + field);

    const password = document.getElementById('password_' + field);
    var value = password.value.length - 1;

    if (itens.length <= value) {
        item = document.getElementById("checkbox_0_" + field);
        local = document.getElementsByClassName("checkboxfield")[field];
        node = document.importNode(item, true);

        node.id = "checkbox_" + itens.length + "_" + field;

        local.appendChild(node);

    }
}

function Remove_Checkbox(id) {
    var last_element;
    let local;

    if (isNaN(id))
        var field = id.match(/\d/g).join("");
    else
        var field = id;

    const itens = document.getElementsByName("checkbox_field_" + field);
    local = document.getElementsByClassName("checkboxfield")[field];

    last_element = itens.length - 1;

    if (last_element != 0) local.removeChild(itens[last_element]);
}

function Remove_InputFields() {
    let local, item, last_item, node;
    var last_element, container;

    const itens = document.getElementsByClassName("inputfield");
    local = document.getElementById("inputfields");

    last_element = itens.length - 1;
    container = "container_" + last_element;

    item = document.getElementById(container);

    last_item = document.getElementById("container_" + itens.length);
    node = document.importNode(last_item, true);
    node.id = "container_" + last_element;

    const order = document.getElementsByName("ordem");

    if (last_element != 1) {
        local.removeChild(item);
        local.replaceChild(node, last_item);

        for (var i = 0; i < order.length; i++) {
            order[i].removeChild(order[i].lastChild)
        }
    }
}


function Gerate() {

    const output = document.getElementById('output');
    const selec_option = document.getElementsByClassName("order");

    var result = "";
    let results = [];

    var ordem = null;
    var bool = false;

    var options = [];

    var checkbox_id;
    let checkbox;

    const inputs = document.getElementsByClassName("input");

    for (var x = 0; x < inputs.length; x++) {
        const checkbox_fields = document.getElementsByName("checkbox_field_" + x);
        var num_checkbox = checkbox_fields.length;
        var num_lyrics = inputs[x].value.length;
        if (num_checkbox > num_lyrics) {
            var amount = num_checkbox - num_lyrics;
            for (var i = 0; i < amount; i++) {
                Remove_Checkbox(x);
            }
        }
    }



    for (var x = 0; x < selec_option.length; x++) {
        var local = document.getElementById(selec_option[x].id);
        options[x] = local.value;
    }


    for (var x = 0; x < selec_option.length; x++) {
        bool = false;
        for (var i = 0; i < selec_option.length; i++) {
            if (x + 1 == selec_option[i].value) bool = true;
        }
        for (var i = 0; i < selec_option.length; i++) {
            for (var y = 0; y < selec_option.length; y++) {
                if (options[y] == options[i] && y != i && bool == false) {
                    options[i] = x + 1;
                }
            }
        }
    }

    for (var x = 0; x < selec_option.length; x++) {
        var local = document.getElementById(selec_option[x].id);
        local.value = options[x];
    }



    var selectfields = []

    for (var x = 0; x < selec_option.length; x++) {
        var value = selec_option[x].value - 1;
        selectfields.push(value);
    }

    // Criar uma lista de objetos contendo os valores e seus índices originais
    const listaComIndices = selectfields.map((valor, indice) => ({
        valor: valor,
        indice: indice
    }));

    // Ordenar a lista com base nos valores
    listaComIndices.sort((a, b) => a.valor - b.valor);

    // Criar uma lista apenas com os índices na ordem dos valores
    const indicesOrdenados = listaComIndices.map(item => item.indice);

    console.log(indicesOrdenados);

    results = indicesOrdenados;








    for (var y = 0; y < results.length; y++) {

        ordem = results[y]

        let checkbox_field = document.getElementsByName('checkbox_field_' + ordem);
        let element_password = document.getElementById('password_' + ordem);

        var passaword = element_password.value;

        var wordsize = passaword.length;
        var amount = checkbox_field.length;
        var percentage = (100 / amount) / 100;
        var lyrics_size = wordsize * percentage;
        //console.log(lyrics_size);

        for (var i = 0; i < checkbox_field.length; i++) {
            checkbox_id = "checkbox_" + i + "_" + ordem;
            checkbox = document.getElementById(checkbox_id);
            //const checkbox_selec = document.querySelectorAll('input[name="checkbox_field_' + ordem + '"]:checked');
            //console.log(checkbox_selec)

            if (checkbox.checked == true && passaword[i] != null && lyrics_size == 1) result = result + passaword[i];

            var init = i * lyrics_size;

            if (lyrics_size != 1 && checkbox.checked == true) {
                for (var x = init; x < wordsize; x++) {
                    if (x < lyrics_size + init) {
                        result = result + passaword[x];
                    }
                }
            }

        }


    }

    output.value = result;


    save();

}



function save() {

    const container = document.querySelectorAll('.container');

    const valores = [];
    const input = document.querySelectorAll('.input');

    localStorage.setItem('amount_container', JSON.stringify(container.length));  // Salva os valores como JSON no LocalStorage

    input.forEach(input => {
        valores.push(input.value);  // Salva o valor de cada caixa de texto
    });

    localStorage.setItem('words_container', JSON.stringify(valores));  // Salva os valores como JSON no LocalStorage

}




