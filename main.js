document.querySelector('#measure').addEventListener('change', setUnits);
document.querySelector('#form').addEventListener('submit', getOutput);

// Measure Values
const measures = {
    weight: {
        _unitBase: 'grams',
        grams: 1,
        kilograms: 0.001,
        pounds: 0.002204623,
        ounces: 0.03527396,
    },
    length: {
        _unitBase: 'metres',
        metres: 1,
        kilometres: 0.001,
        inches: 39.37007874,
        miles: 0.00062137,
        yards: 1.093613298,
        feet: 3.280839895,
    },
    area: {
        _unitBase: 'square metres',
        'square metres': 1,
        'square kilometres': 0.000001,
        'square inches': 1550.0031,
        'square miles': 0.0000003861,
        'square yards': 1.1959900463,
        'square feet': 10.7639104167,
        'acres': 0.00024710538,
    },
    volume: {
        _unitBase: 'cubic metres',
        'cubic metres': 1,
        'cubic inches': 61023.7440947,
        'cubic feet': 35.314666721489,
        'gallon': 264.17205235815,
        'barrel': 8.3864143605761,
        'liters': 1000,
    }
};

// Create Units Select Element
function setUnits() {
    const unitSelect = document.querySelector('#unitSelect');
    unitSelect.innerHTML = '';
    unitSelect.setAttribute('name', this.value);
    const units = Object.keys(measures[this.value]);
    units.shift();

    const options = units.reduce( (prev, current) => (
        prev += `<option value="${current}">${current[0].toUpperCase() + current.slice(1)}</option>`
    ), '<option selected disabled>Select Unit</option>');
    
    unitSelect.innerHTML = options;
    
    document.querySelector('#output').innerHTML = '';
}

function getOutput(e) {
    e.preventDefault();
    const measureValue = document.querySelector('#measure').value;

    if (measureValue == 'Select Measure') {
        return alertError('Select a measure');
    }

    const unitValue = document.querySelector(`#unitSelect[name=${measureValue}]`).value;
    if ( unitValue == 'Select Unit') {
        return alertError('Select a unit of measurement');
    }

    const inputValue = document.querySelector('input').value;
    if ( inputValue == '') {
        return alertError('Enter a value to convert');
    }

    const result = convert(measureValue, unitValue, inputValue);
    
    const output = Object.keys(result).reduce( (prev, measure) => (
        prev += `<li class="list-group-item list-group-item-secondary font-weight-bold">${Math.round(result[measure] * 10000) / 10000} ${measure}</li>`), '<ul class="list-group text-left">') + '</ul>';
    
    document.querySelector('#output').innerHTML = output;

}

function alertError(errorMessage){
    const alertDiv = document.createElement('div');
    alertDiv.setAttribute('class', 'alert alert-danger');
    alertDiv.innerHTML = errorMessage;
    document.getElementById('content').insertBefore(alertDiv, document.forms[0]);
    setTimeout( () => alertDiv.remove(), 2000);
}

function convert(measure, unit, input){
    const weightObj = Object.create(null);
    const measureProperty = measures[measure];

    const inputInBasicUnit = input / measureProperty[unit];

    for(let measureUnit in measureProperty) {
        if(measureUnit !== '_unitBase') {
            weightObj[measureUnit] = inputInBasicUnit * measureProperty[measureUnit];
        }
    }
    
    return weightObj;
}
