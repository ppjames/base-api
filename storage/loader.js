
    // this.suiteConService.waitStart();

      // this.suiteConService.stopWait(); ;


/* start script  */

console.log('start script: ', new Date());
console.log(this);
/* console.log(this.creatorUserMail); */
/* let that = this; */
console.log(this.waiting);
let start = this.suiteConService.waitStart;
/* debugger; */
start.call(this);
console.log(start);

setTimeout(() => {
  /* that.suiteConService.stopWait(); */
  console.log('finish');
  /* that.waiting = false; */
}, 5000);
