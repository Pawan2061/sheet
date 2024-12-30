function main() {

}


setInterval(main, 5000)


async function callMain() {
    await main();
    await new Promise(x => setTimeout(x, 1000));
}


