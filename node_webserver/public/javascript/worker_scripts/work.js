/**
 * Created by nottan on 2016-11-28.
 */

self.addEventListener('message', message => {
   console.log(message.data);
   self.postMessage("hello there!");
});
