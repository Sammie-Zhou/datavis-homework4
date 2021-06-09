let _width = $(window).width();
let _height = $(window).height();
let width = 1 * _width;
let height = 1 * _height;

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

function main() {
    set_ui();
    let padding = {'left': 0.1*width, 'bottom': 0.1*height, 'top': 0.2*height, 'right': 0.1*width};
    let svg = d3.select('#firstpage')
        .select('svg')
        .attr('width', width)
        .attr('height', height);
    
    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${padding.top*0.9})`)
        .append('text')
        .attr('class', 'title')
        .text('American Coffee Sales and Profit Situation')
    
    svg.append('g')
        .attr('transform', 'translate(' + (padding.left+(width-padding.left-padding.right)/2) + ',' + height * 0.7 + ')')
        .append('text')
        .attr('class', 'text')
        .text('by ZZM')
}
main()