export function configureFakeBackend() {

    let realFetch = window.fetch;
    window.fetch = function (url, opts) {

        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);
                    const itemvalues = {
                        UserName: params.userName,
                        Password: params.password
                    }
                    document.getElementById("showload").style.display = "block";
                    fetch("http://192.168.3.55/shipping/Login/PostLogin", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify(itemvalues)
                    })
                        .then(res => res.json())
                        .then((res) => {
                            if (res.rcode === 100) {
                                let responseJson = {
                                    id: res.Internalid,
                                    name: res.fullName,
                                    token: res.token
                                };
                                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                                document.getElementById("showload").style.display = "none";
                            } else {
                                reject('These credentials do not match our records.');
                                document.getElementById("showload").style.display = "none";
                            }
                        })
                        .catch((error) => {
                            reject('Serer Error:' + error);
                            document.getElementById("showload").style.display = "none";
                        });
                    return;
                }
                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}