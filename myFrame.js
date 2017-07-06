/**
 * Created by xu_ts on 2017/6/6.
 */
//二位向量
function vec2(){
    var result = _argumentsToArray(arguments);
    switch (result.length){
        case 0 : result.push(0);
        case 1:  result.push( 0.0 );
    }
    return result.splice(0,2);
}

//三维向量
function vec3(){
    var result = _argumentsToArray(arguments);
    switch (result.length){
        case 0 : result.push( 0.0 );
        case 1:  result.push( 0.0 );
        case 2:  result.push( 0.0 );
    }
    return result.splice(0,3);
}
function vec4(){
    var result = _argumentsToArray(arguments);
    switch (result.length){
        case 0 : result.push( 0.0 );
        case 1:  result.push( 0.0 );
        case 2:  result.push( 0.0 );
        case 3:  result.push( 0.0 );
    }
    return result.splice(0,4);
}


//类数组转换数组
function _argumentsToArray(arguments){
    return  [].concat.apply([],Array.prototype.slice.call(arguments,[]));
}

function mix( u, v, s )
{
   if( typeof s  !== "number" ){
       throw('第3个参数需要是整数类型');
   }
   if( u.length !== v.length){
       throw('前两个数组的长度应该一样长');
   }
   var result = [];
   for(let i = 0 ; i < u.length ; i++){
       result.push(u[i]*s + v[i]*(1-s));
   }
   return result;
}

//转换成webgl和识别的Float32格式
function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}




