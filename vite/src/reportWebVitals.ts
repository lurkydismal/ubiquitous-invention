export default (onPerfEntry?: Function) => {
    if (onPerfEntry) {
        import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
            onCLS(onPerfEntry as any);
            onFCP(onPerfEntry as any);
            onLCP(onPerfEntry as any);
            onTTFB(onPerfEntry as any);
        });
    }
};
