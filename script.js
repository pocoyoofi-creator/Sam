let mangoData = [];

// Cargar mangos desde mangos.txt
async function loadItems() {
    try {
        const response = await fetch('mangos.txt');
        const text = await response.text();

        mangoData = text
            .trim()
            .split('\n')
            .map(line => {
                const [name, price, perSecond, rarity] = line.split('|');
                return {
                    name: name.trim(),
                    price: parseFloat(price),
                    perSecond: parseFloat(perSecond),
                    rarity: rarity.trim()
                };
            });

        populateSelect('your-offer-list');
        populateSelect('their-offer-list');
    } catch (error) {
        console.error('Error loading mangos:', error);
    }
}

// Llenar el select con opciones
function populateSelect(selectId) {
    const select = document.getElementById(selectId);
    mangoData.forEach((mango, index) => {
        const option = document.createElement('option');
        option.value = index; // usamos el índice para permitir duplicados
        option.textContent = `${mango.name} - $${mango.price} (${mango.rarity})`;

        select.appendChild(option);
    });
}

// Agregar mango seleccionado al área correspondiente
function addItem(area) {
    const select = document.getElementById(area === 'your' ? 'your-offer-list' : 'their-offer-list');
    const selectedIndex = select.value;

    if (selectedIndex === "") return;

    const mango = mangoData[selectedIndex];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('selected-item');
    itemDiv.textContent = `${mango.name} - $${mango.price}`;
    itemDiv.setAttribute('data-price', mango.price);

    // Crear el botón para eliminar el mango
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        itemDiv.remove(); // Eliminar el mango de la lista
        updateTradeValue(); // Recalcular los valores después de eliminar
    };
    
    // Añadir el botón de eliminar al div
    itemDiv.appendChild(removeButton);

    const itemsArea = document.getElementById(area === 'your' ? 'your-items' : 'their-items');
    itemsArea.appendChild(itemDiv);

    // Reset select to default
    select.value = "";
    updateTradeValue(); // Recalcular los valores al agregar un mango
}

// Verificar si el intercambio es justo
function checkTrade() {
    const yourItems = document.getElementById("your-items").children;
    const theirItems = document.getElementById("their-items").children;

    let yourTotal = 0;
    let theirTotal = 0;

    for (let item of yourItems) {
        yourTotal += parseFloat(item.getAttribute("data-price"));
    }

    for (let item of theirItems) {
        theirTotal += parseFloat(item.getAttribute("data-price"));
    }

    let resultMessage;

    if (yourTotal === theirTotal) {
        resultMessage = "The trade is fair!";
    } else if (yourTotal > theirTotal) {
        resultMessage = "You're offering more than you're receiving.";
    } else {
        resultMessage = "You're receiving more than you're offering.";
    }

    document.getElementById("result").textContent = resultMessage;
}

// Calcular el valor total de los mangos en una oferta
function updateTradeValue() {
    const yourItems = document.getElementById("your-items").children;
    const theirItems = document.getElementById("their-items").children;

    let yourTotal = 0;
    let theirTotal = 0;

    for (let item of yourItems) {
        yourTotal += parseFloat(item.getAttribute("data-price"));
    }

    for (let item of theirItems) {
        theirTotal += parseFloat(item.getAttribute("data-price"));
    }

    // Mostrar el valor actualizado de cada área
    document.getElementById("your-total").textContent = `Your Total: $${yourTotal}`;
    document.getElementById("their-total").textContent = `Their Total: $${theirTotal}`;
}

// Cargar los mangos al cargar la página
window.onload = loadItems;
