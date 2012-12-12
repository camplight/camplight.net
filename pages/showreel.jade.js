var supports3DTransforms =  document.body.style['webkitPerspective'] !== undefined || 
                            document.body.style['MozPerspective'] !== undefined;

function linkify( selector ) {
    if( supports3DTransforms ) {
        
        var nodes = document.querySelectorAll( selector );

        for( var i = 0, len = nodes.length; i < len; i++ ) {
            var node = nodes[i];
            if( !node.className || !node.className.match( /roll/g ) ) {
                node.className += ' roll';
                var text = node.innerHTML;
                node.innerHTML = '<span data-title="'+ text +'">' + node.innerHTML + '</span>';
            }
        };
    }
}

linkify( '.projects a li' );
require("../client/views/ShowreelBackground");