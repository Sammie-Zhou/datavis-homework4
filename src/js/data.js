let data = null;
let data_file = './data/data.csv';

function get_min_max(data, attr) {
    let min = 1e9;
    let max = 0;
    if (attr != 'date') {
        data.forEach(d => {
            let v = parseInt(d[attr]);
            if (v > max)
                max = v;
            if (v < min)
                min = v;
        });
        console.log('attr', attr, 'min', min, 'max', max);
    }
    else {
        data.forEach(d => {
            let str = d[attr];
            date = str.split('/');
            let v = parseInt(date[0]+date[2]);
            if (v > max) max = v;
            if (v < min) min = v;
        })
    }

    return [min*0.95, max];
}

function get_state_data(data) {
    let num = data.length;
    let state = [];
    
    let profit = [];
    for (var i = 0; i < num; i++) {
        if (state.indexOf(data[i]['state']) == -1) {
            state.push(data[i]['state']);
            profit.push(0);
        }
        let ind = state.indexOf(data[i]['state']);
        profit[ind] += parseInt(data[i]['profit']);
    }
    let state_data = [];
    for (var i = 0; i < state.length; i++) {
        state_data.push({'state':state[i], 'profit':profit[i]})
    }
    // console.log(state_data)
    return state_data;
}

function get_defined_data(data) {
    let date = [];
    for (var year = 2010; year <= 2011; year++) {
        for (var month = 1; month <= 12; month++) {
            date.push(String(month) + '/1/' + String(year));
        }
    }
    let profit = new Array(date.length).fill(0);
    let sales = new Array(date.length).fill(0);
    // console.log(data);
    for (var i = 0; i < data.length; ++i) {
        ind = date.indexOf(data[i]['date']);
        profit[ind] += parseInt(data[i]['profit']);
        sales[ind] += parseInt(data[i]['sales']);
    }
    let res = [];
    for (var i = 0; i < date.length; ++i) {
        res.push({'profit':profit[i], 'sales':sales[i], 'date':date[i]})
    }
    // console.log(res)
    return res;
}