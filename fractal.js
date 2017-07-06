/**
 * Created by Administrator on 2017/7/5.
 */
//克隆数组
function cloneArray(arr){
    var a = [];
    arr.forEach( o => a.push(o));
    return a;
}
//计算矢量
function vector2D(point1,point2){
    return [point2[0]-point1[0] , point2[1] - point1[1]]
}
//max
function max(a,b){
    if(a > b){
        return a
    }
    return b;
}
//min
function min(a,b){
    if(a > b){
        return b
    }
    return a;
}
//构造2d图形对象
function graph2D(ctx,points){
    //画笔
    this.ctx = ctx;
    this.points = points;
}
//2d图形的方法
graph2D.prototype = {
    draw : function(){
        var ctx = this.ctx;
        var points = this.points;
        ctx.beginPath();
        ctx.moveTo(points[0][0],points[0][1]);
        for(let i = 1 ; i < points.length;i++){
            ctx.lineTo(points[i][0],points[i][1]);
        }
        ctx.fillStyle = "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+",1)";
        ctx.closePath();
        ctx.fill();
    },
    //判断是否为凸图形
    isConvex : function(points){
        //构造矢量
        var v1 , v2;
        var direction , d;
        for(let i = 0 ; i < points.length-1;i++){
            //并非最后向量
            if(i !== (points.length-2)) {
                v1 = vector2D(points[ i ]  , points[ i + 1 ]);
                v2 = vector2D(points[i + 1], points[i +  2]);
            }
            else{
                v1 = vector2D(points[ i ]   , points[ i+1 ]);
                v2 = vector2D(points[ i+1 ], points[ 0 ]);
            }
            if(!direction){
                direction = (v1[0]*v2[1] - v1[1]*v2[0]) > 0?1:-1;
            }
            else{
                d =  (v1[0]*v2[1] - v1[1]*v2[0]) > 0?1:-1;
                if(d !== direction){
                    return {convex:false,index:i}
                }
            }
        }
        return {convex:true};
    },
    //切割凹多边形
    cuttingConcave : function(points,option){
        var graph2d = [];
        //是否凸图形
        var vm = this;
        var option = option?option:vm.isConvex(points);
        //是凸图形
        if(option.convex){
            graph2d.push(points);
        }else{
            cutGraph(points,option);
        }
        function cutGraph(points,option){
            var index = option.index;
            var p1 = points[index] , p2 = points[index+1],p3,p4;
            var k1 = (p2[1] - p1[1])/(p2[0] - p1[0]) ,  k2;
            var X,Y;

            var clonePoints = cloneArray(points);

            for(let i = 0 ; i < points.length ; i++){
                if(i === index || i === index+1 || i === index - 1){
                    continue;
                }
                if(i === points.length-1){
                    p3 = points[i];
                    p4 = points[0];
                }
                else {
                    p3 = points[i];
                    p4 = points[i + 1];
                }
                k2 = (p4[1] - p3[1]) / (p4[0] - p3[0]);
                //平行
                if(Math.abs(k1) === Math.abs(k2))
                    continue;
                if(k2 === -Infinity || k2 === Infinity){
                    Y = k1*(p3[0]-p1[0])+p1[1];
                    X = p3[0];
                    if(inclueXY(X,Y,p3,p4)){
                        spliceArray(clonePoints,i,X,Y,index);
                        break;
                    }
                }
                else if(k2 === 0){
                    X = (p3[1] - p1[1])/k1 + p1[0];
                    Y = p3[1];
                    if(inclueXY(X,Y,p3,p4)){
                        spliceArray(clonePoints,i,X,Y,index);
                        break;
                    }
                }
                else {
                    if(Math.abs(k1) === Infinity){
                        X = p1[0];
                        Y = k2*(X - p3[0]) + p3[1];
                        if(inclueXY(X,Y,p3,p4)){
                            spliceArray(clonePoints,i,X,Y,index);
                            break;
                        }
                    }
                    else if(k1 === 0){
                        Y = p1[1];
                        X = 1/k2*(Y - p3[1]) + p3[0];
                        if(inclueXY(X,Y,p3,p4)){
                            spliceArray(clonePoints,i,X,Y,index);
                            break;
                        }
                    }
                    else{
                        X = ((k1 * p1[0] - k2 * p3[0]) + p3[1] - p1[1]) / (k1 - k2);
                        Y = ((p1[1] / k1 - p3[1] / k2 + p3[0] - p1[0]) * (k1 * k2)) / (k2 - k1);
                        if(inclueXY(X,Y,p3,p4)){
                            spliceArray(clonePoints,i,X,Y,index);
                            break;
                        }
                    }
                }
            }
        }
        function inclueXY(X,Y ,p3,p4){
            return (X >= min(p3[0], p4[0])) && (X <= max(p3[0], p4[0])) && (Y >= min(p3[1], p4[1])) && (Y <= max(p3[1], p4[1]))
        }
        //切割数组
        function spliceArray(clonePoints,i,X,Y,index){
            var points1,points2;
            clonePoints.splice(i+1, 0, vec2(X, Y));
            //是否落到端点上
            if((clonePoints[i][0] !== clonePoints[i+1][0] || clonePoints[i][1] !== clonePoints[1] )&&(clonePoints[i+2][0] !== clonePoints[i+1][0] || clonePoints[i+2][1] !== clonePoints[1])){
                clonePoints.splice(i+2, 0, vec2(X, Y));
            }
            points1 = clonePoints.splice(index+1,i - index + 1);
            points2 = clonePoints;
            var option1 = vm.isConvex(points1);
            var option2 = vm.isConvex(points2);
            if(option1.convex){
                graph2d.push(points1);
            }else{
                cutGraph(points1,option1);
            }
            if(option2.convex){
                graph2d.push(points2);
            }else{
                cutGraph(points2,option2);
            }
        }
        return graph2d;
    },
    //分割三角形
    dividedTriangle : function(){
        var points = cloneArray(this.points);
        var trianglePoints = [];
        var length;
        //如果是凸图形直接分割三角形，否则分解成凸图形
        var option = this.isConvex(this.points);
        if(option.convex === true){
            points = [points];
            length = 1;
        }
        else{
            points = this.cuttingConcave(points,option);
            length = points.length;
        }
        for(let i = 0 ; i < length ; i++) {
            while (points[i].length >= 3) {
                trianglePoints.push([
                    points[i][0], points[i][1], points[i][2]
                ]);
                points[i].splice(1, 1);
            }
        }

        return trianglePoints;
    },
    constructor : graph2D
}


//cator三分集
function cator(ax,ay,bx,by,ctx,length,d){
    if(bx - ax < length){
        ctx.beginPath();
        ctx.moveTo(ax,ay);
        ctx.lineTo(bx,by);
        ctx.closePath();
        ctx.stroke();
    }else{
        var cx,cy,dx,dy;
        ctx.beginPath();
        ctx.moveTo(ax,ay);
        ctx.lineTo(bx,by);
        ctx.closePath();
        ctx.stroke();
        cx = ax + (bx - ax)/3;
        cy = ay + d;
        dx = ax + (bx - ax)*2/3;
        dy = ay + d;
        ay += d;
        by += d;
        cator(ax,ay,cx,cy,ctx,length,d);
        cator(dx,dy,bx,by,ctx,length,d);
    }
}

//koch
function koch( ax ,ay , bx, by , ctx , length ){
    if(Math.sqrt((bx-ax)*(bx-ax) + (by-ay)*(by-ay)) < length){
        ctx.beginPath();
        ctx.moveTo(ax,ay);
        ctx.lineTo(bx,by);
        ctx.closePath();
        ctx.stroke();
    }
    else{
        var cx,cy,ex,ey,dx,dy,alpha,L;
        cx = ax + (bx - ax)/3;
        cy = ay - (ay - by)/3;
        ex = bx - (bx - ax)/3;
        ey = by + (ay - by)/3;
        alpha = Math.PI/3 + Math.atan((cy - ey)/(ex - cx));
        L = Math.sqrt((ex - cx)*(ex - cx) + (ey - cy)*(ey - cy));
        if((ex - cx) < 0){
            alpha += Math.PI;
        }
        dx = L*Math.cos(alpha) + cx;
        dy = cy - L*Math.sin(alpha);

        koch(ax,ay,cx,cy,ctx,length);
        koch(cx,cy,dx,dy,ctx,length);
        koch(dx,dy,ex,ey,ctx,length);
        koch(ex,ey,bx,by,ctx,length);
    }
}


//sierpinski
//初试x,y,l
function sierpinski1(x,y,l,ctx,dep){
    var x1 = x - l/2;
    var y1 = y + Math.tan(Math.PI/6)*l/2;
    var x2 = x + l/2;
    var y2 = y + Math.tan(Math.PI/6)*l/2;
    var x3 = x;
    var y3 = y - (1/Math.sin(Math.PI/3))*l/2;

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();
    ctx.stroke();
    if(dep > 1) {
        drawsierpinski(x1, y1, x2, y2, x3, y3, dep);
    }
    function drawsierpinski(x1,y1,x2,y2,x3,y3,dep){
        if(dep===1){
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3);
            ctx.closePath();
            ctx.stroke();
        }else{
            var dx,dy,ex,ey,fx,fy;
            dx = (x3 + x1)/2;
            dy = (y1 + y3)/2;
            ex = (x2 + x1)/2;
            ey = y1;
            fx = (x2 + x3)/2;
            fy = (y2 + y3)/2;
            drawsierpinski(x1,y1,ex,ey,dx,dy,dep-1);
            drawsierpinski(ex,ey,x2,y2,fx,fy,dep-1);
            drawsierpinski(dx,dy,fx,fy,x3,y3,dep-1);
        }
    }
}

//Hilbert-Peano
function HilbertPeano(Xmin,Ymin,Xmax,Ymax,n,ctx){
    var dx = (Xmax - Xmin)/(2*Math.pow(2,n));
    var dy = (Ymax - Ymin)/(2*Math.pow(2,n));
    var x = Xmin + dx;
    var y = Ymin + dy;
    ctx.beginPath();
    var points = [];
    drawPeano(Xmin,Ymin,Xmax,Ymax,1,n,ctx);
    ctx.stroke();


    function drawPeano(x1,y1,x2,y2,s,n,ctx){
        if(n === 1){
            points.push([x1 + (x2-x1)/4 , y1 + (y2-y1)/4]);
            points.push([x1 + (2-s)*(x2-x1)/4 , y2 - (2-s)*(y2-y1)/4]);
            points.push([x2 - (x2-x1)/4 , y2 - (y2-y1)/4]);
            points.push([x2 - (2-s)*(x2-x1)/4 , y1 + (2-s)*(y2-y1)/4]);
            ctx.lineTo(x1 + (x2-x1)/4 , y1 + (y2-y1)/4);
            ctx.lineTo(x1 + (2-s)*(x2-x1)/4 , y2 - (2-s)*(y2-y1)/4);
            ctx.lineTo(x2 - (x2-x1)/4 , y2 - (y2-y1)/4);
            ctx.lineTo(x2 - (2-s)*(x2-x1)/4 , y1 + (2-s)*(y2-y1)/4);
        }else{
            if(s > 0){
                drawPeano(x1,y1,(x2+x1)/2,(y2+y1)/2,-1,n-1,ctx);
                drawPeano(x1,(y2+y1)/2,(x2+x1)/2,y2,1,n-1,ctx);
                drawPeano((x2+x1)/2,(y2+y1)/2,x2,y2,1,n-1,ctx);
                drawPeano(x2,(y2+y1)/2,(x2+x1)/2,y1,-1,n-1,ctx);
            }else{
                drawPeano(x1,y1,(x2+x1)/2,(y2+y1)/2,1,n-1,ctx);
                drawPeano((x2+x1)/2,y1,x2,(y2+y1)/2,-1,n-1,ctx);
                drawPeano((x2+x1)/2,(y2+y1)/2,x2,y2,-1,n-1,ctx);
                drawPeano((x2+x1)/2,y2,x1,(y2+y1)/2,1,n-1,ctx);
            }
        }
    }
    return points;
}

//C曲线
function levy(x1,y1,x2,y2,ctx,n){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
    if(n > 0){
        var x3 = (x1+x2+y2-y1)/2;
        var y3 = (x2+y1+y2-x1)/2;
        drawLevy(x1,y1,x3,y3,ctx,n-1);
        drawLevy(x3,y3,x2,y2,ctx,n-1);
    }

    function drawLevy(x1,y1,x2,y2,ctx,n){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.closePath();
        ctx.stroke();
        if(n >= 1){
            var x3 = (x1+x2+y1-y2)/2;
            var y3 = (x2+y1+y2-x1)/2;
            drawLevy(x1,y1,x3,y3,ctx,n-1);
            drawLevy(x3,y3,x2,y2,ctx,n-1);
        }
    }
}
//分形树
function tree(x,y,alpha,l,n){
    if(n > 0 ){
        var x1 = x + Math.cos(alpha)*l;
        var y1 = y - Math.sin(alpha)*l;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x1,y1);
        ctx.closePath();
        ctx.stroke();
        var alpha_L = alpha+Math.PI/8;
        var alpha_R = alpha-Math.PI/8;
        tree(x1,y1,alpha_L,l*2/3,n-1);
        tree(x1,y1,alpha_R,l*2/3,n-1);
    }
}

//分形树2
function tree2(x,y,l,s1,A,ctx){
    var B = Math.PI/6;
    var C = Math.PI/8;
    var s1 = s1;
    var s2 = 3;
    var s3 = 1.2;

    drawTree(x,y,l,A,ctx);


    function drawTree(x,y,l,A,ctx){
        if(l > s1){
            var x2 = x + l*Math.cos(A);
            var y2 = y - l*Math.sin(A);
            var x2L = x2 + l/s2*Math.cos(A+B);
            var y2L = y2 - l/s2*Math.sin(A+B);
            var x2R = x2 + l/s2*Math.cos(A-B);
            var y2R = y2 - l/s2*Math.sin(A-B);
            var x1 = x + l/s2*Math.cos(A);
            var y1 = y - l/s2*Math.sin(A);
            var x1L = x1 + l/s2*Math.cos(A+B);
            var y1L = y1 - l/s2*Math.sin(A+B);
            var x1R = x1 + l/s2*Math.cos(A-B);
            var y1R = y1 - l/s2*Math.sin(A-B);
            drawLine(x,y,x2,y2,ctx);
            drawLine(x2,y2,x2L,y2L,ctx);
            drawLine(x2,y2,x2R,y2R,ctx);
            drawLine(x1,y1,x1R,y1R,ctx);
            drawLine(x1,y1,x1L,y1L,ctx);

            drawTree(x2,y2,l/s3,A-C,ctx);
            drawTree(x2R,y2R,l/s2,A-B,ctx);
            drawTree(x2L,y2L,l/s2,A+B,ctx);
            drawTree(x1L,y1L,l/s2,A+B,ctx);
            drawTree(x1R,y1R,l/s2,A-B,ctx);
        }
    }
    function drawLine(x1,y1,x2,y2,ctx){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.closePath();
        ctx.stroke();
    }
}


//文法koch
function LSKoch(x,y,n,ctx){
    var str = "F-F-F-F-";
    var alpha = 0;
    var l = 3;
    var delta = Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    while(n > 0){
        str = str.replace(/F/g,'FF-F-F-F-F-F+F');
        n--;
    }

    for(let i = 0 ; i < str.length ; i++){
        switch(str[i]){
            case 'F' :
                var x1 = x + l*Math.cos(alpha);
                var y1 = y - l*Math.sin(alpha);
                ctx.lineTo(x1,y1);
                x = x1;
                y = y1;
                break;
            case '+' :
                alpha += delta;break;
            case '-' :
                alpha -= delta;break;
        }
    }
    ctx.stroke();
}


//文法树
function LSTree(x,y,n,ctx){
    var str = 'F-F-F-F';
    var alpha = Math.PI/2;
    var replace1 = 'F[+F]F[-F]F';
    var replace2 = 'F[+F]F[-F[+F]]';
    var replace3 = 'FF[-F+F+F]+[+F-F-F]';
    var delta = Math.PI/6;
    var buffer = [];
    ctx.beginPath();
    ctx.moveTo(x,y);
    var l = 2;
    while(n > 0){
        var k = Math.random();
        var re = k < 0.33?replace1 : k<0.66?replace2 : replace3;
        str = str.replace(/F/g,re);
        n--;
    }
    for(let i = 0 ; i < str.length ; i++){
        switch(str[i]){
            case 'F' :
                var x1 = x + l*Math.cos(alpha);
                var y1 = y - l*Math.sin(alpha);
                ctx.lineTo(x1,y1);
                x = x1;
                y = y1;
                break;
            case '+' :
                alpha += delta;break;
            case '-' :
                alpha -= delta;break;
            case '[' :
                buffer.push({
                    'alpha' : alpha,
                    'x' : x,
                    'y' : y
                });break;
            case ']' :
                var obj = buffer.pop();
                alpha = obj.alpha;
                x = obj.x;
                y = obj.y;
                ctx.moveTo(x,y);
                break;
        }
    }
    ctx.stroke();
}

//IFS Sierpinski
function IFSSierpinski(x,y,n,ctx,xy){
    var points = [[x,y]];
    // var A1 = [0.5 , 0 , 0   , 0.5 , 0 , 0];
    // var A2 = [0.5 , 0 , 0 , 0.5 , 0.5 , 0];
    // var A3 = [0.5 , 0 ,0 , 0.5 , 0.25 , 0.5];

    var a,b,c,d,e,f;
    for(let i = 0 ; i < n ; i++){
        var t = Math.random();
        if(t <= xy[0][6]){
            a = xy[0][0];
            b = xy[0][1];
            c = xy[0][2];
            d = xy[0][3];
            e = xy[0][4];
            f = xy[0][5];
        }else if( t <= (xy[0][6]+xy[1][6])){
            a = xy[1][0];
            b = xy[1][1];
            c = xy[1][2];
            d = xy[1][3];
            e = xy[1][4];
            f = xy[1][5];
        }else if( t <= (xy[0][6]+xy[1][6] + xy[2][6])){
            a = xy[2][0];
            b = xy[2][1];
            c = xy[2][2];
            d = xy[2][3];
            e = xy[2][4];
            f = xy[2][5];
        }
        else if( t <= (xy[0][6]+xy[1][6] + xy[2][6] +xy[3][6])){
            a = xy[3][0];
            b = xy[3][1];
            c = xy[3][2];
            d = xy[3][3];
            e = xy[3][4];
            f = xy[3][5];
        }else  if( t <= (xy[0][6]+xy[1][6] + xy[2][6] +xy[3][6] + xy[4][6])){
            a = xy[4][0];
            b = xy[4][1];
            c = xy[4][2];
            d = xy[4][3];
            e = xy[4][4];
            f = xy[4][5];
        }else{
            a = xy[5][0];
            b = xy[5][1];
            c = xy[5][2];
            d = xy[5][3];
            e = xy[5][4];
            f = xy[5][5];
        }
        var x1 = points[i][0];
        var y1 = points[i][1];
        points.push([
            a*x1+b*y1+e,
            c*x1+d*y1+f
        ]);
    }
    // var i = 0 ;
    // setInterval(function(){
    //     ctx.beginPath();
    //     ctx.arc((500+400*points[i][0]),(1200-400*points[i][1]),1,0,Math.PI*2);
    //     ctx.closePath();
    //     ctx.fill();
    //     i++;
    // },10)
    for(let i = 0 ; i < n ; i++) {
        ctx.beginPath();
        ctx.arc((500 + 400 * points[i][0]), (1200 - 400 * points[i][1]), 0.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

//IFSJulia
// function IFSJuila(cx,cy,length,ctx){
//     var x = 1,y = 1;
//     var a = 0.5,b=1,e=0.75,f=0.25;
//     for(let i = 0 ; i < length ; i++){
//         var m = parseInt(2000/15*x+3500/15);
//         var n = parseInt(2000/15*y+3000/15);
//         if(i > 10) {
//             ctx.beginPath();
//             ctx.arc(m, n, 1, 0, Math.PI * 2);
//             ctx.closePath();
//             ctx.fill();
//         }
//
//         var wx = x - cx;
//         var wy = y - cy;
//         if(wx > 0){
//             var theta = Math.atan(wy/wx);
//         }
//         if(wx < 0){
//             var theta = Math.PI + Math.atan(wy/wx);
//         }
//         if(wx === 0){
//             var theta = Math.PI/2;
//         }
//         var r = Math.sqrt(wx*wx+wy*wy);
//         var k = Math.random();
//         if(k < 0.5){
//             r = Math.sqrt(r);
//         }else{
//             r = -Math.sqrt(r);
//         }
//         x = r*Math.cos(theta);
//         y = r*Math.sin(theta);
//     }
// }

function julia(p,q,ctx){
    var K = 1000;
    var m = 200;
    var Mx = 400,My=400;
    // var ps = -2;
    // var pl = 2;
    // var qs = -2;
    // var ql = 2;
    var H;
    var xb = (pl - ps)/Mx;
    var yb = (ql - qs)/My;
    // var colors = [];
    // colors.push("#000000");
    // for(let i = 1 ; i < K ; i++){
    //     colors.push("rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")");
    // }
    for(var nx = 0 ; nx <= Mx ; nx++){
        for(var ny  = 0 ; ny <= My ; ny++){
            var x0 = ps + nx*xb;
            var y0 = qs + ny*yb;
            var k = 0;
            loop1();
        }
    }

    function loop1(){
        var xk = x0*x0 - y0*y0 + p;
        var yk = 2*x0*y0+q;
        k = k+1;
        var r = xk*xk + yk*yk;
        x0 = xk;
        y0 = yk;

        if(r > m){
            H = k;
            loop2();
        }
        else if( k === K){
            H = 0;
            loop2();
        }
        else if(r <= m  && k < K){
            loop1();
        }
    }

    function loop2(){
        ctx.beginPath();
        ctx.arc(nx,ny,0.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = colors[H];
        ctx.fill();
        // points.push([nx,ny,H]);
    }
}

//曼德勃罗逃逸算法
function MandelbrotJulia(ctx,pl,ps,ql,qs) {
    var Mx = 400, My = 400;
    var p = (pl - ps) / Mx;
    var q = (ql - qs) / My;
    var m = 100, K = 1000;
    var nx, ny;
    var H;


    for (nx = 0; nx < Mx; nx++) {
        for (ny = 0; ny < My; ny++) {
            var p0 = ps + nx * p;
            var q0 = qs + ny * q;
            var x0 = 0, y0 = 0, k = 0;
            loop1();
        }
    }

    function loop1() {
        k++;
        var xk = x0 * x0 - y0 * y0 + p0;
        var yk = 2 * x0 * y0 + q0;
        x0 = xk;
        y0 = yk;
        var r = xk * xk + yk * yk;
        if (r > m) {
            H = k;
            loop2();
        }
        else if (k === K) {
            H = 0;
            loop2();
        } else if (r <= m && k < K) {
            loop1();
        }
    }


    function loop2() {
        ctx.beginPath();
        ctx.arc(nx, ny, 0.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = colors[H];
        ctx.fill();
        // points.push([nx,ny,H]);
    }


}