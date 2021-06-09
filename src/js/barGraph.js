let _width = $(window).width();
let _height = $(window).height();
let width = 0.9 * _width;
let height = 0.96 * _height;

let x_attr = 'date';
let y_attr = 'sales';
let defined_attr_value = ['all'];
let defined_attr = ['state'];

let fontFamily;

function set_ui() {
    // 设置字体
    let ua = navigator.userAgent.toLowerCase();
    fontFamily = "Times New Roman";
    if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
        fontFamily = "Times New Roman";
    }
    d3.select("body")
        .style("font-family", fontFamily);
}

function set_push(arr, ele) {
    if (arr.indexOf(ele) == -1) {
        arr.push(ele);
    }
    return arr;
}

function draw_main() {
    let padding = {'left': 0.2*width, 'bottom': 0.1*height, 'top': 0.2*height, 'right': 0.1*width};
    let svg = d3.select('#container')
        .select('svg')
        .attr('width', width)
        .attr('height', height);

    // title
    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${padding.top*0.4})`)
        .append('text')
        .attr('class', 'title')
        .text('Profit and Sales changing with Time');

    // x axis - phd graduation year
    let xaxis = [];
    for (var i = 2010; i <= 2011; i++) {
        for (var j = 1; j <= 12; j++) {
            xaxis.push(String(j)+'/1/'+String(i));
        } 
    }
    let ran = [];
    let left = padding.left;
    let right = width - padding.right;
    let delta = (right - left) / 24;
    for (var i = 0; i < 24; i++) {
        ran.push(left + delta * i);
    }
    let x = d3.scaleOrdinal()
        .domain(xaxis)
        .range(ran);    
    let axis_x = d3.axisBottom()
        .scale(x)
        .ticks(10)
        .tickFormat(d => d);

    // y axis - publications, citations
    let y = d3.scaleLinear()
        .domain(get_min_max(data, y_attr))
        .range([height-padding.bottom, padding.top]);    
    let axis_y = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(d => d);

    // x axis
    svg.append('g')
        .attr('transform', `translate(${0}, ${height-padding.bottom})`)
        .call(axis_x)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.6rem')
        .selectAll('text')
        .attr('dy', '1.75em')
        .attr('transform', 'rotate(-30)')

    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${height-padding.bottom})`)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dx', '-0.5rem')
        .attr('dy', 0.09*height)
        .text(x_attr);

    // y axis
    svg.append('g')        
        .attr('transform', `translate(${padding.left}, ${0})`)
        .call(axis_y)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.8rem')
    svg.append('g')
        .attr('transform', `
            translate(${padding.left}, ${height/2})
            rotate(-90)    
        `)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dy', -height*0.12)
        .text(y_attr);
    
    // rect
    svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('class', 'rect')
        .attr('x', (d, i) => {
            // console.log(d)
            let ind = xaxis.indexOf(d[x_attr]);
            return x(ran[ind])+delta*0.1;
        })
        .attr('y', (d, i) => {
            return y(d[y_attr]);
        })
        .attr('width', delta * 0.8)
        .attr('height', (d, i) => {
            // console.log(typeof(d[y_attr]))
            return (height - padding.bottom)-(y(d[y_attr]));
        })
        .attr('fill', 'steelblue')
        .on('mouseover', (e, d) => {
            let date = d['date'];
            let profit = d['profit'];
            let sales = d['sales'];
            let content = '<table><tr><td>date</td><td>' + date + '</td></tr>' 
                        + '<tr><td>profit</td><td>'+ profit + '</td></tr>'
                        + '<tr><td>sales</td><td>'+ sales + '</td></tr>';
            let tooltip = d3.select('#tooltip');
            console.log(typeof(y(parseInt(d[y_attr]))))
            tooltip.html(content)
                .style('left', (x(ran[xaxis.indexOf(d[x_attr])]) + 5) + 'px')
                .style('top', (y(parseInt(d[y_attr])))+ 'px')
                .style('visibility', 'visible');
        })
        .on('mouseout', (e, d) => {
            let tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden')
        })
    
    svg.append('g')
        .selectAll('text')
        .data(data, (d) => {
            return d[y_attr]
        })
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('x', (d, i) => {
            let ind = xaxis.indexOf(d[x_attr]);
            return x(ran[ind])+delta*0.5;
        })
        .attr('y', (d, i) => {
            return y(d[y_attr])+20;
        })
        .text((d) => {
            return d[y_attr];
        })
        
}


function main() {
    d3.csv(data_file).then(function(DATA) {
        data = DATA;

        // remove data without x_attr or y_attr
        data = data.filter((d, i) => (d[x_attr] != '' && d[y_attr] != ''));
        for (var j = 0; j < defined_attr.length; ++j) {
            if (defined_attr_value[j] != 'all') {
                data = data.filter((d, i) => (d[defined_attr[j]] == defined_attr_value[j]));
            }
        }
        data = get_defined_data(data);
        // console.log(typeof(data))
        set_ui();
        draw_main();
    })
}
function getTableType() {
    var value_y = document.getElementById('y_selection').value;
    y_attr = value_y;
    d3.selectAll('g').remove();
    draw_main();
}

function StateSelection() {
    var value_state = document.getElementById('state_selection').value
    if (defined_attr.indexOf('state') == -1) {
        defined_attr.push('state');
        defined_attr_value.push(value_state);
    }
    else {
        let ind = defined_attr.indexOf('state');
        defined_attr_value[ind] = value_state;
    }
    var value_category = document.getElementById('category_selection').value
    if (defined_attr.indexOf('category') == -1) {
        defined_attr.push('category')
        defined_attr_value.push(value_category)
    }
    else {
        let ind = defined_attr.indexOf('category');
        defined_attr_value[ind] = value_category;
    }
    console.log(defined_attr, defined_attr_value)
    d3.selectAll('g').remove();
    d3.csv(data_file).then(function(DATA) {
        data = DATA;

        // remove data without x_attr or y_attr
        data = data.filter((d, i) => (d[x_attr] != '' && d[y_attr] != ''));
        for (var j = 0; j < defined_attr_value.length; ++j) {
            if (defined_attr_value[j] != 'all') {
                data = data.filter((d, i) => (d[defined_attr[j]] == defined_attr_value[j]));
            }
        }
        data = get_defined_data(data);
        // console.log(typeof(data))
        set_ui();
        draw_main();
    })

}
main()