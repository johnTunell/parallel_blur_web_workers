/**
 * Created by nottan on 2016-11-28.
 */

$(document).ready(() => {
    $()
    let worker = new Worker('./javascript/worker_scripts/work.js');
    worker.addEventListener('message', message => {
        console.log('Worker sending: ' + message.data);
    });
    worker.postMessage('Hello worker!');
});


