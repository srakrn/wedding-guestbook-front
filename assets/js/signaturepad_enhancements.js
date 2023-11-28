function toSvgWithoutScaling(signaturePad) {
    const pointGroups = signaturePad._data;
    const minX = 0;
    const minY = 0;
    const maxX = signaturePad.canvas.width;
    const maxY = signaturePad.canvas.height;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('viewBox', `${minX} ${minY} ${maxX} ${maxY}`);
    svg.setAttribute('width', maxX.toString());
    svg.setAttribute('height', maxY.toString());

    signaturePad._fromData(
        pointGroups,

        (curve, { penColor }) => {
            const path = document.createElement('path');

            // Need to check curve for NaN values, these pop up when drawing
            // lines on the canvas that are not continuous. E.g. Sharp corners
            // or stopping mid-stroke and than continuing without lifting mouse.
            /* eslint-disable no-restricted-globals */
            if (
                !isNaN(curve.control1.x) &&
                !isNaN(curve.control1.y) &&
                !isNaN(curve.control2.x) &&
                !isNaN(curve.control2.y)
            ) {
                const attr =
                    `M ${curve.startPoint.x.toFixed(3)},${curve.startPoint.y.toFixed(
                        3,
                    )} ` +
                    `C ${curve.control1.x.toFixed(3)},${curve.control1.y.toFixed(3)} ` +
                    `${curve.control2.x.toFixed(3)},${curve.control2.y.toFixed(3)} ` +
                    `${curve.endPoint.x.toFixed(3)},${curve.endPoint.y.toFixed(3)}`;
                path.setAttribute('d', attr);
                path.setAttribute('stroke-width', (curve.endWidth * 2.25).toFixed(3));
                path.setAttribute('stroke', penColor);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');

                svg.appendChild(path);
            }
            /* eslint-enable no-restricted-globals */
        },

        (point, { penColor, dotSize, minWidth, maxWidth }) => {
            const circle = document.createElement('circle');
            const size = dotSize > 0 ? dotSize : (minWidth + maxWidth) / 2;
            circle.setAttribute('r', size.toString());
            circle.setAttribute('cx', point.x.toString());
            circle.setAttribute('cy', point.y.toString());
            circle.setAttribute('fill', penColor);

            svg.appendChild(circle);
        },
    );
    return svg.outerHTML;
}