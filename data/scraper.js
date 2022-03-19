async function getAllProducers() {
    let api = new Jikan4();

    let data = await api.getProducers({orderBy:"name"});
    data = data.data;
    while(api.hasNextPage()) {
        let more = await api.getMore();
        data = data.concat(more.data);
        await sleep(800);
    }

    return data;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

getAllProducers().then(data => console.log(JSON.stringify(data)));





async function getAllMagazines() {
    let api = new Jikan4();

    let data = await api.getMagazines({orderBy:"name"});
    data = data.data;
    while(api.hasNextPage()) {
        let more = await api.getMore();
        data = data.concat(more.data);
        await sleep(800);
    }

    return data;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

getAllMagazines().then(data => console.log(JSON.stringify(data)));
