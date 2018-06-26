document.querySelector('#measure').addEventListener('change', setUnits);
document.querySelector('#form').addEventListener('submit', getOutput);

document.querySelector('#inputUnit').addEventListener('change', () => document.querySelector('#output').innerHTML = '');
document.querySelector('#outputUnit').addEventListener('change', () => {
    const inputUnitValue = document.querySelector('#inputUnit').value;
    const inputValue = document.querySelector('#input').value;

    if ( inputUnitValue != 'Select Input Unit' && inputValue != '') {
        getOutput()
    }
});

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
        'gallons': 264.17205235815,
        'barrels': 8.3864143605761,
        'liters': 1000,
    }
};

// Create Units Select Element
function setUnits() {
    const inputUnit = document.querySelector('#inputUnit');
    const outputUnit = document.querySelector('#outputUnit');

    inputUnit.innerHTML = '<option selected disabled>Select Input Unit</option>';
    outputUnit.innerHTML = '<option selected disabled>Select Output Unit</option><option>All Units</option>';

    inputUnit.setAttribute('name', this.value);
    
    const units = Object.keys(measures[this.value]);
    units.shift();
    
    const options = units.reduce( (prev, current) => (
        prev += `<option value="${current}">${current[0].toUpperCase() + current.slice(1)}</option>`
    ), '');
    
    inputUnit.innerHTML += options;
    outputUnit.innerHTML += options;
    
    document.querySelector('#output').innerHTML = '';

}

function getOutput(e) {
    if (e) e.preventDefault();
    const measureValue = document.querySelector('#measure').value;

    if (measureValue == 'Select Measure') {
        return alertError('Select a measure');
    }

    const inputUnitValue = document.querySelector('#inputUnit').value;
    if ( inputUnitValue == 'Select Input Unit') {
        return alertError('Select Input Unit');
    }

    const inputValue = document.querySelector('input').value;
    if ( inputValue == '') {
        return alertError('Enter a value to convert');
    }

    const outputUnitValue = document.querySelector('#outputUnit').value;
    if ( outputUnitValue == 'Select Output Unit') {
        return alertError('Select Output Unit');
    }

    const result = convert(measureValue, inputUnitValue, inputValue, outputUnitValue);
    
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

function convert(measure, inputUnit, input, outputUnit){
    const weightObj = Object.create(null);
    const measureProperty = measures[measure];

    const inputInBasicUnit = input / measureProperty[inputUnit];

    if (outputUnit === 'All Units') {
        for(let measureUnit in measureProperty) {
            if(measureUnit !== '_unitBase' && measureUnit !== inputUnit) {
                weightObj[measureUnit] = inputInBasicUnit * measureProperty[measureUnit];
            }
        }
    } else {
        weightObj[outputUnit] = inputInBasicUnit * measureProperty[outputUnit];
    }
    
    return weightObj;
}
