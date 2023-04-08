import { useEffect, useState } from "react";

function debounce(fn, ms) {
    var timer;
    return _ => {
        clearTimeout(timer);
        timer = setTimeout(_ => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

export default function useDimensions(){
    const [dimensions, setDimensions] = useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    });

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
          setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
          })
        }, 100)
        window.addEventListener('resize', debouncedHandleResize)
        return _ => {
          window.removeEventListener('resize', debouncedHandleResize);
        }
    });

    return dimensions
}