import confetti from "canvas-confetti";

export function setupCounter(element) {
    let counter = 0;
    const setCounter = (count) => {
        counter = count;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
        element.innerHTML = `count is ${counter}`;
    };
    element.addEventListener("click", () => setCounter(counter + 1));
    setCounter(0);
}
