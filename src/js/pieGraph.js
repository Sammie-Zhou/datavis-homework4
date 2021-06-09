let _width = $(window).width();
let _height = $(window).height();
let width = 1 * _width;
let height = 1 * _height;

let fontFamily;

let value_attr = 'sales';

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

function get_region_data(data) {
    let region_data = [[], [], [], []];
    let state_data = [];
    let category_data = [];
    let region = ['Central', 'East', 'West', 'South'];
    for (var num = 0; num < 4; ++num) {
        region_data[num] = data.filter((d, i) => (d['region'] == region[num]));
        let state = [];
        let profit = [];
        let sales = [];
        for (var j = 0; j < region_data[num].length; ++j) {
            if (state.indexOf(region_data[num][j]['state']) == -1) {
                state.push(region_data[num][j]['state']);
                profit.push(0);
                sales.push(0);
            }
            let ind = state.indexOf(region_data[num][j]['state']);
            profit[ind] += parseInt(region_data[num][j]['profit']);
            sales[ind] += parseInt(region_data[num][j]['sales']);
        }
        let temp = [];
        for (var l = 0; l < state.length; ++l) {
            temp.push({'state':state[l], 'profit':profit[l], 'sales':sales[l]})
        }
        state_data.push(temp);
    }
    for (var num = 0; num < 4; ++num) {
        region_data[num] = data.filter((d, i) => (d['region'] == region[num]));
        let category = [];
        let profit = [];
        let sales = [];
        for (var j = 0; j < region_data[num].length; ++j) {
            if (category.indexOf(region_data[num][j]['category']) == -1) {
                category.push(region_data[num][j]['category']);
                profit.push(0);
                sales.push(0);
            }
            let ind = category.indexOf(region_data[num][j]['category']);
            profit[ind] += parseInt(region_data[num][j]['profit']);
            sales[ind] += parseInt(region_data[num][j]['sales']);
        }
        let temp = [];
        for (var l = 0; l < category.length; ++l) {
            temp.push({'category':category[l], 'profit':profit[l], 'sales':sales[l]})
        }
        category_data.push(temp);
    }
    return [state_data, category_data];
}

function get_category_data(data, state) {
    let category = ['Coffee', 'Herbal Tea', 'Tea', 'Espresso'];
    let state_data = data.filter((d, i) => (d['state'] == state));
    let profit = new Array(4).fill(0);
    let sales = new Array(4).fill(0);
    for (var i = 0; i < state_data.length; ++i) {
        let ind = category.indexOf(state_data[i]['category']);
        profit[ind] += parseInt(state_data[i]['profit']);
        sales[ind] += parseInt(state_data[i]['sales']);
    }
    let res = [];
    for (var i = 0; i < 4; ++i) {
        let temp = {'category':category[i], 'profit':profit[i], 'sales':sales[i]};
        res.push(temp);
    }
    return res;
}

function get_type_data(data, category, region) {
    let type_data = data.filter((d, i) => (d['category'] == category && d['region'] == region));
    let type = [];
    let profit = [];
    let sales = [];
    let res = [];
    for (var i = 0; i < type_data.length; ++i) {
        if (type.indexOf(type_data[i]['type']) == -1) {
            type.push(type_data[i]['type']);
            profit.push(0);
            sales.push(0);
        }
        let ind = type.indexOf(type_data[i]['type']);
        profit[ind] += parseInt(type_data[i]['profit']);
        sales[ind] += parseInt(type_data[i]['sales']);
    }
    for (var i = 0; i < type.length; ++i) {
        let temp = {'type':type[i], 'profit':profit[i], 'sales':sales[i]};
        res.push(temp);
    }
    return res;
}

function draw_pie() {
    let padding = {'left': 0.1*width, 'bottom': 0.1*height, 'top': 0.2*height, 'right': 0.1*width};

    let pie = d3.pie().value(function(d) {
        return d[value_attr];
    })
    console.log(get_region_data(data))
    res = get_region_data(data);
    let state_data = res[0];
    let category_data = res[1]
    // console.log(draw_data)
    let piedata = [];
    for (var i = 0; i < 4; ++i) {
        piedata.push(pie(state_data[i]))
    }
    for (var i = 0; i < 4; ++i) {
        piedata.push(pie(category_data[i]))
    }

    let svg = d3.select('#container')
        .select('svg')
        .attr('width', width)
        .attr('height', height);
    
    // title
    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${padding.top*0.4})`)
        .append('text')
        .attr('class', 'title')
        .text('Profit and Sales in each Region, State and Category');
        
    let outRadius = 100;
    let inRadius = 0;
    let arc = d3.arc()
        .innerRadius(inRadius)
        .outerRadius(outRadius);
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let subtext = ['Central', 'East', 'West', 'South'];
    let total = [];
    for (var i = 0; i < 4; ++i) {
        cnt = 0;
        for (var j = 0; j < state_data[i].length; ++j) {
            console.log(state_data[i])
            cnt += parseInt(state_data[i][j][value_attr])
        }
        total.push(cnt);
    }

    // state
    for (var i = 0; i < 4; ++i) {
        let center = [width*(0.165+i*0.225), height*0.4];
        svg.append('g')
            .attr('transform', 'translate('+(width*(0.165+i*0.225))+','+(height*0.2)+')')
            .append('text')
            .attr('class', 'subtitle')
            .text(subtext[i]);

        let arcs = svg.selectAll('arcs')
            .data(piedata[i])
            .enter()
            .append('g')
            .attr('transform', 'translate(' + (width * (0.165+i*0.225)) + ',' + (height * 0.4) + ')')
        arcs.append('path')
            .attr('fill', (d, i) => {
                return color(i);
            })
            .attr('opacity', 0.7)
            .attr('d', (d) => {return arc(d);})
        arcs.append('text')
            .attr('transform', function(d) {
                let x = arc.centroid(d)[0] * 2;
                let y = arc.centroid(d)[1] * 2;
                return 'translate(' + x + ',' + y + ')';
            })
            .attr('text-anchor', 'middle')
            .text(d => {
                return d.data.state + '\n' + d.data[value_attr];
            })
        arcs.on('mouseover', (e, d) => {
            let state = d.data.state;
            let text_data = get_category_data(data, state);
            let content = '<table>';
            for (var j = 0; j < text_data.length; ++j) {
                content += '<tr><td>' + text_data[j]['category'] + '</td><td>' + text_data[j][value_attr] + '</td></tr>';
            }
            content += '</table>';
            let tooltip = d3.select('#tooltip');
            // console.log(arc.centroid(d))
            tooltip.html(content)
                .style('left', (arc.centroid(d)[0]+center[0])+'px')
                .style('top', (arc.centroid(d)[1]+center[1])+'px')
                .style('visibility', 'visible');
        })
            .on('mouseout', (e, d) => {
                let tooltip = d3.select('#tooltip');
                tooltip.style('visibility', 'hidden')
            })
    }
    
    // category
    for (var i = 0; i < 4; ++i) {
        let region = subtext[i];
        let center = [width*(0.165+i*0.225), height*0.7];
        let arcs = svg.selectAll('arcs')
            .data(piedata[i+4])
            .enter()
            .append('g')
            .attr('transform', 'translate(' + (width * (0.165 + i * 0.225)) + ',' + (height * 0.7) + ')')
        arcs.append('path')
            .attr('fill', (d, i) => {
                return color(i);
            })
            .attr('opacity', 0.7)
            .attr('d', (d) => {return arc(d);})
        arcs.append('text')
            .attr('transform', function(d) {
                let x = arc.centroid(d)[0] * 2;
                let y = arc.centroid(d)[1] * 2;
                return 'translate(' + x + ',' + y + ')';
            })
            .attr('text-anchor', 'middle')
            .text(d => {
                return d.data.category + '\n' + d.data[value_attr];
            })
        arcs.on('mouseover', (e, d) => {
            let category = d.data.category;
            let type_data = get_type_data(data, category, region);
            let content = '<table>';
            for (var j = 0; j < type_data.length; ++j) {
                content += '<tr><td>' + type_data[j]['type'] + '</td><td>' + type_data[j][value_attr] + '</td></tr>';
            }
            content += '</table>';
            let tooltip = d3.select('#tooltip');
            // console.log(arc.centroid(d))
            tooltip.html(content)
                .style('left', (arc.centroid(d)[0]+center[0])+'px')
                .style('top', (arc.centroid(d)[1]+center[1])+'px')
                .style('visibility', 'visible');
        })
            .on('mouseout', (e, d) => {
                let tooltip = d3.select('#tooltip');
                tooltip.style('visibility', 'hidden');
            })
    }

    // total value
    for (var i = 0; i < 4; ++i) {
        svg.append('g')
            .attr('transform', 'translate(' + (width*(0.165 + i * 0.225)) + ',' + (height*0.9) + ')')
            .append('text')
            .attr('class', 'text')
            .text('Total:'+total[i])
    }
}

function main() {
    d3.csv(data_file).then(function(DATA) {
        data = DATA;
        set_ui();
        draw_pie();
    })
}

function ValueSelection() {
    value_attr = document.getElementById('value_selection').value;
    d3.selectAll('g').remove();
    draw_pie();
}

main();