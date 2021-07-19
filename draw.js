/*
If your app needs some initial interaction to get into the interesting state, write something like this and call it from run(). In this example, this app has buttons called JoinButton, mic, and video and press themm to move to the main part.

async function clickJoin(page) {
    const joinButton = await page.$('#joinButton');
    const micButton = await page.$('#mic');
    const videoButton = await page.$('#video');
    const ready = await page.waitForFunction(node => node.getAttribute('state'), {polling: 1000, timeout: 10000}, joinButton);
    if (ready) {
        console.log('click');

        return page.evaluate((m, v, j) => {
            m.click();
            v.click();
            j.click();
        }, micButton, videoButton, joinButton);
    }
    // NOT REACHED
    throw new Error('timedOut');
}

*/

/*
Checking window.ISLAND value ensures that the Croquet session is up and running. Called from run().
*/

async function waitTopView(page) {
    const ready = await page.waitForFunction('!!window.ISLAND', {polling: 1000, timeout: 10000});
    if (ready) {
        return true;
    }
    // NOT REACHED
    throw new Error('timedOut');
}

/* 
This drawing app assumes that the color palette is located within the specified area. Randomly choose a color.
*/

async function selectColor(page) {
    const x = Math.random() * 105 + 10;
    const y = Math.random() * 140 + 85;
    await page.mouse.move(x, y);
    await page.mouse.down();
    return page.mouse.up();
}

/* 
The function that simulates user's drawing action. Randomly put button up and down while moving the cursor in circle
*/

async function moveMouse(page, duration) {
    const start = Date.now();

    let mouseIsDown = false;

    const toggleButton = () => {
        mouseIsDown = !mouseIsDown;
        if (!mouseIsDown) { // was down
            return page.mouse.up();
        } else {
            return page.mouse.down();
        }
    };

    let now = start;
    const origin = Math.random() * Math.PI * 2;
    const radius = Math.random() * 100 + 150;

    await selectColor(page);
    while (now < start + duration) {
        const elapsed = now - start;
        const r = origin + (elapsed / 2000) * Math.PI * 2;
        const x = Math.cos(r) * radius + 300;
        const y = Math.sin(r) * radius + 300;
        /* eslint-disable no-await-in-loop */
        if (Math.random() < 0.05) {
            await toggleButton();
        }
        await page.mouse.move(x, y);
        await page.waitForTimeout(20);
        now = Date.now();
    }
}

/*
The entry point. The argument for page.goto(should be changed for your app
*/

async function run({page, _context}) {
    await page.goto('https://croquet.io/whiteboard/?q=abc&debug=hashing,session,snapshots');
    //await clickJoin(page);
    await waitTopView(page);
    await moveMouse(page, 60000);
    return page.screenshot();
}

module.exports = run;
